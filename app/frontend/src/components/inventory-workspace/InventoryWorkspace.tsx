import { Check, ChevronDown, ChevronRight, Download, Minus, Plus, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  countAssetIssues,
  countIssueComponents,
  deriveAssetStatus,
  deriveComponentStatus,
  getStatusLabel,
  getTypeLabel,
  statusOptions,
  today,
  workspaceViews
} from "../../data/inventoryRules";
import type {
  Asset,
  AssetComponent,
  AssetPatch,
  AssetStatus,
  AuditRecord,
  InventoryLocation,
  LocationPatch,
  LocationType,
  WorkspaceView
} from "../../data/types";
import { downloadInventoryCsv } from "../../services/inventoryExport";
import { StatusBadge } from "../detail-panels/StatusBadge";
import { FloorPlan } from "../floor-plan/FloorPlan";
import { InventoryTable } from "../inventory-table/InventoryTable";

interface InventoryWorkspaceProps {
  activeView: WorkspaceView;
  assets: Asset[];
  audits: AuditRecord[];
  filteredAssets: Asset[];
  mapAssets: Asset[];
  locations: InventoryLocation[];
  selectedLocationId?: string;
  onCreateLocation: (type: LocationType) => void;
  onDeleteLocation: (locationId: string) => void;
  onOpenAddAsset: (category?: string) => void;
  onSeedInventory: () => void;
  onSelectLocation: (locationId: string) => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
  onUpdateLocation: (locationId: string, patch: LocationPatch) => void;
  onViewChange: (view: WorkspaceView) => void;
}

export function InventoryWorkspace({
  activeView,
  assets,
  audits,
  filteredAssets,
  mapAssets,
  locations,
  selectedLocationId,
  onCreateLocation,
  onDeleteLocation,
  onOpenAddAsset,
  onSeedInventory,
  onSelectLocation,
  onUpdateAsset,
  onUpdateLocation,
  onViewChange
}: InventoryWorkspaceProps) {
  const viewMeta = workspaceViews.find((item) => item.view === activeView) ?? workspaceViews[0];

  return (
    <section className="min-w-0" id="inventario">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">{viewMeta.label}</h2>
          <p className="text-sm text-on-surface-variant">{viewMeta.description}</p>
        </div>
        <div className="grid grid-cols-2 rounded-lg border border-outline-variant bg-surface-container-low p-1 text-sm font-bold sm:grid-cols-3 xl:grid-cols-6">
          {workspaceViews.map((item) => {
            const Icon = item.icon;

            return (
              <ViewButton
                active={activeView === item.view}
                icon={<Icon size={16} />}
                key={item.view}
                label={item.label}
                onClick={() => onViewChange(item.view)}
              />
            );
          })}
        </div>
      </div>

      <div className="min-w-0 overflow-hidden">
        <div className="view-transition" key={activeView}>
          {locations.length === 0 ? <EmptyInventorySetup onSeedInventory={onSeedInventory} /> : null}

          {activeView === "layout" ? (
            <FloorPlan
              assets={mapAssets}
              locations={locations}
              onCreateLocation={onCreateLocation}
              onDeleteLocation={onDeleteLocation}
              onSelectLocation={onSelectLocation}
              onUpdateLocation={onUpdateLocation}
              selectedLocationId={selectedLocationId}
            />
          ) : null}

          {activeView === "dashboard" ? (
            <OverviewView assets={assets} filteredAssets={filteredAssets} locations={locations} />
          ) : null}

          {activeView === "cards" ? (
            <CardsView
              assets={filteredAssets}
              locations={locations}
              onSelectLocation={onSelectLocation}
              onUpdateAsset={onUpdateAsset}
              selectedLocationId={selectedLocationId}
            />
          ) : null}

          {activeView === "table" ? <InventoryTable assets={filteredAssets} locations={locations} /> : null}

          {activeView === "audits" ? (
            <AuditsView
              assets={assets}
              audits={audits}
              locations={locations}
              onSelectLocation={onSelectLocation}
              onViewChange={onViewChange}
              selectedLocationId={selectedLocationId}
            />
          ) : null}

          {activeView === "reports" ? (
            <ReportsView
              assets={assets}
              audits={audits}
              filteredAssets={filteredAssets}
              locations={locations}
              onOpenAddAsset={onOpenAddAsset}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function EmptyInventorySetup({ onSeedInventory }: { onSeedInventory: () => void }) {
  return (
    <section className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-primary">Inventario sin datos iniciales</h3>
          <p className="text-sm text-on-surface-variant">
            Inicializa closets, estaciones, mesas y activos base en el scope actual.
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-bold text-on-primary hover:brightness-105"
          onClick={onSeedInventory}
          type="button"
        >
          <Plus size={16} />
          Inicializar MVP
        </button>
      </div>
    </section>
  );
}

function ViewButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 transition",
        active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary"
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function OverviewView({
  assets,
  filteredAssets,
  locations
}: {
  assets: Asset[];
  filteredAssets: Asset[];
  locations: InventoryLocation[];
}) {
  const issueAssets = assets.filter((asset) => asset.status !== "ok" || countIssueComponents(asset) > 0);
  const componentIssues = assets.reduce(
    (total, asset) => total + countIssueComponents(asset),
    0
  );
  const statusCounts = countBy(assets, (asset) => asset.status);
  const categoryCounts = countBy(assets, (asset) => asset.category);
  const locationTypeCounts = countBy(locations, (location) => getTypeLabel(location.type));

  return (
    <section className="rounded-lg border border-outline-variant bg-surface p-3 shadow-panel sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Activos registrados" value={assets.length.toString()} />
        <Metric label="Puntos layout" value={locations.length.toString()} />
        <Metric label="Con incidencia" value={issueAssets.length.toString()} tone="alert" />
        <Metric label="Resultado busqueda" value={filteredAssets.length.toString()} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryGroup title="Categorias" values={categoryCounts} />
          <SummaryGroup title="Estados" values={statusCounts} statusKeys />
          <SummaryGroup title="Layout" values={locationTypeCounts} />
          <article className="rounded-lg border border-outline-variant bg-white p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-outline">Componentes</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary">{componentIssues}</p>
            <p className="mt-1 text-sm text-on-surface-variant">Componentes con incidencia.</p>
          </article>
        </div>

        <article className="rounded-lg border border-outline-variant bg-white p-4">
          <h3 className="font-display text-lg font-bold text-primary">Incidencias visibles</h3>
          <div className="mt-3 space-y-2">
            {issueAssets.length === 0 ? (
              <p className="rounded-lg border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                No hay activos con incidencia.
              </p>
            ) : (
              issueAssets.slice(0, 6).map((asset) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-outline-variant p-3" key={asset.id}>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs font-bold text-outline">{asset.code}</p>
                    <p className="truncate text-sm font-semibold">{asset.name}</p>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function AuditsView({
  assets,
  audits,
  locations,
  selectedLocationId,
  onSelectLocation,
  onViewChange
}: {
  assets: Asset[];
  audits: AuditRecord[];
  locations: InventoryLocation[];
  selectedLocationId?: string;
  onSelectLocation: (locationId: string) => void;
  onViewChange: (view: WorkspaceView) => void;
}) {
  const auditsByLocation = useMemo(() => {
    return audits.reduce<Record<string, AuditRecord[]>>((acc, audit) => {
      acc[audit.locationId] = [...(acc[audit.locationId] ?? []), audit];
      return acc;
    }, {});
  }, [audits]);
  const assetsByLocation = useMemo(() => {
    return assets.reduce<Record<string, Asset[]>>((acc, asset) => {
      acc[asset.locationId] = [...(acc[asset.locationId] ?? []), asset];
      return acc;
    }, {});
  }, [assets]);
  const pendingLocations = locations
    .map((location) => {
      const locationAssets = assetsByLocation[location.id] ?? [];
      const issueCount = countAssetIssues(locationAssets);
      const latestAudit = [...(auditsByLocation[location.id] ?? [])].sort((a, b) => b.date.localeCompare(a.date))[0];

      return {
        assetCount: locationAssets.length,
        issueCount,
        latestAudit,
        location
      };
    })
    .filter((item) => item.issueCount > 0 || !item.latestAudit);

  return (
    <section className="rounded-lg border border-outline-variant bg-surface p-3 shadow-panel sm:p-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <Metric label="Auditorias cerradas" value={audits.length.toString()} />
        <Metric label="Puntos pendientes" value={pendingLocations.length.toString()} tone={pendingLocations.length > 0 ? "alert" : "default"} />
        <Metric label="Ultima auditoria" value={audits[0]?.date ?? "Sin cierre"} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1fr)]">
        <article className="rounded-lg border border-outline-variant bg-white p-4">
          <h3 className="font-display text-lg font-bold text-primary">Puntos por revisar</h3>
          <div className="mt-3 space-y-2">
            {pendingLocations.length === 0 ? (
              <p className="rounded-lg border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                No hay puntos pendientes por incidencias o falta de cierre.
              </p>
            ) : (
              pendingLocations.slice(0, 8).map(({ assetCount, issueCount, latestAudit, location }) => (
                <button
                  className={[
                    "grid w-full gap-2 rounded-lg border p-3 text-left transition hover:border-primary hover:text-primary",
                    selectedLocationId === location.id ? "border-primary ring-4 ring-primary/10" : "border-outline-variant"
                  ].join(" ")}
                  key={location.id}
                  onClick={() => {
                    onSelectLocation(location.id);
                    onViewChange("layout");
                  }}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-display text-base font-bold">
                        {location.code} · {location.name}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                        {getTypeLabel(location.type)} · {assetCount} activos
                      </span>
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-on-secondary">
                      {issueCount} incid.
                    </span>
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Ultimo cierre: {latestAudit?.date ?? "sin auditoria"}
                  </span>
                </button>
              ))
            )}
          </div>
        </article>

        <article className="rounded-lg border border-outline-variant bg-white p-4">
          <h3 className="font-display text-lg font-bold text-primary">Historial de auditorias</h3>
          <div className="mt-3 space-y-2">
            {audits.length === 0 ? (
              <p className="rounded-lg border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                Aun no hay cierres de revision. Usa el panel derecho para cerrar una revision de punto seleccionado.
              </p>
            ) : (
              audits.slice(0, 10).map((audit) => (
                <div className="rounded-lg border border-outline-variant p-3" key={audit.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-outline">{audit.date}</p>
                      <h4 className="truncate font-display text-base font-bold text-primary">
                        {audit.locationCode} · {audit.locationName}
                      </h4>
                    </div>
                    <span className="rounded-full bg-surface-container-low px-2 py-1 font-mono text-[10px] font-bold text-on-surface-variant">
                      {audit.assetCount} activos
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">{audit.notes}</p>
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    {audit.userName} · {audit.issueCount} incidencias
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function ReportsView({
  assets,
  audits,
  filteredAssets,
  locations,
  onOpenAddAsset
}: {
  assets: Asset[];
  audits: AuditRecord[];
  filteredAssets: Asset[];
  locations: InventoryLocation[];
  onOpenAddAsset: (category?: string) => void;
}) {
  const issueAssets = filteredAssets.filter((asset) => asset.status !== "ok" || countIssueComponents(asset) > 0);
  const statusCounts = countBy(filteredAssets, (asset) => getStatusLabel(asset.status));
  const categoryCounts = countBy(filteredAssets, (asset) => asset.category);
  const componentIssues = filteredAssets.reduce((total, asset) => total + countIssueComponents(asset), 0);

  return (
    <section className="rounded-lg border border-outline-variant bg-surface p-3 shadow-panel sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-primary">Corte operativo</h3>
          <p className="text-sm text-on-surface-variant">
            {filteredAssets.length} activos filtrados · {issueAssets.length} activos con incidencia
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary px-3 text-sm font-bold text-primary hover:bg-primary hover:text-on-primary"
            onClick={() => downloadInventoryCsv(filteredAssets, locations)}
            type="button"
          >
            <Download size={16} />
            Exportar CSV
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-3 text-sm font-bold text-on-secondary hover:brightness-105"
            onClick={() => onOpenAddAsset()}
            type="button"
          >
            Registrar activo
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Activos filtrados" value={filteredAssets.length.toString()} />
        <Metric label="Incidencias" value={issueAssets.length.toString()} tone={issueAssets.length > 0 ? "alert" : "default"} />
        <Metric label="Componentes revisar" value={componentIssues.toString()} tone={componentIssues > 0 ? "alert" : "default"} />
        <Metric label="Auditorias" value={audits.length.toString()} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryGroup title="Estados filtrados" values={statusCounts} />
          <SummaryGroup title="Categorias filtradas" values={categoryCounts} />
        </div>

        <article className="rounded-lg border border-outline-variant bg-white p-4">
          <h3 className="font-display text-lg font-bold text-primary">Activos criticos</h3>
          <div className="mt-3 space-y-2">
            {issueAssets.length === 0 ? (
              <p className="rounded-lg border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                No hay activos criticos en el filtro actual.
              </p>
            ) : (
              issueAssets.slice(0, 8).map((asset) => (
                <div className="rounded-lg border border-outline-variant p-3" key={asset.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-bold text-outline">{asset.code}</p>
                      <p className="truncate text-sm font-semibold">{asset.name}</p>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">{asset.notes}</p>
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    {countIssueComponents(asset)} componentes por revisar
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function CardsView({
  assets,
  locations,
  selectedLocationId,
  onSelectLocation,
  onUpdateAsset
}: {
  assets: Asset[];
  locations: InventoryLocation[];
  selectedLocationId?: string;
  onSelectLocation: (locationId: string) => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
}) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const assetsByLocation = useMemo(() => {
    return assets.reduce<Record<string, Asset[]>>((acc, asset) => {
      acc[asset.locationId] = [...(acc[asset.locationId] ?? []), asset];
      return acc;
    }, {});
  }, [assets]);

  function toggle(locationId: string) {
    setOpenIds((current) =>
      current.includes(locationId) ? current.filter((id) => id !== locationId) : [...current, locationId]
    );
    onSelectLocation(locationId);
  }

  return (
    <section className="rounded-lg border border-outline-variant bg-surface p-3 shadow-panel sm:p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {locations.map((location) => {
          const locationAssets = assetsByLocation[location.id] ?? [];
          const open = openIds.includes(location.id) || selectedLocationId === location.id;

          return (
            <article
              className={[
                "overflow-hidden rounded-lg border bg-white",
                selectedLocationId === location.id ? "border-primary ring-4 ring-primary/10" : "border-outline-variant"
              ].join(" ")}
              key={location.id}
            >
              <button
                className="flex w-full items-center justify-between gap-3 bg-surface-container-low px-4 py-3 text-left"
                onClick={() => toggle(location.id)}
                type="button"
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg font-bold text-primary">
                    {location.code} · {location.name}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    {getTypeLabel(location.type)} · {locationAssets.length} activos
                  </span>
                </span>
                {open ? <ChevronDown className="shrink-0 text-primary" size={18} /> : <ChevronRight className="shrink-0 text-outline" size={18} />}
              </button>

              {open ? (
                <div className="space-y-3 p-3">
                  {locationAssets.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
                      Sin activos visibles.
                    </p>
                  ) : (
                    locationAssets.map((asset) => <AssetCard asset={asset} key={asset.id} onUpdateAsset={onUpdateAsset} />)
                  )}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AssetCard({ asset, onUpdateAsset }: { asset: Asset; onUpdateAsset: (assetId: string, patch: AssetPatch) => void }) {
  const [draftNotes, setDraftNotes] = useState(asset.notes);
  const notesDirty = draftNotes !== asset.notes;

  useEffect(() => {
    setDraftNotes(asset.notes);
  }, [asset.id, asset.notes]);

  function updateStatus(status: AssetStatus) {
    onUpdateAsset(asset.id, {
      lastReview: today(),
      status
    });
  }

  function saveNotes() {
    onUpdateAsset(asset.id, {
      lastReview: today(),
      notes: draftNotes
    });
  }

  function updateComponent(componentId: string, patch: Partial<AssetComponent>) {
    const nextComponents = asset.components.map((component) => {
      if (component.id !== componentId) {
        return component;
      }

      const nextComponent = { ...component, ...patch };
      return {
        ...nextComponent,
        status: patch.status ?? deriveComponentStatus(nextComponent.quantityActual, nextComponent.quantityExpected)
      };
    });

    onUpdateAsset(asset.id, {
      components: nextComponents,
      lastReview: today(),
      status: deriveAssetStatus(nextComponents)
    });
  }

  function changeQuantity(component: AssetComponent, delta: number) {
    const nextQuantity = Math.max(0, component.quantityActual + delta);
    updateComponent(component.id, {
      quantityActual: nextQuantity,
      status: deriveComponentStatus(nextQuantity, component.quantityExpected)
    });
  }

  return (
    <div className="rounded-lg border border-outline-variant p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold text-outline">{asset.code}</p>
          <h3 className="truncate font-display text-base font-bold">{asset.name}</h3>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(120px,0.65fr)_minmax(0,1fr)_auto] lg:items-end">
        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Estado
          <select
            className="h-9 min-w-0 rounded-md border border-outline-variant bg-white px-2 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => updateStatus(event.target.value as AssetStatus)}
            value={asset.status}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {getStatusLabel(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Observacion
          <input
            className="h-9 min-w-0 rounded-md border border-outline-variant bg-white px-2 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => setDraftNotes(event.target.value)}
            value={draftNotes}
          />
        </label>

        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-on-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!notesDirty}
          onClick={saveNotes}
          type="button"
        >
          <Save size={15} />
          Guardar
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        {asset.components.map((component) => (
          <div
            className="grid gap-2 rounded-md bg-surface-container-low p-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            key={component.id}
          >
            <div className="min-w-0">
              <span className="block truncate font-semibold">{component.name}</span>
              <span className="font-mono text-xs text-on-surface-variant">
                {component.quantityActual}/{component.quantityExpected}
              </span>
            </div>

            <div className="grid grid-cols-[2.25rem_minmax(3rem,1fr)_2.25rem] items-center gap-1 sm:w-36">
              <button
                aria-label={`Restar ${component.name}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={component.quantityActual === 0}
                onClick={() => changeQuantity(component, -1)}
                type="button"
              >
                <Minus size={15} />
              </button>
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white font-mono text-xs font-bold text-on-surface">
                {component.quantityActual}/{component.quantityExpected}
              </span>
              <button
                aria-label={`Sumar ${component.name}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface-variant transition hover:border-primary hover:text-primary"
                onClick={() => changeQuantity(component, 1)}
                type="button"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 sm:col-span-2">
              <button
                className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-success px-2 text-xs font-bold text-success transition hover:bg-success hover:text-white"
                onClick={() =>
                  updateComponent(component.id, {
                    quantityActual: component.quantityExpected,
                    status: "ok"
                  })
                }
                type="button"
              >
                <Check size={14} />
                OK
              </button>
              <button
                className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-error px-2 text-xs font-bold text-error transition hover:bg-error hover:text-white"
                onClick={() => {
                  const nextQuantity = Math.max(0, component.quantityExpected - 1);
                  updateComponent(component.id, {
                    quantityActual: nextQuantity,
                    status: deriveComponentStatus(nextQuantity, component.quantityExpected)
                  });
                }}
                type="button"
              >
                <Minus size={14} />
                Falta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryGroup({
  statusKeys,
  title,
  values
}: {
  statusKeys?: boolean;
  title: string;
  values: Record<string, number>;
}) {
  return (
    <article className="rounded-lg border border-outline-variant bg-white p-4">
      <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
      <div className="mt-3 space-y-2">
        {Object.entries(values).map(([key, value]) => (
          <div className="flex items-center justify-between gap-3 rounded-md bg-surface-container-low px-3 py-2" key={key}>
            <span className="truncate text-sm font-semibold">{statusKeys ? getStatusLabel(key as AssetStatus) : key}</span>
            <span className="font-mono text-xs font-bold text-on-surface-variant">{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "alert" }) {
  return (
    <article className="rounded-lg border border-outline-variant bg-white p-3">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-outline">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone === "alert" ? "text-secondary" : "text-primary"}`}>
        {value}
      </p>
    </article>
  );
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
