/**
 * Parse a single comparable "years" figure from free text (first numeric token).
 * Prefer {@link parseExperienceYearBounds} for filtering ranges like "4-7 Years".
 */
export function parseExperienceYears(value: string | undefined | null): number | null {
  if (value == null || value === "") return null;
  const nums = String(value).match(/\d+(\.\d+)?/g);
  if (!nums?.length) return null;
  const parsed = nums.map((x) => Number(x)).filter(Number.isFinite);
  if (!parsed.length) return null;
  return parsed[0];
}

/**
 * Lower/upper year bounds for filtering.
 * - "4-7 Years" / "8-12 Years" → overlapping range
 * - "5 years", "4" → single point
 */
export function parseExperienceYearBounds(
  value: string | undefined | null,
): { low: number; high: number } | null {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  const rangeMatch = s.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const a = Number(rangeMatch[1]);
    const b = Number(rangeMatch[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) {
      return { low: Math.min(a, b), high: Math.max(a, b) };
    }
  }
  const n = parseExperienceYears(s);
  if (n === null) return null;
  return { low: n, high: n };
}
