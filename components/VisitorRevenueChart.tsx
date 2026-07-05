// components/VisitorRevenueChart.tsx

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendTourRecord } from "@/types/trendTour";
import { formatJapaneseMoney, formatNumber, formatYen } from "@/lib/utils";

export type ChartMode = "visitors" | "revenue" | "both";

type ChartRow = {
  year: number;
  startDate: string;
  visitors: number;
  economicImpact: number;
  eventName: string;
  municipality: string;
  hasEvent: boolean;
};

type VisitorRevenueChartProps = {
  records: TrendTourRecord[];
  mode: ChartMode;
};

type EventCompareChartProps = {
  normalAverageVisitors: number;
  eventAverageVisitors: number;
};

function toNumber(value: number | "") {
  return value === "" ? 0 : value;
}

export function VisitorRevenueChart({
  records,
  mode,
}: VisitorRevenueChartProps) {
  const chartData: ChartRow[] = [...records]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((record) => ({
      year: record.year,
      startDate: record.startDate,
      visitors: toNumber(record.visitors),
      economicImpact: toNumber(record.economicImpact),
      eventName: record.eventName,
      municipality: record.municipality,
      hasEvent: record.hasEvent,
    }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
        まだデータがありません。
      </div>
    );
  }

  return (
    <div className="h-[60vh] min-h-87.5 rounded-2xl border bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="startDate" tick={{ fontSize: 12 }} />

          <YAxis
            yAxisId="left"
            tickFormatter={(value) => formatNumber(Number(value))}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) =>
              `${formatNumber(Math.round(Number(value) / 100000000))}億`
            }
          />

          <Tooltip
            formatter={(value, name) => {
              const numValue = Number(value);

              if (name === "観光客数") {
                return [`${formatNumber(numValue)}人`, name];
              }

              return [
                `${formatYen(numValue)}（${formatJapaneseMoney(numValue)}）`,
                "経済効果",
              ];
            }}
            labelFormatter={(label, payload) => {
              const row = payload?.[0]?.payload as ChartRow | undefined;

              if (!row) return `開始日：${label}`;

              return [
                `開始日：${label}`,
                `年：${row.year}`,
                `市町村：${row.municipality}`,
                `イベント：${row.eventName || "通常日"}`,
              ].join(" / ");
            }}
          />

          <Legend />

          {(mode === "both" || mode === "visitors") && (
            <Line
              yAxisId="left"
              dataKey="visitors"
              name="観光客数"
              type="monotone"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          )}

          {(mode === "both" || mode === "revenue") && (
            <Line
              yAxisId="right"
              dataKey="economicImpact"
              name="経済効果"
              type="monotone"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EventCompareChart({
  normalAverageVisitors,
  eventAverageVisitors,
}: EventCompareChartProps) {
  const data = [
    {
      label: "通常",
      visitors: normalAverageVisitors,
    },
    {
      label: "イベント",
      visitors: eventAverageVisitors,
    },
  ];

  return (
    <div className="h-90 rounded-2xl border bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis tickFormatter={(value) => formatNumber(Number(value))} />

          <Tooltip
            formatter={(value) => [
              `${formatNumber(Number(value))}人`,
              "平均観光客数",
            ]}
          />

          <Legend />

          <Bar
            dataKey="visitors"
            name="平均観光客数"
            fill="#059669"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
