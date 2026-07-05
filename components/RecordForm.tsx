// components/RecordForm.tsx

"use client";

import { useState } from "react";
import type { TrendTourRecord } from "@/types/trendTour";

type Props = {
  onAdd: (record: TrendTourRecord) => void;
};

const prefectures = ["山形県"];

const municipalities = [
  "山形市",
  "米沢市",
  "鶴岡市",
  "酒田市",
  "新庄市",
  "寒河江市",
  "上山市",
  "村山市",
  "長井市",
  "天童市",
  "東根市",
  "尾花沢市",
  "南陽市",
  "山辺町",
  "中山町",
  "河北町",
  "西川町",
  "朝日町",
  "大江町",
  "大石田町",
  "金山町",
  "最上町",
  "舟形町",
  "真室川町",
  "大蔵村",
  "鮭川村",
  "戸沢村",
  "高畠町",
  "川西町",
  "小国町",
  "白鷹町",
  "飯豊町",
  "三川町",
  "庄内町",
  "遊佐町",
];

const dataTypes = ["アニメ", "漫画", "映画", "ドラマ"];
const contentCategories = ["アニメ", "漫画", "映画", "ドラマ"];

function calcDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

function calcEconomicImpactPerPerson(visitors: string, economicImpact: string) {
  const visitorNumber = Number(visitors);
  const impactNumber = Number(economicImpact);

  if (!visitorNumber || !impactNumber || visitorNumber <= 0) return "";

  return Math.round(impactNumber / visitorNumber);
}

export default function RecordForm({ onAdd }: Props) {
  const [prefecture, setPrefecture] = useState("山形県");
  const [municipality, setMunicipality] = useState("新庄市");

  const [dataType, setDataType] = useState("アニメ");
  const [contentTitle, setContentTitle] = useState("");
  const [contentCategory, setContentCategory] = useState("アニメ");
  const [eventName, setEventName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [visitors, setVisitors] = useState("");
  const [economicImpact, setEconomicImpact] = useState("");
  const [memo, setMemo] = useState("");

  const durationDays = calcDurationDays(startDate, endDate);
  const economicImpactPerPerson = calcEconomicImpactPerPerson(
    visitors,
    economicImpact
  );

  function resetForm() {
    setPrefecture("山形県");
    setMunicipality("新庄市");
    setDataType("アニメ");
    setContentTitle("");
    setContentCategory("アニメ");
    setEventName("");
    setStartDate("");
    setEndDate("");
    setVisitors("");
    setEconomicImpact("");
    setMemo("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!prefecture || !municipality) {
      alert("都道府県・市町村を選択してください");
      return;
    }

    if (!contentTitle || !contentCategory || !eventName) {
      alert("作品名・コンテンツ分類・イベント名を入力してください");
      return;
    }

    if (!startDate || !endDate) {
      alert("開始日・終了日を入力してください");
      return;
    }

    if (durationDays <= 0) {
      alert("終了日は開始日以降の日付にしてください");
      return;
    }

    const now = new Date().toISOString();
    const year = new Date(startDate).getFullYear();

    const newRecord: TrendTourRecord = {
      id: crypto.randomUUID(),

      year,
      prefecture,
      municipality,

      dataType,
      contentTitle,
      contentCategory,
      eventName,

      startDate,
      endDate,
      durationDays,

      visitors: visitors ? Number(visitors) : "",
      economicImpact: economicImpact ? Number(economicImpact) : "",
      economicImpactPerPerson,

      hasEvent: true,
      memo,

      createdAt: now,
      updatedAt: now,
    };

    onAdd(newRecord);
    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="mb-4 text-xl font-bold">コンテンツ観光データ登録</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">都道府県</label>
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="input"
          >
            {prefectures.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">市町村</label>
          <select
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="input"
          >
            {municipalities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">データ種別</label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="input"
          >
            {dataTypes.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            コンテンツ分類
          </label>
          <select
            value={contentCategory}
            onChange={(e) => {
              setContentCategory(e.target.value);
              setDataType(e.target.value);
            }}
            className="input"
          >
            {contentCategories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">作品名</label>
          <input
            type="text"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            className="input"
            placeholder="例：進撃の巨人"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">イベント名</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="input"
            placeholder="例：聖地巡礼・ロケ地巡り"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (!endDate) setEndDate(e.target.value);
            }}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">終了日</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">開催日数</label>
          <input
            value={durationDays > 0 ? `${durationDays}日` : ""}
            readOnly
            className="input bg-slate-100"
            placeholder="開始日・終了日から自動計算"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">観光客数</label>
          <input
            type="number"
            value={visitors}
            onChange={(e) => setVisitors(e.target.value)}
            className="input"
            placeholder="未確認の場合は空欄"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">経済効果</label>
          <input
            type="number"
            value={economicImpact}
            onChange={(e) => setEconomicImpact(e.target.value)}
            className="input"
            placeholder="未確認の場合は空欄"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            経済効果(1人)
          </label>
          <input
            value={
              economicImpactPerPerson === ""
                ? ""
                : `¥${economicImpactPerPerson.toLocaleString()}`
            }
            readOnly
            className="input bg-slate-100"
            placeholder="自動計算"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="textarea"
          placeholder="例：観光客数・経済効果は未入力"
        />
      </div>

      <button type="submit" className="btn-success mt-6">
        登録する
      </button>
    </form>
  );
}
