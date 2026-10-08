// Practice with look-alike pairs, based on the learner's own mistakes.
import { ITEMS } from "../core/catalog.js";
import { S } from "../core/store.js";
import { shuffle } from "../core/utils.js";
import { CONF_SEED } from "../data/confusions.js";
import { begin } from "./session/flow.js";

export function noteConf(a, b) {
  if (!a || !b || a === b || !ITEMS[b]) return;
  S.conf = S.conf || {};
  const k = [a, b].sort().join("|");
  S.conf[k] = (S.conf[k] || 0) + 1;
}

export function confPairs() {
  const own = Object.entries(S.conf || {})
    .sort((x, y) => y[1] - x[1])
    .map(([k]) => k.split("|"));
  const seed = CONF_SEED.filter(([a, b]) => !own.some((p) => p.includes(a) && p.includes(b)));
  return [...own, ...seed].filter(([a, b]) => ITEMS[a] && ITEMS[b]).slice(0, 8);
}

export function startConf() {
  const own = Object.keys(S.conf || {}).length;
  const qs = [];
  confPairs().forEach(([a, b]) => {
    qs.push({ id: a, t: "rec", with: b }, { id: b, t: "rev", with: a });
  });
  begin({
    kind: "mode",
    mode: "conf",
    title: own ? "Os que eu confundo" : "Pares que todo mundo confunde",
    qs: shuffle(qs),
    intro: [],
  });
}
