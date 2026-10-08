// Stroke data from KanjiVG (CC BY-SA 3.0), downloaded on demand.

// dados de traços do KanjiVG (CC BY-SA 3.0), baixados sob demanda
export const KVG = "https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@r20240807/kanji/";

export const kvgCache = {};

export async function strokesOf(ch) {
  if (kvgCache[ch]) return kvgCache[ch];
  const hex = ch.codePointAt(0).toString(16).padStart(5, "0");
  const r = await fetch(KVG + hex + ".svg");
  if (!r.ok) throw new Error("sem dados");
  const doc = new DOMParser().parseFromString(await r.text(), "image/svg+xml");
  const ds = [...doc.querySelectorAll("path")].map((p) => p.getAttribute("d")).filter(Boolean);
  if (!ds.length) throw new Error("sem traços");
  return (kvgCache[ch] = ds);
}
