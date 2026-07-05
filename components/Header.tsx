// components/Header.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { href: "/", label: "ホーム" },
    { href: "/records", label: "一覧" },
    { href: "/import", label: "CSV取込" },
    { href: "/graph", label: "グラフ分析" },
    { href: "/prediction", label: "AI予測" },
    { href: "/report", label: "PDFレポート" },
  ];

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white">
              🌾
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">TrendTour</h1>

              <p className="text-sm text-slate-500">
                観光客数・売上・イベント効果分析
              </p>
            </div>
          </Link>

          {/* PCメニュー */}
          <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
            {menus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="text-slate-700 transition hover:text-emerald-700"
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          {/* スマホメニュー */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-lg p-2 text-2xl md:hidden"
            aria-label="メニューを開く"
          >
            ☰
          </button>
        </div>

        {/* スマホドロワー */}
        {isOpen && (
          <nav className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {menus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {menu.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
