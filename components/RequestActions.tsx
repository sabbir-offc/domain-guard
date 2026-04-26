"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import clsx from "clsx";

interface Props {
  requestId: string;
  domain: string;
}

export default function RequestActions({ requestId, domain }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function decide(decision: "approved" | "denied", noteValue: string = "") {
    setBusy(decision === "approved" ? "approve" : "deny");
    setError(null);

    const res = await fetch(`/api/requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note: noteValue })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to save decision");
      setBusy(null);
      return;
    }

    setShowDenyForm(false);
    setNote("");
    startTransition(() => router.refresh());
  }

  if (showDenyForm) {
    return (
      <div className="w-full sm:w-72 space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Reason (optional, employee won't see this directly)"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setShowDenyForm(false);
              setNote("");
              setError(null);
            }}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-navy"
          >
            Cancel
          </button>
          <button
            onClick={() => decide("denied", note)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white text-sm font-semibold rounded-lg hover:bg-rose-600 disabled:opacity-60"
          >
            <X size={14} />
            Deny
          </button>
        </div>
        {error && <div className="text-xs text-rose-600">{error}</div>}
      </div>
    );
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => decide("approved")}
        disabled={busy !== null}
        className={clsx(
          "inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors",
          "bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
        )}
        title={`Approve and add ${domain} to the allowlist`}
      >
        <Check size={15} />
        {busy === "approve" ? "Approving…" : "Approve"}
      </button>
      <button
        onClick={() => setShowDenyForm(true)}
        disabled={busy !== null}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 transition-colors disabled:opacity-60"
      >
        <X size={15} />
        Deny
      </button>
      {error && (
        <div className="text-xs text-rose-600 self-center">{error}</div>
      )}
    </div>
  );
}
