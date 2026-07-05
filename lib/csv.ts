// lib/csv.ts

import type { TrendTourRecord } from "@/types/trendTour";

export type ImportResult = {
  records: TrendTourRecord[];
  errors: string[];
};

type RawRow = Record<string, string | number | boolean | undefined>;

function getValue(row: RawRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

function toNumberOrEmpty(value: string): number | "" {
  if (!value) return "";

  const cleaned = String(value).replace(/,/g, "").replace(/円/g, "").trim();
  const num = Number(cleaned);

  return Number.isFinite(num) ? num : "";
}

function toNumber(value: string) {
  const num = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(num) ? num : 0;
}

function toBoolean(value: string) {
  return ["true", "1", "あり", "有", "○", "〇", "yes", "YES"].includes(
    value.trim()
  );
}

function calcDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

function calcEconomicImpactPerPerson(
  visitors: number | "",
  economicImpact: number | ""
): number | "" {
  if (visitors === "" || economicImpact === "" || visitors <= 0) return "";

  return Math.round(economicImpact / visitors);
}

function createRecord(
  row: RawRow,
  rowNumber: number
): {
  record: TrendTourRecord | null;
  errors: string[];
} {
  const errors: string[] = [];

  const yearText = getValue(row, ["年", "year"]);
  const prefecture = getValue(row, ["都道府県", "prefecture"]);
  const municipality = getValue(row, ["市町村", "municipality"]);
  const dataType = getValue(row, ["データ種別", "dataType"]);
  const contentTitle = getValue(row, ["作品名", "contentTitle"]);
  const contentCategory = getValue(row, ["コンテンツ分類", "contentCategory"]);
  const eventName = getValue(row, ["イベント名", "eventName"]);
  const startDate = getValue(row, ["開始日", "startDate"]);
  const endDate = getValue(row, ["終了日", "endDate"]);
  const durationDaysText = getValue(row, ["開催日数", "durationDays"]);
  const visitorsText = getValue(row, ["観光客数", "visitors"]);
  const economicImpactText = getValue(row, ["経済効果", "economicImpact"]);
  const economicImpactPerPersonText = getValue(row, [
    "経済効果(1人)",
    "経済効果（1人）",
    "economicImpactPerPerson",
  ]);
  const hasEventText = getValue(row, ["イベント有無", "hasEvent"]);
  const memo = getValue(row, ["メモ", "memo"]);

  if (!yearText) errors.push(`${rowNumber}行目：年が入力されていません。`);
  if (!prefecture)
    errors.push(`${rowNumber}行目：都道府県が入力されていません。`);
  if (!municipality)
    errors.push(`${rowNumber}行目：市町村が入力されていません。`);
  if (!contentTitle)
    errors.push(`${rowNumber}行目：作品名が入力されていません。`);
  if (!contentCategory)
    errors.push(`${rowNumber}行目：コンテンツ分類が入力されていません。`);
  if (!eventName)
    errors.push(`${rowNumber}行目：イベント名が入力されていません。`);
  if (!startDate) errors.push(`${rowNumber}行目：開始日が入力されていません。`);
  if (!endDate) errors.push(`${rowNumber}行目：終了日が入力されていません。`);

  const year = toNumber(yearText);
  const durationDays =
    durationDaysText !== ""
      ? toNumber(durationDaysText)
      : calcDurationDays(startDate, endDate);

  const visitors = toNumberOrEmpty(visitorsText);
  const economicImpact = toNumberOrEmpty(economicImpactText);

  const economicImpactPerPerson =
    economicImpactPerPersonText !== ""
      ? toNumberOrEmpty(economicImpactPerPersonText)
      : calcEconomicImpactPerPerson(visitors, economicImpact);

  if (year <= 0) errors.push(`${rowNumber}行目：年が正しくありません。`);
  if (durationDays <= 0)
    errors.push(`${rowNumber}行目：開催日数が正しくありません。`);

  if (errors.length > 0) {
    return { record: null, errors };
  }

  const now = new Date().toISOString();

  return {
    record: {
      id: crypto.randomUUID(),

      year,
      prefecture,
      municipality,

      dataType: dataType || contentCategory,
      contentTitle,
      contentCategory,

      eventName,

      startDate,
      endDate,
      durationDays,

      visitors,
      economicImpact,
      economicImpactPerPerson,

      hasEvent: hasEventText ? toBoolean(hasEventText) : true,
      memo,

      createdAt: now,
      updatedAt: now,
    },
    errors: [],
  };
}

export function parseCsvText(csvText: string): ImportResult {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length <= 1) {
    return {
      records: [],
      errors: ["データ行がありません。"],
    };
  }

  const headers = splitCsvLine(lines[0]);
  const records: TrendTourRecord[] = [];
  const errors: string[] = [];

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2;
    const values = splitCsvLine(line);
    const row: RawRow = {};

    headers.forEach((header, i) => {
      row[header.trim()] = values[i]?.trim() ?? "";
    });

    const result = createRecord(row, rowNumber);

    if (result.record) records.push(result.record);
    errors.push(...result.errors);
  });

  return { records, errors };
}

export async function parseExcelFile(file: File): Promise<ImportResult> {
  const XLSX = await import("xlsx");

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return {
      records: [],
      errors: ["シートが見つかりません。"],
    };
  }

  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, {
    defval: "",
  });

  const records: TrendTourRecord[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const result = createRecord(row, rowNumber);

    if (result.record) records.push(result.record);
    errors.push(...result.errors);
  });

  return { records, errors };
}

export function downloadImportTemplate() {
  const headers = [
    "年",
    "都道府県",
    "市町村",
    "データ種別",
    "作品名",
    "コンテンツ分類",
    "イベント名",
    "開始日",
    "終了日",
    "開催日数",
    "観光客数",
    "経済効果",
    "経済効果(1人)",
    "イベント有無",
    "メモ",
  ];

  const sampleRows = [
    [
      "2025",
      "大分県",
      "日田市",
      "漫画",
      "進撃の巨人",
      "漫画",
      "進撃の巨人 in HITA ミュージアム・聖地巡礼",
      "2025/1/1",
      "2025/12/31",
      "365",
      "",
      "",
      "",
      "あり",
      "観光客数・経済効果は未入力",
    ],
  ];

  const csv = [headers, ...sampleRows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "trendtour_content_template.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  return result.map((value) => value.replace(/^"|"$/g, ""));
}
