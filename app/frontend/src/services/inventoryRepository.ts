import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Firestore,
  type Unsubscribe
} from "firebase/firestore";
import type { Asset, AuditRecord, InventoryLocation } from "../data/types";

export interface InventorySnapshot {
  assets: Asset[];
  audits: AuditRecord[];
  locations: InventoryLocation[];
}

export type InventorySyncMode = "firebase" | "local";
export type InventorySyncStatus = "loading" | "synced" | "saving" | "error";

const localStorageKey = "robolab-inventory-state-v1";
const inventoryScope = import.meta.env.VITE_FIREBASE_INVENTORY_SCOPE || "aula-robotica";

function collectionRef(db: Firestore, name: "assets" | "audits" | "locations") {
  return collection(db, "inventories", inventoryScope, name);
}

export function subscribeToInventory(
  db: Firestore,
  onData: (snapshot: InventorySnapshot) => void,
  onError: (error: Error) => void
) {
  let assets: Asset[] = [];
  let audits: AuditRecord[] = [];
  let locations: InventoryLocation[] = [];
  const loaded = {
    assets: false,
    audits: false,
    locations: false
  };

  function emitWhenReady() {
    if (loaded.assets && loaded.audits && loaded.locations) {
      onData({ assets, audits, locations });
    }
  }

  const unsubscribers: Unsubscribe[] = [
    onSnapshot(
      query(collectionRef(db, "locations"), orderBy("layoutOrder")),
      (snapshot) => {
        locations = snapshot.docs.map((item) => item.data() as InventoryLocation);
        loaded.locations = true;
        emitWhenReady();
      },
      (error) => onError(error)
    ),
    onSnapshot(
      query(collectionRef(db, "assets"), orderBy("code")),
      (snapshot) => {
        assets = snapshot.docs.map((item) => item.data() as Asset);
        loaded.assets = true;
        emitWhenReady();
      },
      (error) => onError(error)
    ),
    onSnapshot(
      query(collectionRef(db, "audits"), orderBy("date", "desc")),
      (snapshot) => {
        audits = snapshot.docs.map((item) => item.data() as AuditRecord);
        loaded.audits = true;
        emitWhenReady();
      },
      (error) => onError(error)
    )
  ];

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

export async function saveAsset(db: Firestore, asset: Asset) {
  await setDoc(doc(collectionRef(db, "assets"), asset.id), asset);
}

export async function saveLocation(db: Firestore, location: InventoryLocation) {
  await setDoc(doc(collectionRef(db, "locations"), location.id), location);
}

export async function saveAudit(db: Firestore, audit: AuditRecord) {
  await setDoc(doc(collectionRef(db, "audits"), audit.id), audit);
}

export async function removeLocation(db: Firestore, locationId: string) {
  await deleteDoc(doc(collectionRef(db, "locations"), locationId));
}

export async function removeAsset(db: Firestore, assetId: string) {
  await deleteDoc(doc(collectionRef(db, "assets"), assetId));
}

export function loadLocalInventory(fallback: InventorySnapshot): InventorySnapshot {
  const stored = window.localStorage.getItem(localStorageKey);

  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as InventorySnapshot;
  } catch {
    return fallback;
  }
}

export function saveLocalInventory(snapshot: InventorySnapshot) {
  window.localStorage.setItem(localStorageKey, JSON.stringify(snapshot));
}

export function getInventoryScope() {
  return inventoryScope;
}
