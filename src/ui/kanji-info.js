// On'yomi / kun'yomi block shown for kanji.
import { KYOMI } from "../data/kanji.js";

export function kyomi(it) {
  const k = it.s === "j" && KYOMI[it.q];
  if (!k) return "";
  const [on, kun, ex] = k.split("|");
  return `<div class="yomi"><span><b>On</b> ${on}</span><span><b>Kun</b> ${kun}</span><span><b>Exemplo</b> <span class="jp">${ex}</span></span></div>`;
}
