// Writing practice: draw each stroke in order and get it checked.
import { AUD, sfx, speak, vib } from "../../core/audio.js";
import { ITEMS, lab, SCRIPT, writable } from "../../core/catalog.js";
import { box, hist, SRS_INTERVALS, markDay, S, save } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $, reduce, shuffle } from "../../core/utils.js";
import { addXP } from "../session/flow.js";
import { timerStop } from "../session/timer.js";
import { resample } from "./geometry.js";
import { strokesOf } from "./strokes.js";
import { burst } from "../../ui/effects.js";

export function writeSetup() {
  st.run = { phase: "setup", kind: "setup", intro: [], qs: [] };
  st.paused = false;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#fill").style.width = "0";
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  const cnt = (s) => Object.values(ITEMS).filter((x) => x.s === s && writable(x)).length;
  $("#stage").innerHTML = `<form class="setup enter" id="wForm">
    <h2>Escrever</h2>
    <p style="color:var(--muted);line-height:1.5">Desenhe cada traço na ordem certa, com o dedo ou o mouse. O site confere cada traço e mostra a dica se você travar.</p>
    <div class="field"><span class="lab" id="lWs">O que treinar</span><div class="seg" role="radiogroup" aria-labelledby="lWs">
      ${[
        ["h", "Hiragana"],
        ["k", "Katakana"],
        ["j", "Kanji"],
        ["seen", "Só o que já vi"],
      ]
        .map(
          ([v, l], i) =>
            `<label><input type="radio" name="ws" value="${v}" ${i === 0 ? "checked" : ""}><span>${l}${v !== "seen" ? ` (${cnt(v)})` : ""}</span></label>`,
        )
        .join("")}</div></div>
    <div class="field"><span class="lab" id="lWn">Quantos caracteres</span><div class="seg" role="radiogroup" aria-labelledby="lWn">
      ${[
        [5, "5"],
        [10, "10"],
        [0, "Todos em ordem"],
      ]
        .map(
          ([v, l], i) =>
            `<label><input type="radio" name="wn" value="${v}" ${i === 0 ? "checked" : ""}><span>${l}</span></label>`,
        )
        .join("")}</div></div>
    <p class="err" id="wErr" role="alert"></p>
    <div class="ctas"><button class="btn primary" type="submit"><i class="ph-bold ph-pencil-simple"></i>Começar</button><button class="btn ghost" type="button" data-home>Voltar</button></div></form>`;
}

export function startWrite(ids, title) {
  if (!ids.length) return;
  st.run = {
    kind: "write",
    title: title || "Escrever",
    qs: ids.map((id) => ({ id })),
    intro: [],
    i: 0,
    ok: 0,
    bad: 0,
    combo: 0,
    best: 0,
    xp: 0,
    missed: [],
    phase: "w",
    t0: Date.now(),
  };
  st.paused = false;
  $("#pauseOv").hidden = true;
  document.body.classList.add("playing");
  clearInterval(st.pvTimer);
  timerStop();
  $("#runXp").textContent = 0;
  window.scrollTo(0, 0);
  renderWrite();
}

// mostra a ordem dos traços dentro da lição, sem sair dela
export async function demoInline(id, btn) {
  const it = ITEMS[id],
    el = document.createElement("div");
  el.className = "wmini";
  btn.replaceWith(el);
  try {
    const ds = await strokesOf(it.q);
    el.innerHTML = `<svg viewBox="0 0 109 109" aria-label="Ordem dos traços de ${it.q}"><g class="mghost">${ds.map((d) => `<path d="${d}"/>`).join("")}</g><g class="mink"></g></svg><span>${ds.length} ${ds.length === 1 ? "traço" : "traços"}</span>`;
    const ink = el.querySelector(".mink");
    for (const d of ds) {
      ink.insertAdjacentHTML("beforeend", `<path d="${d}" class="animp" pathLength="1"/>`);
      await new Promise((r) => setTimeout(r, reduce ? 100 : 600));
    }
  } catch (e) {
    el.innerHTML = `<span>Sem internet para mostrar os traços agora.</span>`;
  }
}

export async function renderWrite() {
  const it = ITEMS[st.run.qs[st.run.i].id];
  $("#fill").style.width = (st.run.i / st.run.qs.length) * 100 + "%";
  $("#stage").innerHTML = `<div class="wr enter">
    <div class="ptitle">${st.run.title} · ${st.run.i + 1} de ${st.run.qs.length}</div>
    <div class="whead"><span class="jp wq">${it.q}</span><div><b>${lab(it)}</b><small id="wInfo">Carregando os traços...</small></div>${AUD() ? `<button class="iconbtn" data-say="${it.say}" aria-label="Ouvir"><i class="ph ph-speaker-high"></i></button>` : ""}</div>
    <div class="wbox" id="wbox"><svg viewBox="0 0 109 109" id="wsvg" aria-hidden="true"><g class="wgrid"><line x1="54.5" y1="0" x2="54.5" y2="109"/><line x1="0" y1="54.5" x2="109" y2="54.5"/></g><g id="wGhost"></g><g id="wInk"></g><g id="wHint"></g></svg><canvas id="wcv"></canvas></div>
    <div class="wtools">
      <button class="btn ghost" id="wShow"><i class="ph ph-play-circle"></i>Ver a ordem</button>
      <button class="btn ghost" id="wGuide"><i class="ph ph-eye"></i><span>Esconder guia</span></button>
      <button class="btn ghost" id="wRedo"><i class="ph ph-arrow-counter-clockwise"></i>Recomeçar</button>
    </div>
    <div id="wAfter" style="display:contents"></div></div>`;
  st.W = { it, strokes: null, done: 0, fails: 0, miss: 0, guide: true, pts: [], drawing: false };
  setupCanvas();
  try {
    st.W.strokes = await strokesOf(it.q);
    if (!st.W || st.W.it !== it) return;
    $("#wGhost").innerHTML = st.W.strokes.map((d) => `<path d="${d}"/>`).join("");
    $("#wInfo").textContent =
      `${st.W.strokes.length} ${st.W.strokes.length === 1 ? "traço" : "traços"}. Desenhe o traço 1.`;
    if (!(S.wseen || {})[it.id]) animateOrder();
  } catch (e) {
    st.W.free = true;
    $("#wGhost").innerHTML =
      `<text x="54.5" y="88" text-anchor="middle" font-size="86" class="jp">${it.q}</text>`;
    $("#wInfo").textContent =
      "Sem internet para baixar a ordem dos traços. Treine livre por cima do modelo.";
    $("#wAfter").innerHTML =
      `<div class="ctas"><button class="btn primary" id="wSelfOk">Ficou bom</button><button class="btn ghost" id="wSelfBad">Preciso treinar mais</button></div>`;
  }
}

export function setupCanvas() {
  const cv = $("#wcv"),
    bx = $("#wbox"),
    dpr = window.devicePixelRatio || 1;
  const size = bx.clientWidth;
  cv.width = size * dpr;
  cv.height = size * dpr;
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);
  const ink =
    getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#222";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(6, size / 32);
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  cv.onpointerdown = (e) => {
    if (!st.W || st.W.lock) return;
    cv.setPointerCapture(e.pointerId);
    st.W.drawing = true;
    st.W.pts = [pos(e)];
    ctx.beginPath();
    ctx.moveTo(...st.W.pts[0]);
  };
  cv.onpointermove = (e) => {
    if (!st.W || !st.W.drawing) return;
    const p = pos(e);
    st.W.pts.push(p);
    ctx.lineTo(...p);
    ctx.stroke();
  };
  const end = () => {
    if (!st.W || !st.W.drawing) return;
    st.W.drawing = false;
    const pts = st.W.pts.map(([x, y]) => [(x / size) * 109, (y / size) * 109]);
    ctx.clearRect(0, 0, size, size);
    if (!st.W.free) checkStroke(pts);
    else {
      $("#wInk").insertAdjacentHTML(
        "beforeend",
        `<polyline points="${pts.map((p) => p.join(",")).join(" ")}"/>`,
      );
    }
  };
  cv.onpointerup = end;
  cv.onpointercancel = end;
}

export function samplePath(d, n) {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  const svg = $("#wsvg");
  svg.appendChild(p);
  const L = p.getTotalLength(),
    out = [];
  for (let i = 0; i < n; i++) {
    const q = p.getPointAtLength((L * i) / (n - 1));
    out.push([q.x, q.y]);
  }
  p.remove();
  return { pts: out, len: L };
}

export function checkStroke(user) {
  const d = st.W.strokes[st.W.done],
    N = 20,
    ref = samplePath(d, N),
    u = resample(user, N);
  const avg = ref.pts.reduce((a, p, i) => a + Math.hypot(p[0] - u[i][0], p[1] - u[i][1]), 0) / N;
  const start = Math.hypot(ref.pts[0][0] - u[0][0], ref.pts[0][1] - u[0][1]);
  // traços curtos (pontinhos) têm mais tolerância
  const tol = ref.len < 20 ? 16 : 13;
  if (avg < tol && start < tol * 1.6) {
    $("#wInk").insertAdjacentHTML("beforeend", `<path d="${d}"/>`);
    $("#wHint").innerHTML = "";
    st.W.done++;
    st.W.fails = 0;
    sfx("ok", st.W.done);
    vib(8);
    if (st.W.done >= st.W.strokes.length) return writeDone();
    $("#wInfo").textContent = `Isso! Agora o traço ${st.W.done + 1} de ${st.W.strokes.length}.`;
  } else {
    st.W.fails++;
    st.W.miss++;
    sfx("bad");
    vib([20, 30, 20]);
    $("#wbox").classList.remove("shake");
    void $("#wbox").offsetWidth;
    $("#wbox").classList.add("shake");
    const back =
      Math.hypot(ref.pts[0][0] - u[N - 1][0], ref.pts[0][1] - u[N - 1][1]) < tol &&
      Math.hypot(ref.pts[N - 1][0] - u[0][0], ref.pts[N - 1][1] - u[0][1]) < tol;
    $("#wInfo").textContent = back
      ? "O formato está certo, mas o sentido está ao contrário. Comece pelo outro lado."
      : st.W.fails >= 2
        ? "Olha a dica piscando: comece pela bolinha."
        : "Quase. Tente de novo esse traço.";
    if (st.W.fails >= 2) showHint(st.W.done);
  }
}

export function showHint(i) {
  const d = st.W.strokes[i],
    p = samplePath(d, 2).pts[0];
  $("#wHint").innerHTML =
    `<path d="${d}" class="hintp"/><circle cx="${p[0]}" cy="${p[1]}" r="3.5" class="hintc"/>`;
}

export async function animateOrder() {
  const w = st.W;
  if (!w || !w.strokes || w.anim) return;
  w.anim = true;
  w.lock = true;
  const g = $("#wHint");
  // stop quietly if the learner leaves or moves to another character mid-animation
  const left = () => st.W !== w;
  for (const d of w.strokes) {
    if (left()) return;
    g.innerHTML = `<path d="${d}" class="animp" pathLength="1"/>`;
    await new Promise((r) => setTimeout(r, reduce ? 150 : 650));
    if (left()) return;
    $("#wInk").insertAdjacentHTML("beforeend", `<path d="${d}" class="demo"/>`);
  }
  await new Promise((r) => setTimeout(r, 400));
  if (left()) return;
  $("#wInk")
    .querySelectorAll(".demo")
    .forEach((p) => p.remove());
  g.innerHTML = "";
  w.anim = false;
  w.lock = false;
  for (let i = 0; i < w.done; i++)
    $("#wInk").insertAdjacentHTML("beforeend", `<path d="${w.strokes[i]}"/>`);
  S.wseen = S.wseen || {};
  S.wseen[w.it.id] = 1;
  save();
}

export function writeDone() {
  st.W.lock = true;
  const it = st.W.it,
    good = st.W.miss <= 1;
  const g = Math.max(4, st.W.strokes.length * 3 - st.W.miss * 2);
  addXP(g);
  $("#runXp").textContent = st.run.xp;
  const r = S.srs[it.id] || (S.srs[it.id] = { b: 0, due: 0, ok: 0, bad: 0 });
  if (good) {
    r.b = Math.min(5, r.b + 1);
    r.ok++;
    st.run.ok++;
  } else {
    r.bad++;
    st.run.bad++;
    st.run.missed.push(it.id);
  }
  r.due = Date.now() + SRS_INTERVALS[r.b];
  hist().n++;
  if (good) hist().ok++;
  save();
  $("#wInfo").textContent = st.W.miss
    ? `Pronto! ${st.W.miss} ${st.W.miss === 1 ? "tentativa errada" : "tentativas erradas"}. +${g} XP`
    : `Perfeito, sem errar nenhum traço! +${g} XP`;
  burst($("#wbox"));
  if (S.set.voice) speak(it.say);
  $("#wAfter").innerHTML =
    `<div class="ctas"><button class="btn primary" id="wNext">${st.run.i + 1 < st.run.qs.length ? "Próximo" : "Ver resultado"} <kbd>Enter</kbd></button><button class="btn ghost" id="wAgain">Escrever de novo</button></div>`;
  st.run.phase = "wdone";
}

export function writeNext() {
  if (!st.run || st.run.kind !== "write") return;
  if (Date.now() - st.lastKey < 150) return;
  st.lastKey = Date.now();
  st.run.i++;
  if (st.run.i >= st.run.qs.length) return finishWrite();
  st.run.phase = "w";
  renderWrite();
}

export function finishWrite() {
  st.run.phase = "end";
  $("#fill").style.width = "100%";
  markDay();
  hist().secs += Math.round((Date.now() - st.run.t0) / 1000);
  save();
  sfx("done");
  const n = st.run.ok + st.run.bad;
  $("#stage").innerHTML =
    `<div class="result enter"><h2>${st.run.bad ? "Boa escrita!" : "Mão firme!"}</h2>
    <p class="gl">${st.run.ok} de ${n} sem tropeçar. Escrever à mão é uma das formas mais fortes de fixar.</p>
    <div class="rstats"><div><b>${n}</b><span>caracteres</span></div><div><b>+${st.run.xp}</b><span>XP</span></div><div><b>${st.run.ok}</b><span>de primeira</span></div></div>
    ${st.run.missed.length ? `<div><p class="gl" style="margin-bottom:10px">Vale escrever de novo:</p><div class="miss">${st.run.missed.map((id) => `<button class="jp" data-write="${id}">${ITEMS[id].q}<small>${lab(ITEMS[id])}</small></button>`).join("")}</div></div>` : ""}
    <div class="ctas" style="justify-content:center"><button class="btn primary" id="rPrimary" data-mode="write"><i class="ph-bold ph-pencil-simple"></i>Escrever mais</button><button class="btn ghost" data-home>Início</button></div></div>`;
}

export function writeSubmit(f) {
  const ws = f.get("ws"),
    wn = +f.get("wn");
  let pool = Object.values(ITEMS).filter(writable);
  if (ws === "seen") pool = pool.filter((x) => S.srs[x.id]);
  else pool = pool.filter((x) => x.s === ws);
  if (!pool.length) {
    $("#wErr").textContent =
      "Você ainda não viu nenhum caractere. Faça uma lição primeiro ou escolha outra opção.";
    return;
  }
  let ids = pool.map((x) => x.id);
  if (wn)
    ids = shuffle(ids)
      .sort((a, b) => box(a) - box(b) + (Math.random() - 0.5) * 3)
      .slice(0, wn);
  startWrite(ids, ws === "seen" ? "Escrever" : `Escrever ${SCRIPT[ws]}`);
}
