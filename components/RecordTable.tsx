// components/RecordTable.tsx

"use client";

import type { TrendTourRecord } from "@/types/trendTour";
import { formatNumber, formatYen, formatJapaneseMoney } from "@/lib/utils";

type Props = {
  records: TrendTourRecord[];
  onDelete: (id: string) => void;
};

export default function RecordTable({ records, onDelete }: Props) {
  if (records.length === 0) {
    return (
      <div className="card text-center text-slate-500">
        まだ観光データが登録されていません。
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="overflow-x-auto">
        <table className="table-base min-w-250 text-sm">
          <thead className="table-head">
            <tr>
              <th className="w-20">年</th>
              <th className="w-40">作品名</th>
              <th className="w-56">イベント名</th>
              <th className="w-28">市町村</th>
              <th className="w-32">開始日</th>
              <th className="w-24">日数</th>
              <th className="w-36">観光客数</th>
              <th className="w-48">経済効果</th>
              <th className="w-44">1人あたり</th>
              <th className="w-24">操作</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.id}-${index}`}>
                <td>{record.year}</td>

                <td className="font-medium text-slate-900">
                  {record.contentTitle || "-"}
                </td>

                <td>{record.eventName || "通常データ"}</td>

                <td>{record.municipality || "-"}</td>

                <td>{record.startDate || "-"}</td>

                <td>{record.durationDays}日</td>

                <td className="text-right font-medium">
                  {formatNumber(record.visitors)}人
                </td>

                <td className="text-right">
                  <div className="font-medium text-slate-900">
                    {formatYen(record.economicImpact)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    （{formatJapaneseMoney(record.economicImpact)}）
                  </div>
                </td>

                <td className="text-right">
                  <div className="font-medium text-slate-900">
                    {formatYen(record.economicImpactPerPerson)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    （{formatJapaneseMoney(record.economicImpactPerPerson)}）
                  </div>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(record.id)}
                    className="btn-danger btn-sm"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
