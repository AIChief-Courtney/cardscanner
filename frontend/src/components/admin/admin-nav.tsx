"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users } from "lucide-react";

const links = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activity", label: "Activity", icon: Activity },
] as const;

export function AdminNav() {
  const path = usePathname();

  return (
    <nav className="admin-sidebar" aria-label="Admin sections">
      <p className="admin-sidebar-label">Console</p>
      <ul className="admin-sidebar-list">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/admin/overview" && path.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={active ? "admin-sidebar-link is-active" : "admin-sidebar-link"}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}