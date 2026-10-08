// Progress page: XP history, totals and most missed items.
import { ITEMS, lab, SCRIPT } from "../core/catalog.js";
import { box, S, seenIds } from "../core/store.js";
import { $ } from "../core/utils.js";

export function renderStats() {
  const days = Array.from({ length: 14 }, (_, i) => {
    const t = new Date(Date.now() - (13 - i) * 864e5),
      k = t.toDateString(),
      h = (S.hist || {})[k];
    return { xp: h ? h.xp : 0, l: t.getDate(), wd: "DSTQQSS"[t.getDay()] };
  });
  const mx = Math.max(50, ...days.map((d) => d.xp)),
    CW = 560,
    H = 150,
    bw = CW / 14;
  const bars = days
    .map((d, i) => {
      const h = (d.xp / mx) * (H - 26);
      return `<g><rect x="${i * bw + 6}" y="${H - 18 - h}" width="${bw - 12}" height="${Math.max(h, d.xp ? 3 : 0)}" rx="4" fill="var(--accent)" opacity="${i === 13 ? 1 : 0.75}"><title>${d.xp} XP</title></rect>${d.xp ? `<text x="${i * bw + bw / 2}" y="${H - 22 - h}" text-anchor="middle" font-size="10" fill="var(--muted)">${d.xp}</text>` : ""}<text x="${i * bw + bw / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="var(--muted)">${d.l}</text></g>`;
    })
    .join("");
  const seen = seenIds(),
    dom = seen.filter((id) => box(id) >= 3).length,
    acc = S.tot ? Math.round((S.okc / S.tot) * 100) : 0;
  const secs = Object.values(S.hist || {}).reduce((a, h) => a + (h.secs || 0), 0),
    mins = Math.round(secs / 60);
  const per = ["h", "k", "j", "w"]
    .map((s) => {
      const all = Object.values(ITEMS).filter((x) => x.s === s),
        d = all.filter((x) => box(x.id) >= 3).length;
      return `<div><b>${d}</b><span>de ${all.length}</span><small>${SCRIPT[s]}</small></div>`;
    })
    .join("");
  const worst = seen
    .filter((id) => S.srs[id].bad > 0)
    .sort((a, b) => S.srs[b].bad - S.srs[a].bad)
    .slice(0, 10);
  $("#stats").innerHTML = `
    <div class="schart"><h3>XP nos últimos 14 dias</h3><svg viewBox="0 0 ${CW} ${H}" role="img" aria-label="XP por dia nos últimos 14 dias">${bars}</svg></div>
    <div class="snums"><div><b>${seen.length}</b><span>cartas vistas</span></div><div><b>${dom}</b><span>dominadas</span></div><div><b>${acc}%</b><span>de acertos</span></div><div><b>${mins < 60 ? mins + " min" : Math.floor(mins / 60) + "h " + (mins % 60) + "min"}</b><span>de estudo</span></div></div>
    <div class="sper">${per}</div>
    <div class="sworst"><h3>Os que você mais erra</h3>${
      worst.length
        ? `<div class="miss">${worst
            .map((id) => {
              const m = ITEMS[id];
              return `<button class="jp" data-say="${m.say}" title="${S.srs[id].bad} erros">${m.q}<small>${lab(m)} · ${S.srs[id].bad}x</small></button>`;
            })
            .join("")}</div>`
        : `<p class="note">Nenhum erro ainda. Quando aparecerem, eles ficam listados aqui.</p>`
    }</div>`;
}
