import { beforeEach, describe, expect, it } from "vitest";
import { furi } from "../src/features/exam/furigana.js";
import { S } from "../src/core/store.js";

describe("furi", () => {
  beforeEach(() => {
    S.set.furi = true;
  });

  it("adds readings above known kanji", () => {
    expect(furi("毎朝 運動します")).toBe(
      "<ruby>毎朝<rt>まいあさ</rt></ruby> <ruby>運動<rt>うんどう</rt></ruby>します",
    );
  });

  it("uses the following kana to pick the right reading", () => {
    expect(furi("来る")).toContain("<rt>く</rt>");
    expect(furi("来た")).toContain("<rt>き</rt>");
  });

  it("never reveals the underlined answer", () => {
    expect(furi("<u>病院</u>へ 行きました")).toMatch(/^<u>病院<\/u>/);
  });

  it("does nothing when turned off", () => {
    S.set.furi = false;
    expect(furi("毎朝")).toBe("毎朝");
  });
});
