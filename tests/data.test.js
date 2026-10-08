import { describe, expect, it } from "vitest";
import { EXAMS, SEC, SECTION_ORDER, EXAM_SECONDS } from "../src/data/exams/index.js";
import { GRAM } from "../src/data/grammar.js";
import { FURI } from "../src/data/furigana.js";
import { KANJI, KYOMI } from "../src/data/kanji.js";
import { CONF_SEED } from "../src/data/confusions.js";
import { ITEMS } from "../src/core/catalog.js";

const fourDistinct = (o) => o.length === 4 && new Set(o).size === 4;

describe("mock exams", () => {
  it("has the five JLPT levels with a time limit each", () => {
    expect(Object.keys(EXAMS)).toEqual(["N5", "N4", "N3", "N2", "N1"]);
    for (const lv of Object.keys(EXAMS)) expect(EXAM_SECONDS[lv]).toBeGreaterThan(0);
  });

  it("has four distinct options and an explanation in every question", () => {
    for (const [lv, exam] of Object.entries(EXAMS)) {
      for (const q of exam.qs) {
        expect(fourDistinct(q.o), `${lv}: ${q.q}`).toBe(true);
        expect(Object.keys(SEC)).toContain(q.s);
        expect(SECTION_ORDER).toContain(q.s);
        expect(q.ex, `${lv}: ${q.q}`).toBeTruthy();
        if (q.s === "choukai") expect(q.say).toBeTruthy();
      }
    }
  });

  it("underlines the target word in reading questions", () => {
    for (const exam of Object.values(EXAMS))
      for (const q of exam.qs.filter((x) => x.s === "yomi" || x.s === "hyoki"))
        expect(q.q).toMatch(/<u>.+<\/u>/);
  });
});

describe("grammar", () => {
  it("has an explanation, examples and valid exercises per topic", () => {
    for (const g of GRAM) {
      expect(g.e).toBeTruthy();
      expect(g.x.length).toBeGreaterThan(0);
      for (const q of g.q) expect(fourDistinct(q.o), `${g.id}: ${q.q}`).toBe(true);
    }
  });
});

describe("readings", () => {
  it("uses only hiragana in furigana readings", () => {
    for (const [k, r] of Object.entries(FURI)) expect(r, k).toMatch(/^[ぁ-ゟ]+$/);
  });

  it("has on/kun readings for every kanji", () => {
    for (const [, , list] of KANJI)
      for (const [k] of list) expect(KYOMI[k], k).toMatch(/^[^|]+\|[^|]+\|[^|]+$/);
  });

  it("only seeds confusion pairs with existing items", () => {
    for (const [a, b] of CONF_SEED) {
      expect(ITEMS[a], a).toBeDefined();
      expect(ITEMS[b], b).toBeDefined();
    }
  });
});
