// Light and dark theme.
import { S } from "../core/store.js";

export const isDark = () =>
  S.set.theme ? S.set.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

export function applyTheme() {
  if (S.set.theme) document.documentElement.dataset.theme = S.set.theme;
  else delete document.documentElement.dataset.theme;
}
