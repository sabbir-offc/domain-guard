"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, RotateCw, Filter } from "lucide-react";
import clsx from "clsx";
import type { BlockEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  events: BlockEvent[];
}

const TYPE_STYLES: Record<string, string> = {
  navigation: "bg-rose-50 text-rose-700",
  input: "bg-amber-50 text-amber-700",
  paste: "bg-blue-50 text-blue-700",
};

export default function EventsFilters({ events }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [employeeId, setEmployeeId] = useState(params.get("employeeId") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [domain, setDomain] = useState(params.get("domain") || "");

  useEffect(() => {
    setEmployeeId(params.get("employeeId") || "");
    setType(params.get("type") || "");
    setDomain(params.get("domain") || "");
  }, [params]);

  function applyFilters() {
    const next = new URLSearchParams();
    if (employeeId) next.set("employeeId", employeeId);
    if (type) next.set("type", type);
    if (domain) next.set("domain", domain);
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`);
    });
  }

  function clearFilters() {
    setEmployeeId("");
    setType("");
    setDomain("");
    startTransition(() => router.push(pathname));
  }

  function refresh() {
    startTransition(() => router.refresh());
  }

  const hasFilter = !!(employeeId || type || domain);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-brand-navy">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Employee ID"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">All types</option>
            <option value="navigation">Navigation</option>
            <option value="input">Input</option>
            <option value="paste">Paste</option>
          </select>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Domain (exact match)"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={applyFilters}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light disabled:opacity-50 transition-colors"
          >
            <Search size={16} />
            Apply
          </button>
          {hasFilter && (
            <button
              onClick={clearFilters}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors"
            >
              Clear
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={refresh}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:border-brand-cyan hover:text-brand-cyan transition-colors disabled:opacity-50"
          >
            <RotateCw size={14} className={clsx(isPending && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-16">
            No events match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Domain
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const target = ev.url || ev.domain || "—";
                  return (
                    <tr
                      key={ev._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDateTime(ev.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-brand-navy font-medium">
                        {ev.employeeId || "unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            "inline-block px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-semibold",
                            TYPE_STYLES[ev.type] ||
                              "bg-slate-100 text-slate-600",
                          )}
                        >
                          {ev.type}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-brand-navy font-medium"
                        title={ev.domain || "—"}
                      >
                        {ev.domain || "—"}
                      </td>
                      <td
                        className="px-4 py-3 font-mono text-[12px] text-slate-700 max-w-[420px] truncate"
                        title={target}
                      >
                        {target}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
