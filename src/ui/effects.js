// Visual feedback: particle bursts, confetti and toasts.
import { $, reduce } from "../core/utils.js";

export let toastT;

export function toast(m) {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("on"), 2600);
}

export function burst(el) {
  if (reduce || !el) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("div");
    p.className = "burst";
    p.style.left = r.left + r.width / 2 + "px";
    p.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(p);
    const a = Math.random() * Math.PI * 2,
      d = 50 + Math.random() * 80;
    p.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        {
          transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
    ).onfinish = () => p.remove();
  }
}

export function confetti() {
  if (reduce) return;
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("div");
    p.className = "burst";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "-10px";
    p.style.opacity = 0.4 + Math.random() * 0.6;
    document.body.appendChild(p);
    p.animate(
      [
        { transform: "translateY(0) rotate(0)" },
        {
          transform: `translateY(${innerHeight + 40}px) translateX(${(Math.random() - 0.5) * 160}px) rotate(${Math.random() * 720}deg)`,
        },
      ],
      {
        duration: 1600 + Math.random() * 1200,
        delay: Math.random() * 400,
        easing: "cubic-bezier(.3,.6,.4,1)",
      },
    ).onfinish = () => p.remove();
  }
}
