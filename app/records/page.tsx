// app/records/page.tsx

"use client";

import { useEffect, useState } from "react";
import RecordForm from "@/components/RecordForm";
import RecordTable from "@/components/RecordTable";
import SummaryCards from "@/components/SummaryCards";
import { createSampleTrendTourRecords } from "@/lib/sampleData";
import {
  getTrendTourRecords,
  saveTrendTourRecords,
} from "@/lib/trendTourStorage";
import type { TrendTourRecord } from "@/types/trendTour";

function getSortDate(record: TrendTourRecord) {
  return record.startDate || "";
}

function sortByStartDate(items: TrendTourRecord[]) {
  return [...items].sort((a, b) =>
    getSortDate(a).localeCompare(getSortDate(b))
  );
}

function isSameRecord(a: TrendTourRecord, b: TrendTourRecord) {
  return (
    a.startDate === b.startDate &&
    a.endDate === b.endDate &&
    a.prefecture === b.prefecture &&
    a.municipality === b.municipality &&
    a.eventName === b.eventName &&
    a.contentCategory === b.contentCategory &&
    a.visitors === b.visitors &&
    a.economicImpact === b.economicImpact
  );
}

function filterNewRecords(
  currentRecords: TrendTourRecord[],
  newRecords: TrendTourRecord[]
) {
  return newRecords.filter(
    (newRecord) =>
      !currentRecords.some((record) => isSameRecord(record, newRecord))
  );
}

export default function RecordsPage() {
  const [records, setRecords] = useState<TrendTourRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedRecords = getTrendTourRecords();
      setRecords(sortByStartDate(savedRecords));
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    saveTrendTourRecords(records);
  }, [records, isLoaded]);

  function handleAddRecord(record: TrendTourRecord) {
    setRecords((prev) => sortByStartDate([...prev, record]));
  }

  function handleDeleteRecord(id: string) {
    const ok = window.confirm("このデータを削除しますか？");
    if (!ok) return;

    setRecords((prev) => prev.filter((record) => record.id !== id));
  }

  function handleAddSampleData() {
    const ok = window.confirm("サンプルデータを追加しますか？");
    if (!ok) return;

    const samples = createSampleTrendTourRecords();

    setRecords((prev) => {
      const newSamples = filterNewRecords(prev, samples);

      if (newSamples.length === 0) {
        window.alert("同じサンプルデータはすでに登録されています。");
        return prev;
      }

      return sortByStartDate([...prev, ...newSamples]);
    });
  }

  function handleClearAll() {
    const ok = window.confirm("すべてのデータを削除しますか？");
    if (!ok) return;

    setRecords([]);
  }

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
        <h1 className="text-3xl font-bold">観光データ一覧</h1>

        <p className="mt-2 text-slate-600">
          イベント・観光客数・経済効果のデータを登録、確認できます。
        </p>
      </section>

      <SummaryCards records={records} />

      <RecordForm onAdd={handleAddRecord} />

      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAddSampleData}
          className="btn-success"
        >
          サンプルデータ追加
        </button>

        <button type="button" onClick={handleClearAll} className="btn-danger">
          全削除
        </button>
      </section>

      <RecordTable records={records} onDelete={handleDeleteRecord} />
    </main>
  );
}
