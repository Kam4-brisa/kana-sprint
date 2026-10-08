// Optional furigana on exam text.
import { S, save } from "../../core/store.js";
import { st } from "../../core/state.js";
import { $ } from "../../core/utils.js";
import { FURI } from "../../data/furigana.js";
import { renderExamQ } from "./exam.js";
import { toast } from "../../ui/effects.js";

export function furi(html) {
  if (!S.set.furi) return html;
  // não coloca leitura dentro do trecho sublinhado (é a resposta)
  return html
    .split(/(<u>.*?<\/u>)/)
    .map((part) =>
      part.startsWith("<u>")
        ? part
        : part.replace(/([一-鿿々]+)([ぁ-ん]?)/g, (m, k, nx) => {
            const r = FURI[k + nx] || FURI[k];
            return r ? `<ruby>${k}<rt>${r}</rt></ruby>${nx}` : m;
          }),
    )
    .join("");
}

export function toggleFuri() {
  S.set.furi = !S.set.furi;
  save();
  // só redesenha antes de responder, para não permitir responder duas vezes
  if (st.run && st.run.kind === "exam" && st.run.phase === "eq") renderExamQ();
  else {
    const b = $("#furiBtn");
    if (b) b.classList.toggle("on", !!S.set.furi);
    toast(S.set.furi ? "Furigana ligado a partir da próxima questão." : "Furigana desligado.");
  }
}
