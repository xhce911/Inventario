import type { AssetStatus } from "../../data/types";

const statusStyles: Record<AssetStatus, string> = {
  ok: "bg-success text-white",
  incompleto: "bg-secondary text-white",
  mantenimiento: "bg-warning text-white",
  faltante: "bg-error text-white"
};

const statusLabels: Record<AssetStatus, string> = {
  ok: "OK",
  incompleto: "Incompleto",
  mantenimiento: "Mantenimiento",
  faltante: "Faltante"
};

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
