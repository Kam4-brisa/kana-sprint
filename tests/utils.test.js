import { describe, expect, it } from "vitest";
import { normR, shuffle } from "../src/core/utils.js";

describe("utils", () => {
  it("shuffles in place without losing items", () => {
    const a = [1, 2, 3, 4, 5, 6];
    shuffle(a);
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("normalizes typed romaji", () => {
    expect(normR(" Ikura desu ka? ")).toBe("ikuradesuka");
    expect(normR(undefined)).toBe("");
  });
});
