import Link from "next/link";
import { Activity, ShieldAlert, History } from "lucide-react";
import { backendFetch } from "@/lib/api";
import StatCard from "@/components/StatCard";
import TopList from "@/components/TopList";
import { BlocksOverTimeChart, TypeBreakdownChart } from "@/components/Charts";
import type { Stats, TimeseriesData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, timeseries] = await Promise.all([
    backendFetch<Stats>("/api/admin/stats"),
    backendFetch<TimeseriesData>("/api/admin/timeseries?days=14")
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Block activity across the team. Updated live.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Last 24 hours"
          value={stats.total24h}
          icon={ShieldAlert}
          accent="cyan"
          hint="Blocks recorded in the past day"
        />
        <StatCard
          label="Last 7 days"
          value={stats.total7d}
          icon={Activity}
          accent="navy"
          hint="Total weekly volume"
        />
        <StatCard
          label="All time"
          value={stats.totalAll}
          icon={History}
          accent="amber"
          hint="Lifetime block events"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BlocksOverTimeChart data={timeseries.days} />
        </div>
        <TypeBreakdownChart data={stats.byType} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopList
          title="Top blocked domains"
          subtitle="Last 7 days"
          data={stats.topDomains}
          emptyText="No domains blocked yet — all employees are within bounds."
        />
        <TopList
          title="Top employees"
          subtitle="Last 7 days · click to drill down"
          data={stats.topEmployees}
          emptyText="No activity yet."
          renderLabel={(id) => (
            <Link
              href={`/employees/${encodeURIComponent(id || "unknown")}`}
              className="hover:text-brand-cyan transition-colors"
            >
              {id || "unknown"}
            </Link>
          )}
        />
      </div>
    </div>
  );
}
