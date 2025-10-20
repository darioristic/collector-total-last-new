"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Package, Settings, ToggleLeft, ToggleRight } from "lucide-react";

interface Module {
  id: string;
  name: string;
  version: string;
  description?: string;
  isActive: boolean;
  config?: any;
  dependencies?: any;
}

interface WorkspaceModule {
  id: string;
  workspaceId: string;
  moduleName: string;
  isEnabled: boolean;
  config?: any;
}

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [workspaceModules, setWorkspaceModules] = useState<WorkspaceModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    fetchWorkspaceModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const fetchWorkspaceModules = async () => {
    try {
      // This would need to be updated to fetch for a specific workspace
      // For now, we'll use a placeholder
      setWorkspaceModules([]);
    } catch (error) {
      console.error("Error fetching workspace modules:", error);
    }
  };

  const toggleModule = async (moduleName: string, isEnabled: boolean) => {
    try {
      // This would need to be updated to work with a specific workspace
      await fetch("/api/workspaces/[id]/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleName,
          isEnabled,
        }),
      });
      fetchWorkspaceModules();
    } catch (error) {
      console.error("Error toggling module:", error);
    }
  };

  if (loading) {
    return <div>Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Module Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register Module
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                </div>
                <Badge variant={module.isActive ? "default" : "secondary"}>
                  v{module.version}
                </Badge>
              </div>
              {module.description && (
                <CardDescription>{module.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enabled</span>
                <Switch
                  checked={module.isActive}
                  onCheckedChange={(checked) => {
                    // Handle module toggle
                    console.log(`Toggle ${module.name} to ${checked}`);
                  }}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Toggle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
