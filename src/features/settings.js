// Settings dialog.
import { resetState, S, save } from "../core/store.js";
import { st } from "../core/state.js";
import { $, $$ } from "../core/utils.js";
import { renderHome } from "./home.js";

export const SEGS = {
  len: [
    [5, "5"],
    [10, "10"],
    [15, "15"],
    [20, "20"],
  ],
  secs: [
    [0, "Sem tempo"],
    [6, "6s"],
    [10, "10s"],
    [15, "15s"],
  ],
  goal: [
    [50, "50 XP"],
    [100, "100 XP"],
    [200, "200 XP"],
    [400, "400 XP"],
  ],
};

export function renderSettings() {
  $$("[data-set]").forEach((g) => {
    const k = g.dataset.set;
    g.innerHTML = SEGS[k]
      .map(
        ([v, l]) =>
          `<label><input type="radio" name="${k}" value="${v}" ${S.set[k] == v ? "checked" : ""}><span>${l}</span></label>`,
      )
      .join("");
  });
  $$("[data-sw]").forEach((c) => (c.checked = !!S.set[c.dataset.sw]));
  $("#voiceNote").textContent = st.VOICE
    ? ""
    : "Seu navegador não tem voz em japonês, então o áudio fica desligado. No Chrome ou no Edge costuma funcionar.";
}

export function initSettings() {
  $("#openSet").onclick = () => {
    renderSettings();
    $("#setDlg").showModal();
  };
  $("#closeSet").onclick = () => $("#setDlg").close();
  $("#setDlg").addEventListener("click", (e) => {
    if (e.target === $("#setDlg")) $("#setDlg").close();
  });
  $("#setDlg").addEventListener("change", (e) => {
    const i = e.target;
    if (i.type === "radio") S.set[i.name] = +i.value;
    if (i.dataset.sw) S.set[i.dataset.sw] = i.checked;
    save();
    renderHome();
  });
  $("#resetBtn").onclick = () => {
    if (!confirm("Apagar todo o progresso? Isso não pode ser desfeito.")) return;
    resetState();
    $("#setDlg").close();
    st.pathTab = null;
    st.selCell = null;
    renderHome();
  };
}
