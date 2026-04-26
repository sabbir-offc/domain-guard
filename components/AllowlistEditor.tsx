"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Search, Save, Download } from "lucide-react";
import { normalizeDomain, isValidDomain } from "@/lib/utils";
import type { AllowlistData } from "@/lib/types";

interface Props {
  initial: AllowlistData;
}

export default function AllowlistEditor({ initial }: Props) {
  const router = useRouter();
  const [domains, setDomains] = useState<string[]>(initial.domains);
  const [newDomain, setNewDomain] = useState("");
  const [search, setSearch] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...domains].sort().filter((d) => !q || d.includes(q));
  }, [domains, search]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function save(next: string[], successMsg: string) {
    const res = await fetch("/api/allowlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domains: next })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast("Save failed: " + (err.error || res.status));
      return false;
    }
    const data = await res.json();
    setDomains(data.domains);
    showToast(successMsg);
    startTransition(() => router.refresh());
    return true;
  }

  function add() {
    const d = normalizeDomain(newDomain);
    if (!d) return;
    if (!isValidDomain(d)) return showToast("Invalid domain");
    if (domains.includes(d)) return showToast("Already on the list");
    save([...domains, d], `Added ${d}`).then((ok) => {
      if (ok) setNewDomain("");
    });
  }

  function remove(d: string) {
    save(
      domains.filter((x) => x !== d),
      `Removed ${d}`
    );
  }

  function bulkSave() {
    const lines = bulkText
      .split(/[\n,;\s]+/)
      .map(normalizeDomain)
      .filter(Boolean);
    const valid = [...new Set(lines.filter(isValidDomain))];
    if (!valid.length) return showToast("No valid domains in list");
    if (!confirm(`Replace allowlist with ${valid.length} domains?`)) return;
    save(valid, `Saved ${valid.length} domains`).then((ok) => {
      if (ok) setBulkText("");
    });
  }

  function loadCurrentList() {
    setBulkText([...domains].sort().join("\n"));
    showToast("Loaded current list into bulk editor");
  }

  return (
    <div className="space-y-6">
      {/* Add + search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a domain (e.g. example.com)"
            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
            disabled={isPending}
          />
          <button
            onClick={add}
            disabled={isPending || !newDomain.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domains…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
          />
        </div>
      </div>

      {/* Domain list */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-base font-semibold text-brand-navy">
            {filtered.length} of {domains.length} domain
            {domains.length === 1 ? "" : "s"}
          </h2>
        </div>

        {domains.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-12">
            No domains yet. Add one above.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-12">
            No domains match &ldquo;{search}&rdquo;.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((d) => (
              <li
                key={d}
                className="group flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[13px] font-mono text-brand-navy transition-colors"
              >
                <span className="truncate">{d}</span>
                <button
                  onClick={() => remove(d)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all disabled:opacity-30"
                  title={`Remove ${d}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bulk replace */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-brand-navy mb-1">
          Bulk replace
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          Paste a list (one domain per line) to replace the entire allowlist.
        </p>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={8}
          placeholder="example.com&#10;another.com&#10;..."
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono bg-white resize-y"
          disabled={isPending}
        />
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            onClick={loadCurrentList}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-sm font-semibold text-brand-navy rounded-lg hover:border-brand-cyan hover:text-brand-cyan transition-colors"
          >
            <Download size={16} />
            Load current list
          </button>
          <button
            onClick={bulkSave}
            disabled={isPending || !bulkText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            Save (replace all)
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-brand-navy text-white px-4 py-3 rounded-lg shadow-lg border-l-4 border-brand-cyan text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
