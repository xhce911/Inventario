import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { LoginScreen } from "./components/auth/LoginScreen";
import { AppShell } from "./components/layout/AppShell";
import { AddAssetDialog } from "./components/workflows/AddAssetDialog";
import { countAssetIssues } from "./data/inventoryRules";
import type { WorkspaceView } from "./data/types";
import { useInventoryStore } from "./hooks/useInventoryStore";
import { InventoryDashboard } from "./pages/InventoryDashboard";

export default function App() {
  const { authMode, loading, signOutUser, user } = useAuth();
  const inventory = useInventoryStore(user);
  const [activeView, setActiveView] = useState<WorkspaceView>("layout");
  const [query, setQuery] = useState("");
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [addAssetCategory, setAddAssetCategory] = useState<string | undefined>();
  const [detailPanelOpen, setDetailPanelOpen] = useState(true);
  const stationOneCleanupRan = useRef(false);

  useEffect(() => {
    if (stationOneCleanupRan.current) {
      return;
    }

    const stationOneAssets = inventory.assets.filter((asset) => asset.locationId === "station-1");

    if (stationOneAssets.length > 1) {
      stationOneCleanupRan.current = true;
      void inventory.cleanupStationOneDuplicates();
    }
  }, [inventory.assets, inventory.cleanupStationOneDuplicates]);

  const filteredAssets = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return inventory.assets;
    }

    return inventory.assets.filter((asset) => {
      const searchable = [
        asset.code,
        asset.name,
        asset.category,
        asset.status,
        asset.notes
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(value);
    });
  }, [inventory.assets, query]);

  const issueCount = useMemo(() => countAssetIssues(inventory.assets), [inventory.assets]);

  function openAddAsset(category?: string) {
    setAddAssetCategory(category);
    setAddAssetOpen(true);
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface-container-lowest p-6">
        <div className="rounded-lg border border-outline-variant bg-surface px-6 py-5 text-center shadow-panel">
          <p className="font-display text-xl font-bold text-primary">RoboLab Inventory</p>
          <p className="mt-1 text-sm text-on-surface-variant">Validando sesion</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <AppShell
      authMode={authMode}
      activeView={activeView}
      detailPanelOpen={detailPanelOpen}
      issueCount={issueCount}
      onQueryChange={setQuery}
      onSignOut={() => void signOutUser()}
      onToggleDetailPanel={() => setDetailPanelOpen((current) => !current)}
      onViewChange={setActiveView}
      query={query}
      syncState={inventory.syncState}
      user={user}
    >
      <InventoryDashboard
        activeView={activeView}
        assets={inventory.assets}
        audits={inventory.audits}
        detailPanelOpen={detailPanelOpen}
        filteredAssets={filteredAssets}
        locations={inventory.locations}
        onCreateAudit={inventory.createAudit}
        onOpenAddAsset={openAddAsset}
        onSeedInventory={inventory.seedInventory}
        onDeleteAsset={inventory.deleteAsset}
        onUpdateAsset={inventory.updateAsset}
        onCreateLocation={inventory.createLocation}
        onDeleteLocation={inventory.deleteLocation}
        onUpdateLocation={inventory.updateLocation}
        onViewChange={setActiveView}
        query={query}
        user={user}
      />
      <AddAssetDialog
        initialCategory={addAssetCategory}
        locations={inventory.locations}
        onClose={() => {
          setAddAssetOpen(false);
          setAddAssetCategory(undefined);
        }}
        onCreateAsset={(input) => {
          void inventory.createAsset(input);
          setAddAssetOpen(false);
          setAddAssetCategory(undefined);
        }}
        open={addAssetOpen}
      />
    </AppShell>
  );
}
