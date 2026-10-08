// Builds the learnable items, lessons and the order of the learning path from the data files.
import { S } from "./store.js";
import { ALT, BASE, LABEL, MNH, MNK, ROWS, SND, YOON } from "../data/kana.js";
import { KANJI } from "../data/kanji.js";
import { WCATS } from "../data/words.js";

export const ITEMS = {},
  LESSONS = {};

export const rowById = Object.fromEntries(ROWS.map((r) => [r[0], r]));

["h", "k"].forEach((s) => {
  ROWS.forEach(([rid, title, list]) => {
    const ids = list.map(([rom, hi, ka], i) => {
      const q = s === "h" ? hi : ka,
        id = s + q;
      let mn;
      if (BASE[rid]) {
        const b = rowById[BASE[rid]][2][i],
          bq = s === "h" ? b[1] : b[2];
        mn =
          rid === "p"
            ? `É o ${bq} (${b[0]}) com uma bolinha (maru). A bolinha troca o som para P.`
            : `É o ${bq} (${b[0]}) com dois tracinhos (tenten). Eles deixam o som mais forte: ${b[0]} vira ${LABEL[rom] || rom}.`;
        if (rom === "di") mn += ` Soa igual a ${s === "h" ? "じ" : "ジ"} e quase não é usado.`;
        if (rom === "du") mn += ` Soa igual a ${s === "h" ? "ず" : "ズ"} e quase não é usado.`;
      } else mn = s === "h" ? MNH[hi] : MNK[ka] || `Mesmo som de ${hi} (${rom}) no hiragana.`;
      ITEMS[id] = {
        id,
        s,
        q,
        a: rom,
        label: LABEL[rom] || rom,
        snd: SND[rom] || rom,
        alt: ALT[rom] || [],
        mn,
        say: q,
        row: rid,
      };
      return id;
    });
    LESSONS[s + "-" + rid] = { id: s + "-" + rid, s, title, ids };
  });
});

["h", "k"].forEach((s) => {
  YOON.forEach(([lid, title, list]) => {
    const ids = list.map(([rom, hi, ka]) => {
      const q = s === "h" ? hi : ka,
        id = s + q,
        b = q[0],
        sm = q[1],
        bi = ITEMS[s + b];
      const mn = `${b} (${bi.a}) + ${sm} pequeno = ${rom}. Os dois sons viram uma sílaba só.`;
      ITEMS[id] = {
        id,
        s,
        q,
        a: rom,
        label: rom,
        snd: rom,
        alt: ALT[rom] || [],
        mn,
        say: q,
        row: lid,
      };
      return id;
    });
    LESSONS[s + "-" + lid] = { id: s + "-" + lid, s, title, ids };
  });
});

WCATS.forEach(([cid, title, list]) => {
  const ids = list.map(([q, r, a]) => {
    const id = "w" + q;
    ITEMS[id] = {
      id,
      s: "w",
      q,
      a,
      label: a,
      snd: a,
      r,
      alt: [],
      mn: `Lê-se "${r}". Significa ${a}.`,
      say: q,
      row: cid,
    };
    return id;
  });
  LESSONS["w-" + cid] = { id: "w-" + cid, s: "w", title, ids };
});

KANJI.forEach(([cid, title, list]) => {
  const ids = list.map(([q, kana, r, a, mn]) => {
    const id = "j" + q;
    ITEMS[id] = {
      id,
      s: "j",
      q,
      a,
      label: a,
      snd: a,
      r,
      alt: [],
      mn: `${mn} Lê-se "${r}" (${kana}).`,
      say: kana,
      row: cid,
    };
    return id;
  });
  LESSONS["j-" + cid] = { id: "j-" + cid, s: "j", title, ids };
});

export const H10 = ["vog", "k", "s", "t", "n", "h", "m", "y", "r", "w"],
  DK = ["g", "z", "d", "b", "p"];

export const YO = ["yo1", "yo2", "yo3", "yo4"];

export const EXTRA = [
  "w-casa",
  "w-corpo",
  "j-num3",
  "j-pos2",
  "w-roupas",
  "w-clima",
  "j-nat2",
  "j-corpo2",
  "w-sent",
  "w-trab",
  "j-adj",
  "j-acao3",
  "w-compras",
  "w-hobby",
  "j-lugar2",
  "j-gente2",
  "w-verbos3",
  "w-adj2",
];

export const ORDER = [
  ...H10.map((r) => "h-" + r),
  "w-sauda",
  "w-comida",
  "w-cores",
  "j-num1",
  "j-num2",
  ...DK.map((r) => "h-" + r),
  "w-familia",
  "w-tempo",
  "j-dias",
  ...YO.map((r) => "h-" + r),
  ...H10.map((r) => "k-" + r),
  "w-animais",
  "w-natureza",
  "w-lugares",
  "j-nat",
  "j-corpo",
  "w-pessoas",
  "w-verbos",
  "w-adj",
  "j-pos",
  "j-gente",
  "j-coisas",
  ...DK.map((r) => "k-" + r),
  "w-transp",
  "w-verbos2",
  "w-frases",
  "j-tempo",
  "j-dir",
  "j-escola",
  "j-fam",
  "j-acao1",
  "j-acao2",
  "j-lugar",
  ...YO.map((r) => "k-" + r),
  ...EXTRA,
];

export const SCRIPT = { h: "Hiragana", k: "Katakana", j: "Kanji", w: "Palavras" };

export const voc = (it) => it.s === "w" || it.s === "j";

export const isKana = (it) => it.s === "h" || it.s === "k";

// com o modo romaji ligado, palavras e kanji mostram a leitura em vez do português
export const lab = (it) => (voc(it) && S.set.romaji ? it.r : it.label);

export const writable = (it) => it && it.s !== "w" && [...it.q].length === 1;
