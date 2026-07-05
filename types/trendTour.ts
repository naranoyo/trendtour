// types/trendTour.ts

export type TrendTourRecord = {
  id: string;

  year: number;
  prefecture: string;
  municipality: string;

  dataType: string;
  contentTitle: string;
  contentCategory: string;

  eventName: string;

  startDate: string;
  endDate: string;
  durationDays: number;

  visitors: number | "";
  economicImpact: number | "";
  economicImpactPerPerson: number | "";

  hasEvent: boolean;
  memo?: string;

  createdAt: string;
  updatedAt: string;
};

export type TrendTourCsvRow = {
  年: string;
  都道府県: string;
  市町村: string;
  データ種別: string;
  作品名: string;
  コンテンツ分類: string;
  イベント名: string;
  開始日: string;
  終了日: string;
  開催日数: string;
  観光客数?: string;
  経済効果?: string;
  "経済効果(1人)"?: string;
  イベント有無?: string;
  メモ?: string;
};
