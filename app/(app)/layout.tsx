import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { backendFetch } from "@/lib/api";

async function getPendingCount(): Promise<number> {
  try {
    const data = await backendFetch<{ pendingCount: number }>(
      "/api/admin/access-requests?status=pending&limit=1"
    );
    return data.pendingCount || 0;
  } catch {
    return 0;
  }
}

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [username, pending] = await Promise.all([
    getCurrentUser(),
    getPendingCount()
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar username={username} pendingRequests={pending} />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
