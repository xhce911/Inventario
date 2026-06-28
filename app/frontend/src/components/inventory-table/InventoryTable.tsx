import { Download } from "lucide-react";
import type { Asset, InventoryLocation } from "../../data/types";
import { downloadInventoryCsv } from "../../services/inventoryExport";
import { StatusBadge } from "../detail-panels/StatusBadge";

interface InventoryTableProps {
  assets: Asset[];
  locations: InventoryLocation[];
}

export function InventoryTable({ assets, locations }: InventoryTableProps) {
  const locationById = new Map(locations.map((location) => [location.id, location]));

  return (
    <section className="scroll-mt-32 rounded-lg border border-outline-variant bg-surface shadow-panel" id="inventario">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-4 sm:px-5">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">Inventario detallado</h2>
          <p className="text-sm text-on-surface-variant">{assets.length} activos visibles</p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary px-3 text-sm font-bold text-primary hover:bg-primary hover:text-on-primary"
          onClick={() => downloadInventoryCsv(assets, locations)}
          type="button"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {assets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-outline-variant p-5 text-center text-sm text-on-surface-variant">
            No hay activos que coincidan con la busqueda.
          </div>
        ) : (
          assets.map((asset) => (
            <article className="rounded-lg border border-outline-variant bg-white p-4" key={asset.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-outline">{asset.code}</p>
                  <h3 className="mt-1 truncate font-display text-lg font-bold">{asset.name}</h3>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    Categoria
                  </dt>
                  <dd className="truncate font-semibold">{asset.category}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    Ubicacion
                  </dt>
                  <dd className="truncate font-semibold">{locationById.get(asset.locationId)?.code ?? asset.locationId}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    Revision
                  </dt>
                  <dd className="font-mono text-xs">{asset.lastReview}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-outline">
                    Componentes
                  </dt>
                  <dd className="font-mono text-xs">{asset.components.length}</dd>
                </div>
              </dl>
              <div className="mt-3 flex justify-end">
                <StatusBadge status={asset.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{asset.notes}</p>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-auto md:block">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-primary text-on-primary">
            <tr>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">ID equipo</th>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Categoria</th>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Ubicacion</th>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Ultima revision</th>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Notas</th>
              <th className="border border-primary/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td className="border border-outline-variant px-4 py-8 text-center text-on-surface-variant" colSpan={6}>
                  No hay activos que coincidan con la busqueda.
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => {
                return (
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-surface-container-lowest"} key={asset.id}>
                    <td className="border border-outline-variant px-4 py-3 font-mono text-xs font-semibold">{asset.code}</td>
                    <td className="border border-outline-variant px-4 py-3">{asset.category}</td>
                    <td className="border border-outline-variant px-4 py-3">
                      {locationById.get(asset.locationId)?.code ?? asset.locationId}
                    </td>
                    <td className="border border-outline-variant px-4 py-3 font-mono text-xs">{asset.lastReview}</td>
                    <td className="border border-outline-variant px-4 py-3 text-on-surface-variant">{asset.notes}</td>
                    <td className="border border-outline-variant px-4 py-3">
                      <StatusBadge status={asset.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
