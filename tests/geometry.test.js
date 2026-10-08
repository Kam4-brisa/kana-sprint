import { describe, expect, it } from "vitest";
import { resample } from "../src/features/write/geometry.js";

describe("resample", () => {
  it("spreads points evenly along the stroke", () => {
    expect(
      resample(
        [
          [0, 0],
          [10, 0],
        ],
        3,
      ),
    ).toEqual([
      [0, 0],
      [5, 0],
      [10, 0],
    ]);
  });

  it("follows corners by arc length", () => {
    const pts = resample(
      [
        [0, 0],
        [10, 0],
        [10, 10],
      ],
      3,
    );
    expect(pts[1][0]).toBeCloseTo(10);
    expect(pts[1][1]).toBeCloseTo(0);
  });

  it("handles a single tap", () => {
    expect(resample([[4, 4]], 2)).toEqual([
      [4, 4],
      [4, 4],
    ]);
  });
});
