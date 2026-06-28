import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  LayoutGrid,
  Layers3,
  Table2,
  type LucideIcon
} from "lucide-react";
import type { Asset, AssetComponent, AssetStatus, LocationType, WorkspaceView } from "./types";

export const GRID_COLS = 12;
export const GRID_ROWS = 14;

export const statusOptions: AssetStatus[] = ["ok", "incompleto", "mantenimiento", "faltante"];
export const categoryOptions = ["Lego EV3", "Robotkit", "DYGO", "Electronica", "Computo"];

export const workspaceViews: Array<{
  view: WorkspaceView;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    view: "dashboard",
    label: "Principal",
    description: "Overview general de inventario, estados y categorias.",
    icon: BarChart3
  },
  {
    view: "layout",
    label: "Layout",
    description: "Edita y consulta la distribucion fisica del aula.",
    icon: LayoutGrid
  },
  {
    view: "cards",
    label: "Cartas",
    description: "Navega contenidos por punto, activo y componentes.",
    icon: Layers3
  },
  {
    view: "table",
    label: "Tabla",
    description: "Consulta lineal y densa de activos visibles.",
    icon: Table2
  },
  {
    view: "audits",
    label: "Auditorias",
    description: "Consulta cierres de revision y puntos pendientes.",
    icon: ClipboardList
  },
  {
    view: "reports",
    label: "Reportes",
    description: "Genera cortes CSV y revisa incidencias operativas.",
    icon: FileSpreadsheet
  }
];

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function makeId(prefix: string) {
  if (typeof window !== "undefined" && "crypto" in window && "randomUUID" in window.crypto) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function makeAssetCode(category: string, nextIndex: number) {
  const prefix = category
    .split(/\s+/)
    .map((word) => word.slice(0, 3).toUpperCase())
    .join("-")
    .replace(/[^A-Z-]/g, "")
    .slice(0, 10);

  return `${prefix || "AST"}-${String(nextIndex).padStart(3, "0")}`;
}

export function deriveComponentStatus(quantityActual: number, quantityExpected: number): AssetStatus {
  if (quantityActual >= quantityExpected) {
    return "ok";
  }

  return quantityActual === 0 ? "faltante" : "incompleto";
}

export function deriveAssetStatus(components: AssetComponent[]): AssetStatus {
  if (
    components.some(
      (component) =>
        component.status === "faltante" || (component.quantityExpected > 0 && component.quantityActual === 0)
    )
  ) {
    return "faltante";
  }

  if (components.some((component) => component.status === "incompleto" || component.quantityActual < component.quantityExpected)) {
    return "incompleto";
  }

  if (components.some((component) => component.status === "mantenimiento")) {
    return "mantenimiento";
  }

  return "ok";
}

export function getDefaultLocationSize(type: LocationType) {
  if (type === "closet") {
    return { layoutW: 2, layoutH: 2 };
  }

  if (type === "work_area") {
    return { layoutW: 3, layoutH: 2 };
  }

  return { layoutW: 2, layoutH: 1 };
}

export function getDefaultComponentNames(category: string) {
  if (category === "Computo") {
    return ["Mouse", "Teclado", "Bocinas", "Mousepad"];
  }

  return ["Controlador", "Cables", "Sensores"];
}

export function getTypeLabel(type: LocationType) {
  return {
    closet: "Closet",
    station: "Equipo",
    work_area: "Mesa"
  }[type];
}

export function getStatusLabel(status: AssetStatus) {
  return {
    ok: "OK",
    incompleto: "Incompleto",
    mantenimiento: "Mantenimiento",
    faltante: "Faltante"
  }[status];
}

export function countIssueComponents(asset: Asset) {
  return asset.components.filter(
    (component) => component.status !== "ok" || component.quantityActual < component.quantityExpected
  ).length;
}

export function countAssetIssues(assets: Asset[]) {
  return assets.filter((asset) => asset.status !== "ok" || countIssueComponents(asset) > 0).length;
}

export function findOpenGridPosition(
  locations: Array<{ layoutX: number; layoutY: number; layoutW: number; layoutH: number }>,
  layoutW: number,
  layoutH: number
) {
  for (let y = 1; y <= GRID_ROWS - layoutH + 1; y += 1) {
    for (let x = 1; x <= GRID_COLS - layoutW + 1; x += 1) {
      const overlaps = locations.some((location) =>
        rectsOverlap(
          { x, y, w: layoutW, h: layoutH },
          { x: location.layoutX, y: location.layoutY, w: location.layoutW, h: location.layoutH }
        )
      );

      if (!overlaps) {
        return { layoutX: x, layoutY: y };
      }
    }
  }

  return { layoutX: 1, layoutY: 1 };
}

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
