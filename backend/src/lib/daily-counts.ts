import { db } from "@backend/lib/db";
import { dayKeys } from "@backend/lib/charts";

type DayRow = { day: string; count: bigint };

function mergeDayRows(keys: string[], rows: DayRow[]) {
  const map = new Map(rows.map((r) => [r.day, Number(r.count)]));
  return keys.map((date) => ({ date, count: map.get(date) ?? 0 }));
}

export async function activityDailyCounts(days: number) {
  const keys = dayKeys(days);
  const since = new Date(`${keys[0]}T00:00:00.000Z`);
  const rows = await db.$queryRaw<DayRow[]>`
    SELECT to_char(("createdAt" AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day,
           COUNT(*)::bigint AS count
    FROM "Activity"
    WHERE "createdAt" >= ${since}
    GROUP BY 1
  `;
  return mergeDayRows(keys, rows);
}

export async function userSignupDailyCounts(days: number) {
  const keys = dayKeys(days);
  const since = new Date(`${keys[0]}T00:00:00.000Z`);
  const rows = await db.$queryRaw<DayRow[]>`
    SELECT to_char(("createdAt" AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day,
           COUNT(*)::bigint AS count
    FROM "User"
    WHERE "createdAt" >= ${since}
    GROUP BY 1
  `;
  return mergeDayRows(keys, rows);
}