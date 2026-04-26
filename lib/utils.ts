export function normalizeDomain(d: string): string {
  return String(d || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0];
}

export function isValidDomain(d: string): boolean {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d) && !d.startsWith(".") && !d.endsWith(".");
}

export function timeAgo(input: string | Date | number | null): string {
  if (!input) return "never";
  const ts = typeof input === "object" ? input.getTime() : new Date(input).getTime();
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export function formatDateTime(input: string | Date | number): string {
  return new Date(input).toLocaleString();
}
