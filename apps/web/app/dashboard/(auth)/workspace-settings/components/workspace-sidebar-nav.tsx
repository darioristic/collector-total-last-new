"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2Icon,
  SettingsIcon
} from "lucide-react";

const workspaceNavItems = [
  {
    title: "Company Settings",
    href: "/dashboard/workspace-settings",
    icon: Building2Icon
  },
  {
    title: "Module Configuration",
    href: "/dashboard/workspace-settings/modules",
    icon: SettingsIcon
  }
];

export function WorkspaceSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="py-0 border rounded-lg shadow-sm bg-card">
      <div className="p-2">
        <nav className="flex flex-col space-y-0.5 space-x-2 lg:space-x-0">
          {workspaceNavItems.map((item) => (
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
