// Japanese text-to-speech, sound effects and vibration.
import { S } from "./store.js";
import { st } from "./state.js";
import { renderHome } from "../features/home.js";

export const AUD = () => st.VOICE && S.set.audio;

export function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  const v = speechSynthesis.getVoices();
  st.jaVoice = v.find((x) => /^ja/i.test(x.lang)) || null;
  const had = st.VOICE;
  st.VOICE = !!st.jaVoice;
  if (had !== st.VOICE && !document.body.classList.contains("playing")) renderHome();
}

export function speak(t) {
  if (!AUD()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "ja-JP";
  u.voice = st.jaVoice;
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

export function beep(f, at, dur, type = "sine", vol = 0.07) {
  const t = st.AC.currentTime + at,
    o = st.AC.createOscillator(),
    g = st.AC.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(st.AC.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function sfx(k, c = 0) {
  if (!S.set.sfx) return;
  try {
    st.AC = st.AC || new (window.AudioContext || window.webkitAudioContext)();
    const up = Math.min(c, 8) * 25;
    if (k === "ok") {
      beep(660 + up, 0, 0.09);
      beep(990 + up, 0.07, 0.14);
    } else if (k === "bad") {
      beep(220, 0, 0.16, "triangle", 0.09);
      beep(160, 0.11, 0.22, "triangle", 0.09);
    } else if (k === "done") {
      [523, 659, 784, 1047].forEach((f, i) => beep(f, i * 0.09, 0.22));
    }
  } catch (e) {}
}

export const vib = (p) => {
  if (S.set.vib && navigator.vibrate)
    try {
      navigator.vibrate(p);
    } catch (e) {}
};

export function initAudio() {
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
}
