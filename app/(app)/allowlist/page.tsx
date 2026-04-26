import { backendFetch } from "@/lib/api";
import AllowlistEditor from "@/components/AllowlistEditor";
import type { AllowlistData } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AllowlistPage() {
  const data = await backendFetch<AllowlistData>("/api/admin/allowlist");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-navy">Allowlist</h1>
        <p className="text-sm text-slate-500 mt-1">
          {data.domains.length} domain{data.domains.length === 1 ? "" : "s"}
          {data.updatedAt && (
            <>
              {" · "}
              Last updated {formatDateTime(data.updatedAt)}
              {data.updatedBy && (
                <>
                  {" by "}
                  <span className="font-medium text-brand-navy">
                    {data.updatedBy}
                  </span>
                </>
              )}
            </>
          )}
        </p>
      </header>

      <AllowlistEditor initial={data} />
    </div>
  );
}
