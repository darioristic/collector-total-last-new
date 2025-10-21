"use client";

import { useState, useEffect } from "react";
import { BellIcon, SmartphoneIcon, MailIcon, MessageSquareIcon, CalendarIcon, CreditCardIcon, FileTextIcon, UsersIcon, SettingsIcon, ShieldIcon, Building2Icon, BarChart3Icon, LoaderIcon, SaveIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "../components/sidebar-nav";
import { useAuth, authenticatedFetch } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// Mock data for applications
const applications = [
  {
    id: "collector-bot",
    name: "Collector Bot",
    description: "AI-powered data collection and automation",
    icon: MessageSquareIcon,
    category: "Automation",
    status: "active",
    notifications: {
      email: true,
      push: true,
      inApp: true,
      sms: false
    }
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Event scheduling and management",
    icon: CalendarIcon,
    category: "Productivity",
    status: "active",
    notifications: {
      email: true,
      push: true,
      inApp: true,
      sms: false
    }
  },
  {
    id: "payment",
    name: "Payment System",
    description: "Financial transactions and billing",
    icon: CreditCardIcon,
    category: "Finance",
    status: "active",
    notifications: {
      email: true,
      push: false,
      inApp: true,
      sms: true
    }
  },
  {
    id: "file-manager",
    name: "File Manager",
    description: "Document and file management",
    icon: FileTextIcon,
    category: "Storage",
    status: "active",
    notifications: {
      email: false,
      push: true,
      inApp: true,
      sms: false
    }
  },
  {
    id: "user-management",
    name: "User Management",
    description: "User accounts and permissions",
    icon: UsersIcon,
    category: "Security",
    status: "active",
    notifications: {
      email: true,
      push: true,
      inApp: true,
      sms: false
    }
  },
  {
    id: "system-settings",
    name: "System Settings",
    description: "System configuration and maintenance",
    icon: SettingsIcon,
    category: "System",
    status: "active",
    notifications: {
      email: true,
      push: false,
      inApp: true,
      sms: false
    }
  },
  {
    id: "security",
    name: "Security Center",
    description: "Security monitoring and alerts",
    icon: ShieldIcon,
    category: "Security",
    status: "active",
    notifications: {
      email: true,
      push: true,
      inApp: true,
      sms: true
    }
  },
  {
    id: "workspace",
    name: "Workspace",
    description: "Workspace management and settings",
    icon: Building2Icon,
    category: "Management",
    status: "active",
    notifications: {
      email: true,
      push: false,
      inApp: true,
      sms: false
    }
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Data analytics and reporting",
    icon: BarChart3Icon,
    category: "Analytics",
    status: "active",
    notifications: {
      email: false,
      push: true,
      inApp: true,
      sms: false
    }
  }
];

const notificationTypes = [
  { key: "email", label: "Email", icon: MailIcon, description: "Receive notifications via email" },
  { key: "push", label: "Push", icon: BellIcon, description: "Browser push notifications" },
  { key: "inApp", label: "In-App", icon: MessageSquareIcon, description: "Notifications within the application" },
  { key: "sms", label: "SMS", icon: SmartphoneIcon, description: "Text message notifications" }
];

export default function NotificationsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [appNotifications, setAppNotifications] = useState(
    applications.reduce((acc, app) => {
      acc[app.id] = app.notifications;
      return acc;
    }, {} as Record<string, Record<string, boolean>>)
  );
  
  const [globalNotifications, setGlobalNotifications] = useState({
    email: true,
    push: true,
    inApp: true,
    sms: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load notification preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await authenticatedFetch('/api/notifications/preferences', {
          method: 'GET'
        }, token);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update global notifications
            if (data.data.global) {
              setGlobalNotifications(data.data.global);
            }
            // Update app notifications
            if (data.data.applications) {
              setAppNotifications(data.data.applications);
            }
          }
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [token, toast]);

  const handleNotificationToggle = (appId: string, type: string, enabled: boolean) => {
    setAppNotifications(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [type]: enabled
      }
    }));
  };

  const handleGlobalNotificationToggle = (type: string, enabled: boolean) => {
    setGlobalNotifications(prev => ({
      ...prev,
      [type]: enabled
    }));
  };

  const handleSaveAll = async () => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      const response = await authenticatedFetch('/api/notifications/preferences', {
        method: 'POST',
        body: JSON.stringify({
          global: globalNotifications,
          applications: appNotifications
        })
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Notification preferences saved successfully"
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to save notification preferences",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAll = () => {
    setAppNotifications(
      applications.reduce((acc, app) => {
        acc[app.id] = app.notifications;
        return acc;
      }, {} as Record<string, Record<string, boolean>>)
    );
    setGlobalNotifications({
      email: true,
      push: true,
      inApp: true,
      sms: false
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BellIcon className="w-6 h-6" />
            Notification Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage notification preferences for all applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetAll} disabled={isLoading || isSaving}>
            Reset All
          </Button>
          <Button size="sm" onClick={handleSaveAll} disabled={isLoading || isSaving}>
            {isSaving ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Global Notification Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BellIcon className="w-4 h-4" />
                Global Notification Settings
              </CardTitle>
              <CardDescription className="text-sm">
                Default notification preferences for all applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notificationTypes.map((type) => (
                  <div key={type.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <type.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">{type.label}</Label>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={globalNotifications[type.key as keyof typeof globalNotifications]}
                      onCheckedChange={(enabled) => handleGlobalNotificationToggle(type.key, enabled)}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="w-4 h-4" />
                Application Notifications
              </CardTitle>
              <CardDescription className="text-sm">
                Configure notifications for each application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Horizontal scroll container for applications */}
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
                  {applications.map((app) => (
                    <Card key={app.id} className="w-80 shrink-0">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <app.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium">{app.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{app.category}</Badge>
                              <Badge 
                                variant={app.status === "active" ? "default" : "secondary"} 
                                className="text-xs"
                              >
                                {app.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          {app.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {notificationTypes.map((type) => (
                          <div key={type.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <type.icon className="w-3 h-3 text-muted-foreground" />
                              <Label className="text-xs">{type.label}</Label>
                            </div>
                            <Switch
                              checked={appNotifications[app.id]?.[type.key] || false}
                              onCheckedChange={(enabled) => 
                                handleNotificationToggle(app.id, type.key, enabled)
                              }
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notification Summary</CardTitle>
              <CardDescription className="text-sm">
                Overview of your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {notificationTypes.map((type) => {
                  const enabledCount = applications.filter(app => 
                    appNotifications[app.id]?.[type.key]
                  ).length;
                  const totalCount = applications.length;
                  
                  return (
                    <div key={type.key} className="text-center p-3 border rounded-lg">
                      <type.icon className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {enabledCount}/{totalCount} apps
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
