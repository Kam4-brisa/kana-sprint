// Kana and kanji tables with the detail panel.
import { AUD } from "../core/audio.js";
import { DK, H10, ITEMS, lab, LESSONS, ORDER, rowById, writable } from "../core/catalog.js";
import { box, S } from "../core/store.js";
import { st } from "../core/state.js";
import { $, $$ } from "../core/utils.js";
import { YOON } from "../data/kana.js";
import { kyomi } from "../ui/kanji-info.js";

export function renderTable() {
  $$("#tblTabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.tt === st.tblTab));
  const cellId = (id) => {
    const it = ITEMS[id];
    return `<button class="kc c${box(id) + 1} ${st.selCell === id ? "sel" : ""}" data-cell="${id}" aria-label="${it.q}, ${lab(it)}"><span class="jp">${it.q}</span><small>${it.s === "j" ? lab(it).split(",")[0] : it.label}</small></button>`;
  };
  if (st.tblTab === "j") {
    const ids = ORDER.filter((l) => l[0] === "j").flatMap((l) => LESSONS[l].ids);
    $("#kgrid").innerHTML = `<div class="kgrid jp">${ids.map(cellId).join("")}</div>`;
    if (!st.selCell || st.selCell[0] !== "j") st.selCell = ids[0];
  } else {
    const cell = ([, hi, ka]) => cellId(st.tblTab + (st.tblTab === "h" ? hi : ka));
    const gap = '<div class="kgap"></div>';
    let main = "",
      dk = "";
    H10.forEach((r) => {
      const l = rowById[r][2];
      if (r === "y") main += cell(l[0]) + gap + cell(l[1]) + gap + cell(l[2]);
      else if (r === "w")
        main += cell(l[0]) + gap + gap + gap + cell(l[1]) + cell(l[2]) + gap + gap + gap + gap;
      else main += l.map(cell).join("");
    });
    DK.forEach((r) => (dk += rowById[r][2].map(cell).join("")));
    const yc = YOON.flatMap((y) => y[2])
      .map(cell)
      .join("");
    $("#kgrid").innerHTML =
      `<div class="kgrid jp">${main}</div><div class="kgrid jp">${dk}</div><div class="kgrid y3 jp">${yc}</div>`;
    if (!st.selCell || st.selCell[0] !== st.tblTab)
      st.selCell = st.tblTab + (st.tblTab === "h" ? "あ" : "ア");
  }
  $(`[data-cell="${st.selCell}"]`)?.classList.add("sel");
  const it = ITEMS[st.selCell],
    r = S.srs[st.selCell];
  const status = !r
    ? "Ainda não visto."
    : r.b >= 3
      ? `Dominado. Acertou ${r.ok} de ${r.ok + r.bad}.`
      : `Aprendendo. Acertou ${r.ok} de ${r.ok + r.bad}.`;
  $("#detail").innerHTML =
    `<div class="dg jp">${it.q}</div><div class="dr">${it.s === "j" ? `${it.a} <small style="color:var(--muted);font-weight:600">(${it.r})</small>` : it.label}</div>${kyomi(it)}<p>${it.mn}</p><div class="meta">${status}</div>
    <div class="ctas">${writable(it) ? `<button class="btn primary" data-write="${it.id}"><i class="ph ph-pencil-simple"></i>Escrever</button>` : ""}${AUD() ? `<button class="btn ghost" data-say="${it.say}"><i class="ph ph-speaker-high"></i>Ouvir</button>` : ""}</div>`;
}
