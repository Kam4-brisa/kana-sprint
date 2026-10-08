import { describe, expect, it } from "vitest";
import { ITEMS, LESSONS, ORDER, SCRIPT } from "../src/core/catalog.js";

describe("catalog", () => {
  it("has every lesson exactly once in the learning path", () => {
    expect(new Set(ORDER).size).toBe(ORDER.length);
    expect([...ORDER].sort()).toEqual(Object.keys(LESSONS).sort());
  });

  it("only references existing items in lessons", () => {
    for (const lesson of Object.values(LESSONS)) {
      expect(lesson.ids.length).toBeGreaterThan(0);
      for (const id of lesson.ids) expect(ITEMS[id], `${lesson.id} -> ${id}`).toBeDefined();
    }
  });

  it("gives every item what the quiz needs", () => {
    for (const it of Object.values(ITEMS)) {
      expect(Object.keys(SCRIPT)).toContain(it.s);
      expect(it.q, it.id).toBeTruthy();
      expect(it.a, it.id).toBeTruthy();
      expect(it.label, it.id).toBeTruthy();
      expect(it.mn, it.id).toBeTruthy();
      expect(it.say, it.id).toBeTruthy();
      if (it.s === "w" || it.s === "j") expect(it.r, it.id).toBeTruthy();
    }
  });

  it("covers all basic kana in both scripts", () => {
    const count = (s) => Object.values(ITEMS).filter((x) => x.s === s).length;
    expect(count("h")).toBe(104);
    expect(count("k")).toBe(104);
  });
});
