// lib/utils.ts

/**
 * 数値表示
 */
export function formatNumber(value: number | "" | undefined | null): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }

  return value.toLocaleString("ja-JP");
}

/**
 * 円表示
 */
export function formatYen(value: number | "" | undefined | null): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }

  return `¥${value.toLocaleString("ja-JP")}`;
}

/**
 * 日本の金額表示
 */
export function formatJapaneseMoney(
  value: number | "" | undefined | null
): string {
  if (value === "" || value === undefined || value === null) {
    return "-";
  }

  const oku = Math.floor(value / 100000000);
  const man = Math.floor((value % 100000000) / 10000);

  if (oku > 0 && man > 0) {
    return `${oku}億${man.toLocaleString()}万円`;
  }

  if (oku > 0) {
    return `${oku}億円`;
  }

  if (man > 0) {
    return `${man.toLocaleString()}万円`;
  }

  return `${value.toLocaleString()}円`;
}

/**
 * 1人当たり経済効果
 */
export function calcPerPerson(
  economicImpact: number | "" | undefined | null,
  visitors: number | "" | undefined | null
): number {
  if (
    economicImpact === "" ||
    visitors === "" ||
    economicImpact === undefined ||
    visitors === undefined ||
    economicImpact === null ||
    visitors === null ||
    visitors === 0
  ) {
    return 0;
  }

  return Math.round(economicImpact / visitors);
}
