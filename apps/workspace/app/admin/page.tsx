import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace Admin Dashboard",
  description: "Administration panel for workspace and module management",
};

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Administration</h1>
          <p className="text-muted-foreground">
            Manage workspaces, modules, and system settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Workspaces</h3>
          <p className="text-muted-foreground">Manage workspace configurations</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Modules</h3>
          <p className="text-muted-foreground">Configure system modules</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-muted-foreground">Manage user permissions</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Settings</h3>
          <p className="text-muted-foreground">System configuration</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Activity Logs</h3>
          <p className="text-muted-foreground">Monitor system activity</p>
        </div>
      </div>
    </div>
  );
}
