import { backendFetch } from "@/lib/api";
import EventsFilters from "@/components/EventsFilters";
import type { BlockEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

interface SearchParams {
  employeeId?: string;
  type?: string;
  domain?: string;
}

export default async function EventsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.employeeId) params.set("employeeId", sp.employeeId);
  if (sp.type) params.set("type", sp.type);
  if (sp.domain) params.set("domain", sp.domain);
  params.set("limit", "200");

  const { events } = await backendFetch<{ events: BlockEvent[] }>(
    "/api/admin/events?" + params.toString()
  );

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Block events</h1>
          <p className="text-sm text-slate-500 mt-1">
            {events.length} event{events.length === 1 ? "" : "s"} shown
            {(sp.employeeId || sp.type || sp.domain) && " (filtered)"}
          </p>
        </div>
      </header>

      <EventsFilters events={events} />
    </div>
  );
}
