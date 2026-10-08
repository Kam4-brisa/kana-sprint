// Free practice modes (review, listen, type, mix and more).
import { isKana, ITEMS } from "../../core/catalog.js";
import { dueIds, S, seenIds } from "../../core/store.js";
import { st } from "../../core/state.js";
import { shuffle } from "../../core/utils.js";
import { allSetup, startAll } from "../challenge.js";
import { startConf } from "../confusions.js";
import { begin, empty } from "./flow.js";
import { pickType } from "./question.js";
import { writeSetup } from "../write/write.js";

export function startMode(mode) {
  if (mode === "all") return allSetup();
  if (mode === "allAgain") return startAll();
  if (mode === "conf") return startConf();
  if (mode === "write") return writeSetup();
  let base = seenIds();
  if (mode === "listen") base = base.filter((id) => isKana(ITEMS[id]));
  if (mode === "type") base = base.filter((id) => isKana(ITEMS[id]) || S.set.romaji);
  const title = { review: "Revisão", listen: "Ouvir", type: "Digitar", mix: "Mistura rápida" }[
    mode
  ];
  if (mode === "listen" && st.VOICE && !S.set.audio)
    return empty(
      "ph-speaker-slash",
      "Áudio desligado",
      "Esse treino precisa de som. Ligue o áudio no botão de som (ou nos ajustes) quando puder ouvir.",
    );
  if (mode === "listen" && !st.VOICE)
    return empty(
      "ph-speaker-slash",
      "Sem voz em japonês",
      "Seu navegador não tem uma voz japonesa instalada. No Chrome ou no Edge costuma funcionar direto.",
    );
  if (base.length < 4)
    return empty(
      "ph-plant",
      "Primeiro, uma lição",
      "Faça a primeira lição da trilha para ter cartas aqui. Leva uns 2 minutos.",
      true,
    );
  const byBox = (x, y) => S.srs[x].b - S.srs[y].b;
  let ids;
  if (mode === "review") {
    const d = dueIds()
      .filter((id) => base.includes(id))
      .sort(byBox);
    ids = d.length ? d : base.slice().sort(byBox);
  } else ids = shuffle(base.slice()).sort((x, y) => byBox(x, y) + (Math.random() - 0.5) * 3);
  ids = shuffle(ids.slice(0, S.set.len));
  const fixed = mode === "listen" ? "aud" : mode === "type" ? "type" : null;
  begin({
    kind: "mode",
    mode,
    title,
    qs: ids.map((id) => ({ id, t: fixed || pickType(id) })),
    intro: [],
  });
}
