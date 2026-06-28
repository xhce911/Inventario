import { AlertTriangle, Check, ClipboardCheck, Minus, PackageSearch, Plus, Save, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  categoryOptions,
  deriveAssetStatus,
  deriveComponentStatus,
  getStatusLabel,
  makeId,
  statusOptions,
  today
} from "../../data/inventoryRules";
import type { Asset, AssetComponent, AssetPatch, AssetStatus, InventoryLocation } from "../../data/types";
import { StatusBadge } from "./StatusBadge";

interface DetailPanelProps {
  location?: InventoryLocation;
  locations?: InventoryLocation[];
  assets: Asset[];
  onClear: () => void;
  onDeleteAsset?: (assetId: string) => void;
  onUpdateAsset?: (assetId: string, patch: AssetPatch) => void;
  reviewerName?: string;
}

export function DetailPanel({
  location,
  locations = [],
  assets,
  onClear,
  onDeleteAsset,
  onUpdateAsset,
  reviewerName
}: DetailPanelProps) {
  if (!location) {
    return (
      <aside className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface p-6 text-center shadow-panel xl:min-h-0">
        <PackageSearch className="mb-4 text-outline-variant" size={58} />
        <h2 className="font-display text-xl font-semibold">Selecciona un elemento</h2>
        <p className="mt-2 max-w-56 text-sm leading-6 text-on-surface-variant">
          Selecciona un punto del layout para revisar activos y componentes.
        </p>
      </aside>
    );
  }

  const categories = Array.from(new Set(assets.map((asset) => asset.category)));
  const editable = Boolean(onUpdateAsset);

  return (
    <aside className="flex min-h-[260px] flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-panel xl:min-h-0">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-outline">
            {editable ? "Detalle editable" : "Detalle"}
          </p>
          <h2 className="font-display text-xl font-bold text-primary">{location.code}</h2>
        </div>
        <button
          aria-label="Cerrar panel"
          className="grid h-9 w-9 place-items-center rounded-md text-on-surface-variant hover:bg-surface-container"
          onClick={onClear}
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4">
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-outline">
            <ClipboardCheck size={15} />
            Activos
          </div>
          <p className="mt-2 font-display text-lg font-semibold">{assets.length}</p>
        </div>

        {categories.length > 0 ? (
          <div>
            <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Categorias
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-xs font-semibold"
                  key={category}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {assets.length === 0 ? (
            <div className="rounded-lg border border-dashed border-outline-variant p-5 text-sm text-on-surface-variant">
              No hay activos registrados en este punto.
            </div>
          ) : (
            assets.map((asset) =>
              onUpdateAsset ? (
                <EditableAssetCard
                  asset={asset}
                  key={asset.id}
                  locations={locations}
                  onDeleteAsset={onDeleteAsset}
                  onUpdateAsset={onUpdateAsset}
                  reviewerName={reviewerName}
                />
              ) : (
                <ReadOnlyAssetCard asset={asset} key={asset.id} />
              )
            )
          )}
        </div>
      </div>
    </aside>
  );
}

function ReadOnlyAssetCard({ asset }: { asset: Asset }) {
  return (
    <article className="rounded-lg border border-outline-variant bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-outline">{asset.code}</p>
          <h3 className="mt-1 font-display text-lg font-semibold">{asset.name}</h3>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{asset.notes}</p>

      <AssetMeta asset={asset} />

      <div className="mt-4 space-y-2">
        {asset.components.map((component) => (
          <ComponentRow component={component} key={component.id} />
        ))}
      </div>
    </article>
  );
}

function EditableAssetCard({
  asset,
  locations,
  onDeleteAsset,
  onUpdateAsset,
  reviewerName
}: {
  asset: Asset;
  locations: InventoryLocation[];
  onDeleteAsset?: (assetId: string) => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
  reviewerName?: string;
}) {
  const assignableLocations = locations.filter((item) => item.type !== "work_area");
  const [draft, setDraft] = useState({
    category: asset.category,
    locationId: asset.locationId,
    name: asset.name,
    notes: asset.notes,
    responsible: asset.responsible,
    status: asset.status
  });

  useEffect(() => {
    setDraft({
      category: asset.category,
      locationId: asset.locationId,
      name: asset.name,
      notes: asset.notes,
      responsible: asset.responsible,
      status: asset.status
    });
  }, [asset.category, asset.id, asset.locationId, asset.name, asset.notes, asset.responsible, asset.status]);

  const dirty = useMemo(
    () =>
      draft.category !== asset.category ||
      draft.locationId !== asset.locationId ||
      draft.name !== asset.name ||
      draft.notes !== asset.notes ||
      draft.responsible !== asset.responsible ||
      draft.status !== asset.status,
    [asset.category, asset.locationId, asset.name, asset.notes, asset.responsible, asset.status, draft]
  );

  function saveDetails() {
    onUpdateAsset(asset.id, {
      category: draft.category,
      lastReview: today(),
      locationId: draft.locationId,
      name: draft.name.trim() || asset.name,
      notes: draft.notes,
      responsible: draft.responsible.trim() || reviewerName || asset.responsible,
      status: draft.status
    });
  }

  function deleteAsset() {
    if (!onDeleteAsset) {
      return;
    }

    const shouldDelete = window.confirm(`Eliminar ${asset.code} del inventario?`);

    if (shouldDelete) {
      onDeleteAsset(asset.id);
    }
  }

  function updateComponent(componentId: string, patch: Partial<AssetComponent>) {
    const nextComponents = asset.components.map((component) => {
      if (component.id !== componentId) {
        return component;
      }

      const nextComponent = { ...component, ...patch };
      const quantityChanged = patch.quantityActual !== undefined || patch.quantityExpected !== undefined;

      return {
        ...nextComponent,
        name: nextComponent.name.trim() || component.name,
        quantityActual: Math.max(0, nextComponent.quantityActual),
        quantityExpected: Math.max(0, nextComponent.quantityExpected),
        status: patch.status ?? (quantityChanged ? deriveComponentStatus(nextComponent.quantityActual, nextComponent.quantityExpected) : component.status)
      };
    });

    onUpdateAsset(asset.id, {
      components: nextComponents,
      lastReview: today(),
      status: deriveAssetStatus(nextComponents)
    });
  }

  function changeQuantity(component: AssetComponent, field: "quantityActual" | "quantityExpected", delta: number) {
    const nextQuantity = Math.max(0, component[field] + delta);
    updateComponent(component.id, { [field]: nextQuantity });
  }

  function addComponent() {
    const nextComponents: AssetComponent[] = [
      ...asset.components,
      {
        id: makeId(`${asset.id}-component`),
        name: "Nuevo componente",
        quantityActual: 1,
        quantityExpected: 1,
        status: "ok"
      }
    ];

    onUpdateAsset(asset.id, {
      components: nextComponents,
      lastReview: today(),
      status: deriveAssetStatus(nextComponents)
    });
  }

  function deleteComponent(componentId: string) {
    const nextComponents = asset.components.filter((component) => component.id !== componentId);

    onUpdateAsset(asset.id, {
      components: nextComponents,
      lastReview: today(),
      status: deriveAssetStatus(nextComponents)
    });
  }

  return (
    <article className="rounded-lg border border-outline-variant bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-outline">{asset.code}</p>
          <h3 className="mt-1 truncate font-display text-lg font-semibold">{asset.name}</h3>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Nombre
          <input
            className="h-10 min-w-0 rounded-md border border-outline-variant bg-white px-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            value={draft.name}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
            Categoria
            <select
              className="h-10 min-w-0 rounded-md border border-outline-variant bg-white px-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              value={draft.category}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
            Estado
            <select
              className="h-10 min-w-0 rounded-md border border-outline-variant bg-white px-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as AssetStatus }))}
              value={draft.status}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {getStatusLabel(option)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Ubicacion
          <select
            className="h-10 min-w-0 rounded-md border border-outline-variant bg-white px-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => setDraft((current) => ({ ...current, locationId: event.target.value }))}
            value={draft.locationId}
          >
            {assignableLocations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Responsable
          <input
            className="h-10 min-w-0 rounded-md border border-outline-variant bg-white px-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => setDraft((current) => ({ ...current, responsible: event.target.value }))}
            value={draft.responsible}
          />
        </label>

        <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
          Observacion
          <textarea
            className="min-h-24 min-w-0 rounded-md border border-outline-variant bg-white px-3 py-2 text-sm font-semibold leading-6 text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
            value={draft.notes}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-on-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!dirty}
            onClick={saveDetails}
            type="button"
          >
            <Save size={16} />
            Guardar cambios
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-error/40 px-3 text-sm font-bold text-error transition hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline"
            disabled={!onDeleteAsset}
            onClick={deleteAsset}
            type="button"
          >
            <Trash2 size={16} />
            Eliminar activo
          </button>
        </div>
      </div>

      <AssetMeta asset={asset} />

      <div className="mt-4 flex items-center justify-between gap-3">
        <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Componentes</h4>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-primary px-2 text-xs font-bold text-primary hover:bg-primary hover:text-on-primary"
          onClick={addComponent}
          type="button"
        >
          <Plus size={14} />
          Agregar
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {asset.components.map((component) => (
          <EditableComponentRow
            component={component}
            key={component.id}
            onChangeQuantity={changeQuantity}
            onDeleteComponent={deleteComponent}
            onUpdateComponent={updateComponent}
          />
        ))}
      </div>
    </article>
  );
}

function AssetMeta({ asset }: { asset: Asset }) {
  return (
    <div className="mt-3 grid gap-2 rounded-lg border border-surface-container-high bg-surface-container-lowest p-3 text-xs sm:grid-cols-2">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <ClipboardCheck size={14} />
        <span className="font-mono font-semibold">{asset.lastReview}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2 text-on-surface-variant">
        <UserRound size={14} className="shrink-0" />
        <span className="truncate">{asset.responsible}</span>
      </div>
    </div>
  );
}

function ComponentRow({ component }: { component: AssetComponent }) {
  const verified = component.status === "ok" && component.quantityActual >= component.quantityExpected;

  return (
    <div className="flex items-center gap-3 border-t border-surface-container-high pt-2 text-sm">
      <span
        className={[
          "grid h-7 w-7 shrink-0 place-items-center rounded-full border",
          verified ? "border-success bg-success text-white" : "border-warning/40 bg-warning/10 text-warning"
        ].join(" ")}
        aria-label={verified ? "Componente verificado" : "Componente con incidencia"}
      >
        {verified ? <Check size={15} strokeWidth={3} /> : <AlertTriangle size={15} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{component.name}</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-outline">
          {component.status}
        </span>
      </span>
      <span className="rounded-md bg-surface-container-low px-2 py-1 font-mono text-xs font-bold text-on-surface-variant">
        {component.quantityActual}/{component.quantityExpected}
      </span>
    </div>
  );
}

function EditableComponentRow({
  component,
  onChangeQuantity,
  onDeleteComponent,
  onUpdateComponent
}: {
  component: AssetComponent;
  onChangeQuantity: (component: AssetComponent, field: "quantityActual" | "quantityExpected", delta: number) => void;
  onDeleteComponent: (componentId: string) => void;
  onUpdateComponent: (componentId: string, patch: Partial<AssetComponent>) => void;
}) {
  const verified = component.status === "ok" && component.quantityActual >= component.quantityExpected;
  const [componentName, setComponentName] = useState(component.name);
  const componentNameDirty = componentName !== component.name;

  useEffect(() => {
    setComponentName(component.name);
  }, [component.id, component.name]);

  function saveComponentName() {
    onUpdateComponent(component.id, { name: componentName });
  }

  return (
    <div className="grid gap-2 border-t border-surface-container-high pt-3 text-sm">
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border",
            verified ? "border-success bg-success text-white" : "border-warning/40 bg-warning/10 text-warning"
          ].join(" ")}
          aria-label={verified ? "Componente verificado" : "Componente con incidencia"}
        >
          {verified ? <Check size={15} strokeWidth={3} /> : <AlertTriangle size={15} />}
        </span>

        <label className="grid min-w-0 flex-1 gap-1 text-xs font-bold text-on-surface-variant">
          Componente
          <span className="grid grid-cols-[minmax(0,1fr)_2.25rem_2.25rem] gap-1">
            <input
              className="h-9 min-w-0 rounded-md border border-outline-variant bg-white px-2 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setComponentName(event.target.value)}
              value={componentName}
            />
            <button
              aria-label={`Guardar ${component.name}`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary text-on-primary transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!componentNameDirty}
              onClick={saveComponentName}
              type="button"
            >
              <Save size={14} />
            </button>
            <button
              aria-label={`Eliminar ${component.name}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-error/35 text-error transition hover:bg-error hover:text-white"
              onClick={() => onDeleteComponent(component.id)}
              type="button"
            >
              <Trash2 size={14} />
            </button>
          </span>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <QuantityEditor
          label="Encontrado"
          onDecrease={() => onChangeQuantity(component, "quantityActual", -1)}
          onIncrease={() => onChangeQuantity(component, "quantityActual", 1)}
          value={component.quantityActual}
        />
        <QuantityEditor
          label="Esperado"
          onDecrease={() => onChangeQuantity(component, "quantityExpected", -1)}
          onIncrease={() => onChangeQuantity(component, "quantityExpected", 1)}
          value={component.quantityExpected}
        />
      </div>

      <label className="grid gap-1 text-xs font-bold text-on-surface-variant">
        Estado componente
        <select
          className="h-9 min-w-0 rounded-md border border-outline-variant bg-white px-2 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          onChange={(event) => onUpdateComponent(component.id, { status: event.target.value as AssetStatus })}
          value={component.status}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {getStatusLabel(option)}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-success px-2 text-xs font-bold text-success transition hover:bg-success hover:text-white"
          onClick={() =>
            onUpdateComponent(component.id, {
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
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-error px-2 text-xs font-bold text-error transition hover:bg-error hover:text-white"
          onClick={() => {
            const nextQuantity = Math.max(0, component.quantityExpected - 1);
            onUpdateComponent(component.id, {
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
  );
}

function QuantityEditor({
  label,
  onDecrease,
  onIncrease,
  value
}: {
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  value: number;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-bold text-on-surface-variant">{label}</span>
      <div className="grid grid-cols-[2.25rem_minmax(3rem,1fr)_2.25rem] items-center gap-1">
        <button
          aria-label={`Restar ${label.toLowerCase()}`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={value === 0}
          onClick={onDecrease}
          type="button"
        >
          <Minus size={15} />
        </button>
        <span className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white font-mono text-xs font-bold text-on-surface">
          {value}
        </span>
        <button
          aria-label={`Sumar ${label.toLowerCase()}`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface-variant transition hover:border-primary hover:text-primary"
          onClick={onIncrease}
          type="button"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
