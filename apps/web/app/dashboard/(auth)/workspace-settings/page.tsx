"use client";

// biome-ignore assist/source/organizeImports: imports are properly organized
import { 
  Building2Icon, 
  RefreshCwIcon,
  SaveIcon,
  SettingsIcon,
  UploadIcon,
  XIcon
} from "lucide-react";
import { useState, useId, useEffect, useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { WorkspaceSidebarNav } from "./components/workspace-sidebar-nav";

// Types for workspace data
interface WorkspaceData {
  id: string;
  name: string;
  domain: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

interface WorkspaceSettings {
  userRegistration: boolean;
  emailNotifications: boolean;
  dataBackup: boolean;
  apiAccess: boolean;
}

export default function WorkspaceAdminPage() {
  const { updateUserOrganization } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Workspace data state
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>({
    userRegistration: true,
    emailNotifications: true,
    dataBackup: true,
    apiAccess: false
  });
  
  // Company Information state
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companyEmail, setCompanyEmail] = useState("admin@collector.com");
  const [companyPhone, setCompanyPhone] = useState("+1 (555) 123-4567");
  const [companyAddress, setCompanyAddress] = useState("123 Business Street, Suite 100, New York, NY 10001");
  const [companyDescription, setCompanyDescription] = useState("Leading CRM and business management solution provider");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  // Company Information IDs
  const companyNameId = useId();
  const companyDomainId = useId();
  const companyEmailId = useId();
  const companyPhoneId = useId();
  const companyAddressId = useId();
  const companyDescriptionId = useId();
  const logoUploadId = useId();

  // API functions
  const loadWorkspaceData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading workspace data from:', '/api/workspace');
      const response = await fetch('/api/workspace', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Workspace data response status:', response.status);
      console.log('Workspace data response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workspace data response error:', errorText);
        throw new Error(`Failed to load workspace data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Workspace data loaded:', data);
      setWorkspaceData(data);
      
      // Update form fields with loaded data
      setCompanyName(data.name || "Collector CRM");
      setCompanyDomain(data.domain || "collector.crm");
      
    } catch (err) {
      console.error('Error loading workspace data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workspace data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWorkspaceSettings = useCallback(async () => {
    try {
      console.log('Loading workspace settings from:', '/api/workspace/settings');
      const response = await fetch('/api/workspace/settings', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to load workspace settings: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Workspace settings loaded:', data);
      setWorkspaceSettings(data);
      
    } catch (err) {
      console.error('Failed to load workspace settings:', err);
      // Don't show error for settings, just use defaults
    }
  }, []);

  // Load workspace data on component mount
  useEffect(() => {
    loadWorkspaceData();
    loadWorkspaceSettings();
  }, [loadWorkspaceData, loadWorkspaceSettings]);

  const saveWorkspaceData = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      console.log('Saving workspace data:', {
        name: companyName,
        domain: companyDomain,
        subscriptionPlan: workspaceData?.subscriptionPlan || 'free'
      });
      
      const response = await fetch('/api/workspace', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: companyName,
          domain: companyDomain,
          subscriptionPlan: workspaceData?.subscriptionPlan || 'free'
        }),
      });
      
      console.log('Workspace data save response status:', response.status);
      console.log('Workspace data save response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Workspace data save response error:', errorText);
        throw new Error(`Failed to save workspace data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Workspace data saved:', data);
      setWorkspaceData(prev => prev ? { ...prev, ...data } : null);
      setSuccess('Workspace information saved successfully');
      
      // Update user organization in auth context
      console.log('Calling updateUserOrganization with:', { name: companyName });
      updateUserOrganization({ name: companyName });
      console.log('updateUserOrganization called successfully');
      
      // Emit event to update sidebar
      console.log('Emitting workspaceUpdated event');
      window.dispatchEvent(new CustomEvent('workspaceUpdated'));
      
    } catch (err) {
      console.error('Error saving workspace data:', err);
      setError(err instanceof Error ? err.message : 'Failed to save workspace data');
    } finally {
      setIsSaving(false);
    }
  };

  const saveWorkspaceSettings = async () => {
    try {
      console.log('Saving workspace settings:', workspaceSettings);
      const response = await fetch('/api/workspace/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceSettings),
      });
      
      console.log('Save response status:', response.status);
      console.log('Save response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save response error:', errorText);
        throw new Error(`Failed to save workspace settings: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Workspace settings saved:', data);
      setWorkspaceSettings(data);
      setSuccess('Workspace settings saved successfully');
      
    } catch (err) {
      console.error('Error saving workspace settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save workspace settings');
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/workspace/logo', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload logo');
      }
      
      const data = await response.json();
      setCompanyLogo(data.logoUrl);
      setSuccess('Logo uploaded successfully');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload logo');
    } finally {
      setIsSaving(false);
    }
  };

  const removeLogo = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/workspace/logo', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove logo');
      }
      
      setCompanyLogo(null);
      setSuccess('Logo removed successfully');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove logo');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate initials from company name
  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    removeLogo();
  };

  const handleSave = async () => {
    await Promise.all([
      saveWorkspaceData(),
      saveWorkspaceSettings()
    ]);
  };

  const handleReset = () => {
    loadWorkspaceData();
    loadWorkspaceSettings();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2Icon className="w-8 h-8" />
            Workspace Administration
          </h1>
          <p className="text-muted-foreground">
            Manage your workspace settings and module configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading || isSaving}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <WorkspaceSidebarNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <Alert>
                <AlertDescription>Loading workspace data...</AlertDescription>
              </Alert>
            )}

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2Icon className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your company and workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Logo Section */}
                  <div className="space-y-4">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={companyLogo || ""} alt="Company Logo" />
                        <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                          {generateInitials(companyName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <label htmlFor={logoUploadId} className="cursor-pointer">
                              <UploadIcon className="w-4 h-4 mr-2" />
                              Upload Logo
                            </label>
                          </Button>
                          {companyLogo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveLogo}
                            >
                              <XIcon className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {companyLogo 
                            ? "Logo uploaded successfully" 
                            : "Upload a logo or use initials from company name"
                          }
                        </p>
                      </div>
                    </div>
                    <input
                      id={logoUploadId}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={companyNameId}>Company Name</Label>
                      <Input 
                        id={companyNameId} 
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={companyDomainId}>Workspace Domain</Label>
                      <Input 
                        id={companyDomainId} 
                        placeholder="company.collector.com"
                        value={companyDomain}
                        onChange={(e) => setCompanyDomain(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={companyEmailId}>Company Email</Label>
                      <Input 
                        id={companyEmailId} 
                        type="email"
                        placeholder="contact@company.com"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={companyPhoneId}>Phone Number</Label>
                      <Input 
                        id={companyPhoneId} 
                        placeholder="+1 (555) 123-4567"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={companyAddressId}>Company Address</Label>
                    <Textarea 
                      id={companyAddressId} 
                      placeholder="Enter company address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={companyDescriptionId}>Company Description</Label>
                    <Textarea 
                      id={companyDescriptionId} 
                      placeholder="Brief description of your company"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Workspace Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Workspace Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your workspace preferences and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>User Registration</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow new users to register
                          </p>
                        </div>
                        <Switch 
                          checked={workspaceSettings.userRegistration}
                          onCheckedChange={(checked) => 
                            setWorkspaceSettings(prev => ({ ...prev, userRegistration: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email notifications
                          </p>
                        </div>
                        <Switch 
                          checked={workspaceSettings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setWorkspaceSettings(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Data Backup</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatic daily backups
                          </p>
                        </div>
                        <Switch 
                          checked={workspaceSettings.dataBackup}
                          onCheckedChange={(checked) => 
                            setWorkspaceSettings(prev => ({ ...prev, dataBackup: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>API Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable API access
                          </p>
                        </div>
                        <Switch 
                          checked={workspaceSettings.apiAccess}
                          onCheckedChange={(checked) => 
                            setWorkspaceSettings(prev => ({ ...prev, apiAccess: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
