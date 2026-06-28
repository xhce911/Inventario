export type LocationType = "closet" | "station" | "work_area";
export type LocationLayoutSide = "top" | "left" | "right" | "center";

export type AssetStatus = "ok" | "incompleto" | "mantenimiento" | "faltante";
export type WorkspaceView = "dashboard" | "layout" | "cards" | "table" | "audits" | "reports";

export interface InventoryLocation {
  id: string;
  code: string;
  type: LocationType;
  name: string;
  zone: string;
  layoutSide: LocationLayoutSide;
  layoutOrder: number;
  layoutX: number;
  layoutY: number;
  layoutW: number;
  layoutH: number;
}

export interface AssetComponent {
  id: string;
  name: string;
  quantityExpected: number;
  quantityActual: number;
  status: AssetStatus;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  status: AssetStatus;
  locationId: string;
  lastReview: string;
  responsible: string;
  notes: string;
  components: AssetComponent[];
}

export interface AuditRecord {
  id: string;
  date: string;
  userId: string;
  userName: string;
  locationId: string;
  locationCode: string;
  locationName: string;
  assetCount: number;
  issueCount: number;
  notes: string;
}

export type AssetPatch = Partial<Pick<Asset, "name" | "category" | "status" | "lastReview" | "responsible" | "notes">> & {
  components?: AssetComponent[];
  locationId?: string;
};

export type LocationPatch = Partial<
  Pick<InventoryLocation, "name" | "zone" | "layoutSide" | "layoutOrder" | "layoutX" | "layoutY" | "layoutW" | "layoutH">
>;

export interface CreateAssetInput {
  name: string;
  category: string;
  status: AssetStatus;
  locationId: string;
  notes: string;
  components: Array<Pick<AssetComponent, "name" | "quantityExpected" | "quantityActual" | "status">>;
}

export interface CreateAuditInput {
  location: InventoryLocation;
  assets: Asset[];
  userId: string;
  userName: string;
  notes: string;
}
