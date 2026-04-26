"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  ListFilter,
  LogOut,
  Inbox,
  Users
} from "lucide-react";
import clsx from "clsx";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/allowlist", label: "Allowlist", icon: ShieldCheck },
  { href: "/requests", label: "Access requests", icon: Inbox, badge: true },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/events", label: "Block events", icon: ListFilter }
];

interface Props {
  username: string | null;
  pendingRequests?: number;
}

export default function Sidebar({ username, pendingRequests = 0 }: Props) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-brand-navy text-white">
      <div className="px-5 pt-6 pb-7 flex items-center gap-3">
        <Logo size={36} />
        <div>
          <div className="font-semibold text-[15px] leading-tight">
            Domain Guard
          </div>
          <div className="text-xs text-white/50 mt-0.5">NeXbit LTD</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const showBadge = item.badge && pendingRequests > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-cyan text-white shadow-sm"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span
                  className={clsx(
                    "min-w-[20px] px-1.5 h-5 inline-flex items-center justify-center rounded-full text-[11px] font-bold",
                    active
                      ? "bg-white text-brand-navy"
                      : "bg-amber-400 text-brand-navy"
                  )}
                >
                  {pendingRequests}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="px-3 py-2 mb-2">
          <div className="text-[11px] uppercase tracking-wider text-white/40">
            Signed in as
          </div>
          <div className="text-sm font-medium truncate mt-0.5">
            {username || "admin"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
