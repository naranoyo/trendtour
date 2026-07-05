// lib/analytics.ts

import type { TrendTourRecord } from "@/types/trendTour";

export type RankingItem = {
  name: string;
  totalVisitors: number;
  totalRevenue: number;
  count: number;
  averageVisitors: number;
  averageRevenue: number;
};

export type MonthlyItem = {
  month: string;
  totalVisitors: number;
  totalRevenue: number;
  count: number;
};

export type EventEffectItem = {
  eventName: string;
  areaName: string;
  date: string;
  visitors: number;
  revenue: number;
  visitorDiff: number;
  revenueDiff: number;
};

function toNumber(value: number | "" | undefined | null) {
  return typeof value === "number" ? value : 0;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function getAreaName(record: TrendTourRecord) {
  const prefecture = record.prefecture || "";
  const municipality = record.municipality || "";

  return `${prefecture}${municipality}` || "未設定";
}

function getRecordDate(record: TrendTourRecord) {
  return record.startDate || "";
}

function getVisitors(record: TrendTourRecord) {
  return toNumber(record.visitors);
}

function getRevenue(record: TrendTourRecord) {
  return toNumber(record.economicImpact);
}

export function getAreaRanking(records: TrendTourRecord[]): RankingItem[] {
  const map = new Map<string, TrendTourRecord[]>();

  records.forEach((record) => {
    const key = getAreaName(record);
    map.set(key, [...(map.get(key) ?? []), record]);
  });

  return Array.from(map.entries())
    .map(([name, items]) => {
      const totalVisitors = items.reduce((sum, r) => sum + getVisitors(r), 0);

      const totalRevenue = items.reduce((sum, r) => sum + getRevenue(r), 0);

      return {
        name,
        totalVisitors,
        totalRevenue,
        count: items.length,
        averageVisitors: average(items.map((r) => getVisitors(r))),
        averageRevenue: average(items.map((r) => getRevenue(r))),
      };
    })
    .sort((a, b) => b.totalVisitors - a.totalVisitors);
}

export function getMonthlyAnalysis(records: TrendTourRecord[]): MonthlyItem[] {
  const map = new Map<string, TrendTourRecord[]>();

  records.forEach((record) => {
    const date = getRecordDate(record);
    const month = date ? date.slice(0, 7) : "未設定";

    map.set(month, [...(map.get(month) ?? []), record]);
  });

  return Array.from(map.entries())
    .map(([month, items]) => ({
      month,
      totalVisitors: items.reduce((sum, r) => sum + getVisitors(r), 0),
      totalRevenue: items.reduce((sum, r) => sum + getRevenue(r), 0),
      count: items.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getEventEffectRanking(
  records: TrendTourRecord[]
): EventEffectItem[] {
  const normalRecords = records.filter((r) => !r.hasEvent);

  const normalAverageVisitors = average(
    normalRecords.map((r) => getVisitors(r))
  );

  const normalAverageRevenue = average(normalRecords.map((r) => getRevenue(r)));

  return records
    .filter((r) => r.hasEvent)
    .map((record) => {
      const visitors = getVisitors(record);
      const revenue = getRevenue(record);

      return {
        eventName: record.eventName || "イベント名未設定",
        areaName: getAreaName(record),
        date: getRecordDate(record),
        visitors,
        revenue,
        visitorDiff: visitors - normalAverageVisitors,
        revenueDiff: revenue - normalAverageRevenue,
      };
    })
    .sort((a, b) => b.visitorDiff - a.visitorDiff);
}
