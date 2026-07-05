// lib/contentMaster.ts

export type ContentCategory =
  | "漫画"
  | "アニメ"
  | "映画"
  | "ドラマ"
  | "ゲーム"
  | "VTuber"
  | "ご当地キャラ"
  | "アイドル"
  | "その他";

export type EventType =
  | "コラボカフェ"
  | "スタンプラリー"
  | "原画展"
  | "聖地巡礼"
  | "ライブ"
  | "物販"
  | "限定グッズ"
  | "声優イベント"
  | "展示会"
  | "上映会"
  | "その他";

export type WeatherType =
  | "晴れ"
  | "曇り"
  | "雨"
  | "雪"
  | "猛暑"
  | "台風"
  | "不明";

export type ContentMasterItem = {
  title: string;
  category: ContentCategory;

  // 人気指数（0～100）
  popularityScoreJapan: number;
  popularityScoreOverseas: number;
  popularityScoreAverage: number;

  note?: string;
};

export const CONTENT_MASTER: ContentMasterItem[] = [
  {
    title: "鬼滅の刃",
    category: "漫画",
    popularityScoreJapan: 95,
    popularityScoreOverseas: 90,
    popularityScoreAverage: 93,
    note: "日本・海外ともに認知度が非常に高い",
  },
  {
    title: "ゆるキャン△",
    category: "漫画",
    popularityScoreJapan: 75,
    popularityScoreOverseas: 35,
    popularityScoreAverage: 55,
    note: "日本の聖地巡礼・地域コラボに強い",
  },
  {
    title: "HUNTER×HUNTER",
    category: "漫画",
    popularityScoreJapan: 82,
    popularityScoreOverseas: 80,
    popularityScoreAverage: 81,
    note: "国内外に固定ファンが多い",
  },
  {
    title: "呪術廻戦",
    category: "漫画",
    popularityScoreJapan: 92,
    popularityScoreOverseas: 90,
    popularityScoreAverage: 91,
  },
  {
    title: "ONE PIECE",
    category: "漫画",
    popularityScoreJapan: 98,
    popularityScoreOverseas: 98,
    popularityScoreAverage: 98,
  },
  {
    title: "名探偵コナン",
    category: "漫画",
    popularityScoreJapan: 96,
    popularityScoreOverseas: 75,
    popularityScoreAverage: 86,
  },
  {
    title: "SLAM DUNK",
    category: "漫画",
    popularityScoreJapan: 90,
    popularityScoreOverseas: 88,
    popularityScoreAverage: 89,
  },
  {
    title: "SPY×FAMILY",
    category: "漫画",
    popularityScoreJapan: 88,
    popularityScoreOverseas: 88,
    popularityScoreAverage: 88,
  },
  {
    title: "ハイキュー!!",
    category: "漫画",
    popularityScoreJapan: 90,
    popularityScoreOverseas: 86,
    popularityScoreAverage: 88,
  },
  {
    title: "進撃の巨人",
    category: "漫画",
    popularityScoreJapan: 92,
    popularityScoreOverseas: 96,
    popularityScoreAverage: 94,
  },
  {
    title: "ラブライブ！",
    category: "アニメ",
    popularityScoreJapan: 82,
    popularityScoreOverseas: 65,
    popularityScoreAverage: 74,
  },
  {
    title: "ガールズ＆パンツァー",
    category: "アニメ",
    popularityScoreJapan: 78,
    popularityScoreOverseas: 50,
    popularityScoreAverage: 64,
    note: "地域活性化事例として強い",
  },
  {
    title: "ぼっち・ざ・ろっく！",
    category: "アニメ",
    popularityScoreJapan: 84,
    popularityScoreOverseas: 68,
    popularityScoreAverage: 76,
  },
  {
    title: "すずめの戸締まり",
    category: "映画",
    popularityScoreJapan: 84,
    popularityScoreOverseas: 82,
    popularityScoreAverage: 83,
  },
  {
    title: "君の名は。",
    category: "映画",
    popularityScoreJapan: 95,
    popularityScoreOverseas: 94,
    popularityScoreAverage: 95,
  },
  {
    title: "あつまれ どうぶつの森",
    category: "ゲーム",
    popularityScoreJapan: 92,
    popularityScoreOverseas: 92,
    popularityScoreAverage: 92,
  },
  {
    title: "ポケットモンスター",
    category: "ゲーム",
    popularityScoreJapan: 100,
    popularityScoreOverseas: 100,
    popularityScoreAverage: 100,
  },
  {
    title: "刀剣乱舞",
    category: "ゲーム",
    popularityScoreJapan: 82,
    popularityScoreOverseas: 55,
    popularityScoreAverage: 69,
  },
  {
    title: "ウマ娘 プリティーダービー",
    category: "ゲーム",
    popularityScoreJapan: 88,
    popularityScoreOverseas: 58,
    popularityScoreAverage: 73,
  },
  {
    title: "初音ミク",
    category: "VTuber",
    popularityScoreJapan: 90,
    popularityScoreOverseas: 92,
    popularityScoreAverage: 91,
  },
  {
    title: "ホロライブ",
    category: "VTuber",
    popularityScoreJapan: 94,
    popularityScoreOverseas: 90,
    popularityScoreAverage: 92,
  },
  {
    title: "にじさんじ",
    category: "VTuber",
    popularityScoreJapan: 90,
    popularityScoreOverseas: 78,
    popularityScoreAverage: 84,
  },
];

export const EVENT_TYPE_RATES: Record<EventType, number> = {
  コラボカフェ: 1.15,
  スタンプラリー: 1.2,
  原画展: 1.25,
  聖地巡礼: 1.3,
  ライブ: 1.45,
  物販: 1.2,
  限定グッズ: 1.25,
  声優イベント: 1.4,
  展示会: 1.15,
  上映会: 1.1,
  その他: 1,
};

export const WEATHER_RATES: Record<WeatherType, number> = {
  晴れ: 1.08,
  曇り: 1,
  雨: 0.88,
  雪: 0.82,
  猛暑: 0.9,
  台風: 0.55,
  不明: 1,
};

export function findContent(title: string) {
  return CONTENT_MASTER.find((item) => item.title === title);
}
