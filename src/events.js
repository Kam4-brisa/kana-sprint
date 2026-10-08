// Global event wiring: clicks, forms, keyboard shortcuts and visibility.
import { speak } from "./core/audio.js";
import { ITEMS } from "./core/catalog.js";
import { S, save } from "./core/store.js";
import { st } from "./core/state.js";
import { $, $$ } from "./core/utils.js";
import { startAll } from "./features/challenge.js";
import { examAnswer, examIntro, examNext, startExam } from "./features/exam/exam.js";
import { toggleFuri } from "./features/exam/furigana.js";
import { gramIntro, startGram } from "./features/grammar.js";
import { renderHome, toggleAud, toggleRom } from "./features/home.js";
import { advance, exitRun, pause, quit, resume } from "./features/session/flow.js";
import { nextIntro, startLesson } from "./features/session/lesson.js";
import { startMode } from "./features/session/modes.js";
import { answer } from "./features/session/question.js";
import { renderTable } from "./features/table.js";
import {
  animateOrder,
  demoInline,
  renderWrite,
  startWrite,
  writeDone,
  writeNext,
  writeSubmit,
} from "./features/write/write.js";
import { applyTheme, isDark } from "./ui/theme.js";

export function initEvents() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button,[data-say]");
    if (!t) return;
    if (t.dataset.say !== undefined && !t.dataset.lesson) {
      speak(t.dataset.say);
      if (!t.classList.contains("introcard")) return;
    }
    if (t.dataset.lesson) return startLesson(t.dataset.lesson);
    if (t.dataset.exam) return examIntro(t.dataset.exam);
    if (t.dataset.gram) return gramIntro(t.dataset.gram);
    if (t.dataset.gstart) return startGram(t.dataset.gstart);
    if (t.dataset.demo) return demoInline(t.dataset.demo, t);
    if (t.dataset.write) {
      const id = t.dataset.write;
      return startWrite([id], "Escrever " + ITEMS[id].q);
    }
    if (t.id === "furiBtn") {
      toggleFuri();
      return;
    }
    if (t.classList.contains("romBtn")) return toggleRom();
    if (t.id === "wShow") return animateOrder();
    if (t.id === "wGuide") {
      if (!st.W) return;
      st.W.guide = !st.W.guide;
      $("#wGhost").style.opacity = st.W.guide ? "" : "0";
      t.querySelector("span").textContent = st.W.guide ? "Esconder guia" : "Mostrar guia";
      return;
    }
    if (t.id === "wRedo") {
      if (!st.W || st.W.anim) return;
      st.W.done = 0;
      st.W.fails = 0;
      $("#wInk").innerHTML = "";
      $("#wHint").innerHTML = "";
      $("#wAfter").innerHTML = "";
      st.W.lock = false;
      st.run.phase = "w";
      if (st.W.strokes) $("#wInfo").textContent = "Desenhe o traço 1.";
      return;
    }
    if (t.id === "wNext") return writeNext();
    if (t.id === "wAgain") {
      st.run.phase = "w";
      return renderWrite();
    }
    if (t.id === "wSelfOk" || t.id === "wSelfBad") {
      st.W.miss = t.id === "wSelfOk" ? 0 : 3;
      st.W.strokes = st.W.strokes || [1];
      return writeDone();
    }
    if (t.dataset.full) {
      st.ALLCFG = { s: { h: false, k: false, j: false, w: false }, len: -1 };
      st.ALLCFG.s[t.dataset.full] = true;
      return startAll();
    }
    if (t.dataset.estart) return startExam(t.dataset.estart, t.dataset.emode);
    if (t.classList.contains("eopt")) return examAnswer(+t.dataset.i);
    if (t.id === "eNext") return examNext();
    if (t.dataset.mode) return startMode(t.dataset.mode);
    if (t.dataset.home !== undefined) return quit();
    if (t.dataset.tab) {
      st.pathTab = t.dataset.tab;
      return renderHome();
    }
    if (t.dataset.tt) {
      st.tblTab = t.dataset.tt;
      st.selCell = null;
      return renderTable();
    }
    if (t.dataset.cell) {
      st.selCell = t.dataset.cell;
      renderTable();
      speak(ITEMS[st.selCell].say);
      return;
    }
    if (t.classList.contains("opt")) return answer(t.dataset.id);
    if (t.id === "introNext") return nextIntro();
    if (t.id === "contBtn") return advance();
  });
  $("#pvCard").addEventListener("click", () => speak($("#pvCard").dataset.say));
  document.addEventListener("submit", (e) => {
    if (e.target.id === "tf") {
      e.preventDefault();
      answer($("#ti").value);
    }
    if (e.target.id === "wForm") {
      e.preventDefault();
      writeSubmit(new FormData(e.target));
    }
    if (e.target.id === "allForm") {
      e.preventDefault();
      const f = new FormData(e.target);
      st.ALLCFG.s = { h: false, k: false, j: false, w: false };
      f.getAll("s").forEach((k) => (st.ALLCFG.s[k] = true));
      st.ALLCFG.len = +f.get("len");
      startAll();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("playing") || $("#setDlg").open) return;
    const k = e.key.toLowerCase();
    if (st.paused) {
      if (k === "enter" || k === " " || k === "p") {
        e.preventDefault();
        resume();
      }
      return;
    }
    if (k === "escape") return exitRun();
    if (e.target.tagName === "INPUT") return;
    if (k === "p") {
      e.preventDefault();
      return pause();
    }
    if (k === "r") {
      const s = $("#stage [data-say]");
      if (s) speak(s.dataset.say);
      return;
    }
    if (!st.run) return;
    if (st.run.phase === "intro" && (k === " " || k === "enter" || k === "arrowright")) {
      e.preventDefault();
      nextIntro();
    } else if (st.run.phase === "q") {
      const n = +e.key;
      if (n >= 1 && n <= 4) {
        const b = $$(".opt")[n - 1];
        if (b) {
          e.preventDefault();
          answer(b.dataset.id);
        }
      }
    } else if (st.run.phase === "fb" && (k === "enter" || k === " ")) {
      e.preventDefault();
      advance();
    } else if (st.run.phase === "eq") {
      const n = +e.key;
      if (n >= 1 && n <= 4) {
        const b = $$(".eopt")[n - 1];
        if (b) {
          e.preventDefault();
          examAnswer(+b.dataset.i);
        }
      }
    } else if (st.run.phase === "efb" && (k === "enter" || k === " ")) {
      e.preventDefault();
      examNext();
    } else if (st.run.phase === "wdone" && (k === "enter" || k === " ")) {
      e.preventDefault();
      writeNext();
    } else if (st.run.phase === "end" && k === "enter") {
      e.preventDefault();
      $("#rPrimary")?.click();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && document.body.classList.contains("playing")) pause();
  });
  $("#quitBtn").onclick = exitRun;
  $$(".audBtn").forEach((b) => (b.onclick = toggleAud));
  $("#pauseBtn").onclick = pause;
  $("#resumeBtn").onclick = resume;
  $("#themeBtn").onclick = () => {
    S.set.theme = isDark() ? "light" : "dark";
    applyTheme();
    save();
    renderHome();
  };
}
