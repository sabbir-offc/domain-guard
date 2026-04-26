import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, Activity, ShieldAlert, Inbox } from "lucide-react";
import { backendFetch } from "@/lib/api";
import StatCard from "@/components/StatCard";
import TopList from "@/components/TopList";
import { BlocksOverTimeChart } from "@/components/Charts";
import { formatDateTime, timeAgo } from "@/lib/utils";
import type { EmployeeDetail, RequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_STYLES: Record<string, string> = {
  navigation: "bg-rose-50 text-rose-700",
  input: "bg-amber-50 text-amber-700",
  paste: "bg-blue-50 text-blue-700"
};

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  denied: "bg-rose-50 text-rose-700"
};

export default async function EmployeeDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const employeeId = decodeURIComponent(rawId);

  const data = await backendFetch<EmployeeDetail>(
    `/api/admin/employees/${encodeURIComponent(employeeId)}`
  );

  const pendingRequests = data.requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-cyan mb-3"
        >
          <ArrowLeft size={14} />
          All employees
        </Link>
        <header className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy font-mono">
              {employeeId}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {data.firstSeen && (
                <>
                  Active since {formatDateTime(data.firstSeen)}
                  {data.lastSeen && (
                    <> · last block {timeAgo(data.lastSeen)}</>
                  )}
                </>
              )}
              {!data.firstSeen && "No activity recorded yet."}
            </p>
          </div>
        </header>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Last 14 days"
          value={data.recent}
          icon={Activity}
          accent="cyan"
        />
        <StatCard
          label="All-time blocks"
          value={data.total}
          icon={ShieldAlert}
          accent="navy"
        />
        <StatCard
          label="Pending requests"
          value={pendingRequests.length}
          icon={Inbox}
          accent={pendingRequests.length > 0 ? "amber" : "cyan"}
        />
      </div>

      <BlocksOverTimeChart data={data.timeseries} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopList
          title={`${employeeId}'s top blocked domains`}
          subtitle="Last 14 days"
          data={data.topDomains}
          emptyText="No blocks in the past 14 days."
        />

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-brand-navy mb-4">
            Access requests
          </h2>
          {data.requests.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">
              This employee has not submitted any requests.
            </div>
          ) : (
            <ul className="space-y-2">
              {data.requests.slice(0, 8).map((req) => (
                <li
                  key={req._id}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[13px] text-brand-navy truncate">
                      {req.domain}
                    </span>
                    <span
                      className={clsx(
                        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0",
                        STATUS_STYLES[req.status]
                      )}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {timeAgo(req.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {data.requests.length > 0 && (
            <Link
              href={`/requests?status=all`}
              className="mt-3 inline-block text-xs font-semibold text-brand-cyan hover:underline"
            >
              View all requests →
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-brand-navy">
            Recent block events
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Last {data.events.length} events
          </p>
        </div>
        {data.events.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-12">
            No events to show.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Time
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Type
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.events.map((ev) => {
                  const target = ev.url || ev.domain || "—";
                  return (
                    <tr
                      key={ev._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                        {formatDateTime(ev.timestamp)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={clsx(
                            "inline-block px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide font-semibold",
                            TYPE_STYLES[ev.type] ||
                              "bg-slate-100 text-slate-600"
                          )}
                        >
                          {ev.type}
                        </span>
                      </td>
                      <td
                        className="px-4 py-2.5 font-mono text-[12px] text-slate-700 max-w-[420px] truncate"
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
