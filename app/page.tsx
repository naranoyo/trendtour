// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-linear-to-br from-emerald-700 to-teal-600 p-8 text-white shadow-lg">
        <p className="mb-3 text-sm font-semibold opacity-90">
          探究研究向け コンテンツツーリズム分析アプリ
        </p>

        <h2 className="mb-4 text-4xl font-bold">TrendTour</h2>

        <p className="max-w-3xl text-base leading-8 opacity-95">
          アニメ・漫画・映画・ドラマなどの地域イベントを記録し、
          観光客数や経済効果を分析できるアプリです。
          CSV取込、グラフ分析、AI予測、レポート作成まで行えます。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/records"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow hover:bg-emerald-50"
          >
            データを登録する
          </Link>

          <Link
            href="/graph"
            className="rounded-xl border border-white/70 px-5 py-3 font-semibold text-white hover:bg-white/10"
          >
            グラフを見る
          </Link>
        </div>
      </section>

      {/* Menu Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
        <Link
          href="/records"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">📝</div>

          <h3 className="mb-2 text-lg font-bold">データ登録</h3>

          <p className="text-sm leading-6 text-slate-600">
            コンテンツツーリズムのイベント情報を 画面から登録・編集できます。
          </p>
        </Link>

        <Link
          href="/import"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">📄</div>

          <h3 className="mb-2 text-lg font-bold">CSV取込</h3>

          <p className="text-sm leading-6 text-slate-600">
            CSV・Excelファイルから イベントデータを一括で取り込みます。
          </p>
        </Link>

        <Link
          href="/graph"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">📊</div>

          <h3 className="mb-2 text-lg font-bold">グラフ分析</h3>

          <p className="text-sm leading-6 text-slate-600">
            観光客数や経済効果をグラフ化し、
            コンテンツごとの比較分析を行います。
          </p>
        </Link>

        <Link
          href="/prediction"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 text-3xl">🤖</div>

          <h3 className="mb-2 text-lg font-bold">AI予測</h3>

          <p className="text-sm leading-6 text-slate-600">
            過去データをもとに、 観光客数や経済効果を予測します。
          </p>
        </Link>

        <Link
          href="/report"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:col-span-2"
        >
          <div className="mb-3 text-3xl">📑</div>

          <h3 className="mb-2 text-lg font-bold">レポート</h3>

          <p className="text-sm leading-6 text-slate-600">
            集計結果をレポートとして表示・印刷できます。
          </p>
        </Link>
      </section>
    </div>
  );
}
