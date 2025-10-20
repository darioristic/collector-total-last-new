"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings, Activity, Trash2, Edit } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    modules: number;
    users: number;
    logs: number;
  };
}

export default function WorkspaceOverview() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("/api/workspaces");
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await fetch(`/api/workspaces/${id}`, {
        method: "DELETE",
      });
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  if (loading) {
    return <div>Loading workspaces...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workspaces</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card key={workspace.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workspace.name}</CardTitle>
                <Badge variant={workspace.isActive ? "default" : "secondary"}>
                  {workspace.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {workspace.description && (
                <CardDescription>{workspace.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>{workspace._count.modules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{workspace._count.users} users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{workspace._count.logs} logs</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteWorkspace(workspace.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
