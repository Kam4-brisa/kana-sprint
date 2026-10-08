// JLPT-style mock exams (practice and test modes, optional time limit).
import { AUD, sfx, speak, vib } from "../../core/audio.js";
import { hist, markDay, S, save } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $, $$, shuffle } from "../../core/utils.js";
import { EXAM_SECONDS, EXAMS, SEC, SECTION_ORDER } from "../../data/exams/index.js";
import { furi } from "./furigana.js";
import { addXP } from "../session/flow.js";
import { timerStop } from "../session/timer.js";
import { confetti } from "../../ui/effects.js";

export function renderExams() {
  S.exam = S.exam || {};
  $("#exams").innerHTML = Object.entries(EXAMS)
    .map(([lv, e]) => {
      const b = S.exam[lv];
      return `<button class="exam" data-exam="${lv}"><span class="lv">${lv}</span><p>${e.desc}</p><span class="best">${b ? `<i class="ph-fill ph-trophy"></i>Melhor: ${b.best}%` : `<i class="ph ph-clipboard-text"></i>${e.qs.length} questões`}</span></button>`;
    })
    .join("");
}

export function examIntro(lv) {
  const e = EXAMS[lv],
    nl = e.qs.filter((q) => q.s === "choukai").length;
  st.run = { phase: "setup", kind: "setup", intro: [], qs: [] };
  st.paused = false;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#fill").style.width = "0";
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  const secs = [...new Set(e.qs.map((q) => q.s))]
    .filter((s) => s !== "choukai" || AUD())
    .map((s) => SEC[s].split(" · ")[1])
    .join(", ");
  $("#stage").innerHTML = `<div class="setup enter">
    <h2>Simulado JLPT ${lv}</h2>
    <p class="gl" style="color:var(--muted);line-height:1.5">Banco com ${e.qs.length - (AUD() ? 0 : nl)} questões de: ${secs}. O modo completo usa todas.${nl && !AUD() ? ` As ${nl} de compreensão oral ficam de fora porque o áudio está desligado.` : ""}</p>
    <div class="field"><span class="lab" id="lEl">Tamanho</span><div class="seg" role="radiogroup" aria-labelledby="lEl">
      <label><input type="radio" name="elen" value="15" ${st.EXLEN === 15 ? "checked" : ""}><span>Rápido, 15 questões</span></label>
      <label><input type="radio" name="elen" value="0" ${st.EXLEN === 0 ? "checked" : ""}><span>Completo</span></label></div></div>
    <label class="sw" style="max-width:520px">Com tempo de prova (${EXAM_SECONDS[lv]} segundos por questão)<input type="checkbox" id="eTime" ${st.EXTIME ? "checked" : ""}></label>
    <div class="choice">
      <button data-estart="${lv}" data-emode="treino"><b>Treino</b><span>Vê se acertou e a explicação logo depois de cada questão.</span></button>
      <button data-estart="${lv}" data-emode="prova"><b>Prova</b><span>Responde tudo direto e vê o resultado só no final, como no dia.</span></button>
    </div>
    <p class="note">No JLPT de verdade a aprovação depende da nota em cada seção. Aqui 60% de acertos serve de referência.</p>
    <div class="ctas"><button class="btn ghost" data-home>Voltar</button></div></div>`;
}

export function startExam(lv, mode) {
  const r = document.querySelector('input[name="elen"]:checked');
  if (r) st.EXLEN = +r.value;
  const tb = $("#eTime");
  if (tb) st.EXTIME = tb.checked;
  let base = EXAMS[lv].qs.filter((q) => q.s !== "choukai" || AUD());
  if (st.EXLEN && base.length > st.EXLEN) base = shuffle(base.slice()).slice(0, st.EXLEN);
  base = base
    .slice()
    .sort(
      (a, b) =>
        SECTION_ORDER.indexOf(a.s) - SECTION_ORDER.indexOf(b.s) ||
        (a.p || "").localeCompare(b.p || ""),
    );
  const qs = base.map((q) => {
    const o = q.o.map((t, i) => ({ t, ok: i === 0 }));
    return Object.assign({}, q, { opts: shuffle(o) });
  });
  st.run = {
    kind: "exam",
    lv,
    mode,
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
    title: `JLPT ${lv}`,
  };
  if (st.EXTIME) {
    st.run.deadline = Date.now() + qs.length * EXAM_SECONDS[lv] * 1000;
    examTimerStart();
  }
  st.paused = false;
  $("#pauseOv").hidden = true;
  renderExamQ();
}

export function renderExamQ() {
  st.run.phase = "eq";
  const q = st.run.qs[st.run.i],
    fo = q.s !== "hyoki";
  $("#fill").style.width = (st.run.i / st.run.qs.length) * 100 + "%";
  const head = st.run.gid
    ? `Gramática: ${st.run.title} · ${st.run.i + 1} de ${st.run.qs.length}`
    : `Simulado JLPT ${st.run.lv} · ${st.run.i + 1} de ${st.run.qs.length}${st.run.mode === "prova" ? " · modo prova" : ""}`;
  $("#stage").innerHTML = `<div class="ex enter">
    <div class="ehead"><span class="ptitle">${head}</span>${st.run.deadline ? `<span class="etime" id="etime"></span>` : ""}${st.run.gid ? "" : `<button class="furiBtn ${S.set.furi ? "on" : ""}" id="furiBtn" aria-pressed="${!!S.set.furi}"><span class="jp">ふりがな</span></button>`}</div>
    <div class="esec">${SEC[q.s]}</div>
    ${q.p ? `<div class="passage jp">${furi(q.p)}</div>` : ""}
    ${q.say ? `<button class="speak" data-say="${q.say}" aria-label="Ouvir de novo" style="width:110px;height:110px;font-size:44px"><i class="ph-fill ph-speaker-high"></i></button>` : ""}
    <div class="eq jp">${furi(q.q)}</div>
    <div class="eopts">${q.opts.map((o, i) => `<button class="eopt jp" data-i="${i}"><kbd>${i + 1}</kbd><span>${fo ? furi(o.t) : o.t}</span></button>`).join("")}</div>
    <div id="eAfter" style="display:contents"></div></div>`;
  if (q.say) setTimeout(() => speak(q.say), 200);
}

export function skipListening() {
  st.run.qs.splice(st.run.i, 1);
  if (st.run.i >= st.run.qs.length) finishExam();
  else renderExamQ();
}

export function examAnswer(i) {
  if (!st.run || st.run.phase !== "eq") return;
  const q = st.run.qs[st.run.i],
    ok = q.opts[i].ok;
  st.run.picks[st.run.i] = i;
  if (ok) {
    st.run.ok++;
    addXP(5);
  } else st.run.bad++;
  hist().n++;
  if (ok) hist().ok++;
  $("#runXp").textContent = st.run.xp;
  const bs = $$(".eopt");
  bs.forEach((b) => (b.disabled = true));
  if (st.run.mode === "prova") {
    bs[i].classList.add("pick");
    st.run.phase = "lock";
    const tok = st.run;
    setTimeout(() => {
      if (st.run === tok && st.run.phase === "lock") {
        st.run.phase = "efb";
        examNext();
      }
    }, 250);
    return;
  }
  bs.forEach((b, j) => {
    if (q.opts[j].ok) b.classList.add("ok");
    else if (j === i) b.classList.add("bad");
  });
  ok ? (sfx("ok", st.run.ok), vib(12)) : (sfx("bad"), vib([30, 40, 30]));
  $("#eAfter").innerHTML =
    `<div class="exp enter"><b>${ok ? "Certo!" : "Resposta: " + q.opts.find((o) => o.ok).t}</b>${q.ex}</div><button class="btn primary" id="eNext" style="align-self:flex-start">Continuar <kbd>Enter</kbd></button>`;
  st.run.phase = "efb";
}

export function examNext() {
  if (!st.run || st.run.phase !== "efb") return;
  if (Date.now() - st.lastKey < 150) return;
  st.lastKey = Date.now();
  st.run.i++;
  st.run.i >= st.run.qs.length ? finishExam() : renderExamQ();
}

export function finishExam() {
  if (!st.run || st.run.phase === "end") return;
  st.run.phase = "end";
  $("#fill").style.width = "100%";
  clearInterval(st.exTick);
  const n = st.run.qs.length,
    pct = n ? Math.round((st.run.ok / n) * 100) : 0,
    pass = pct >= (st.run.gid ? 80 : 60);
  const store = st.run.gid ? (S.gram = S.gram || {}) : (S.exam = S.exam || {}),
    key = st.run.gid || st.run.lv;
  const prev = store[key];
  store[key] = { best: Math.max(pct, prev ? prev.best : 0), tries: (prev ? prev.tries : 0) + 1 };
  markDay();
  hist().secs += Math.round((Date.now() - st.run.t0) / 1000);
  save();
  sfx("done");
  const by = {};
  st.run.qs.forEach((q, i) => {
    const r = by[q.s] || (by[q.s] = { ok: 0, n: 0 });
    r.n++;
    if (q.opts[st.run.picks[i]]?.ok) r.ok++;
  });
  const wrong = st.run.qs.map((q, i) => ({ q, i })).filter((x) => !x.q.opts[st.run.picks[x.i]]?.ok);
  $("#stage").innerHTML = `<div class="result enter">
    <h2>${st.run.gid ? (pass ? "Você pegou o jeito!" : "Vale rever a explicação") : pass ? `Aprovado no simulado ${st.run.lv}!` : `Ainda não, mas está perto`}</h2>
    <p class="gl">${st.run.timeUp ? "O tempo acabou. As questões sem resposta contam como erro. " : ""}${st.run.gid ? (pass ? "Mais de 80% de acertos nesse ponto de gramática." : "Leia a explicação de novo e tente outra vez. Com 80% você domina.") : pass ? "Você passou da linha de referência de 60%." : "A linha de referência é 60%. Veja abaixo o que errou, é ali que você melhora."}</p>
    <div class="rstats"><div><b>${pct}%</b><span>acertos</span></div><div><b>${st.run.ok}/${n}</b><span>questões</span></div><div><b>+${st.run.xp}</b><span>XP</span></div></div>
    <div class="secs">${Object.entries(by)
      .map(([s, r]) => `<div><span>${SEC[s]}</span><b>${r.ok}/${r.n}</b></div>`)
      .join("")}</div>
    ${wrong.length ? `<div class="wrongs"><h3 style="font-size:20px">Para revisar</h3>${wrong.map(({ q }) => `<div class="w"><div class="jp">${furi(q.q)}</div><b class="jp">${q.opts.find((o) => o.ok).t}</b><p>${q.ex}</p></div>`).join("")}</div>` : ""}
    <div class="ctas" style="justify-content:center">${st.run.gid ? `<button class="btn primary" id="rPrimary" data-gstart="${st.run.gid}"><i class="ph-bold ph-arrow-clockwise"></i>Refazer</button><button class="btn ghost" data-gram="${st.run.gid}">Ver explicação</button>` : `<button class="btn primary" id="rPrimary" data-estart="${st.run.lv}" data-emode="${st.run.mode}"><i class="ph-bold ph-arrow-clockwise"></i>Refazer</button>`}<button class="btn ghost" data-home>Início</button></div></div>`;
  if (pass) confetti();
}

export function examTimerStart() {
  clearInterval(st.exTick);
  st.exTick = setInterval(() => {
    if (!st.run || st.run.kind !== "exam" || !st.run.deadline) {
      clearInterval(st.exTick);
      return;
    }
    if (st.paused || st.run.phase === "end") return;
    const left = Math.max(0, st.run.deadline - Date.now()),
      el = $("#etime");
    if (el) {
      const m = Math.floor(left / 60000),
        s = Math.floor(left / 1000) % 60;
      el.textContent = `${m}:${String(s).padStart(2, "0")}`;
      el.classList.toggle("low", left < 60000);
    }
    if (left <= 0) {
      clearInterval(st.exTick);
      st.run.timeUp = true;
      finishExam();
    }
  }, 500);
}
