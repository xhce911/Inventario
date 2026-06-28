import type { Asset, InventoryLocation } from "../data/types";

export function downloadInventoryCsv(assets: Asset[], locations: InventoryLocation[], filenamePrefix = "inventario-robolab") {
  const locationById = new Map(locations.map((location) => [location.id, location]));
  const rows = [
    ["codigo", "nombre", "categoria", "estado", "ubicacion", "responsable", "ultima_revision", "componentes", "notas"],
    ...assets.map((asset) => {
      const location = locationById.get(asset.locationId);

      return [
        asset.code,
        asset.name,
        asset.category,
        asset.status,
        location ? `${location.code} ${location.name}` : asset.locationId,
        asset.responsible,
        asset.lastReview,
        asset.components
          .map((component) => `${component.name} ${component.quantityActual}/${component.quantityExpected} ${component.status}`)
          .join(" | "),
        asset.notes
      ];
    })
  ];
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string | number) {
  const text = String(value);

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}
