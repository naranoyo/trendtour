// lib/trendTourStorage.ts

import type { TrendTourRecord } from "@/types/trendTour";

const STORAGE_KEY = "trendtour_records_v1";

export function getTrendTourRecords(): TrendTourRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed as TrendTourRecord[];
  } catch {
    return [];
  }
}

export function saveTrendTourRecords(records: TrendTourRecord[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addTrendTourRecord(record: TrendTourRecord) {
  const records = getTrendTourRecords();
  const nextRecords = [record, ...records];

  saveTrendTourRecords(nextRecords);

  return nextRecords;
}

export function deleteTrendTourRecord(id: string) {
  const records = getTrendTourRecords();
  const nextRecords = records.filter((record) => record.id !== id);

  saveTrendTourRecords(nextRecords);

  return nextRecords;
}

export function clearTrendTourRecords() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
}
