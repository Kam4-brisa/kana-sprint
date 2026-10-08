// General challenge: everything mixed, or a full category once.
import { ITEMS, SCRIPT } from "../core/catalog.js";
import { box } from "../core/store.js";
import { st } from "../core/state.js";
import { $, shuffle } from "../core/utils.js";
import { begin } from "./session/flow.js";
import { pickType } from "./session/question.js";
import { timerStop } from "./session/timer.js";

export function allSetup() {
  st.run = { phase: "setup", kind: "setup", intro: [], qs: [] };
  st.paused = false;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#fill").style.width = "0";
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  const cnt = (s) => Object.values(ITEMS).filter((x) => x.s === s).length;
  const opt = [
    ["h", "あ", "Hiragana"],
    ["k", "ア", "Katakana"],
    ["j", "日", "Kanji"],
    ["w", "ねこ", "Palavras"],
  ];
  $("#stage").innerHTML = `<form class="setup enter" id="allForm">
    <h2>Desafio geral</h2>
    <div class="field"><span class="lab" id="lInc">O que entra</span>
      <div class="toggles" role="group" aria-labelledby="lInc">${opt.map(([k, g, t]) => `<label><input type="checkbox" name="s" value="${k}" ${st.ALLCFG.s[k] ? "checked" : ""}><span><b>${g}</b><span>${t}<small>${cnt(k)} itens</small></span></span></label>`).join("")}</div></div>
    <div class="field"><span class="lab" id="lQt">Quantas perguntas</span>
      <div class="seg" role="radiogroup" aria-labelledby="lQt">${[
        [20, "20"],
        [50, "50"],
        [100, "100"],
        [-1, "Todos, uma vez"],
        [0, "Sem fim"],
      ]
        .map(
          ([v, l]) =>
            `<label><input type="radio" name="len" value="${v}" ${st.ALLCFG.len == v ? "checked" : ""}><span>${l}</span></label>`,
        )
        .join("")}</div>
      <span class="help" style="font-size:13px;color:var(--muted)">No "Sem fim", aperte o X quando quiser parar e veja seu resultado.</span></div>
    <p class="err" id="allErr" role="alert"></p>
    <div class="ctas"><button class="btn primary" type="submit"><i class="ph-bold ph-play"></i>Começar</button><button class="btn ghost" type="button" data-home>Voltar</button></div>
  </form>`;
}

export function allQs(n) {
  const pool = Object.values(ITEMS).filter((x) => st.ALLCFG.s[x.s]);
  if (n < 0) return shuffle(pool.slice()).map((x) => ({ id: x.id, t: pickType(x.id) }));
  // itens fracos ou nunca vistos aparecem um pouco mais
  return shuffle(pool.slice())
    .sort((x, y) => (box(x.id) - box(y.id)) * 0.5 + (Math.random() - 0.5) * 4)
    .slice(0, n)
    .map((x) => ({ id: x.id, t: pickType(x.id) }));
}

export function startAll() {
  if (!Object.values(st.ALLCFG.s).some(Boolean)) {
    $("#allErr").textContent = "Escolha pelo menos uma opção.";
    return;
  }
  const endless = st.ALLCFG.len === 0;
  const only = Object.keys(st.ALLCFG.s).filter((k) => st.ALLCFG.s[k]);
  const title =
    st.ALLCFG.len < 0 && only.length === 1 ? `${SCRIPT[only[0]]} completo` : "Desafio geral";
  begin({
    kind: "mode",
    mode: "all",
    title,
    endless,
    qs: allQs(endless ? 15 : st.ALLCFG.len),
    intro: [],
  });
}
