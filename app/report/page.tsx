// app/report/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getTrendTourRecords } from "@/lib/trendTourStorage";
import { calculateTrendTourSummary } from "@/lib/graph";
import {
  getAreaRanking,
  getEventEffectRanking,
  getMonthlyAnalysis,
} from "@/lib/analytics";
import type { TrendTourRecord } from "@/types/trendTour";

export default function ReportPage() {
  const [records, setRecords] = useState<TrendTourRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedRecords = getTrendTourRecords();
      setRecords(savedRecords);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-slate-500">読み込み中...</p>
      </main>
    );
  }

  const summary = calculateTrendTourSummary(records);
  const areaRanking = getAreaRanking(records);
  const monthlyAnalysis = getMonthlyAnalysis(records);
  const eventRanking = getEventEffectRanking(records);

  function handlePrint() {
    window.print();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-8 print:px-0">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold">PDFレポート</h1>

        <button onClick={handlePrint} className="btn-success">
          印刷 / PDF保存
        </button>
      </div>

      <section className="card-lg print:border-none print:shadow-none">
        <h2 className="text-3xl font-bold">TrendTour 分析レポート</h2>

        <p className="mt-2 text-slate-500">
          作成日：{new Date().toLocaleDateString("ja-JP")}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ReportCard label="登録件数" value={`${summary.totalRecords}件`} />

          <ReportCard
            label="総観光客数"
            value={`${summary.totalVisitors.toLocaleString()}人`}
          />

          <ReportCard
            label="総売上"
            value={`¥${summary.totalRevenue.toLocaleString()}`}
          />

          <ReportCard
            label="平均観光客数"
            value={`${summary.averageVisitors.toLocaleString()}人`}
          />

          <ReportCard
            label="平均売上"
            value={`¥${summary.averageRevenue.toLocaleString()}`}
          />

          <ReportCard
            label="イベント日 / 通常日"
            value={`${summary.eventDays}日 / ${summary.normalDays}日`}
          />
        </div>

        <ReportSection title="地域別ランキング">
          <SimpleTable
            rows={areaRanking.map((r, i) => [
              `${i + 1}`,
              r.name,
              `${r.totalVisitors.toLocaleString()}人`,
              `¥${r.totalRevenue.toLocaleString()}`,
            ])}
          />
        </ReportSection>

        <ReportSection title="月別分析">
          <SimpleTable
            rows={monthlyAnalysis.map((r, i) => [
              `${i + 1}`,
              r.month,
              `${r.totalVisitors.toLocaleString()}人`,
              `¥${r.totalRevenue.toLocaleString()}`,
            ])}
          />
        </ReportSection>

        <ReportSection title="イベント効果ランキング">
          <SimpleTable
            rows={eventRanking.map((r, i) => [
              `${i + 1}`,
              r.eventName,
              `+${r.visitorDiff.toLocaleString()}人`,
              `+¥${r.revenueDiff.toLocaleString()}`,
            ])}
          />
        </ReportSection>

        <p className="mt-8 text-xs text-slate-500">
          ※ 本レポートは登録データをもとにした簡易分析です。
        </p>
      </section>
    </main>
  );
}

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h3 className="mb-3 border-b pb-2 text-xl font-bold">{title}</h3>
      {children}
    </section>
  );
}

function SimpleTable({ rows }: { rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">データがありません。</p>;
  }

  return (
    <div className="table-wrapper shadow-none">
      <table className="table-base text-sm">
        <thead className="table-head">
          <tr>
            <th>順位</th>
            <th>項目</th>
            <th>観光客数</th>
            <th>売上</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
