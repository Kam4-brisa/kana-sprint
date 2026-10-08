// Home screen: hero, daily goal, learning path and quick toggles.
import { AUD } from "../core/audio.js";
import { isKana, ITEMS, lab, LESSONS, ORDER, SCRIPT, voc } from "../core/catalog.js";
import {
  box,
  daily,
  dueIds,
  level,
  lvlStart,
  nextLesson,
  S,
  save,
  seenIds,
  streakNow,
} from "../core/store.js";
import { st } from "../core/state.js";
import { $, $$, reduce } from "../core/utils.js";
import { renderExams, skipListening } from "./exam/exam.js";
import { renderGram } from "./grammar.js";
import { renderQ } from "./session/question.js";
import { renderStats } from "./stats.js";
import { renderTable } from "./table.js";
import { toast } from "../ui/effects.js";
import { isDark } from "../ui/theme.js";

export function renderHome() {
  const nl = nextLesson(),
    L = nl && LESSONS[nl],
    due = dueIds().length,
    seen = seenIds().length;
  $("#nStreak").textContent = streakNow();
  $("#nLvl").textContent = level();
  const themeIcon = $("#themeBtn i");
  themeIcon.className = "ph " + (isDark() ? "ph-sun" : "ph-moon");

  // hero
  const reviewFirst = due >= 12;
  let sub, cta;
  if (!seen) {
    sub = `Aprenda 5 caracteres, teste na hora e pronto. Feito para quem perde o foco rápido.`;
    cta = `<button class="btn primary" data-lesson="${nl}"><i class="ph-bold ph-play"></i>Começar pelas vogais</button>`;
  } else if (reviewFirst) {
    sub = `Você tem <b>${due} cartas</b> esperando revisão. Revisar agora fixa o que você já aprendeu.`;
    cta =
      `<button class="btn primary" data-mode="review"><i class="ph-bold ph-play"></i>Revisar agora</button>` +
      (L ? `<button class="btn ghost" data-lesson="${nl}">Lição nova</button>` : "");
  } else if (L) {
    sub = `Próximo passo: <b>${L.title}</b> ${L.s === "w" ? "(palavras)" : "em " + SCRIPT[L.s].toLowerCase()}. ${L.ids.length} itens, uns 2 minutos.`;
    cta =
      `<button class="btn primary" data-lesson="${nl}"><i class="ph-bold ph-play"></i>Continuar</button>` +
      (due ? `<button class="btn ghost" data-mode="review">Revisar ${due}</button>` : "");
  } else {
    sub = `Você terminou a trilha toda. Agora é manter: uma revisão por dia.`;
    cta = `<button class="btn primary" data-mode="review"><i class="ph-bold ph-play"></i>Revisar</button>`;
  }
  $("#heroSub").innerHTML = sub;
  $("#heroCtas").innerHTML = cta;

  // preview cycles the next lesson's kana
  const pv = (L || LESSONS["h-vog"]).ids.map((id) => ITEMS[id]);
  let pi = 0;
  const setPv = () => {
    const it = pv[pi % pv.length];
    const g = $("#pvG");
    g.textContent = it.q;
    g.style.fontSize = it.s === "w" ? "clamp(48px,8vw,80px)" : "";
    $("#pvR").textContent = lab(it);
    $("#pvCard").dataset.say = it.say;
    g.classList.remove("pop");
    void g.offsetWidth;
    g.classList.add("pop");
  };
  setPv();
  clearInterval(st.pvTimer);
  if (!reduce)
    st.pvTimer = setInterval(() => {
      pi++;
      setPv();
    }, 2400);
  $("#pvSpk").style.display = AUD() ? "" : "none";

  // bento
  const d = daily(),
    goal = S.set.goal,
    pct = Math.min(1, d.xp / goal),
    C = 2 * Math.PI * 52;
  const lv = level(),
    need = lvlStart(lv + 1) - S.xp;
  const days = Array.from({ length: 7 }, (_, i) => {
    const t = new Date(Date.now() - (6 - i) * 864e5);
    return { on: S.days.includes(t.toDateString()), l: "DSTQQSS"[t.getDay()] };
  });
  const acc = S.tot ? Math.round((S.okc / S.tot) * 100) : 0;
  $("#bento").innerHTML = `
   <div class="cell goal">
     <div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-opacity=".22" stroke-width="12"/><circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" style="transition:stroke-dashoffset .8s var(--ease)"/></svg>
     <div class="t"><div>${d.xp}<small>de ${goal} XP</small></div></div></div>
     <div><h3>Meta de hoje</h3><p class="l">${d.xp >= goal ? "Meta batida. O que vier agora é bônus." : d.xp ? `Faltam ${goal - d.xp} XP. Você já começou, isso é o mais difícil.` : "Uma lição curta já resolve o dia."}</p></div>
   </div>
   <div class="cell"><i class="ph-fill ph-fire" style="font-size:24px;color:var(--accent)"></i><div class="n">${streakNow()}</div><div class="l">${streakNow() === 1 ? "dia seguido" : "dias seguidos"}</div>
     <div class="week">${days.map((x) => `<span class="${x.on ? "on" : ""}">${x.l}</span>`).join("")}</div></div>
   <div class="cell"><i class="ph-fill ph-lightning" style="font-size:24px;color:var(--accent)"></i><div class="n">Nível ${lv}</div><div class="l">${need} XP para o próximo${S.tot ? `. Acertos: ${acc}%` : ""}</div></div>
   <div class="cell rev"><div><div class="n">${due}</div><div class="l">${due ? (due === 1 ? "carta pronta para revisar" : "cartas prontas para revisar") : seen ? "Nada pendente agora. As cartas voltam no momento certo para não esquecer." : "Depois da primeira lição, as cartas aparecem aqui para revisar."}</div></div>
     ${due ? `<button class="btn primary" data-mode="review">Revisar agora</button>` : ""}</div>`;

  // path
  if (!st.pathTab) st.pathTab = L ? L.s : "h";
  $$("#pathTabs button").forEach((b) =>
    b.setAttribute("aria-selected", b.dataset.tab === st.pathTab),
  );
  const ls = ORDER.map((id) => LESSONS[id]).filter((l) => l.s === st.pathTab);
  $("#path").innerHTML = ls
    .map((l) => {
      const m = l.ids.filter((id) => box(id) >= 3).length,
        seg = Math.min(l.ids.length, 5),
        on = Math.round((m / l.ids.length) * seg);
      const done = S.done[l.id],
        nx = l.id === nl;
      const glyphs = l.ids
        .slice(0, l.s === "w" ? 2 : 5)
        .map((id) => ITEMS[id].q)
        .join(l.s === "w" ? " " : "");
      return `<button class="lesson ${done ? "done" : ""} ${nx ? "next" : ""}" data-lesson="${l.id}">
      <span class="gl jp">${glyphs}</span><h3>${l.title}</h3>
      <div class="dots">${Array.from({ length: seg }, (_, i) => `<span class="${i < on ? "on" : ""}"></span>`).join("")}</div>
      <span class="st">${nx ? `<i class="ph-bold ph-arrow-right"></i>Próxima` : done ? `<i class="ph-fill ph-check-circle"></i>${m}/${l.ids.length} dominados` : `<i class="ph ph-circle"></i>${l.ids.length} itens`}</span></button>`;
    })
    .join("");

  // modes
  const kseen = seenIds().filter((id) => isKana(ITEMS[id])).length;
  const modes = [
    [
      "review",
      "ph-arrows-clockwise",
      "Revisão",
      due ? `${due} pendentes, as mais fracas primeiro` : "Reforça o que está mais fraco",
    ],
    [
      "listen",
      "ph-ear",
      "Ouvir",
      AUD()
        ? "Escute o som e ache o caractere"
        : st.VOICE
          ? "Áudio desligado. Ligue no botão de som lá em cima"
          : "Precisa de uma voz em japonês no navegador",
    ],
    [
      "type",
      "ph-keyboard",
      "Digitar",
      kseen >= 4 || S.set.romaji
        ? "Escreva a leitura, sem opções"
        : "Libera depois da primeira lição",
    ],
    ["mix", "ph-shuffle", "Mistura rápida", "Um pouco de tudo que você já viu"],
    [
      "conf",
      "ph-arrows-left-right",
      "Os que eu confundo",
      "Pares parecidos lado a lado, como シ e ツ",
    ],
  ];
  $("#modes").innerHTML = modes
    .map(
      ([k, ic, t, p]) =>
        `<button class="mode" data-mode="${k}"><i class="ph ${ic}"></i><div><h4>${t}</h4><p>${p}</p></div><i class="ph ph-caret-right go"></i></button>`,
    )
    .join("");

  renderTable();
  renderExams();
  renderFulls();
  renderGram();
  renderStats();
  syncAud();
  syncRom();
}

export function renderFulls() {
  const opt = [
    ["h", "あ"],
    ["k", "ア"],
    ["j", "日"],
    ["w", "ねこ"],
  ];
  $("#fulls").innerHTML = opt
    .map(([k, g]) => {
      const all = Object.values(ITEMS).filter((x) => x.s === k),
        m = all.filter((x) => box(x.id) >= 3).length;
      return `<button class="full" data-full="${k}"><span class="g jp">${g}</span><span><b>${SCRIPT[k]} completo</b><small>${all.length} itens, ${m} dominados</small></span></button>`;
    })
    .join("");
}

export function syncAud() {
  $$(".audBtn").forEach((b) => {
    const on = AUD();
    b.classList.toggle("off", !on);
    b.querySelector("i").className = "ph " + (on ? "ph-speaker-high" : "ph-speaker-slash");
    b.setAttribute("aria-pressed", on);
    b.title = !st.VOICE
      ? "Seu navegador não tem voz em japonês"
      : on
        ? "Áudio ligado"
        : "Áudio desligado";
  });
}

export function toggleAud() {
  if (!st.VOICE) {
    toast("Seu navegador não tem voz em japonês. No Chrome ou Edge costuma ter.");
    return;
  }
  S.set.audio = !S.set.audio;
  save();
  if (!S.set.audio && "speechSynthesis" in window) speechSynthesis.cancel();
  toast(
    S.set.audio
      ? "Áudio ligado. Perguntas de ouvir voltaram."
      : "Áudio desligado. Nada de perguntas de ouvir.",
  );
  syncAud();
  if (st.run && st.run.phase === "q" && st.run.qs[st.run.i] && st.run.qs[st.run.i].t === "aud") {
    st.run.qs[st.run.i].t = "rev";
    renderQ();
  } else if (
    st.run &&
    st.run.kind === "exam" &&
    st.run.phase === "eq" &&
    st.run.qs[st.run.i].s === "choukai"
  ) {
    skipListening();
  } else if (!document.body.classList.contains("playing")) renderHome();
}

export function toggleRom() {
  S.set.romaji = !S.set.romaji;
  save();
  toast(
    S.set.romaji
      ? "Modo romaji ligado: palavras e kanji mostram a leitura."
      : "Modo romaji desligado: volta o português.",
  );
  syncRom();
  if (st.run && st.run.phase === "q" && voc(ITEMS[st.run.qs[st.run.i].id])) renderQ();
  else if (!document.body.classList.contains("playing")) renderHome();
}

export function syncRom() {
  $$(".romBtn").forEach((b) => {
    b.classList.toggle("off", !S.set.romaji);
    b.setAttribute("aria-pressed", !!S.set.romaji);
    b.title = S.set.romaji ? "Modo romaji ligado" : "Modo romaji desligado";
  });
}
