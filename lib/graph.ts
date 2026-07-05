// lib/graph.ts

import type { TrendTourRecord } from "@/types/trendTour";

export type TrendTourSummary = {
  totalRecords: number;
  totalVisitors: number;
  totalRevenue: number;
  averageVisitors: number;
  averageRevenue: number;

  eventDays: number;
  normalDays: number;

  eventAverageVisitors: number;
  normalAverageVisitors: number;

  eventAverageRevenue: number;
  normalAverageRevenue: number;

  visitorIncreaseByEvent: number;
  revenueIncreaseByEvent: number;
};

function toNumber(value: number | "" | undefined | null) {
  return typeof value === "number" ? value : 0;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );
}

function getVisitors(record: TrendTourRecord) {
  return toNumber(record.visitors);
}

function getRevenue(record: TrendTourRecord) {
  return toNumber(record.economicImpact);
}

export function calculateTrendTourSummary(
  records: TrendTourRecord[]
): TrendTourSummary {
  const totalRecords = records.length;

  const totalVisitors = records.reduce((sum, r) => sum + getVisitors(r), 0);

  const totalRevenue = records.reduce((sum, r) => sum + getRevenue(r), 0);

  const eventRecords = records.filter((r) => r.hasEvent);
  const normalRecords = records.filter((r) => !r.hasEvent);

  const averageVisitors = average(records.map((r) => getVisitors(r)));
  const averageRevenue = average(records.map((r) => getRevenue(r)));

  const eventAverageVisitors = average(eventRecords.map((r) => getVisitors(r)));
  const normalAverageVisitors = average(
    normalRecords.map((r) => getVisitors(r))
  );

  const eventAverageRevenue = average(eventRecords.map((r) => getRevenue(r)));
  const normalAverageRevenue = average(normalRecords.map((r) => getRevenue(r)));

  return {
    totalRecords,
    totalVisitors,
    totalRevenue,
    averageVisitors,
    averageRevenue,

    eventDays: eventRecords.length,
    normalDays: normalRecords.length,

    eventAverageVisitors,
    normalAverageVisitors,

    eventAverageRevenue,
    normalAverageRevenue,

    visitorIncreaseByEvent: eventAverageVisitors - normalAverageVisitors,
    revenueIncreaseByEvent: eventAverageRevenue - normalAverageRevenue,
  };
}
