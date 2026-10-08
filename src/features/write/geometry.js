// Pure geometry helpers for stroke checking.

export function resample(pts, n) {
  if (pts.length < 2) return Array(n).fill(pts[0] || [0, 0]);
  const seg = [0];
  for (let i = 1; i < pts.length; i++)
    seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = seg[seg.length - 1] || 1,
    out = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const t = (L * i) / (n - 1);
    while (j < seg.length - 2 && seg[j + 1] < t) j++;
    const f = (t - seg[j]) / (seg[j + 1] - seg[j] || 1);
    out.push([
      pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f,
      pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f,
    ]);
  }
  return out;
}
