import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { backendFetch } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import type { EmployeeSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const data = await backendFetch<{ employees: EmployeeSummary[] }>(
    "/api/admin/employees"
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-navy">Employees</h1>
        <p className="text-sm text-slate-500 mt-1">
          {data.employees.length} employee
          {data.employees.length === 1 ? "" : "s"} have triggered blocks. Click
          any row for a deep-dive.
        </p>
      </header>

      {data.employees.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
          No employees have any block events yet.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Employee
                </th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Last 30 days
                </th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  All time
                </th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Last seen
                </th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Pending
                </th>
                <th aria-hidden="true" className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map((emp) => (
                <tr
                  key={emp.employeeId}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/employees/${encodeURIComponent(emp.employeeId)}`}
                      className="font-medium text-brand-navy hover:text-brand-cyan"
                    >
                      {emp.employeeId || "unknown"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-navy">
                    {emp.recentBlocks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {emp.totalBlocks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {emp.lastActivity ? timeAgo(emp.lastActivity) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {emp.pendingRequests > 0 ? (
                      <span className="inline-block min-w-[28px] px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                        {emp.pendingRequests}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="pr-3 text-slate-300">
                    <Link
                      href={`/employees/${encodeURIComponent(emp.employeeId)}`}
                      className="block py-3 hover:text-brand-cyan"
                      aria-label={`View ${emp.employeeId}`}
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
