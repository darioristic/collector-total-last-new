"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, RefreshCw, Database, Bell, Shield } from "lucide-react";

interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
}

export default function SystemSettings() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      // This would need to be updated to fetch system configs
      setConfigs([]);
    } catch (error) {
      console.error("Error fetching configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (key: string, value: any) => {
    try {
      // This would need to be updated to save system configs
      console.log(`Save config ${key}:`, value);
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Settings</span>
            </CardTitle>
            <CardDescription>
              Configure database connection and performance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" placeholder="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Port</Label>
              <Input id="db-port" placeholder="5432" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" placeholder="crm_erp" />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Database Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>
              Configure notification preferences and channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch id="sms-notifications" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-email">Notification Email</Label>
              <Input id="notification-email" type="email" placeholder="admin@example.com" />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>
              Configure security policies and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input id="max-login-attempts" type="number" placeholder="5" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
              <Switch id="two-factor-auth" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-policy">Strong Password Policy</Label>
              <Switch id="password-policy" />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" placeholder="CRM ERP System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="CET">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <Textarea id="maintenance-mode" placeholder="Enter maintenance message..." />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save General Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
