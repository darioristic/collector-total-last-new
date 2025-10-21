"use client";

import { useId, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "../components/sidebar-nav";
import { ShieldIcon, KeyIcon, TrashIcon, AlertTriangleIcon, LoaderIcon, SaveIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, authenticatedFetch } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AccountPage() {
  const { token, logout } = useAuth();
  const { toast } = useToast();
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSaving2FA, setIsSaving2FA] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState<Array<{
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
    ipAddress: string;
  }>>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  // Load sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!token) return;
      
      setIsLoadingSessions(true);
      try {
        const response = await authenticatedFetch('/api/users/sessions', {
          method: 'GET'
        }, token);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSessions(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load sessions",
          variant: "destructive"
        });
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadSessions();
  }, [token, toast]);

  const handleRevokeSession = async (sessionId: string) => {
    if (!token) return;
    
    try {
      const response = await authenticatedFetch(`/api/users/sessions?sessionId=${sessionId}`, {
        method: 'DELETE'
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSessions(prev => prev.filter(session => session.id !== sessionId));
          toast({
            title: "Success",
            description: "Session revoked successfully"
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to revoke session",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error revoking session:', error);
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordUpdate = async () => {
    console.log('🔐 handlePasswordUpdate called');
    console.log('🔑 Token exists:', !!token);
    console.log('📋 Password data:', passwordData);
    
    if (!token) {
      console.log('❌ No token found');
      toast({
        title: "Error",
        description: "Authentication required. Please log in again.",
        variant: "destructive"
      });
      return;
    }
    
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log('❌ Missing password fields');
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match');
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      console.log('❌ Password too short');
      toast({
        title: "Password Too Short",
        description: `Password must be at least 8 characters long. You entered ${newPassword.length} characters.`,
        variant: "destructive"
      });
      return;
    }
    
    console.log('✅ Validation passed, making API call...');
    
    setIsSavingPassword(true);
    try {
      console.log('📡 Making API call to /api/users/password');
      const response = await authenticatedFetch('/api/users/password', {
        method: 'POST',
        body: JSON.stringify(passwordData)
      }, token);
      
      console.log('📡 API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: data.message || "Password updated successfully"
          });
          
          // Clear form
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          // If password change requires re-authentication, logout user
          if (data.requiresReauth) {
            setTimeout(() => {
              logout();
            }, 2000); // Give user time to read the success message
          }
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    if (!token) return;
    
    setIsSaving2FA(true);
    try {
      const response = await authenticatedFetch('/api/users/two-factor', {
        method: 'POST',
        body: JSON.stringify({ 
          action: enabled ? 'enable' : 'disable',
          code: '123456' // Mock code for now
        })
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTwoFAEnabled(enabled);
          toast({
            title: "Success",
            description: enabled ? "2FA enabled successfully" : "2FA disabled successfully"
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update 2FA settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to update 2FA settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving2FA(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account security and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Change Password */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyIcon className="w-4 h-4" />
                Change Password
              </CardTitle>
              <CardDescription className="text-sm">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor={currentPasswordId} className="text-sm">Current Password</Label>
                <Input 
                  id={currentPasswordId} 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="h-9" 
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor={newPasswordId} className="text-sm">New Password</Label>
                <Input 
                  id={newPasswordId} 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={`h-9 ${passwordData.newPassword && passwordData.newPassword.length < 8 ? 'border-red-500' : ''}`}
                />
                {passwordData.newPassword && (
                  <div className="text-xs text-muted-foreground">
                    {passwordData.newPassword.length < 8 ? (
                      <span className="text-red-500">
                        ⚠️ Password too short ({passwordData.newPassword.length}/8 characters)
                      </span>
                    ) : (
                      <span className="text-green-600">
                        ✅ Password length OK ({passwordData.newPassword.length} characters)
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor={confirmPasswordId} className="text-sm">Confirm New Password</Label>
                <Input 
                  id={confirmPasswordId} 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`h-9 ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'border-red-500' : ''}`}
                />
                {passwordData.confirmPassword && passwordData.newPassword && (
                  <div className="text-xs text-muted-foreground">
                    {passwordData.newPassword !== passwordData.confirmPassword ? (
                      <span className="text-red-500">
                        ⚠️ Passwords do not match
                      </span>
                    ) : (
                      <span className="text-green-600">
                        ✅ Passwords match
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => {
                  console.log('🔘 Update Password button clicked');
                  handlePasswordUpdate();
                }}
                disabled={isSavingPassword || 
                  !passwordData.currentPassword || 
                  !passwordData.newPassword || 
                  !passwordData.confirmPassword ||
                  passwordData.newPassword.length < 8 ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
              >
                {isSavingPassword ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldIcon className="w-4 h-4" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-sm">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable 2FA</Label>
                  <p className="text-xs text-muted-foreground">
                    Use an authenticator app to generate verification codes
                  </p>
                </div>
                <Switch 
                  checked={twoFAEnabled}
                  onCheckedChange={handle2FAToggle}
                  disabled={isSaving2FA}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm">Recovery Codes</Label>
                <p className="text-xs text-muted-foreground">
                  Save these codes in a safe place. You can use them to access your account if you lose your device.
                </p>
                <Button variant="outline" size="sm" disabled={isSaving2FA}>
                  Generate New Recovery Codes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Sessions</CardTitle>
              <CardDescription className="text-sm">
                Manage your active sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {isLoadingSessions ? (
                  <div className="text-center py-4">
                    <LoaderIcon className="w-4 h-4 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading sessions...</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {session.isCurrent ? 'Current Session' : `${session.device} ${session.browser}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.device} • {session.browser} • {session.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {session.isCurrent ? 'Now' : new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isCurrent ? (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRevokeSession(session.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangleIcon className="w-4 h-4" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-sm">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  These actions are permanent and cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-destructive rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <TrashIcon className="w-3 h-3 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
