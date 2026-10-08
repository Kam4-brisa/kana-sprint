// Grammar topics: short explanation followed by exercises.
import { AUD } from "../core/audio.js";
import { S } from "../core/store.js";
import { st } from "../core/state.js";
import { $, shuffle } from "../core/utils.js";
import { GRAM } from "../data/grammar.js";
import { renderExamQ } from "./exam/exam.js";
import { timerStop } from "./session/timer.js";

export function renderGram() {
  S.gram = S.gram || {};
  $("#gram").innerHTML = GRAM.map((g) => {
    const b = S.gram[g.id];
    return `<button class="gcard" data-gram="${g.id}"><span class="gt jp">${g.t}</span><span class="gd">${g.d}</span><span class="best">${b ? `<i class="ph-fill ph-check-circle"></i>Melhor: ${b.best}%` : `<i class="ph ph-book-open"></i>${g.q.length} exercícios`}</span></button>`;
  }).join("");
}

export function gramIntro(id) {
  const g = GRAM.find((x) => x.id === id);
  st.run = { phase: "setup", kind: "setup", intro: [], qs: [] };
  st.paused = false;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#fill").style.width = "0";
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  $("#stage").innerHTML = `<div class="setup enter">
    <div class="esec">Gramática</div><h2 class="jp">${g.t}</h2>
    <p style="font-size:18px;line-height:1.6">${g.e}</p>
    <div class="gex">${g.x.map(([jp, pt]) => `<div><span class="jp">${jp}</span><small>${pt}</small>${AUD() ? `<button class="iconbtn" data-say="${jp}" aria-label="Ouvir"><i class="ph ph-speaker-high"></i></button>` : ""}</div>`).join("")}</div>
    <div class="ctas"><button class="btn primary" data-gstart="${id}"><i class="ph-bold ph-play"></i>Praticar</button><button class="btn ghost" data-home>Voltar</button></div></div>`;
}

export function startGram(id) {
  const g = GRAM.find((x) => x.id === id);
  const qs = shuffle(
    g.q.map((q) => {
      const o = q.o.map((t, i) => ({ t, ok: i === 0 }));
      return Object.assign({ s: "bunpo" }, q, { opts: shuffle(o) });
    }),
  );
  st.run = {
    kind: "exam",
    gid: id,
    lv: null,
    mode: "treino",
    qs,
    intro: [],
    i: 0,
    ok: 0,
    bad: 0,
    combo: 0,
    best: 0,
    xp: 0,
    picks: [],
    phase: "eq",
    t0: Date.now(),
    title: g.t,
  };
  st.paused = false;
  $("#pauseOv").hidden = true;
  renderExamQ();
}
