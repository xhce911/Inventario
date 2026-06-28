import type { Asset, AuditRecord, InventoryLocation } from "./types";

export const locations: InventoryLocation[] = [
  { id: "closet-c1", code: "C1", type: "closet", name: "Closet C1", zone: "Norte", layoutSide: "top", layoutOrder: 1, layoutX: 1, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "closet-c2", code: "C2", type: "closet", name: "Closet C2", zone: "Norte", layoutSide: "top", layoutOrder: 2, layoutX: 3, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "closet-c3", code: "C3", type: "closet", name: "Closet C3", zone: "Norte", layoutSide: "top", layoutOrder: 3, layoutX: 5, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "closet-c4", code: "C4", type: "closet", name: "Closet C4", zone: "Norte", layoutSide: "top", layoutOrder: 4, layoutX: 7, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "closet-c5", code: "C5", type: "closet", name: "Closet C5", zone: "Norte", layoutSide: "top", layoutOrder: 5, layoutX: 9, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "closet-c6", code: "C6", type: "closet", name: "Closet C6", zone: "Norte", layoutSide: "top", layoutOrder: 6, layoutX: 11, layoutY: 1, layoutW: 2, layoutH: 2 },
  { id: "station-1", code: "1", type: "station", name: "Equipo 1", zone: "Este", layoutSide: "right", layoutOrder: 1, layoutX: 11, layoutY: 4, layoutW: 2, layoutH: 1 },
  { id: "station-2", code: "2", type: "station", name: "Equipo 2", zone: "Este", layoutSide: "right", layoutOrder: 2, layoutX: 11, layoutY: 6, layoutW: 2, layoutH: 1 },
  { id: "station-3", code: "3", type: "station", name: "Equipo 3", zone: "Este", layoutSide: "right", layoutOrder: 3, layoutX: 11, layoutY: 8, layoutW: 2, layoutH: 1 },
  { id: "station-4", code: "4", type: "station", name: "Equipo 4", zone: "Este", layoutSide: "right", layoutOrder: 4, layoutX: 11, layoutY: 10, layoutW: 2, layoutH: 1 },
  { id: "station-5", code: "5", type: "station", name: "Equipo 5", zone: "Este", layoutSide: "right", layoutOrder: 5, layoutX: 11, layoutY: 12, layoutW: 2, layoutH: 1 },
  { id: "station-6", code: "6", type: "station", name: "Equipo 6", zone: "Oeste", layoutSide: "left", layoutOrder: 5, layoutX: 1, layoutY: 12, layoutW: 2, layoutH: 1 },
  { id: "station-7", code: "7", type: "station", name: "Equipo 7", zone: "Oeste", layoutSide: "left", layoutOrder: 4, layoutX: 1, layoutY: 10, layoutW: 2, layoutH: 1 },
  { id: "station-8", code: "8", type: "station", name: "Equipo 8", zone: "Oeste", layoutSide: "left", layoutOrder: 3, layoutX: 1, layoutY: 8, layoutW: 2, layoutH: 1 },
  { id: "station-9", code: "9", type: "station", name: "Equipo 9", zone: "Oeste", layoutSide: "left", layoutOrder: 2, layoutX: 1, layoutY: 6, layoutW: 2, layoutH: 1 },
  { id: "station-10", code: "10", type: "station", name: "Equipo 10", zone: "Oeste", layoutSide: "left", layoutOrder: 1, layoutX: 1, layoutY: 4, layoutW: 2, layoutH: 1 },
  { id: "work-area-a", code: "MA", type: "work_area", name: "Mesa de trabajo A", zone: "Centro", layoutSide: "center", layoutOrder: 1, layoutX: 4, layoutY: 4, layoutW: 2, layoutH: 2 },
  { id: "work-area-b", code: "MB", type: "work_area", name: "Mesa de trabajo B", zone: "Centro", layoutSide: "center", layoutOrder: 2, layoutX: 7, layoutY: 4, layoutW: 2, layoutH: 2 },
  { id: "station-11", code: "11", type: "station", name: "Equipo 11", zone: "Centro", layoutSide: "center", layoutOrder: 11, layoutX: 4, layoutY: 7, layoutW: 2, layoutH: 2 },
  { id: "station-12", code: "12", type: "station", name: "Equipo 12", zone: "Centro", layoutSide: "center", layoutOrder: 12, layoutX: 7, layoutY: 7, layoutW: 2, layoutH: 2 },
  { id: "bench-mount", code: "MM", type: "work_area", name: "Mesa de montaje", zone: "Centro", layoutSide: "center", layoutOrder: 3, layoutX: 4, layoutY: 10, layoutW: 5, layoutH: 2 },
  { id: "bench-test", code: "MP", type: "work_area", name: "Mesa de pruebas", zone: "Centro", layoutSide: "center", layoutOrder: 4, layoutX: 4, layoutY: 12, layoutW: 5, layoutH: 2 }
];

export const assets: Asset[] = [
  {
    id: "asset-ev3-001",
    code: "KIT-EV3-001",
    name: "Kit Lego EV3 1",
    category: "Lego EV3",
    status: "ok",
    locationId: "closet-c1",
    lastReview: "2026-06-20",
    responsible: "Encargado del aula",
    notes: "Inventario completo.",
    components: [
      { id: "ev3-001-brick", name: "Brick EV3", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "ev3-001-motors", name: "Motores grandes", quantityExpected: 2, quantityActual: 2, status: "ok" },
      { id: "ev3-001-sensors", name: "Sensores", quantityExpected: 4, quantityActual: 4, status: "ok" }
    ]
  },
  {
    id: "asset-ev3-002",
    code: "KIT-EV3-002",
    name: "Kit Lego EV3 2",
    category: "Lego EV3",
    status: "incompleto",
    locationId: "closet-c1",
    lastReview: "2026-06-18",
    responsible: "Encargado del aula",
    notes: "Falta un sensor ultrasonico.",
    components: [
      { id: "ev3-002-brick", name: "Brick EV3", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "ev3-002-motors", name: "Motores grandes", quantityExpected: 2, quantityActual: 2, status: "ok" },
      { id: "ev3-002-ultra", name: "Sensor ultrasonico", quantityExpected: 1, quantityActual: 0, status: "faltante" }
    ]
  },
  {
    id: "asset-rk-001",
    code: "RK-001",
    name: "Robotkit Basico 1",
    category: "Robotkit",
    status: "ok",
    locationId: "closet-c2",
    lastReview: "2026-06-19",
    responsible: "Docente de robotica",
    notes: "Listo para clase.",
    components: [
      { id: "rk-001-board", name: "Controlador", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "rk-001-wheels", name: "Ruedas", quantityExpected: 2, quantityActual: 2, status: "ok" }
    ]
  },
  {
    id: "asset-dygo-001",
    code: "DYGO-001",
    name: "DYGO Set 1",
    category: "DYGO",
    status: "mantenimiento",
    locationId: "closet-c3",
    lastReview: "2026-06-16",
    responsible: "Soporte tecnico",
    notes: "Revisar placa principal.",
    components: [
      { id: "dygo-001-board", name: "Placa", quantityExpected: 1, quantityActual: 1, status: "mantenimiento" },
      { id: "dygo-001-cables", name: "Cables", quantityExpected: 6, quantityActual: 6, status: "ok" }
    ]
  },
  {
    id: "asset-el-001",
    code: "ELEC-001",
    name: "Caja de sensores",
    category: "Electronica",
    status: "ok",
    locationId: "closet-c4",
    lastReview: "2026-06-21",
    responsible: "Encargado del aula",
    notes: "Sensores separados por tipo.",
    components: [
      { id: "el-001-ir", name: "Sensores infrarrojos", quantityExpected: 10, quantityActual: 10, status: "ok" },
      { id: "el-001-jumper", name: "Jumpers", quantityExpected: 40, quantityActual: 40, status: "ok" }
    ]
  },
  {
    id: "asset-pc-001",
    code: "EQ-001",
    name: "Equipo de computo 1",
    category: "Computo",
    status: "ok",
    locationId: "station-1",
    lastReview: "2026-06-22",
    responsible: "Soporte tecnico",
    notes: "Sin incidencias.",
    components: [
      { id: "pc-001-mouse", name: "Mouse", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-001-keyboard", name: "Teclado", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-001-speakers", name: "Bocinas", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-001-mousepad", name: "Mousepad", quantityExpected: 1, quantityActual: 1, status: "ok" }
    ]
  },
  {
    id: "asset-pc-005",
    code: "EQ-005",
    name: "Equipo de computo 5",
    category: "Computo",
    status: "faltante",
    locationId: "station-5",
    lastReview: "2026-06-15",
    responsible: "Soporte tecnico",
    notes: "No se encontro mouse.",
    components: [
      { id: "pc-005-mouse", name: "Mouse", quantityExpected: 1, quantityActual: 0, status: "faltante" },
      { id: "pc-005-keyboard", name: "Teclado", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-005-speakers", name: "Bocinas", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-005-mousepad", name: "Mousepad", quantityExpected: 1, quantityActual: 1, status: "ok" }
    ]
  },
  {
    id: "asset-pc-010",
    code: "EQ-010",
    name: "Equipo de computo 10",
    category: "Computo",
    status: "mantenimiento",
    locationId: "station-10",
    lastReview: "2026-06-17",
    responsible: "Soporte tecnico",
    notes: "Bocinas con falla intermitente.",
    components: [
      { id: "pc-010-mouse", name: "Mouse", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-010-keyboard", name: "Teclado", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-010-speakers", name: "Bocinas", quantityExpected: 1, quantityActual: 1, status: "mantenimiento" },
      { id: "pc-010-mousepad", name: "Mousepad", quantityExpected: 1, quantityActual: 1, status: "ok" }
    ]
  },
  {
    id: "asset-pc-011",
    code: "EQ-011",
    name: "Equipo de computo 11",
    category: "Computo",
    status: "ok",
    locationId: "station-11",
    lastReview: "2026-06-23",
    responsible: "Soporte tecnico",
    notes: "Equipo central listo.",
    components: [
      { id: "pc-011-mouse", name: "Mouse", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-011-keyboard", name: "Teclado", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-011-speakers", name: "Bocinas", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-011-mousepad", name: "Mousepad", quantityExpected: 1, quantityActual: 1, status: "ok" }
    ]
  },
  {
    id: "asset-pc-012",
    code: "EQ-012",
    name: "Equipo de computo 12",
    category: "Computo",
    status: "ok",
    locationId: "station-12",
    lastReview: "2026-06-23",
    responsible: "Soporte tecnico",
    notes: "Equipo central listo.",
    components: [
      { id: "pc-012-mouse", name: "Mouse", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-012-keyboard", name: "Teclado", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-012-speakers", name: "Bocinas", quantityExpected: 1, quantityActual: 1, status: "ok" },
      { id: "pc-012-mousepad", name: "Mousepad", quantityExpected: 1, quantityActual: 1, status: "ok" }
    ]
  }
];

export const audits: AuditRecord[] = [];
