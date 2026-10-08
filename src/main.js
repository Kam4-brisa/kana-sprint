// Entry point: styles, icons, fonts and app startup.
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/fill";
import "./styles/index.css";

import { initAudio } from "./core/audio.js";
import { initEvents } from "./events.js";
import { initSettings } from "./features/settings.js";
import { renderHome } from "./features/home.js";
import { applyTheme } from "./ui/theme.js";

initAudio();
initEvents();
initSettings();
applyTheme();
renderHome();
