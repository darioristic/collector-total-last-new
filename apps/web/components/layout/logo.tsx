/** biome-ignore-all assist/source/organizeImports: manually organized for better readability */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  // Use organization name from auth context
  const organizationName = user?.organization?.name || "Collector CRM";
  
  // Debug: Log user and organization data
  useEffect(() => {
    console.log('Logo component - User data:', user);
    console.log('Logo component - Organization name:', organizationName);
    console.log('Logo component - User organization:', user?.organization);
  }, [user, organizationName]);

  useEffect(() => {
    // Fetch workspace logo only
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/workspace', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        console.log('Logo component - API response:', data);
        if (data.success && data.data?.logoUrl) {
          console.log('Setting logo URL to:', data.data.logoUrl);
          setLogoUrl(data.data.logoUrl);
        }
      })
      .catch(err => console.error('Failed to fetch workspace logo:', err));
    }
  }, []);

  // Listen for workspace updates
  useEffect(() => {
    const handleWorkspaceUpdate = () => {
      console.log('Logo component - workspaceUpdated event received');
      const token = localStorage.getItem('auth_token');
      if (token) {
        fetch('/api/workspace', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(res => res.json())
        .then(data => {
          console.log('Logo component - Workspace update API response:', data);
          if (data.success && data.data?.logoUrl) {
            console.log('Updating logo URL to:', data.data.logoUrl);
            setLogoUrl(data.data.logoUrl);
          }
        })
        .catch(err => console.error('Failed to fetch workspace logo:', err));
      }
    };

    window.addEventListener('workspaceUpdated', handleWorkspaceUpdate);
    
    return () => {
      window.removeEventListener('workspaceUpdated', handleWorkspaceUpdate);
    };
  }, []);

  // Generate initials from organization name
  const generateInitials = useCallback((name: string) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    console.log('Generating initials for:', name, '→', initials);
    return initials;
  }, []);

  // Debug: Log when organization name changes
  useEffect(() => {
    console.log('Organization name changed to:', organizationName);
    console.log('Current initials would be:', generateInitials(organizationName));
  }, [organizationName, generateInitials]);

  // Determine logo style based on theme
  const getLogoStyle = () => {
    const currentTheme = resolvedTheme || theme;
    
    if (currentTheme === 'dark') {
      return {
        filter: 'brightness(0) invert(1)', // White logo for dark theme
      };
    } else {
      return {
        filter: 'brightness(0)', // Black logo for light theme
      };
    }
  };

  // If no custom logo, show initials
  if (!logoUrl || logoUrl === "/logo.png") {
    return (
      <div className="me-1 size-7 rounded-[5px] group-data-collapsible:size-7 group-data-[collapsible=icon]:size-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
        {generateInitials(organizationName)}
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      width={30}
      height={30}
      className="me-1 rounded-[5px] transition-all duration-300 group-data-collapsible:size-7 group-data-[collapsible=icon]:size-8"
      alt="Organization logo"
      style={getLogoStyle()}
      unoptimized
    />
  );
}
