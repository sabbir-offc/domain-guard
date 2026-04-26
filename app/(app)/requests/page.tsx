import Link from "next/link";
import clsx from "clsx";
import { backendFetch } from "@/lib/api";
import RequestActions from "@/components/RequestActions";
import { formatDateTime, timeAgo } from "@/lib/utils";
import type { AccessRequestsResponse, RequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const TABS: Array<{ value: RequestStatus | "all"; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "all", label: "All" }
];

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  denied: "bg-rose-50 text-rose-700 border-rose-200"
};

export default async function RequestsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (sp.status || "pending") as RequestStatus | "all";

  const data = await backendFetch<AccessRequestsResponse>(
    `/api/admin/access-requests?status=${status}&limit=200`
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-navy">Access requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          {data.pendingCount > 0 ? (
            <>
              <span className="font-semibold text-amber-600">
                {data.pendingCount} pending
              </span>{" "}
              · {data.requests.length} shown
            </>
          ) : (
            "No pending requests right now."
          )}
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/requests?status=${tab.value}`}
              className={clsx(
                "px-4 py-2.5 text-sm font-semibold transition-colors -mb-[2px] border-b-2",
                active
                  ? "text-brand-cyan border-brand-cyan"
                  : "text-slate-500 hover:text-brand-navy border-transparent"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Requests list */}
      {data.requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
          No {status === "all" ? "" : status} requests.
        </div>
      ) : (
        <div className="space-y-3">
          {data.requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-base font-semibold text-brand-navy">
                      {req.domain}
                    </span>
                    <span
                      className={clsx(
                        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
                        STATUS_STYLES[req.status]
                      )}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Requested by{" "}
                    <Link
                      href={`/employees/${encodeURIComponent(req.employeeId)}`}
                      className="font-semibold text-brand-navy hover:text-brand-cyan"
                    >
                      {req.employeeId}
                    </Link>{" "}
                    · <span title={formatDateTime(req.createdAt)}>{timeAgo(req.createdAt)}</span>
                  </div>
                  {req.url && (
                    <div className="mt-2 text-xs text-slate-500 font-mono truncate" title={req.url}>
                      {req.url}
                    </div>
                  )}
                  {req.reason && (
                    <div className="mt-3 px-3 py-2 bg-slate-50 border-l-2 border-brand-cyan rounded text-sm text-slate-700">
                      {req.reason}
                    </div>
                  )}
                  {req.status !== "pending" && req.decidedBy && (
                    <div className="mt-3 text-xs text-slate-500">
                      {req.status === "approved" ? "Approved" : "Denied"} by{" "}
                      <span className="font-medium text-brand-navy">
                        {req.decidedBy}
                      </span>
                      {req.decidedAt && <> · {timeAgo(req.decidedAt)}</>}
                      {req.decisionNote && (
                        <div className="mt-1.5 italic text-slate-600">
                          &ldquo;{req.decisionNote}&rdquo;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {req.status === "pending" && (
                  <RequestActions requestId={req._id} domain={req.domain} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
