interface Props {
  title: string;
  subtitle?: string;
  data: Array<{ _id: string; count: number }>;
  emptyText?: string;
  renderLabel?: (id: string) => React.ReactNode;
}

export default function TopList({
  title,
  subtitle,
  data,
  emptyText = "No data yet",
  renderLabel
}: Props) {
  const max = data.length ? Math.max(...data.map((d) => d.count)) : 1;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-navy">{title}</h2>
        {subtitle && (
          <span className="text-xs text-slate-500">{subtitle}</span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center text-slate-400 text-sm py-12">
          {emptyText}
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => {
            const pct = (item.count / max) * 100;
            return (
              <li key={item._id} className="relative">
                <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors relative z-10">
                  <span className="font-mono text-[13px] text-brand-navy truncate">
                    {renderLabel ? renderLabel(item._id) : item._id || "unknown"}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 shrink-0">
                    {item.count}
                  </span>
                </div>
                <div
                  className="absolute inset-y-0 left-0 rounded-lg bg-brand-cyan/10"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
