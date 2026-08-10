export interface TotalEntry {
  value: number;
  raw: string;
  lineIndex: number;
}

export interface TotalItem {
  label: string;
  total: number;
  count: number;
  entries: TotalEntry[];
}

// Matches lines like "Cement 50", "Saria: 200", "سیمنٹ 50", "सीमेंट - 100rs".
// \p{L}\p{M} covers Latin, Devanagari (Hindi) and Arabic (Urdu) letters.
const LINE_PATTERN =
  /^([\p{L}\p{M}][\p{L}\p{M}\s.,'’-]*?)[\s:\-=]+([0-9]+(?:\.[0-9]+)?)\s*(?:rs\.?|rupees?|rupaye|rupya|₹|\/-)?\s*$/iu;

export function parseTotals(text: string): TotalItem[] {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const map = new Map<string, TotalItem>();

  lines.forEach((rawLine, lineIndex) => {
    const line = rawLine.trim();
    if (!line) return;

    const match = line.match(LINE_PATTERN);
    if (!match) return;

    const rawLabel = match[1].trim().replace(/\s+/g, " ");
    const value = parseFloat(match[2]);
    if (!rawLabel || Number.isNaN(value)) return;

    // Group by lowercase (Latin) — Devanagari/Arabic scripts have no case,
    // so this naturally groups those too.
    const key = rawLabel.toLowerCase();
    const existing = map.get(key);
    const entry: TotalEntry = { value, raw: line, lineIndex };
    if (existing) {
      existing.total += value;
      existing.count += 1;
      existing.entries.push(entry);
    } else {
      map.set(key, {
        label: rawLabel,
        total: value,
        count: 1,
        entries: [entry],
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString("en-IN");
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
