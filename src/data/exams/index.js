import N5 from "./n5.js";
import N4 from "./n4.js";
import N3 from "./n3.js";
import N2 from "./n2.js";
import N1 from "./n1.js";

// Exam sections, in the order they appear in the real test
export const SEC = {
  yomi: "漢字読み · Leitura de kanji",
  hyoki: "表記 · Escrita em kanji",
  bunpo: "文法 · Gramática",
  goi: "語彙 · Vocabulário",
  dokkai: "読解 · Leitura",
  choukai: "聴解 · Compreensão oral",
};
export const SECTION_ORDER = ["yomi", "hyoki", "goi", "bunpo", "dokkai", "choukai"];

// Seconds per question when the timed mode is on
export const EXAM_SECONDS = { N5: 60, N4: 65, N3: 70, N2: 75, N1: 80 };

export const EXAMS = { N5, N4, N3, N2, N1 };
