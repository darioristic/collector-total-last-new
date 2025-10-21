"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "../components/sidebar-nav";
import { 
  PaletteIcon, 
  SunIcon,
  SaveIcon,
  RefreshCwIcon,
  EyeIcon
} from "lucide-react";
import {
  PresetSelector,
  ThemeScaleSelector,
  ThemeRadiusSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  SidebarModeSelector,
  ResetThemeButton
} from "@/components/theme-customizer/index";
import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useAuth, authenticatedFetch } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AppearancePage() {
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: {
      preset: 'default',
      scale: 100,
      radius: 'medium',
      mode: 'system'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      colorBlindSupport: false,
      customAccentColor: false
    }
  });

  // Load appearance settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await authenticatedFetch('/api/users/appearance', {
          method: 'GET'
        }, token);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAppearanceSettings(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading appearance settings:', error);
        toast({
          title: "Error",
          description: "Failed to load appearance settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [token, toast]);

  const handleSave = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await authenticatedFetch('/api/users/appearance', {
        method: 'PUT',
        body: JSON.stringify(appearanceSettings)
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Appearance settings saved successfully"
          });
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to save appearance settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast({
        title: "Error",
        description: "Failed to save appearance settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PaletteIcon className="w-6 h-6" />
            Appearance Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className={previewMode ? "bg-primary text-primary-foreground" : ""}
          >
            <EyeIcon className="w-3 h-3 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <RefreshCwIcon className="w-3 h-3 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderIcon className="w-3 h-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="w-3 h-3 mr-2" />
                Save Changes
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
          {/* Theme Customization */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <PaletteIcon className="w-4 h-4" />
                Theme Customization
              </CardTitle>
              <CardDescription className="text-sm">
                Choose your preferred theme, colors, and styling options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Theme Preset</Label>
                    <PresetSelector />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Scale</Label>
                    <ThemeScaleSelector />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Border Radius</Label>
                    <ThemeRadiusSelector />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Color Mode</Label>
                    <ColorModeSelector />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Content Layout</Label>
                    <ContentLayoutSelector />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Sidebar Mode</Label>
                    <SidebarModeSelector />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-center">
                <ResetThemeButton />
              </div>
            </CardContent>
          </Card>


          {/* Color Scheme & Current Theme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Color Scheme */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <SunIcon className="w-4 h-4" />
                  Color Scheme
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize color palette and accessibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">High Contrast Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Increase contrast for better readability
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Reduced Motion</Label>
                      <p className="text-xs text-muted-foreground">
                        Minimize animations for accessibility
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Color Blind Support</Label>
                      <p className="text-xs text-muted-foreground">
                        Optimize colors for color vision deficiency
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Custom Accent Color</Label>
                      <p className="text-xs text-muted-foreground">
                        Use a custom accent color throughout the interface
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Theme */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <EyeIcon className="w-4 h-4" />
                  Current Theme
                </CardTitle>
                <CardDescription className="text-sm">
                  Information about your current theme configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Preset</Label>
                    <Badge variant="secondary" className="text-xs">
                      {appearanceSettings.theme.preset}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Scale</Label>
                    <Badge variant="outline" className="text-xs">
                      {appearanceSettings.theme.scale}%
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Radius</Label>
                    <Badge variant="outline" className="text-xs">
                      {appearanceSettings.theme.radius}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Mode</Label>
                    <Badge variant="outline" className="text-xs">
                      {appearanceSettings.theme.mode}
                    </Badge>
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
