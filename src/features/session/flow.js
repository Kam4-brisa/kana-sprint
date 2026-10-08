// Session lifecycle: start, advance, finish, pause and exit.
import { sfx } from "../../core/audio.js";
import { ITEMS, lab } from "../../core/catalog.js";
import { daily, hist, markDay, nextLesson, S, save } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $ } from "../../core/utils.js";
import { allQs } from "../challenge.js";
import { renderHome } from "../home.js";
import { renderIntro } from "./lesson.js";
import { renderQ } from "./question.js";
import { timerPause, timerResume, timerStop } from "./timer.js";
import { finishWrite } from "../write/write.js";
import { confetti } from "../../ui/effects.js";

export function begin(r) {
  st.run = Object.assign(r, {
    ii: 0,
    i: 0,
    ok: 0,
    bad: 0,
    combo: 0,
    best: 0,
    xp: 0,
    missed: [],
    extra: 0,
    goalHit: false,
    phase: r.intro.length ? "intro" : "q",
    t0: Date.now(),
  });
  st.paused = false;
  $("#pauseOv").hidden = true;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  st.run.phase === "intro" ? renderIntro() : renderQ();
}

export function setFill() {
  if (st.run.endless) {
    $("#fill").style.width = ((st.run.i % 10) / 10) * 100 + "%";
    return;
  }
  const tot = st.run.intro.length + st.run.qs.length;
  $("#fill").style.width = ((st.run.ii + st.run.i) / tot) * 100 + "%";
}

export function empty(ic, h, p, lessonBtn) {
  st.run = { phase: "end", kind: "empty", intro: [], qs: [] };
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#fill").style.width = "0";
  $("#stage").innerHTML =
    `<div class="empty enter"><i class="ph ${ic}"></i><h2>${h}</h2><p>${p}</p><div class="ctas">${lessonBtn ? `<button class="btn primary" id="rPrimary" data-lesson="${nextLesson() || "h-vog"}">Fazer a lição</button>` : ""}<button class="btn ghost" data-home>Voltar</button></div></div>`;
}

export function addXP(g) {
  const d = daily(),
    before = d.xp;
  d.xp += g;
  S.xp += g;
  st.run.xp += g;
  hist().xp += g;
  if (before < S.set.goal && d.xp >= S.set.goal) st.run.goalHit = true;
}

export function advance() {
  if (!st.run || (st.run.phase !== "fb" && st.run.phase !== "lock")) return;
  if (Date.now() - st.lastKey < 150) return;
  st.lastKey = Date.now();
  st.run.phase = "adv";
  st.run.i++;
  if (st.run.endless && st.run.i >= st.run.qs.length - 3) st.run.qs.push(...allQs(10));
  st.run.i >= st.run.qs.length ? finish() : renderQ();
}

export function finish() {
  st.run.phase = "end";
  timerStop();
  $("#fill").style.width = "100%";
  if (st.run.kind === "lesson") S.done[st.run.lid] = true;
  markDay();
  hist().secs += Math.round((Date.now() - st.run.t0) / 1000);
  save();
  sfx("done");
  const tot = st.run.ok + st.run.bad,
    acc = tot ? Math.round((st.run.ok / tot) * 100) : 0,
    secs = Math.round((Date.now() - st.run.t0) / 1000);
  const msg =
    acc === 100
      ? "Perfeito!"
      : acc >= 80
        ? "Mandou bem."
        : acc >= 50
          ? "Tá pegando o jeito."
          : "Começo é assim mesmo.";
  const sub =
    acc === 100
      ? "Nenhum erro. Seu cérebro estava afiado."
      : acc >= 50
        ? "As que você errou vão aparecer mais vezes até grudar."
        : "Errar faz parte. As cartas difíceis vão voltar com mais frequência.";
  const nl = nextLesson(),
    d = daily();
  const primary =
    st.run.kind === "lesson" && nl
      ? `<button class="btn primary" id="rPrimary" data-lesson="${nl}"><i class="ph-bold ph-arrow-right"></i>Próxima lição</button>`
      : `<button class="btn primary" id="rPrimary" ${st.run.kind === "lesson" ? `data-lesson="${st.run.lid}"` : `data-mode="${st.run.mode === "all" ? "allAgain" : st.run.mode}"`}><i class="ph-bold ph-arrow-clockwise"></i>Mais uma</button>`;
  $("#stage").innerHTML = `<div class="result enter">
    <h2>${st.run.goalHit ? "Meta do dia batida!" : msg}</h2>
    <p class="gl">${st.run.goalHit ? `${msg} ${sub}` : sub}</p>
    <div class="rstats"><div><b>${acc}%</b><span>acertos</span></div><div><b>+${st.run.xp}</b><span>XP</span></div><div><b>${secs < 60 ? secs + "s" : Math.floor(secs / 60) + "m " + (secs % 60) + "s"}</b><span>de foco</span></div></div>
    <p class="gl">Meta de hoje: ${Math.min(d.xp, S.set.goal)} de ${S.set.goal} XP. Sequência: ${S.streak} ${S.streak === 1 ? "dia" : "dias"}.</p>
    ${
      st.run.missed.length
        ? `<div><p class="gl" style="margin-bottom:10px">Para prestar atenção:</p><div class="miss">${st.run.missed
            .map((id) => {
              const m = ITEMS[id];
              return `<button class="jp" data-say="${m.say}">${m.q}<small>${lab(m)}</small></button>`;
            })
            .join("")}</div></div>`
        : ""
    }
    <div class="ctas" style="justify-content:center">${primary}<button class="btn ghost" data-home>Início</button></div></div>`;
  if (st.run.goalHit) confetti();
}

export function quit() {
  timerStop();
  clearInterval(st.exTick);
  st.W = null;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  st.run = null;
  st.paused = false;
  $("#pauseOv").hidden = true;
  document.body.classList.remove("playing");
  renderHome();
}

export function pause() {
  if (!st.run || !["q", "intro", "fb", "lock", "eq", "efb"].includes(st.run.phase) || st.paused)
    return;
  st.paused = true;
  timerPause();
  if (st.run.deadline) st.run.remain = st.run.deadline - Date.now();
  $("#pauseOv").hidden = false;
  $("#resumeBtn").focus();
}

export function resume() {
  if (!st.paused) return;
  st.paused = false;
  $("#pauseOv").hidden = true;
  timerResume();
  if (st.run && st.run.deadline && st.run.remain != null) {
    st.run.deadline = Date.now() + st.run.remain;
    st.run.remain = null;
  }
  if (st.run && st.run.phase === "lock") advance();
}

export const exitRun = () => {
  if (
    st.run &&
    (st.run.endless || st.run.mode === "all") &&
    st.run.phase !== "end" &&
    st.run.ok + st.run.bad > 0
  )
    return finish();
  if (st.run && st.run.kind === "write" && st.run.phase !== "end" && st.run.ok + st.run.bad > 0)
    return finishWrite();
  quit();
};
