"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, Download, RefreshCw } from "lucide-react";

interface ActivityLog {
  id: string;
  workspaceId: string;
  userId?: string;
  action: string;
  resource?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // This would need to be updated to fetch activity logs
      setLogs([]);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      case "login":
        return "outline";
      case "logout":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === "all" || log.action.toLowerCase() === filterAction.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div>Loading activity logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Activity</span>
          </CardTitle>
          <CardDescription>
            Monitor system activities and user actions across all workspaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No activity logs found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Activity logs will appear here as users interact with the system.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {log.userId || "System"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {log.resource && `${log.resource} • `}
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {log.ipAddress && (
                        <span>IP: {log.ipAddress}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
