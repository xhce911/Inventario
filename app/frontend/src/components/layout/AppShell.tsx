import {
  AlertCircle,
  Bell,
  Cloud,
  HardDrive,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Search,
  Settings,
  type LucideIcon
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { LabUser } from "../../auth/AuthProvider";
import { workspaceViews } from "../../data/inventoryRules";
import type { WorkspaceView } from "../../data/types";

interface AppShellProps {
  activeView: WorkspaceView;
  authMode: "firebase" | "demo";
  children: ReactNode;
  detailPanelOpen: boolean;
  issueCount: number;
  query: string;
  syncState: {
    error?: string;
    mode: "firebase" | "local";
    scope: string;
    status: "loading" | "synced" | "saving" | "error";
    updatedAt?: string;
  };
  user: LabUser;
  onQueryChange: (value: string) => void;
  onSignOut: () => void;
  onToggleDetailPanel: () => void;
  onViewChange: (view: WorkspaceView) => void;
}

export function AppShell({
  activeView,
  authMode,
  children,
  detailPanelOpen,
  issueCount,
  query,
  syncState,
  user,
  onQueryChange,
  onSignOut,
  onToggleDetailPanel,
  onViewChange
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const initials = user.displayName
    .split(/\s+/)
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface text-on-surface lg:flex">
      <aside
        className={[
          "hidden w-72 shrink-0 border-r border-outline-variant bg-surface-container-low px-3 py-5 lg:min-h-screen lg:flex-col",
          sidebarOpen ? "lg:flex" : "lg:hidden"
        ].join(" ")}
      >
        <div className="px-4 pb-7 pt-3">
          <h1 className="font-display text-2xl font-extrabold text-primary">Robotics Lab</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Main Facility</p>
        </div>

        <nav className="space-y-1" aria-label="Vistas principales">
          {workspaceViews.map((item) => (
            <NavButton
              active={activeView === item.view}
              icon={item.icon}
              key={item.view}
              label={item.label}
              onClick={() => onViewChange(item.view)}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-outline-variant pt-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
            onClick={() => onViewChange("reports")}
            type="button"
          >
            <Settings aria-hidden="true" size={20} />
            Reportes
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
            onClick={onSignOut}
            type="button"
          >
            <LogOut aria-hidden="true" size={20} />
            Salir
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label={sidebarOpen ? "Ocultar panel lateral" : "Mostrar panel lateral"}
                className="hidden h-11 w-11 place-items-center rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-primary lg:grid"
                onClick={() => setSidebarOpen((current) => !current)}
                type="button"
              >
                {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-2xl font-bold text-primary">RoboLab Inventory</p>
                <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-outline">Aula de robotica</p>
              </div>
            </div>

            <nav
              aria-label="Navegacion superior"
              className="hide-scrollbar flex min-w-0 gap-1 overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low p-1 text-sm font-bold"
            >
              {workspaceViews.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    aria-pressed={activeView === item.view}
                    className={[
                      "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 transition",
                      activeView === item.view
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:bg-white hover:text-primary"
                    ].join(" ")}
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    type="button"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
              <label className="relative min-w-0 flex-[1_1_220px] xl:w-72 xl:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={19} />
                <span className="sr-only">Buscar equipo</span>
                <input
                  className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Buscar equipo o estado"
                  type="search"
                  value={query}
                />
              </label>

              <SyncBadge syncState={syncState} />

              <button
                aria-label="Ver incidencias"
                className="relative grid h-11 w-11 place-items-center rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-primary"
                onClick={() => onViewChange("reports")}
                title={`${issueCount} incidencias`}
                type="button"
              >
                <Bell size={20} />
                {issueCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 font-mono text-[10px] font-bold text-on-secondary">
                    {issueCount}
                  </span>
                ) : null}
              </button>

              <button
                aria-label="Ver auditorias"
                className="grid h-11 w-11 place-items-center rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-primary"
                onClick={() => onViewChange("audits")}
                type="button"
              >
                <HelpCircle size={20} />
              </button>

              <div className="hidden min-w-0 items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-2 py-1.5 sm:flex">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary font-display text-xs font-bold text-on-primary">
                  {initials || "RL"}
                </div>
                <div className="hidden min-w-0 2xl:block">
                  <p className="truncate text-sm font-bold">{user.displayName}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-outline">{authMode}</p>
                </div>
              </div>

              <button
                aria-label="Cerrar sesion"
                className="grid h-11 w-11 place-items-center rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-primary lg:hidden"
                onClick={onSignOut}
                type="button"
              >
                <LogOut size={20} />
              </button>

              <button
                aria-label={detailPanelOpen ? "Ocultar panel derecho" : "Mostrar panel derecho"}
                className="grid h-11 w-11 place-items-center rounded-lg border border-primary bg-white text-primary hover:bg-primary hover:text-on-primary"
                onClick={onToggleDetailPanel}
                title={detailPanelOpen ? "Ocultar panel derecho" : "Mostrar panel derecho"}
                type="button"
              >
                {detailPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

function NavButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition",
        active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" size={20} />
      <span>{label}</span>
    </button>
  );
}

function SyncBadge({
  syncState
}: {
  syncState: {
    error?: string;
    mode: "firebase" | "local";
    scope: string;
    status: "loading" | "synced" | "saving" | "error";
  };
}) {
  const modeLabel = syncState.mode === "firebase" ? "Firestore" : "Demo local";
  const statusLabel = {
    error: "Error",
    loading: "Cargando",
    saving: "Guardando",
    synced: "Sincronizado"
  }[syncState.status];
  const Icon =
    syncState.status === "error"
      ? AlertCircle
      : syncState.status === "saving" || syncState.status === "loading"
        ? RefreshCw
        : syncState.mode === "firebase"
          ? Cloud
          : HardDrive;

  return (
    <span
      className={[
        "hidden h-11 items-center gap-2 rounded-lg border px-3 text-xs font-bold md:inline-flex",
        syncState.status === "error"
          ? "border-error/40 bg-error-container text-on-error-container"
          : "border-outline-variant bg-surface-container-low text-on-surface-variant"
      ].join(" ")}
      title={syncState.error ?? syncState.scope}
    >
      <Icon className={syncState.status === "saving" || syncState.status === "loading" ? "animate-spin" : ""} size={16} />
      <span className="hidden 2xl:inline">{modeLabel}</span>
      <span>{statusLabel}</span>
    </span>
  );
}
