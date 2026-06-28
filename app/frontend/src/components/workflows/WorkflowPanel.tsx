import { FormEvent, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Save } from "lucide-react";
import type { LabUser } from "../../auth/AuthProvider";
import type { Asset, AssetPatch, AssetStatus, InventoryLocation } from "../../data/types";
import { StatusBadge } from "../detail-panels/StatusBadge";

interface WorkflowPanelProps {
  location?: InventoryLocation;
  assets: Asset[];
  user: LabUser;
  onOpenAddAsset: () => void;
  onUpdateAsset: (assetId: string, patch: AssetPatch) => void;
}

const statusOptions: AssetStatus[] = ["ok", "incompleto", "mantenimiento", "faltante"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function WorkflowPanel({ assets, location, user, onOpenAddAsset, onUpdateAsset }: WorkflowPanelProps) {
  const [assetId, setAssetId] = useState("");
  const [status, setStatus] = useState<AssetStatus>("ok");
  const [notes, setNotes] = useState("");

  const selectedAsset = useMemo(() => assets.find((asset) => asset.id === assetId), [assetId, assets]);

  useEffect(() => {
    const firstAsset = assets[0];
    setAssetId(firstAsset?.id ?? "");
    setStatus(firstAsset?.status ?? "ok");
    setNotes(firstAsset?.notes ?? "");
  }, [assets, location?.id]);

  useEffect(() => {
    if (!selectedAsset) {
      return;
    }

    setStatus(selectedAsset.status);
    setNotes(selectedAsset.notes);
  }, [selectedAsset]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAsset) {
      return;
    }

    onUpdateAsset(selectedAsset.id, {
      status,
      notes,
      lastReview: today(),
      responsible: user.displayName
    });
  }

  function completeLocationAudit() {
    assets.forEach((asset) => {
      onUpdateAsset(asset.id, {
        lastReview: today(),
        responsible: user.displayName,
        notes: asset.notes || "Revision completada."
      });
    });
  }

  return (
    <section className="rounded-lg border border-outline-variant bg-surface p-5 shadow-panel">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">Flujo operativo</h2>
          <p className="text-sm text-on-surface-variant">
            {location ? location.name : "Selecciona un punto para revisar activos"}
          </p>
        </div>
        <ClipboardCheck className="shrink-0 text-primary" size={24} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <button
          className="rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-on-secondary hover:brightness-105"
          onClick={onOpenAddAsset}
          type="button"
        >
          Alta de activo
        </button>
        <button
          className="rounded-lg border border-primary px-4 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-outline"
          disabled={!location || assets.length === 0}
          onClick={completeLocationAudit}
          type="button"
        >
          Cerrar revision
        </button>
      </div>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-semibold">
          Activo
          <select
            className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary"
            disabled={!location || assets.length === 0}
            onChange={(event) => setAssetId(event.target.value)}
            value={assetId}
          >
            {assets.length === 0 ? <option value="">Sin activos</option> : null}
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.code} - {asset.name}
              </option>
            ))}
          </select>
        </label>

        {selectedAsset ? (
          <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
            <span className="font-mono text-xs font-semibold text-outline">{selectedAsset.code}</span>
            <StatusBadge status={selectedAsset.status} />
          </div>
        ) : null}

        <label className="grid gap-2 text-sm font-semibold">
          Nuevo estado
          <select
            className="h-11 rounded-lg border border-outline-variant bg-white px-3 outline-none focus:border-primary"
            disabled={!selectedAsset}
            onChange={(event) => setStatus(event.target.value as AssetStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Observacion
          <textarea
            className="min-h-24 rounded-lg border border-outline-variant bg-white px-3 py-2 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            disabled={!selectedAsset}
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </label>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!selectedAsset}
          type="submit"
        >
          <Save size={17} />
          Guardar revision
        </button>
      </form>
    </section>
  );
}
