// Guided lessons: introduce new items, then quiz them.
import { AUD, speak } from "../../core/audio.js";
import { ITEMS, LESSONS, SCRIPT, voc, writable } from "../../core/catalog.js";
import { S, save, seenIds } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $, shuffle } from "../../core/utils.js";
import { begin, setFill } from "./flow.js";
import { pickType, renderQ } from "./question.js";
import { timerStop } from "./timer.js";
import { kyomi } from "../../ui/kanji-info.js";

export function startLesson(lid) {
  const L = LESSONS[lid];
  if (!L) return;
  const intro = L.ids.filter((id) => !S.srs[id]);
  const a = shuffle(L.ids.map((id) => ({ id, t: "rec" })));
  const b = shuffle(L.ids.map((id) => ({ id, t: AUD() && Math.random() < 0.4 ? "aud" : "rev" })));
  const rv = seenIds()
    .filter((id) => !L.ids.includes(id) && ITEMS[id].s === L.s)
    .sort((x, y) => S.srs[x].due - S.srs[y].due)
    .slice(0, 3)
    .map((id) => ({ id, t: pickType(id) }));
  const qs = [...a];
  b.forEach((q, i) => {
    qs.push(q);
    if (rv[i]) qs.push(rv[i]);
  });
  begin({
    kind: "lesson",
    lid,
    title: L.title + (L.s === "w" ? "" : " · " + SCRIPT[L.s]),
    qs,
    intro,
  });
}

export function renderIntro() {
  timerStop();
  setFill();
  const it = ITEMS[st.run.intro[st.run.ii]],
    w = voc(it),
    ww = it.s === "w",
    last = st.run.ii === st.run.intro.length - 1;
  if (!S.srs[it.id]) {
    S.srs[it.id] = { b: 0, due: Date.now(), ok: 0, bad: 0 };
    save();
  }
  $("#stage").innerHTML = `<div class="ptitle">${st.run.title}</div>
   <div class="intro enter">
     <div class="pips">${st.run.intro.map((_, i) => `<span class="${i <= st.run.ii ? "on" : ""}"></span>`).join("")}</div>
     <button class="introcard" data-say="${it.say}" aria-label="Ouvir ${it.q}">
       ${AUD() ? '<i class="ph ph-speaker-high"></i>' : ""}
       <span class="g jp ${ww ? "word" : ""}">${it.q}</span>
       <span class="r">${w ? it.r : it.label}</span>${w && !S.set.romaji ? `<span class="m">${it.a}</span>` : ""}
     </button>
     ${kyomi(it)}
     <p class="mn">${ww ? `Toque no cartão para ouvir. Repita em voz alta, ajuda a gravar.` : it.mn}</p>
     ${writable(it) ? `<button class="btn ghost" data-demo="${it.id}" style="padding:10px 18px"><i class="ph ph-pencil-simple"></i>Ver como escreve</button>` : ""}
     <button class="btn primary" id="introNext">${last ? "Testar agora" : "Próxima"} <kbd>Espaço</kbd></button>
   </div>`;
  if (S.set.voice) speak(it.say);
}

export function nextIntro() {
  if (st.run.phase !== "intro" || Date.now() - st.lastKey < 200) return;
  st.lastKey = Date.now();
  st.run.ii++;
  if (st.run.ii >= st.run.intro.length) {
    st.run.phase = "q";
    renderQ();
  } else renderIntro();
}
