/** Turn a clause-type ink hex into an rgba() string for tints/highlights. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || '').replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return [110, 116, 131]; // fallback slate
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function tint(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}
