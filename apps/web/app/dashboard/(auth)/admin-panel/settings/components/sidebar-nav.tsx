"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  ContrastIcon,
  CreditCardIcon,
  PaletteIcon,
  ShieldIcon,
  UserIcon
} from "lucide-react";


const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/admin-panel/settings",
    icon: UserIcon
  },
  {
    title: "Account",
    href: "/dashboard/admin-panel/settings/account",
    icon: ShieldIcon
  },
  {
    title: "Billing",
    href: "/dashboard/admin-panel/settings/billing",
    icon: CreditCardIcon
  },
  {
    title: "Appearance",
    href: "/dashboard/admin-panel/settings/appearance",
    icon: PaletteIcon
  },
  {
    title: "Notifications",
    href: "/dashboard/admin-panel/settings/notifications",
    icon: BellIcon
  },
  {
    title: "Display",
    href: "/dashboard/admin-panel/settings/display",
    icon: ContrastIcon
  }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="py-0 border rounded-lg shadow-sm bg-card">
      <div className="p-2">
        <nav className="flex flex-col space-y-0.5 space-x-2 lg:space-x-0">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                [
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                  (pathname === item.href ? "bg-muted" : "")
                ].join(" ")
              }
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
