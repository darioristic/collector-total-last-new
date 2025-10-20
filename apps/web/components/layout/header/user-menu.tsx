'use client';

import { Bell, LogOut, MoonIcon, SunIcon, Settings, Shield } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
// import {
//   PresetSelector,
//   SidebarModeSelector,
//   ThemeScaleSelector,
//   ContentLayoutSelector,
//   ThemeRadiusSelector,
//   ResetThemeButton
// } from "@/components/theme-customizer/index";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/dashboard/login/v2');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <Link href="/dashboard/login/v2">
        <Avatar>
          <AvatarFallback className="rounded-lg">?</AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={`/images/avatars/01.png`} alt={user.name} />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-60" align="end">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar>
              <AvatarImage src={`/images/avatars/01.png`} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            if (theme === "light") {
              setTheme("dark");
            } else if (theme === "dark") {
              setTheme("system");
            } else {
              setTheme("light");
            }
          }}>
            {theme === "light" ? <SunIcon /> : theme === "dark" ? <MoonIcon /> : <SunIcon />}
            {theme === "light" ? "Light Mode" : theme === "dark" ? "Dark Mode" : "System (Auto)"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="http://localhost:3001/admin" target="_blank">
              <Shield />
              Workspace Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/pages/profile">
            <Settings />
            Profile & Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
