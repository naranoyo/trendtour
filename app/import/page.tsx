// app/import/page.tsx

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  downloadImportTemplate,
  parseCsvText,
  parseExcelFile,
} from "@/lib/csv";
import {
  getTrendTourRecords,
  saveTrendTourRecords,
} from "@/lib/trendTourStorage";
import type { TrendTourRecord } from "@/types/trendTour";

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState("選択されていません");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function handleFileSelect(file: File | null) {
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setErrors([]);
    setMessage("");
  }

  async function handleImport() {
    if (!selectedFile) {
      alert("CSV / Excelファイルを選択してください");
      return;
    }

    setIsImporting(true);
    setErrors([]);
    setMessage("");

    try {
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();

      let importedRecords: TrendTourRecord[] = [];
      let importErrors: string[] = [];

      if (extension === "csv") {
        const text = await selectedFile.text();
        const result = parseCsvText(text);

        importedRecords = result.records;
        importErrors = result.errors;
      } else if (extension === "xlsx" || extension === "xls") {
        const result = await parseExcelFile(selectedFile);

        importedRecords = result.records;
        importErrors = result.errors;
      } else {
        alert("CSV、xlsx、xlsファイルを選択してください");
        return;
      }

      setErrors(importErrors);

      if (importedRecords.length === 0) {
        setMessage("取り込めるデータがありませんでした。");
        return;
      }

      const currentRecords = getTrendTourRecords();

      const nextRecords = [...currentRecords, ...importedRecords].sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
      );

      saveTrendTourRecords(nextRecords);

      if (importErrors.length > 0) {
        setMessage(
          `${importedRecords.length}件を取り込みました。${importErrors.length}件のエラーがあります。`
        );
      } else {
        alert(`${importedRecords.length}件のデータを取り込みました`);
        router.push("/records");
      }
    } catch (error) {
      console.error(error);
      alert("ファイルの取り込みに失敗しました");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <section>
        <h1 className="text-3xl font-bold">CSV / Excel 取込</h1>

        <p className="mt-2 text-slate-600">
          CSVまたはExcelファイルから、イベント・観光客数・経済効果データを一括登録します。
        </p>
      </section>

      <section className="card-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">CSV / Excelファイルを選択</h2>

          <button
            type="button"
            onClick={downloadImportTemplate}
            className="btn-secondary"
          >
            テンプレートをダウンロード
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-400 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-success"
            >
              📁 ファイルを選択
            </button>

            <span className="text-slate-600">{fileName}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
          <p className="font-bold">対応ファイル</p>
          <p className="mt-2">CSV / Excel（.csv / .xlsx / .xls）</p>

          <p className="mt-4 font-bold">見出し例</p>
          <p className="mt-2 overflow-x-auto rounded-lg bg-white p-3 font-mono text-xs">
            年,都道府県,市町村,イベント名,イベント分類,開始日,終了日,開催日数,観光客数,経済効果,前年比(%),イベント有無,天気,メモ
          </p>

          <p className="mt-3 text-emerald-700">
            ※
            必須項目は「都道府県」「市町村」「開始日」「終了日」「観光客数」「経済効果」です。
          </p>

          <p className="mt-2 text-emerald-700">
            ※「開催日数」は未入力の場合、開始日と終了日から自動計算されます。
          </p>

          <p className="mt-2 text-emerald-700">
            ※「前年比(%)」は空欄でも取り込みできます。
          </p>
        </div>

        {message && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-bold text-red-700">エラーレポート</h3>

            <ul className="mt-3 space-y-2 text-sm text-red-700">
              {errors.map((error) => (
                <li key={error}>・{error}</li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-red-600">
              ※
              エラーのある行は取り込まれません。ファイルを修正して再度取り込んでください。
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleImport}
          disabled={isImporting}
          className="btn-success disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isImporting ? "取り込み中..." : "取り込む"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          戻る
        </button>
      </section>
    </main>
  );
}
