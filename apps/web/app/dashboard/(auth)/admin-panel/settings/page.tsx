"use client";

import { useId, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarNav } from "./components/sidebar-nav";
import { UserIcon, LanguagesIcon, SaveIcon, LoaderIcon } from "lucide-react";
import { useAuth, authenticatedFetch } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { token } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    language: 'en'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const bioId = useId();
  const addressId = useId();
  const cityId = useId();
  const stateId = useId();
  const zipCodeId = useId();
  const languageId = useId();

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await authenticatedFetch('/api/users/profile', {
          method: 'GET'
        }, token);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const userData = data.data;
            setFormData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: userData.bio || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              zipCode: userData.zipCode || '',
              language: userData.language || 'en'
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [token, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      const response = await authenticatedFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Profile updated successfully"
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile information and preferences
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
          {/* Profile Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserIcon className="w-4 h-4" />
                Profile Overview
              </CardTitle>
              <CardDescription className="text-sm">
                Your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/images/avatars/01.png" alt="Profile" />
                  <AvatarFallback>
                    {isLoading ? '...' : `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {isLoading ? 'Loading...' : `${formData.firstName} ${formData.lastName}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : formData.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Super Admin</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile Settings</CardTitle>
              <CardDescription className="text-sm">
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personal Information Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-sm font-medium text-foreground">Personal Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={firstNameId} className="text-sm">First Name</Label>
                    <Input 
                      id={firstNameId} 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={lastNameId} className="text-sm">Last Name</Label>
                    <Input 
                      id={lastNameId} 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={emailId} className="text-sm">Email</Label>
                    <Input 
                      id={emailId} 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={phoneId} className="text-sm">Phone</Label>
                    <Input 
                      id={phoneId} 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={bioId} className="text-sm">Bio</Label>
                  <Textarea 
                    id={bioId} 
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="min-h-[70px] text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={addressId} className="text-sm">Address</Label>
                  <Input 
                    id={addressId} 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="h-9" 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={cityId} className="text-sm">City</Label>
                    <Input 
                      id={cityId} 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={stateId} className="text-sm">State</Label>
                    <Input 
                      id={stateId} 
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={zipCodeId} className="text-sm">ZIP Code</Label>
                    <Input 
                      id={zipCodeId} 
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="h-9" 
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Language Preferences Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LanguagesIcon className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Language Preferences</h4>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={languageId} className="text-sm">Interface Language</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => handleInputChange('language', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id={languageId} className="h-9">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="sr">🇷🇸 Srpski</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="pt">🇵🇹 Português</SelectItem>
                      <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                      <SelectItem value="zh">🇨🇳 中文</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                      <SelectItem value="ko">🇰🇷 한국어</SelectItem>
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Changes will be applied after saving
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" disabled={isLoading || isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isSaving}
            >
              {isSaving ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
