import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { categoryOptions, getDefaultComponentNames, getStatusLabel, statusOptions } from "../../data/inventoryRules";
import type { AssetStatus, CreateAssetInput, InventoryLocation } from "../../data/types";

interface AddAssetDialogProps {
  open: boolean;
  initialCategory?: string;
  locations: InventoryLocation[];
  onClose: () => void;
  onCreateAsset: (input: CreateAssetInput) => void;
}

function getComponentText(category: string) {
  return getDefaultComponentNames(category).join("\n");
}

export function AddAssetDialog({ initialCategory, locations, open, onClose, onCreateAsset }: AddAssetDialogProps) {
  const assignableLocations = useMemo(() => locations.filter((location) => location.type !== "work_area"), [locations]);
  const defaultLocationId = assignableLocations[0]?.id ?? "";
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [status, setStatus] = useState<AssetStatus>("ok");
  const [locationId, setLocationId] = useState(defaultLocationId);
  const [notes, setNotes] = useState("");
  const [componentText, setComponentText] = useState(getComponentText(categoryOptions[0]));

  const sortedLocations = useMemo(
    () => [...assignableLocations].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)),
    [assignableLocations]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextCategory = initialCategory && categoryOptions.includes(initialCategory) ? initialCategory : categoryOptions[0];
    const nextLocation =
      sortedLocations.find((location) => (nextCategory === "Computo" ? location.type === "station" : location.type === "closet")) ??
      sortedLocations[0];

    setCategory(nextCategory);
    setLocationId(nextLocation?.id ?? "");
    setComponentText(getComponentText(nextCategory));
  }, [initialCategory, open, sortedLocations]);

  if (!open) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const components = componentText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((componentName) => ({
        name: componentName,
        quantityExpected: 1,
        quantityActual: status === "faltante" ? 0 : 1,
        status
      }));

    onCreateAsset({
      name,
      category,
      status,
      locationId,
      notes: notes || "Alta registrada desde flujo operativo.",
      components
    });

    setName("");
    setNotes("");
    setComponentText(getComponentText(category));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#181c1f]/45 px-4 py-6 backdrop-blur-sm">
      <form
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-panel"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-bold text-primary">Alta de activo</h2>
            <p className="text-sm text-on-surface-variant">Registro operativo de inventario</p>
          </div>
          <button
            aria-label="Cerrar alta"
            className="grid h-9 w-9 place-items-center rounded-md text-on-surface-variant hover:bg-surface-container"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 overflow-auto p-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Nombre
            <input
              className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Categoria
            <select
              className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary"
              onChange={(event) => {
                const nextCategory = event.target.value;
                setCategory(nextCategory);
                setComponentText(getComponentText(nextCategory));
              }}
              value={category}
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Estado
            <select
              className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary"
              onChange={(event) => setStatus(event.target.value as AssetStatus)}
              value={status}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {getStatusLabel(option)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Punto del layout
            <select
              className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary"
              onChange={(event) => setLocationId(event.target.value)}
              value={locationId}
            >
              {sortedLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Componentes
            <textarea
              className="min-h-28 rounded-lg border border-outline-variant bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setComponentText(event.target.value)}
              value={componentText}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Notas
            <textarea
              className="min-h-24 rounded-lg border border-outline-variant bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-outline-variant px-5 py-4 sm:flex-row sm:justify-end">
          <button
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface-variant hover:border-primary hover:text-primary"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:brightness-105" type="submit">
            Guardar activo
          </button>
        </div>
      </form>
    </div>
  );
}
