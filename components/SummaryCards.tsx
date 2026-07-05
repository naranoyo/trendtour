// components/SummaryCards.tsx

"use client";

import type { TrendTourRecord } from "@/types/trendTour";
import { formatJapaneseMoney, formatNumber, formatYen } from "@/lib/utils";

type Props = {
  records: TrendTourRecord[];
};

function toNumber(value: number | "") {
  return value === "" ? 0 : value;
}

export default function SummaryCards({ records }: Props) {
  const validVisitorRecords = records.filter(
    (record) => record.visitors !== ""
  );

  const validImpactRecords = records.filter(
    (record) => record.economicImpact !== ""
  );

  const totalVisitors = records.reduce(
    (sum, record) => sum + toNumber(record.visitors),
    0
  );

  const totalEconomicImpact = records.reduce(
    (sum, record) => sum + toNumber(record.economicImpact),
    0
  );

  const totalEventDays = records.reduce(
    (sum, record) => sum + record.durationDays,
    0
  );

  const averageVisitors =
    validVisitorRecords.length > 0
      ? Math.round(totalVisitors / validVisitorRecords.length)
      : 0;

  const averageEconomicImpact =
    validImpactRecords.length > 0
      ? Math.round(totalEconomicImpact / validImpactRecords.length)
      : 0;

  const cards = [
    {
      label: "登録件数",
      value: `${formatNumber(records.length)}件`,
      subValue: "",
    },
    {
      label: "観光客数 合計",
      value: `${formatNumber(totalVisitors)}人`,
      subValue: "",
    },
    {
      label: "経済効果 合計",
      value: formatYen(totalEconomicImpact),
      subValue: `（${formatJapaneseMoney(totalEconomicImpact)}）`,
    },
    {
      label: "平均観光客数",
      value: `${formatNumber(averageVisitors)}人`,
      subValue: "",
    },
    {
      label: "平均経済効果",
      value: formatYen(averageEconomicImpact),
      subValue: `（${formatJapaneseMoney(averageEconomicImpact)}）`,
    },
    {
      label: "イベント開催日数",
      value: `${formatNumber(totalEventDays)}日`,
      subValue: "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="card overflow-hidden">
          <p className="text-sm text-slate-500">{card.label}</p>

          <p className="mt-2 wrap-break-word text-xl font-bold text-slate-900">
            {card.value}
          </p>

          {card.subValue && (
            <p className="mt-1 text-sm font-medium text-slate-500">
              {card.subValue}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
