import { useMemo, useState } from "react";
import { ClipboardCheck, Plus, X } from "lucide-react";
import type { LabUser } from "../auth/AuthProvider";
import { DetailPanel } from "../components/detail-panels/DetailPanel";
import { InventoryWorkspace } from "../components/inventory-workspace/InventoryWorkspace";
import type {
  Asset,
  AssetPatch,
  AuditRecord,
  CreateAuditInput,
  InventoryLocation,
  LocationPatch,
  LocationType,
  WorkspaceView
} from "../data/types";

interface InventoryDashboardProps {
  activeView: WorkspaceView;
  assets: Asset[];
  audits: AuditRecord[];
  detailPanelOpen: boolean;
  filteredAssets: Asset[];
  locations: InventoryLocation[];
  query: string;
  user: LabUser;
  onCreateAudit: (input: CreateAuditInput) => void;
  onOpenAddAsset: (category?: string) => void;
  onSeedInventory: () => void;
  onCreateLocation: (type: LocationType) => void;
  onDeleteAsset: (assetId: string) => void;
  onDeleteLocation: (locationId: string) => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
  onUpdateLocation: (locationId: string, patch: LocationPatch) => void;
  onViewChange: (view: WorkspaceView) => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InventoryDashboard({
  activeView,
  assets,
  audits,
  detailPanelOpen,
  filteredAssets,
  locations,
  query,
  user,
  onCreateAudit,
  onCreateLocation,
  onDeleteAsset,
  onDeleteLocation,
  onOpenAddAsset,
  onSeedInventory,
  onUpdateAsset,
  onUpdateLocation,
  onViewChange
}: InventoryDashboardProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();

  const selectedLocation = locations.find((location) => location.id === selectedLocationId);

  const selectedAssets = useMemo(() => {
    if (!selectedLocationId) {
      return [];
    }

    return assets.filter((asset) => asset.locationId === selectedLocationId);
  }, [assets, selectedLocationId]);

  const visibleLocationIds = new Set(filteredAssets.map((asset) => asset.locationId));
  const mapAssets = query.trim() ? assets.filter((asset) => visibleLocationIds.has(asset.locationId)) : assets;

  function completeSelectionReview() {
    if (!selectedLocation) {
      return;
    }

    selectedAssets.forEach((asset) => {
      onUpdateAsset(asset.id, {
        lastReview: today(),
        responsible: user.displayName,
        notes: asset.notes || "Revision completada."
      });
    });

    onCreateAudit({
      assets: selectedAssets,
      location: selectedLocation,
      notes: `Revision cerrada para ${selectedLocation.code}.`,
      userId: user.uid,
      userName: user.displayName
    });
  }

  function deleteSelectedLocation(locationId: string) {
    onDeleteLocation(locationId);

    if (selectedLocationId === locationId) {
      setSelectedLocationId(undefined);
    }
  }

  return (
    <main className="flex-1 overflow-auto bg-surface-container-lowest p-2 sm:p-4 lg:p-5">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4">
        <div
          className={[
            "grid min-w-0 gap-4",
            detailPanelOpen ? "2xl:grid-cols-[minmax(0,1fr)_minmax(320px,28vw)]" : ""
          ].join(" ")}
        >
          <InventoryWorkspace
            activeView={activeView}
            assets={assets}
            audits={audits}
            filteredAssets={filteredAssets}
            locations={locations}
            mapAssets={mapAssets}
            onCreateLocation={onCreateLocation}
            onDeleteLocation={deleteSelectedLocation}
            onOpenAddAsset={onOpenAddAsset}
            onSeedInventory={onSeedInventory}
            onSelectLocation={setSelectedLocationId}
            onUpdateAsset={onUpdateAsset}
            onUpdateLocation={onUpdateLocation}
            onViewChange={onViewChange}
            selectedLocationId={selectedLocationId}
          />

          {detailPanelOpen ? (
            <div className="min-w-0 2xl:sticky 2xl:top-28 2xl:max-h-[calc(100vh-8rem)] 2xl:overflow-auto">
              <RightDetailPanel
                assets={selectedAssets}
                locations={locations}
                location={selectedLocation}
                onClear={() => setSelectedLocationId(undefined)}
                onCompleteReview={completeSelectionReview}
                onDeleteAsset={onDeleteAsset}
                onUpdateAsset={onUpdateAsset}
                reviewerName={user.displayName}
              />
            </div>
          ) : null}
        </div>
      </div>
      <FloatingCreateAction onOpenAddAsset={onOpenAddAsset} />
    </main>
  );
}

interface RightDetailPanelProps {
  assets: Asset[];
  locations: InventoryLocation[];
  location?: InventoryLocation;
  onCompleteReview: () => void;
  onClear: () => void;
  onDeleteAsset: (assetId: string) => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
  reviewerName: string;
}

function RightDetailPanel({
  assets,
  locations,
  location,
  onCompleteReview,
  onClear,
  onDeleteAsset,
  onUpdateAsset,
  reviewerName
}: RightDetailPanelProps) {
  const hasAssets = Boolean(location && assets.length > 0);

  return (
    <aside className="grid min-w-0 gap-4">
      <DetailPanel
        assets={assets}
        locations={locations}
        location={location}
        onClear={onClear}
        onDeleteAsset={onDeleteAsset}
        onUpdateAsset={onUpdateAsset}
        reviewerName={reviewerName}
      />

      <section className="rounded-lg border border-outline-variant bg-surface p-3 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-outline">Navegacion</p>
            <p className="truncate font-display text-lg font-bold text-primary">
              {location ? `${location.code} · ${assets.length} activos` : "Selecciona un punto"}
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary px-3 text-sm font-bold text-primary hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline"
            disabled={!hasAssets}
            onClick={onCompleteReview}
            type="button"
          >
            <ClipboardCheck size={16} />
            Cerrar revision
          </button>
        </div>
      </section>
    </aside>
  );
}

function FloatingCreateAction({ onOpenAddAsset }: { onOpenAddAsset: (category?: string) => void }) {
  const [open, setOpen] = useState(false);
  const options = [
    { label: "Equipo", category: "Computo" },
    { label: "Lego EV3", category: "Lego EV3" },
    { label: "Robotkit", category: "Robotkit" },
    { label: "DYGO", category: "DYGO" },
    { label: "Electronica", category: "Electronica" }
  ];

  return (
    <>
      <button
        aria-label="Crear inventario"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-secondary text-on-secondary shadow-panel transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-secondary/20"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40">
          <button
            aria-label="Cerrar crear inventario"
            className="absolute inset-0 bg-[#181c1f]/20"
            onClick={() => setOpen(false)}
            type="button"
          />
          <section className="absolute bottom-24 right-5 w-[min(calc(100vw-2.5rem),320px)] rounded-lg border border-outline-variant bg-surface p-4 shadow-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-primary">Crear inventario</h2>
                <p className="text-sm text-on-surface-variant">Selecciona el modelo de alta.</p>
              </div>
              <button
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-md text-on-surface-variant hover:bg-surface-container"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {options.map((option) => (
                <button
                  className="flex h-11 items-center justify-between rounded-lg border border-outline-variant bg-white px-3 text-sm font-bold text-on-surface-variant hover:border-primary hover:text-primary"
                  key={option.category}
                  onClick={() => {
                    setOpen(false);
                    onOpenAddAsset(option.category);
                  }}
                  type="button"
                >
                  {option.label}
                  <Plus size={16} />
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
