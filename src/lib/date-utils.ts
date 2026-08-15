/**
 * Local-time date helpers. Everything user-facing in GoalPilot is keyed by a
 * LOCAL calendar day ("yyyy-MM-dd") — never by UTC, which shifts habit logs and
 * calendar days for anyone not on GMT.
 */

export function dayKey(input: Date | string = new Date()): string {
  const d = typeof input === "string" ? parseAny(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

/** Parse "yyyy-MM-dd" (or a full ISO string) into a local Date at midnight. */
export function fromDayKey(key: string): Date {
  const [y, m, d] = key.slice(0, 10).split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** Tolerant parser: handles "yyyy-MM-dd", local ISO and full ISO with zone. */
export function parseAny(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return fromDayKey(value);
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function addDaysKey(key: string, days: number): string {
  const d = fromDayKey(key);
  d.setDate(d.getDate() + days);
  return dayKey(d);
}

export function diffDays(aKey: string, bKey: string): number {
  const a = fromDayKey(aKey).getTime();
  const b = fromDayKey(bKey).getTime();
  return Math.round((a - b) / 86_400_000);
}

/** Normalize a time-ish string to strict "HH:mm". Returns undefined if invalid. */
export function normalizeTime(value?: string | null): string | undefined {
  if (!value) return undefined;
  const m = value.trim().match(/^(\d{1,2}):?(\d{2})?/);
  if (!m) return undefined;
  let h = Number(m[1]);
  const min = Number(m[2] ?? "0");
  if (!Number.isFinite(h) || !Number.isFinite(min)) return undefined;
  if (h > 23) h = 23;
  return `${String(h).padStart(2, "0")}:${String(Math.min(59, min)).padStart(2, "0")}`;
}

export function timeToMinutes(time?: string): number | undefined {
  const t = normalizeTime(time);
  if (!t) return undefined;
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.round(minutes)));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(clamped % 60).padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const base = timeToMinutes(time) ?? 0;
  return minutesToTime(base + minutes);
}

/** Local ISO-ish timestamp used for calendar events: "yyyy-MM-ddTHH:mm:00". */
export function localStamp(key: string, time: string): string {
  return `${key.slice(0, 10)}T${normalizeTime(time) ?? "09:00"}:00`;
}

export function formatHours(minutes: number): string {
  if (minutes <= 0) return "0h";
  const h = minutes / 60;
  return h < 10 ? `${Math.round(h * 10) / 10}h` : `${Math.round(h)}h`;
}
