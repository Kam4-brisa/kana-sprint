// Persistent progress, saved in localStorage.
import { ITEMS, ORDER } from "./catalog.js";
import { dayStr } from "./utils.js";

const KEY = "kanasprint2";

// Spaced repetition: how long until a card comes back, by box (0 = now ... 5 = 21 days)
export const SRS_INTERVALS = [0, 6e5, 864e5, 2592e5, 6048e5, 18144e5];

export const fresh = () => ({
  xp: 0,
  streak: 0,
  last: "",
  days: [],
  daily: { d: "", xp: 0 },
  srs: {},
  done: {},
  tot: 0,
  okc: 0,
  best: 0,
  set: {
    len: 10,
    secs: 10,
    goal: 100,
    sfx: true,
    voice: true,
    vib: true,
    audio: true,
    romaji: false,
    furi: false,
    theme: "",
  },
});

function load() {
  let s;
  try {
    s = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {});
  } catch (e) {
    s = fresh();
  }
  s.set = Object.assign(fresh().set, s.set);
  return s;
}

// Saved progress. Never reassigned, so modules can import it directly.
export const S = load();

export const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
};

export function resetState() {
  const theme = S.set.theme;
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, fresh());
  S.set.theme = theme;
  save();
}

export const daily = () => {
  if (S.daily.d !== dayStr()) S.daily = { d: dayStr(), xp: 0 };
  return S.daily;
};

export const streakNow = () => (S.last === dayStr() || S.last === dayStr(1) ? S.streak : 0);

export const level = () => Math.floor((1 + Math.sqrt(1 + S.xp / 12.5)) / 2);

export const lvlStart = (L) => 50 * L * (L - 1);

export const dueIds = () =>
  Object.keys(S.srs).filter((id) => ITEMS[id] && S.srs[id].due <= Date.now());

export const seenIds = () => Object.keys(S.srs).filter((id) => ITEMS[id]);

export const nextLesson = () => ORDER.find((id) => !S.done[id]);

export const box = (id) => (S.srs[id] ? S.srs[id].b : -1);

export function markDay() {
  const t = dayStr();
  if (S.last !== t) {
    S.streak = S.last === dayStr(1) ? S.streak + 1 : 1;
    S.last = t;
    S.days = [...S.days.filter((x) => x !== t), t].slice(-30);
  }
}

export function hist() {
  S.hist = S.hist || {};
  const d = dayStr();
  return S.hist[d] || (S.hist[d] = { xp: 0, n: 0, ok: 0, secs: 0 });
}
