// Rendering and grading of a single question.
import { AUD, sfx, speak, vib } from "../../core/audio.js";
import { isKana, ITEMS, lab, SCRIPT, voc } from "../../core/catalog.js";
import { box, hist, SRS_INTERVALS, S, save } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $, $$, normR, shuffle } from "../../core/utils.js";
import { noteConf } from "../confusions.js";
import { addXP, advance, setFill } from "./flow.js";
import { timerStart, timerStop } from "./timer.js";
import { burst } from "../../ui/effects.js";
import { kyomi } from "../../ui/kanji-info.js";

export function pickType(id) {
  const it = ITEMS[id],
    t = ["rec", "rev"];
  if (AUD()) t.push("aud");
  if ((isKana(it) || S.set.romaji) && box(id) >= 2) t.push("type");
  return t[(Math.random() * t.length) | 0];
}

export function choices(it, withId) {
  const rom = S.set.romaji && voc(it);
  const same = Object.values(ITEMS).filter(
    (x) => x.s === it.s && x.snd !== it.snd && (!rom || normR(x.r) !== normR(it.r)),
  );
  const pick = [];
  if (withId && ITEMS[withId]) pick.push(ITEMS[withId]);
  for (const x of shuffle(same.filter((x) => x.row === it.row))) {
    if (pick.length >= 2) break;
    if (!pick.includes(x)) pick.push(x);
  }
  const others = same.filter((x) => x.row !== it.row),
    known = others.filter((x) => S.srs[x.id]);
  for (const x of shuffle(known.length >= 3 ? known : others)) {
    if (pick.length >= 3) break;
    if (!pick.includes(x)) pick.push(x);
  }
  return shuffle([it, ...pick]);
}

export const praise = ["Isso!", "Boa!", "Mandou bem!", "Certinho!", "Exato!", "Perfeito!"];

export function renderQ() {
  st.run.phase = "q";
  setFill();
  const q = st.run.qs[st.run.i],
    it = ITEMS[q.id],
    w = voc(it),
    ww = it.s === "w";
  if (q.t === "aud" && !AUD()) q.t = "rev";
  let prompt, hint, body;
  if (q.t === "rec") {
    prompt = `<div class="q jp ${ww ? "word" : ""}" id="qq">${it.q}</div>`;
    hint = w && !S.set.romaji ? "O que significa?" : "Como se lê?";
  } else if (q.t === "rev") {
    prompt = `<div class="q ${w && !S.set.romaji ? "mean" : "rom"}" id="qq">${lab(it)}</div>`;
    hint =
      it.s === "j"
        ? "Qual é o kanji?"
        : ww
          ? "Qual é a palavra?"
          : `Qual é o caractere em ${SCRIPT[it.s].toLowerCase()}?`;
  } else if (q.t === "aud") {
    prompt = `<button class="speak" id="qq" data-say="${it.say}" aria-label="Ouvir de novo"><i class="ph-fill ph-speaker-high"></i></button>`;
    hint = "Ouça e escolha. R repete o som.";
  } else {
    prompt = `<div class="q jp" id="qq">${it.q}</div>`;
    hint = "Digite como se lê e aperte Enter";
  }
  if (q.t === "type")
    body = `<form class="typeform" id="tf"><label class="sr" for="ti">Leitura em romaji</label><input id="ti" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${w ? "ex: neko" : "ex: ka"}"><button class="btn primary" type="submit">Conferir</button></form>`;
  else {
    const ch = choices(it, q.with),
      gl = q.t !== "rec";
    body = `<div class="opts">${ch.map((c, n) => `<button class="opt enter" style="animation-delay:${n * 35}ms" data-id="${c.id}"><kbd>${n + 1}</kbd><span class="${gl ? "jp" : ""}">${gl ? c.q : lab(c)}</span></button>`).join("")}</div>`;
  }
  $("#stage").innerHTML =
    `<div class="ptitle">${st.run.title}${st.run.endless ? ` · ${st.run.i} respondidas` : ""}</div>
   <div class="combo">${st.run.combo >= 3 ? `<i class="ph-fill ph-fire"></i>Combo x${st.run.combo}` : ""}</div>
   <div class="enter">${prompt}</div>
   <div class="hint" id="hint">${hint}</div>${body}<div id="after" style="display:contents"></div>`;
  if (q.t === "type") $("#ti").focus({ preventScroll: true });
  if (q.t === "aud") setTimeout(() => speak(it.say), 150);
  if (S.set.secs > 0)
    timerStart((S.set.secs + (q.t === "type" ? 5 : q.t === "aud" ? 2 : 0) + (w ? 2 : 0)) * 1000);
  else timerStop();
}

export function answer(val) {
  if (!st.run || st.run.phase !== "q") return;
  st.run.phase = "lock";
  timerStop();
  const q = st.run.qs[st.run.i],
    it = ITEMS[q.id],
    w = voc(it),
    ww = it.s === "w";
  let ok;
  if (q.t === "type") {
    const v = normR(val);
    ok = w
      ? v === normR(it.r) || v === normR(it.r).replace(/ou/g, "o")
      : v === it.a || it.alt.includes(v);
    const inp = $("#ti");
    if (inp) {
      inp.classList.add(ok ? "ok" : "bad");
      inp.disabled = true;
    }
    $("#tf button").disabled = true;
  } else ok = val === it.id;
  $$(".opt").forEach((b) => {
    if (b.dataset.id === it.id) b.classList.add("ok");
    else if (b.dataset.id === val) b.classList.add("bad");
    b.disabled = true;
  });
  const r = S.srs[it.id] || (S.srs[it.id] = { b: 0, due: 0, ok: 0, bad: 0 });
  S.tot++;
  hist().n++;
  if (ok) hist().ok++;
  else if (q.t !== "type" && val) noteConf(it.id, val);
  if (ok) {
    r.b = Math.min(5, r.b + 1);
    r.ok++;
    S.okc++;
    st.run.ok++;
    st.run.combo++;
    st.run.best = Math.max(st.run.best, st.run.combo);
    S.best = Math.max(S.best, st.run.combo);
    const g = 10 + Math.min(st.run.combo - 1, 5) * 2 + (q.t === "type" ? 5 : 0);
    addXP(g);
    sfx("ok", st.run.combo);
    vib(12);
    const h = $("#hint");
    h.className = "hint good";
    h.textContent = `${praise[(Math.random() * praise.length) | 0]} +${g} XP${w ? `  (${it.r})` : ""}`;
    $("#qq").classList.add("pop");
    burst($(".opt.ok") || $("#ti") || $("#qq"));
    if (S.set.voice && q.t !== "aud") speak(it.say);
    r.due = Date.now() + SRS_INTERVALS[r.b];
    save();
    const tok = st.run;
    setTimeout(
      () => {
        if (st.run === tok && !st.paused && st.run.phase === "lock") advance();
      },
      w ? 1100 : 750,
    );
  } else {
    r.b = Math.max(0, r.b - 1);
    r.bad++;
    r.due = Date.now();
    st.run.bad++;
    st.run.combo = 0;
    if (!st.run.missed.includes(it.id)) st.run.missed.push(it.id);
    if (st.run.extra < 6) {
      st.run.qs.splice(Math.min(st.run.i + 3, st.run.qs.length), 0, { id: it.id, t: "rec" });
      st.run.extra++;
    }
    save();
    sfx("bad");
    vib([30, 40, 30]);
    $("#qq").classList.add("shake");
    const why =
      val === null
        ? "O tempo acabou, sem problema."
        : q.t === "type"
          ? `Você escreveu "${val || "nada"}".`
          : "Quase. Ela vai voltar daqui a pouco.";
    $("#hint").textContent = why;
    $("#after").innerHTML =
      `<div class="fb enter"><span class="fq jp ${ww ? "word" : ""}">${it.q}</span><div><b>${w ? (S.set.romaji ? it.r : `${it.a} (${it.r})`) : it.label}</b>${kyomi(it)}<p>${it.mn}</p></div>${AUD() ? `<button class="iconbtn" data-say="${it.say}" aria-label="Ouvir"><i class="ph ph-speaker-high"></i></button>` : ""}</div>
      <button class="btn primary" id="contBtn">Continuar <kbd>Enter</kbd></button>`;
    speak(it.say);
    st.run.phase = "fb";
  }
  $("#runXp").textContent = st.run.xp;
}
