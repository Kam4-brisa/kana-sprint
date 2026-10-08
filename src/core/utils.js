// Small DOM and data helpers shared across the app.

export const $ = (s) => document.querySelector(s);

export const $$ = (s) => [...document.querySelectorAll(s)];

export const dayStr = (o = 0) => new Date(Date.now() - o * 864e5).toDateString();

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const reduce =
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const normR = (v) => (v || "").toLowerCase().replace(/[\s'.,?!-]/g, "");
