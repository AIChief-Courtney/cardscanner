/** Build last N UTC calendar days (oldest → newest) with zero-filled counts. */
export function dayKeys(days: number): string[] {
  const keys: string[] = [];
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

export function bucketByUtcDay(dates: Date[], days: number): { date: string; count: number }[] {
  const keys = dayKeys(days);
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const dt of dates) {
    const key = dt.toISOString().slice(0, 10);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return keys.map((date) => ({ date, count: counts.get(date) ?? 0 }));
}