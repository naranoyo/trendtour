// app/graph/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import type { TrendTourRecord } from "@/types/trendTour";
import { getTrendTourRecords } from "@/lib/trendTourStorage";
import {
  EventCompareChart,
  type ChartMode,
  VisitorRevenueChart,
} from "@/components/VisitorRevenueChart";

const number = new Intl.NumberFormat("ja-JP");

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

function toNumber(value: number | "") {
  return value === "" ? 0 : value;
}

export default function GraphPage() {
  const [mode, setMode] = useState<ChartMode>("both");
  const [records, setRecords] = useState<TrendTourRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedRecords = getTrendTourRecords();
      setRecords(savedRecords);
      setIsLoaded(true);
    });
  }, []);

  const totalVisitors = useMemo(() => {
    return records.reduce((sum, record) => sum + toNumber(record.visitors), 0);
  }, [records]);

  const totalEconomicImpact = useMemo(() => {
    return records.reduce(
      (sum, record) => sum + toNumber(record.economicImpact),
      0
    );
  }, [records]);

  const validVisitorRecords = records.filter(
    (record) => record.visitors !== ""
  );
  const validImpactRecords = records.filter(
    (record) => record.economicImpact !== ""
  );

  const averageVisitors =
    validVisitorRecords.length > 0
      ? Math.round(totalVisitors / validVisitorRecords.length)
      : 0;

  const averageEconomicImpact =
    validImpactRecords.length > 0
      ? Math.round(totalEconomicImpact / validImpactRecords.length)
      : 0;

  const eventRecords = useMemo(() => {
    return records.filter((record) => record.hasEvent);
  }, [records]);

  const eventAverageVisitors = useMemo(() => {
    const validRecords = eventRecords.filter(
      (record) => record.visitors !== ""
    );
    if (validRecords.length === 0) return 0;

    const total = validRecords.reduce(
      (sum, record) => sum + toNumber(record.visitors),
      0
    );

    return Math.round(total / validRecords.length);
  }, [eventRecords]);

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-slate-500">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <section>
        <h1 className="text-3xl font-bold">グラフ分析</h1>

        <p className="mt-2 text-slate-600">
          コンテンツツーリズムの観光客数・経済効果をグラフで確認します。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <GraphCard label="登録件数" value={`${records.length}件`} />

        <GraphCard
          label="平均観光客数"
          value={`${number.format(averageVisitors)}人`}
        />

        <GraphCard
          label="平均経済効果"
          value={yen.format(averageEconomicImpact)}
        />

        <GraphCard
          label="イベント平均観光客数"
          value={`${number.format(eventAverageVisitors)}人`}
        />
      </section>

      <section className="card">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">推移グラフ</h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("both")}
              className={mode === "both" ? "btn-toggle-active" : "btn-toggle"}
            >
              両方
            </button>

            <button
              type="button"
              onClick={() => setMode("visitors")}
              className={
                mode === "visitors" ? "btn-toggle-active" : "btn-toggle"
              }
            >
              観光客数
            </button>

            <button
              type="button"
              onClick={() => setMode("revenue")}
              className={
                mode === "revenue" ? "btn-toggle-active" : "btn-toggle"
              }
            >
              経済効果
            </button>
          </div>
        </div>

        <VisitorRevenueChart records={records} mode={mode} />
      </section>

      <section className="card">
        <h2 className="mb-5 text-xl font-bold">イベントデータ比較</h2>

        {records.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
            比較するデータがありません。
          </div>
        ) : (
          <EventCompareChart
            normalAverageVisitors={0}
            eventAverageVisitors={eventAverageVisitors}
          />
        )}
      </section>
    </main>
  );
}

function GraphCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
