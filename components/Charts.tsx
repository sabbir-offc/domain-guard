"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import type { TimeseriesPoint } from "@/lib/types";

const TYPE_COLORS = {
  navigation: "#0E1C42",
  input: "#29AAE1",
  paste: "#a78bfa"
};

export function BlocksOverTimeChart({ data }: { data: TimeseriesPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    })
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-navy">
          Blocks over time
        </h2>
        <span className="text-xs text-slate-500">Last 14 days</span>
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart
            data={formatted}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b7894" }}
              stroke="#cbd5e1"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7894" }}
              stroke="#cbd5e1"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e3e8f0",
                borderRadius: 8,
                fontSize: 12
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="navigation"
              stroke={TYPE_COLORS.navigation}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="input"
              stroke={TYPE_COLORS.input}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="paste"
              stroke={TYPE_COLORS.paste}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TypeBreakdownChart({
  data
}: {
  data: Array<{ _id: string; count: number }>;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (total === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-brand-navy mb-4">
          Block types
        </h2>
        <div className="text-center text-slate-400 text-sm py-16">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-semibold text-brand-navy">Block types</h2>
        <span className="text-xs text-slate-500">Last 7 days</span>
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry._id}
                  fill={
                    TYPE_COLORS[entry._id as keyof typeof TYPE_COLORS] ||
                    "#94a3b8"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e3e8f0",
                borderRadius: 8,
                fontSize: 12
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
