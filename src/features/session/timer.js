// Per-question countdown bar.
import { $ } from "../../core/utils.js";
import { answer } from "./question.js";

export const T = { left: 0, total: 0, last: 0, on: false, raf: 0 };

export function timerStart(ms) {
  T.left = T.total = ms;
  T.on = true;
  T.last = performance.now();
  cancelAnimationFrame(T.raf);
  tick();
}

export function tick() {
  if (!T.on) return;
  const n = performance.now();
  T.left -= n - T.last;
  T.last = n;
  $("#timer").style.transform = `scaleX(${Math.max(0, T.left / T.total)})`;
  if (T.left <= 0) {
    T.on = false;
    answer(null);
    return;
  }
  T.raf = requestAnimationFrame(tick);
}

export function timerStop() {
  T.on = false;
  cancelAnimationFrame(T.raf);
  $("#timer").style.transform = "scaleX(0)";
}

export function timerPause() {
  if (T.on) {
    T.on = false;
    T.paused = true;
    cancelAnimationFrame(T.raf);
  }
}

export function timerResume() {
  if (T.paused) {
    T.paused = false;
    T.on = true;
    T.last = performance.now();
    tick();
  }
}
