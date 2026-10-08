// In-memory state of the current screen and study session, shared between modules.
// Not persisted: reloading the page starts fresh.
export const st = {
  run: null,
  paused: false,
  lastKey: 0,
  W: null,
  VOICE: false,
  jaVoice: null,
  AC: null,
  pathTab: null,
  tblTab: "h",
  selCell: null,
  pvTimer: null,
  ALLCFG: { s: { h: true, k: true, j: true, w: true }, len: 20 },
  EXLEN: 15,
  EXTIME: false,
  exTick: null,
};
