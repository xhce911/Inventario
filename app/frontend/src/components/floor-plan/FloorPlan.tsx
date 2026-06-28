import { DoorOpen, Grid2X2, Pencil, Plus, Ruler, SlidersHorizontal, Trash2 } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Asset, AssetStatus, InventoryLocation, LocationPatch, LocationType } from "../../data/types";

const GRID_COLS = 12;
const GRID_ROWS = 14;

interface DragState {
  locationId: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  previewX: number;
  previewY: number;
}

interface FloorPlanProps {
  locations: InventoryLocation[];
  assets: Asset[];
  selectedLocationId?: string;
  onCreateLocation: (type: LocationType) => void;
  onDeleteLocation: (locationId: string) => void;
  onSelectLocation: (locationId: string) => void;
  onUpdateLocation: (locationId: string, patch: LocationPatch) => void;
}

export function FloorPlan({
  locations,
  assets,
  selectedLocationId,
  onCreateLocation,
  onDeleteLocation,
  onSelectLocation,
  onUpdateLocation
}: FloorPlanProps) {
  const [editMode, setEditMode] = useState(false);
  const [dragState, setDragState] = useState<DragState | undefined>();
  const gridRef = useRef<HTMLDivElement>(null);
  const selectedLocation = locations.find((location) => location.id === selectedLocationId);
  const sortedLocations = [...locations].sort(sortByGrid);
  const assetsByLocation = assets.reduce<Record<string, Asset[]>>((acc, asset) => {
    acc[asset.locationId] = [...(acc[asset.locationId] ?? []), asset];
    return acc;
  }, {});

  function getPointerCell(clientX: number, clientY: number) {
    const gridElement = gridRef.current;

    if (!gridElement) {
      return undefined;
    }

    const rect = gridElement.getBoundingClientRect();
    const x = clamp(Math.floor(((clientX - rect.left) / rect.width) * GRID_COLS) + 1, 1, GRID_COLS);
    const y = clamp(Math.floor(((clientY - rect.top) / rect.height) * GRID_ROWS) + 1, 1, GRID_ROWS);

    return { x, y };
  }

  function startLocationDrag(location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) {
    onSelectLocation(location.id);

    if (!editMode || event.button !== 0) {
      return;
    }

    const cell = getPointerCell(event.clientX, event.clientY);

    if (!cell) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    setDragState({
      locationId: location.id,
      offsetX: clamp(cell.x - location.layoutX, 0, Math.max(0, location.layoutW - 1)),
      offsetY: clamp(cell.y - location.layoutY, 0, Math.max(0, location.layoutH - 1)),
      pointerId: event.pointerId,
      previewX: location.layoutX,
      previewY: location.layoutY
    });
  }

  function moveLocationDrag(location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragState || dragState.locationId !== location.id || dragState.pointerId !== event.pointerId) {
      return;
    }

    const cell = getPointerCell(event.clientX, event.clientY);

    if (!cell) {
      return;
    }

    const previewX = clamp(cell.x - dragState.offsetX, 1, GRID_COLS - location.layoutW + 1);
    const previewY = clamp(cell.y - dragState.offsetY, 1, GRID_ROWS - location.layoutH + 1);

    setDragState((current) =>
      current && current.locationId === location.id
        ? {
            ...current,
            previewX,
            previewY
          }
        : current
    );
  }

  function finishLocationDrag(location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragState || dragState.locationId !== location.id || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const position = findNearestAvailablePosition(locations, location, dragState.previewX, dragState.previewY);
    const layoutOrder = getGridOrder(position.layoutX, position.layoutY);

    if (
      location.layoutX !== position.layoutX ||
      location.layoutY !== position.layoutY ||
      location.layoutOrder !== layoutOrder
    ) {
      onUpdateLocation(location.id, {
        layoutOrder,
        layoutX: position.layoutX,
        layoutY: position.layoutY
      });
    }

    setDragState(undefined);
  }

  function cancelLocationDrag(location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) {
    if (dragState?.locationId !== location.id) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragState(undefined);
  }

  return (
    <section
      className="min-w-0 scroll-mt-32 rounded-lg border border-outline-variant bg-surface p-3 shadow-panel sm:p-4 md:p-5"
      id="layout"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Layout del Salon</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Rejilla operativa de closets, mesas y equipos.</p>
        </div>
        <button
          className={[
            "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition",
            editMode
              ? "border-primary bg-primary text-on-primary"
              : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
          ].join(" ")}
          onClick={() => setEditMode((current) => !current)}
          type="button"
        >
          <Pencil size={16} />
          {editMode ? "Listo" : "Editar layout"}
        </button>
      </div>

      {editMode ? (
        <LayoutEditor
          assetCount={selectedLocation ? assetsByLocation[selectedLocation.id]?.length ?? 0 : 0}
          location={selectedLocation}
          onCreateLocation={onCreateLocation}
          onDeleteLocation={onDeleteLocation}
          onSelectLocation={onSelectLocation}
          onUpdateLocation={onUpdateLocation}
        />
      ) : null}

      <div className="grid gap-3 md:hidden">
        {sortedLocations.map((location) => {
          const locationAssets = assetsByLocation[location.id] ?? [];

          return (
            <MobileLocationCard
              assetCount={locationAssets.length}
              key={location.id}
              location={location}
              onSelectLocation={onSelectLocation}
              primaryAsset={locationAssets[0]}
              selected={selectedLocationId === location.id}
              status={getLocationStatus(locationAssets)}
            />
          );
        })}
      </div>

      <div className="hidden overflow-x-auto pb-2 md:block">
        <div className="relative min-w-[760px] rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
          <div
            ref={gridRef}
            className="grid min-h-[620px] gap-2 rounded-md border-4 border-surface-container bg-[linear-gradient(to_right,rgba(115,118,135,0.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,118,135,0.13)_1px,transparent_1px)] bg-[length:8.333%_7.142%] p-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_ROWS}, minmax(34px, 1fr))`
            }}
          >
            {sortedLocations.map((location) => {
              const locationAssets = assetsByLocation[location.id] ?? [];

              return (
                <GridLocationBlock
                  assetCount={locationAssets.length}
                  dragPreview={
                    dragState?.locationId === location.id
                      ? { layoutX: dragState.previewX, layoutY: dragState.previewY }
                      : undefined
                  }
                  editMode={editMode}
                  key={location.id}
                  location={location}
                  onCancelDrag={cancelLocationDrag}
                  onMoveDrag={moveLocationDrag}
                  onSelectLocation={onSelectLocation}
                  onStartDrag={startLocationDrag}
                  onStopDrag={finishLocationDrag}
                  primaryAsset={locationAssets[0]}
                  selected={selectedLocationId === location.id}
                  status={getLocationStatus(locationAssets)}
                />
              );
            })}

            <div className="pointer-events-none col-start-6 col-span-2 row-start-[14] flex h-8 items-center justify-center self-end bg-primary/10 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary/60">
              <DoorOpen size={14} />
              <span className="ml-2">Entrada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LayoutEditor({
  assetCount,
  location,
  onCreateLocation,
  onDeleteLocation,
  onSelectLocation,
  onUpdateLocation
}: {
  assetCount: number;
  location?: InventoryLocation;
  onCreateLocation: (type: LocationType) => void;
  onDeleteLocation: (locationId: string) => void;
  onSelectLocation: (locationId: string) => void;
  onUpdateLocation: (locationId: string, patch: LocationPatch) => void;
}) {
  if (!location) {
    return (
      <div className="mb-4 rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-3">
        <LayoutComponentActions onCreateLocation={onCreateLocation} />
      </div>
    );
  }

  const activeLocation = location;

  function updateGrid(patch: LocationPatch) {
    onUpdateLocation(activeLocation.id, patch);
    onSelectLocation(activeLocation.id);
  }

  function updateX(value: number) {
    updateGrid({ layoutX: clamp(value, 1, GRID_COLS - activeLocation.layoutW + 1) });
  }

  function updateY(value: number) {
    updateGrid({ layoutY: clamp(value, 1, GRID_ROWS - activeLocation.layoutH + 1) });
  }

  function updateW(value: number) {
    updateGrid({ layoutW: clamp(value, 1, GRID_COLS - activeLocation.layoutX + 1) });
  }

  function updateH(value: number) {
    updateGrid({ layoutH: clamp(value, 1, GRID_ROWS - activeLocation.layoutY + 1) });
  }

  return (
    <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-primary">
          <SlidersHorizontal size={18} />
          <h3 className="truncate font-display text-lg font-bold">Editar {location.code}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            <Grid2X2 size={14} />
            Rejilla 12x14
          </span>
          <button
            className="inline-flex h-8 items-center gap-2 rounded-md border border-error/35 bg-white px-2 text-xs font-bold text-error hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline"
            disabled={assetCount > 0}
            onClick={() => onDeleteLocation(location.id)}
            type="button"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>

      <LayoutComponentActions onCreateLocation={onCreateLocation} />

      <div className="grid gap-3 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(280px,1.4fr)]">
        <label className="grid gap-1 text-sm font-semibold">
          Nombre
          <input
            className="h-10 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => updateGrid({ name: event.target.value })}
            value={location.name}
          />
        </label>

        <label className="grid gap-1 text-sm font-semibold">
          Zona
          <input
            className="h-10 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            onChange={(event) => updateGrid({ zone: event.target.value })}
            value={location.zone}
          />
        </label>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Ruler size={16} className="text-primary" />
            Posicion y tamano
          </div>
          <div className="grid grid-cols-4 gap-2">
            <GridInput label="X" max={GRID_COLS} min={1} onChange={updateX} value={location.layoutX} />
            <GridInput label="Y" max={GRID_ROWS} min={1} onChange={updateY} value={location.layoutY} />
            <GridInput label="W" max={GRID_COLS} min={1} onChange={updateW} value={location.layoutW} />
            <GridInput label="H" max={GRID_ROWS} min={1} onChange={updateH} value={location.layoutH} />
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
        <div className="grid grid-cols-4 gap-2">
          <GridButton label="Arr" onClick={() => updateY(location.layoutY - 1)} />
          <GridButton label="Abj" onClick={() => updateY(location.layoutY + 1)} />
          <GridButton label="Izq" onClick={() => updateX(location.layoutX - 1)} />
          <GridButton label="Der" onClick={() => updateX(location.layoutX + 1)} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <GridButton label="W -" onClick={() => updateW(location.layoutW - 1)} />
          <GridButton label="W +" onClick={() => updateW(location.layoutW + 1)} />
          <GridButton label="H -" onClick={() => updateH(location.layoutH - 1)} />
          <GridButton label="H +" onClick={() => updateH(location.layoutH + 1)} />
        </div>
        <span className="self-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
          {getTypeLabel(location.type)}
        </span>
      </div>
    </div>
  );
}

function LayoutComponentActions({ onCreateLocation }: { onCreateLocation: (type: LocationType) => void }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <AddLayoutButton label="Closet" onClick={() => onCreateLocation("closet")} />
      <AddLayoutButton label="Equipo" onClick={() => onCreateLocation("station")} />
      <AddLayoutButton label="Mesa" onClick={() => onCreateLocation("work_area")} />
    </div>
  );
}

function AddLayoutButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 text-xs font-bold text-on-surface-variant hover:border-primary hover:text-primary"
      onClick={onClick}
      type="button"
    >
      <Plus size={14} />
      {label}
    </button>
  );
}

function GridInput({
  label,
  max,
  min,
  onChange,
  value
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-outline">
      {label}
      <input
        className="h-10 rounded-lg border border-outline-variant bg-white px-2 font-mono text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value) || min)}
        type="number"
        value={value}
      />
    </label>
  );
}

function GridButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="h-9 rounded-lg border border-outline-variant bg-white px-2 text-xs font-bold text-on-surface-variant hover:border-primary hover:text-primary"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function GridLocationBlock({
  location,
  selected,
  status,
  assetCount,
  dragPreview,
  primaryAsset,
  editMode,
  onCancelDrag,
  onMoveDrag,
  onSelectLocation,
  onStartDrag,
  onStopDrag
}: {
  location: InventoryLocation;
  selected: boolean;
  status: AssetStatus;
  assetCount: number;
  dragPreview?: { layoutX: number; layoutY: number };
  primaryAsset?: Asset;
  editMode: boolean;
  onCancelDrag: (location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onMoveDrag: (location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onSelectLocation: (locationId: string) => void;
  onStartDrag: (location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onStopDrag: (location: InventoryLocation, event: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      aria-label={location.name}
      className={[
        "relative min-h-0 min-w-0 touch-none overflow-hidden rounded-md border-2 p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel",
        getBlockClass(location.type, status, selected),
        editMode ? "cursor-grab active:cursor-grabbing" : ""
      ].join(" ")}
      onClick={() => onSelectLocation(location.id)}
      onPointerCancel={(event) => onCancelDrag(location, event)}
      onPointerDown={(event) => onStartDrag(location, event)}
      onPointerMove={(event) => onMoveDrag(location, event)}
      onPointerUp={(event) => onStopDrag(location, event)}
      style={{
        gridColumn: `${dragPreview?.layoutX ?? location.layoutX} / span ${location.layoutW}`,
        gridRow: `${dragPreview?.layoutY ?? location.layoutY} / span ${location.layoutH}`,
        zIndex: dragPreview ? 20 : undefined
      }}
      title={location.name}
      type="button"
    >
      <span className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate font-display text-xl font-bold leading-none">{location.code}</span>
          <span className="mt-1 block truncate font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-outline">
            {getTypeLabel(location.type)}
          </span>
        </span>
        {assetCount > 0 ? (
          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
            {assetCount}
          </span>
        ) : null}
      </span>
      <span className="absolute inset-x-2 bottom-2 min-w-0">
        <span className="block truncate font-mono text-[10px] font-bold text-on-surface">
          {primaryAsset?.code ?? location.name}
        </span>
        {location.type === "station" ? (
          <span className="block truncate text-[10px] font-semibold text-outline">{getStatusLabel(status)}</span>
        ) : null}
      </span>
    </button>
  );
}

function MobileLocationCard({
  location,
  selected,
  status,
  assetCount,
  primaryAsset,
  onSelectLocation
}: {
  location: InventoryLocation;
  selected: boolean;
  status: AssetStatus;
  assetCount: number;
  primaryAsset?: Asset;
  onSelectLocation: (locationId: string) => void;
}) {
  return (
    <button
      className={[
        "grid min-h-20 grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-sm",
        selected ? "border-primary ring-4 ring-primary/10" : "border-outline-variant"
      ].join(" ")}
      onClick={() => onSelectLocation(location.id)}
      type="button"
    >
      <span className={["grid h-12 w-12 place-items-center rounded-md border-2 font-display text-lg font-bold", getMobileCodeClass(location.type, status)].join(" ")}>
        {location.code}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-base font-bold">{location.name}</span>
        <span className="block truncate text-sm text-on-surface-variant">
          {primaryAsset ? `${primaryAsset.code} - ${primaryAsset.name}` : getTypeLabel(location.type)}
        </span>
      </span>
      <span className="grid justify-items-end gap-1">
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${getStatusPillClass(status)}`}>
          {location.type === "station" ? getStatusLabel(status) : getTypeLabel(location.type)}
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
          {assetCount} activos
        </span>
      </span>
    </button>
  );
}

function getLocationStatus(locationAssets: Asset[]) {
  if (locationAssets.some((asset) => asset.status === "faltante")) {
    return "faltante";
  }

  if (locationAssets.some((asset) => asset.status === "mantenimiento")) {
    return "mantenimiento";
  }

  if (locationAssets.some((asset) => asset.status === "incompleto")) {
    return "incompleto";
  }

  return "ok";
}

function getBlockClass(type: LocationType, status: AssetStatus, selected: boolean) {
  if (selected) {
    return "border-primary bg-white text-primary ring-4 ring-primary/15";
  }

  if (type === "closet") {
    return "border-secondary/30 bg-white text-secondary hover:border-secondary";
  }

  if (type === "work_area") {
    return "border-dashed border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary";
  }

  return {
    ok: "border-success/35 bg-white text-success hover:border-success",
    incompleto: "border-secondary/35 bg-white text-secondary hover:border-secondary",
    mantenimiento: "border-warning/40 bg-white text-warning hover:border-warning",
    faltante: "border-error/40 bg-white text-error hover:border-error"
  }[status];
}

function getMobileCodeClass(type: LocationType, status: AssetStatus) {
  if (type === "closet") {
    return "border-secondary/30 text-secondary";
  }

  if (type === "work_area") {
    return "border-outline-variant text-on-surface-variant";
  }

  return {
    ok: "border-success/35 text-success",
    incompleto: "border-secondary/35 text-secondary",
    mantenimiento: "border-warning/40 text-warning",
    faltante: "border-error/40 text-error"
  }[status];
}

function getTypeLabel(type: LocationType) {
  return {
    closet: "Closet",
    station: "Equipo",
    work_area: "Mesa"
  }[type];
}

function getStatusLabel(status: AssetStatus) {
  return {
    ok: "OK",
    incompleto: "Incompleto",
    mantenimiento: "Mantenimiento",
    faltante: "Faltante"
  }[status];
}

function getStatusPillClass(status: AssetStatus) {
  return {
    ok: "bg-success text-white",
    incompleto: "bg-secondary text-white",
    mantenimiento: "bg-warning text-white",
    faltante: "bg-error text-white"
  }[status];
}

function sortByGrid(a: InventoryLocation, b: InventoryLocation) {
  return a.layoutY - b.layoutY || a.layoutX - b.layoutX || a.layoutOrder - b.layoutOrder;
}

function findNearestAvailablePosition(
  locations: InventoryLocation[],
  activeLocation: InventoryLocation,
  targetX: number,
  targetY: number
) {
  const safeTarget = {
    layoutX: clamp(targetX, 1, GRID_COLS - activeLocation.layoutW + 1),
    layoutY: clamp(targetY, 1, GRID_ROWS - activeLocation.layoutH + 1)
  };
  const candidates: Array<{ distance: number; layoutX: number; layoutY: number }> = [];

  for (let y = 1; y <= GRID_ROWS - activeLocation.layoutH + 1; y += 1) {
    for (let x = 1; x <= GRID_COLS - activeLocation.layoutW + 1; x += 1) {
      candidates.push({
        distance: Math.abs(x - safeTarget.layoutX) + Math.abs(y - safeTarget.layoutY),
        layoutX: x,
        layoutY: y
      });
    }
  }

  candidates.sort((a, b) => a.distance - b.distance || a.layoutY - b.layoutY || a.layoutX - b.layoutX);

  const available = candidates.find((candidate) =>
    isPositionAvailable(locations, activeLocation, candidate.layoutX, candidate.layoutY)
  );

  return available ?? safeTarget;
}

function isPositionAvailable(
  locations: InventoryLocation[],
  activeLocation: InventoryLocation,
  layoutX: number,
  layoutY: number
) {
  return !locations.some((location) => {
    if (location.id === activeLocation.id) {
      return false;
    }

    return rectsOverlap(
      {
        h: activeLocation.layoutH,
        w: activeLocation.layoutW,
        x: layoutX,
        y: layoutY
      },
      {
        h: location.layoutH,
        w: location.layoutW,
        x: location.layoutX,
        y: location.layoutY
      }
    );
  });
}

function rectsOverlap(
  a: { h: number; w: number; x: number; y: number },
  b: { h: number; w: number; x: number; y: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getGridOrder(layoutX: number, layoutY: number) {
  return (layoutY - 1) * GRID_COLS + layoutX;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
