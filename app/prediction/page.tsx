// app/prediction/page.tsx

"use client";

import { useMemo, useState } from "react";
import { getTrendTourRecords } from "@/lib/trendTourStorage";
import {
  CONTENT_MASTER,
  EVENT_TYPE_RATES,
  WEATHER_RATES,
  type EventType,
  type WeatherType,
  findContent,
} from "@/lib/contentMaster";
import {
  calcPerPerson,
  formatJapaneseMoney,
  formatNumber,
  formatYen,
} from "@/lib/utils";

type PredictionResult = {
  predictedVisitors: number;
  predictedEconomicImpact: number;
  economicImpactPerPerson: number;
  sampleCount: number;
  expectationStars: number;
  reliability: number;
  popularityScore: number;
  comment: string;
  detail: {
    baseVisitors: number;
    baseEconomicImpactPerPerson: number;
    contentRate: number;
    eventRate: number;
    durationRate: number;
    seasonRate: number;
    weekendRate: number;
    weatherRate: number;
  };
};

const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const EVENT_TYPES: EventType[] = [
  "コラボカフェ",
  "スタンプラリー",
  "原画展",
  "聖地巡礼",
  "ライブ",
  "物販",
  "限定グッズ",
  "声優イベント",
  "展示会",
  "上映会",
  "その他",
];

const WEATHER_TYPES: WeatherType[] = [
  "晴れ",
  "曇り",
  "雨",
  "雪",
  "猛暑",
  "台風",
  "不明",
];

function getSeasonRate(startDate: string) {
  if (!startDate) return 1;

  const date = new Date(startDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 3 || month === 4) return 1.08;
  if (month === 5 && day <= 7) return 1.25;
  if (month === 7 || month === 8) return 1.2;
  if (month === 10 || month === 11) return 1.12;
  if (month === 12 || month === 1) return 1.1;

  return 1;
}

function getWeekendRate(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  if (end < start) return 1;

  let weekendCount = 0;
  let totalDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();

    if (day === 0 || day === 6) {
      weekendCount += 1;
    }

    totalDays += 1;
    current.setDate(current.getDate() + 1);
  }

  if (totalDays === 0) return 1;

  const weekendRate = weekendCount / totalDays;

  if (weekendRate >= 0.5) return 1.15;
  if (weekendRate >= 0.3) return 1.08;

  return 1;
}

function getDurationRate(durationDays: number) {
  if (durationDays <= 1) return 1;
  if (durationDays <= 3) return 1.15;
  if (durationDays <= 7) return 1.35;
  if (durationDays <= 14) return 1.55;
  return 1.75;
}

function getExpectationStars(score: number) {
  if (score >= 1.8) return 5;
  if (score >= 1.5) return 4;
  if (score >= 1.2) return 3;
  if (score >= 1) return 2;
  return 1;
}

function getReliability(sampleCount: number) {
  if (sampleCount >= 10) return 90;
  if (sampleCount >= 5) return 75;
  if (sampleCount >= 3) return 60;
  if (sampleCount >= 1) return 45;
  return 30;
}

function createStars(count: number) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function calcDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  if (end < start) return 1;

  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export default function PredictionPage() {
  const records = useMemo(() => getTrendTourRecords(), []);

  const [prefecture, setPrefecture] = useState("山形県");
  const [city, setCity] = useState("新庄市");
  const [contentTitle, setContentTitle] = useState("鬼滅の刃");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>("スタンプラリー");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weather, setWeather] = useState<WeatherType>("不明");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const calculatedDurationDays = calcDurationDays(startDate, endDate);

  function handlePredict() {
    const duration = calculatedDurationDays;
    const selectedContent = findContent(contentTitle);

    const sameCityRecords = records.filter(
      (record) => record.municipality === city
    );

    const sameContentRecords = records.filter(
      (record) => record.contentTitle === contentTitle
    );

    const sameCategoryRecords = records.filter((record) => {
      return (
        selectedContent && record.contentCategory === selectedContent.category
      );
    });

    const samples =
      sameContentRecords.length > 0
        ? sameContentRecords
        : sameCityRecords.length > 0
          ? sameCityRecords
          : sameCategoryRecords.length > 0
            ? sameCategoryRecords
            : records;

    const sampleCount = samples.length;

    const baseVisitors =
      sampleCount > 0
        ? Math.round(
            samples.reduce((sum, record) => {
              return sum + Number(record.visitors);
            }, 0) / sampleCount
          )
        : 1000;

    const baseEconomicImpactPerPerson =
      sampleCount > 0
        ? Math.round(
            samples.reduce((sum, record) => {
              return (
                sum +
                calcPerPerson(
                  Number(record.economicImpact),
                  Number(record.visitors)
                )
              );
            }, 0) / sampleCount
          )
        : 3000;

    const popularityScore = selectedContent?.popularityScoreAverage ?? 0;
    const contentRate = 1 + popularityScore / 100;

    const eventRate = EVENT_TYPE_RATES[eventType] ?? 1;
    const durationRate = getDurationRate(duration);
    const seasonRate = getSeasonRate(startDate);
    const weekendRate = getWeekendRate(startDate, endDate);
    const weatherRate = WEATHER_RATES[weather] ?? 1;

    const totalRate =
      contentRate *
      eventRate *
      durationRate *
      seasonRate *
      weekendRate *
      weatherRate;

    const predictedVisitors = Math.round(baseVisitors * totalRate);

    const predictedEconomicImpact = Math.round(
      predictedVisitors * baseEconomicImpactPerPerson
    );

    const expectationStars = getExpectationStars(totalRate);
    const reliability = getReliability(sampleCount);

    let comment = "";

    if (expectationStars >= 5) {
      comment =
        "作品人気・イベント内容・開催時期の条件が良く、かなり高い集客が期待できます。限定グッズやSNS告知を組み合わせると、さらに効果が出やすいです。";
    } else if (expectationStars >= 4) {
      comment =
        "集客が期待できる内容です。過去データと比較しても、通常イベントより高い観光客数が見込めます。";
    } else if (expectationStars >= 3) {
      comment =
        "一定の集客効果が期待できます。イベント内容や告知方法を工夫すると、さらに伸びる可能性があります。";
    } else {
      comment =
        "現時点では控えめな予測です。作品選定、開催時期、イベント内容を見直すと改善できる可能性があります。";
    }

    setResult({
      predictedVisitors,
      predictedEconomicImpact,
      economicImpactPerPerson: baseEconomicImpactPerPerson,
      sampleCount,
      expectationStars,
      reliability,
      popularityScore,
      comment,
      detail: {
        baseVisitors,
        baseEconomicImpactPerPerson,
        contentRate,
        eventRate,
        durationRate,
        seasonRate,
        weekendRate,
        weatherRate,
      },
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">AI Prediction</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">AI観光予測</h1>
        <p className="mt-2 text-sm text-slate-600">
          作品人気・イベント内容・開催日数・季節・曜日・天候・過去実績をもとに、観光客数と経済効果を予測します。
        </p>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          予測条件を入力
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              都道府県
            </span>
            <select
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            >
              {PREFECTURES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">市町村</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="例：新庄市"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">作品名</span>
            <select
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            >
              {CONTENT_MASTER.map((item) => (
                <option key={item.title}>{item.title}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              イベント名
            </span>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="例：新庄まちなかスタンプラリー"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              イベント内容
            </span>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            >
              {EVENT_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">天気</span>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value as WeatherType)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            >
              {WEATHER_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">開始日</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">終了日</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              開催日数
            </span>
            <input
              type="text"
              value={`${calculatedDurationDays}日`}
              readOnly
              className="mt-1 w-full rounded-xl border bg-slate-100 px-3 py-2 text-slate-700"
            />
          </label>
        </div>

        <button
          onClick={handlePredict}
          className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-slate-700"
        >
          AI予測する
        </button>
      </section>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                予測観光客数
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatNumber(result.predictedVisitors)}人
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                予測経済効果
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatYen(result.predictedEconomicImpact)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatJapaneseMoney(result.predictedEconomicImpact)}
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                1人当たり経済効果
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatYen(result.economicImpactPerPerson)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">期待度</p>
              <p className="mt-2 text-2xl font-bold text-amber-500">
                {createStars(result.expectationStars)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                5個中 {result.expectationStars}個
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">信頼度</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.reliability}%
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                参考データ件数
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.sampleCount}件
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">人気指数</p>

              <p className="mt-4 text-5xl font-bold text-indigo-600">
                {result.popularityScore}
                <span className="text-2xl text-slate-500"> /100</span>
              </p>

              <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-indigo-500"
                  style={{ width: `${result.popularityScore}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                日本・海外の平均人気指数
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">AIコメント</h2>
            <p className="mt-3 leading-7 text-slate-700">{result.comment}</p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">予測の内訳</h2>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <p>基準観光客数：{formatNumber(result.detail.baseVisitors)}人</p>
              <p>
                基準1人当たり経済効果：
                {formatYen(result.detail.baseEconomicImpactPerPerson)}
              </p>
              <p>作品人気補正：×{result.detail.contentRate}</p>
              <p>イベント補正：×{result.detail.eventRate}</p>
              <p>開催日数補正：×{result.detail.durationRate}</p>
              <p>季節補正：×{result.detail.seasonRate}</p>
              <p>曜日補正：×{result.detail.weekendRate}</p>
              <p>天候補正：×{result.detail.weatherRate}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
