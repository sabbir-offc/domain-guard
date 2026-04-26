import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accent?: "cyan" | "navy" | "amber" | "rose";
  hint?: string;
}

const ACCENTS = {
  cyan: "border-l-brand-cyan",
  navy: "border-l-brand-navy",
  amber: "border-l-amber-400",
  rose: "border-l-rose-400"
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "cyan",
  hint
}: Props) {
  return (
    <div
      className={clsx(
        "bg-white border border-slate-200 rounded-2xl p-6 border-l-4",
        ACCENTS[accent]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            {label}
          </div>
          <div className="text-4xl font-bold text-brand-navy mt-3 leading-none">
            {value}
          </div>
          {hint && (
            <div className="text-xs text-slate-500 mt-2">{hint}</div>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
