import { useCallback, useEffect, useMemo, useState } from "react";
import { firebaseDb } from "../auth/firebase";
import type { LabUser } from "../auth/AuthProvider";
import { assets as seedAssets, audits as seedAudits, locations as seedLocations } from "../data/inventory";
import {
  countAssetIssues,
  findOpenGridPosition,
  getDefaultLocationSize,
  makeAssetCode,
  makeId,
  today
} from "../data/inventoryRules";
import type {
  Asset,
  AssetPatch,
  AuditRecord,
  CreateAssetInput,
  CreateAuditInput,
  InventoryLocation,
  LocationPatch,
  LocationType
} from "../data/types";
import {
  getInventoryScope,
  loadLocalInventory,
  removeAsset,
  removeLocation,
  saveAsset,
  saveAudit,
  saveLocalInventory,
  saveLocation,
  subscribeToInventory,
  type InventorySnapshot,
  type InventorySyncMode,
  type InventorySyncStatus
} from "../services/inventoryRepository";

interface InventorySyncState {
  error?: string;
  mode: InventorySyncMode;
  scope: string;
  status: InventorySyncStatus;
  updatedAt?: string;
}

const fallbackInventory: InventorySnapshot = {
  assets: seedAssets,
  audits: seedAudits,
  locations: seedLocations
};

export function useInventoryStore(user: LabUser | null) {
  const [assets, setAssets] = useState<Asset[]>(seedAssets);
  const [audits, setAudits] = useState<AuditRecord[]>(seedAudits);
  const [locations, setLocations] = useState<InventoryLocation[]>(seedLocations);
  const [syncState, setSyncState] = useState<InventorySyncState>({
    mode: firebaseDb ? "firebase" : "local",
    scope: getInventoryScope(),
    status: firebaseDb ? "loading" : "synced"
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!firebaseDb) {
      const localSnapshot = loadLocalInventory(fallbackInventory);
      setAssets(localSnapshot.assets);
      setAudits(localSnapshot.audits ?? []);
      setLocations(localSnapshot.locations);
      setSyncState({
        mode: "local",
        scope: getInventoryScope(),
        status: "synced",
        updatedAt: new Date().toISOString()
      });
      return;
    }

    setSyncState((current) => ({ ...current, mode: "firebase", status: "loading" }));

    return subscribeToInventory(
      firebaseDb,
      (snapshot) => {
        setAssets(snapshot.assets);
        setAudits(snapshot.audits);
        setLocations(snapshot.locations);
        setSyncState({
          mode: "firebase",
          scope: getInventoryScope(),
          status: "synced",
          updatedAt: new Date().toISOString()
        });
      },
      (error) => {
        setSyncState({
          error: error.message,
          mode: "firebase",
          scope: getInventoryScope(),
          status: "error",
          updatedAt: new Date().toISOString()
        });
      }
    );
  }, [user]);

  const snapshot = useMemo<InventorySnapshot>(() => ({ assets, audits, locations }), [assets, audits, locations]);

  const persistLocalSnapshot = useCallback((nextSnapshot: InventorySnapshot) => {
    if (!firebaseDb) {
      saveLocalInventory(nextSnapshot);
    }
  }, []);

  const markSaving = useCallback(() => {
    setSyncState((current) => ({ ...current, status: "saving" }));
  }, []);

  const markSaved = useCallback(() => {
    setSyncState((current) => ({
      ...current,
      error: undefined,
      status: "synced",
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const markError = useCallback((error: unknown) => {
    setSyncState((current) => ({
      ...current,
      error: error instanceof Error ? error.message : "No fue posible sincronizar inventario.",
      status: "error",
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateAsset = useCallback(
    async (assetId: string, patch: AssetPatch) => {
      let nextAsset: Asset | undefined;

      setAssets((currentAssets) => {
        const nextAssets = currentAssets.map((asset) => {
          if (asset.id !== assetId) {
            return asset;
          }

          nextAsset = { ...asset, ...patch };
          return nextAsset;
        });
        persistLocalSnapshot({ ...snapshot, assets: nextAssets });
        return nextAssets;
      });

      if (!nextAsset) {
        return;
      }

      markSaving();

      try {
        if (firebaseDb) {
          await saveAsset(firebaseDb, nextAsset);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const updateLocation = useCallback(
    async (locationId: string, patch: LocationPatch) => {
      let nextLocation: InventoryLocation | undefined;

      setLocations((currentLocations) => {
        const nextLocations = currentLocations.map((location) => {
          if (location.id !== locationId) {
            return location;
          }

          nextLocation = { ...location, ...patch };
          return nextLocation;
        });
        persistLocalSnapshot({ ...snapshot, locations: nextLocations });
        return nextLocations;
      });

      if (!nextLocation) {
        return;
      }

      markSaving();

      try {
        if (firebaseDb) {
          await saveLocation(firebaseDb, nextLocation);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const createLocation = useCallback(
    async (type: LocationType) => {
      const size = getDefaultLocationSize(type);
      const position = findOpenGridPosition(locations, size.layoutW, size.layoutH);
      const nextIndex =
        type === "station"
          ? Math.max(0, ...locations.filter((location) => location.type === "station").map((location) => Number(location.code) || 0)) + 1
          : locations.filter((location) => location.type === type).length + 1;
      const code = type === "closet" ? `C${nextIndex}` : type === "station" ? `${nextIndex}` : `M${nextIndex}`;

      const location: InventoryLocation = {
        id: makeId(`location-${type}`),
        code,
        type,
        name: type === "closet" ? `Closet ${code}` : type === "station" ? `Equipo ${code}` : `Mesa ${nextIndex}`,
        zone: type === "closet" ? "Norte" : "Centro",
        layoutSide: type === "closet" ? "top" : "center",
        layoutOrder: nextIndex,
        layoutX: position.layoutX,
        layoutY: position.layoutY,
        layoutW: size.layoutW,
        layoutH: size.layoutH
      };

      const nextLocations = [...locations, location];
      setLocations(nextLocations);
      persistLocalSnapshot({ ...snapshot, locations: nextLocations });
      markSaving();

      try {
        if (firebaseDb) {
          await saveLocation(firebaseDb, location);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [locations, markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const deleteLocation = useCallback(
    async (locationId: string) => {
      if (assets.some((asset) => asset.locationId === locationId)) {
        return;
      }

      const nextLocations = locations.filter((location) => location.id !== locationId);
      setLocations(nextLocations);
      persistLocalSnapshot({ ...snapshot, locations: nextLocations });
      markSaving();

      try {
        if (firebaseDb) {
          await removeLocation(firebaseDb, locationId);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [assets, locations, markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const createAsset = useCallback(
    async (input: CreateAssetInput) => {
      const assetId = makeId("asset");
      const nextIndex = assets.length + 1;
      const asset: Asset = {
        id: assetId,
        code: makeAssetCode(input.category, nextIndex),
        name: input.name,
        category: input.category,
        status: input.status,
        locationId: input.locationId,
        lastReview: today(),
        responsible: user?.displayName ?? "Encargado",
        notes: input.notes,
        components: input.components.map((component, index) => ({
          ...component,
          id: `${assetId}-component-${index + 1}`
        }))
      };

      const nextAssets = [asset, ...assets];
      setAssets(nextAssets);
      persistLocalSnapshot({ ...snapshot, assets: nextAssets });
      markSaving();

      try {
        if (firebaseDb) {
          await saveAsset(firebaseDb, asset);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [assets, markError, markSaved, markSaving, persistLocalSnapshot, snapshot, user?.displayName]
  );

  const deleteAsset = useCallback(
    async (assetId: string) => {
      const nextAssets = assets.filter((asset) => asset.id !== assetId);

      if (nextAssets.length === assets.length) {
        return;
      }

      setAssets(nextAssets);
      persistLocalSnapshot({ ...snapshot, assets: nextAssets });
      markSaving();

      try {
        if (firebaseDb) {
          await removeAsset(firebaseDb, assetId);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [assets, markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const createAudit = useCallback(
    async ({ assets: auditAssets, location, notes, userId, userName }: CreateAuditInput) => {
      const audit: AuditRecord = {
        id: makeId("audit"),
        assetCount: auditAssets.length,
        date: today(),
        issueCount: countAssetIssues(auditAssets),
        locationCode: location.code,
        locationId: location.id,
        locationName: location.name,
        notes,
        userId,
        userName
      };

      const nextAudits = [audit, ...audits];
      setAudits(nextAudits);
      persistLocalSnapshot({ ...snapshot, audits: nextAudits });
      markSaving();

      try {
        if (firebaseDb) {
          await saveAudit(firebaseDb, audit);
        }

        markSaved();
      } catch (error) {
        markError(error);
      }
    },
    [audits, markError, markSaved, markSaving, persistLocalSnapshot, snapshot]
  );

  const seedInventory = useCallback(async () => {
    setAssets(fallbackInventory.assets);
    setAudits(fallbackInventory.audits);
    setLocations(fallbackInventory.locations);
    persistLocalSnapshot(fallbackInventory);
    markSaving();

    try {
      if (firebaseDb) {
        const db = firebaseDb;

        await Promise.all([
          ...fallbackInventory.locations.map((location) => saveLocation(db, location)),
          ...fallbackInventory.assets.map((asset) => saveAsset(db, asset)),
          ...fallbackInventory.audits.map((audit) => saveAudit(db, audit))
        ]);
      }

      markSaved();
    } catch (error) {
      markError(error);
    }
  }, [markError, markSaved, markSaving, persistLocalSnapshot]);

  const cleanupStationOneDuplicates = useCallback(async () => {
    const stationOneAssets = assets.filter((asset) => asset.locationId === "station-1");

    if (stationOneAssets.length <= 1) {
      return;
    }

    const [assetToKeep, ...assetsToDelete] = stationOneAssets;
    const deleteIds = new Set(assetsToDelete.map((asset) => asset.id));
    const nextAssets = assets.filter((asset) => asset.id === assetToKeep.id || !deleteIds.has(asset.id));

    setAssets(nextAssets);
    persistLocalSnapshot({ ...snapshot, assets: nextAssets });
    markSaving();

    try {
      if (firebaseDb) {
        const db = firebaseDb;

        await Promise.all(assetsToDelete.map((asset) => removeAsset(db, asset.id)));
      }

      markSaved();
    } catch (error) {
      markError(error);
    }
  }, [assets, markError, markSaved, markSaving, persistLocalSnapshot, snapshot]);

  return {
    assets,
    cleanupStationOneDuplicates,
    audits,
    createAsset,
    createAudit,
    createLocation,
    deleteAsset,
    deleteLocation,
    locations,
    seedInventory,
    syncState,
    updateAsset,
    updateLocation
  };
}
