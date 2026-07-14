/** Pure text heuristics for rendering contract documents. */

/** True for markdown headings and short numbered section titles ("3.2 Term"). */
export function isHeading(text: string): boolean {
  const t = text.trim();
  if (/^#{1,6}\s/.test(t)) return true;
  return /^\d+(\.\d+)*\.?\s+\S/.test(t) && t.length <= 60 && !/[.:;]$/.test(t);
}

/** Strip markdown syntax (#, **) from a heading for display. */
export function displayHeading(text: string): string {
  return text
    .trim()
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '');
}

/** "02-employment-agreement.md" → "Employment Agreement". */
export function titleize(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').replace(/^\d+[-_\s]*/, '');
  const words = base.replace(/[-_]+/g, ' ').trim();
  return words.replace(/\b\w/g, (c) => c.toUpperCase());
}
