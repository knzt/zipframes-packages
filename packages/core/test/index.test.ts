import { describe, expect, it } from "vitest";

import * as core from "../src/index.js";

describe("public package surface", () => {
  it("exports the Result helpers", () => {
    expect(Object.keys(core)).toEqual(
      expect.arrayContaining([
        "ok",
        "err",
        "isOk",
        "isErr",
        "map",
        "mapErr",
        "andThen",
        "unwrapOr",
        "unwrapOrElse",
        "match",
        "all",
      ]),
    );
  });

  it("exports the brand helper and the base errors", () => {
    expect(Object.keys(core)).toEqual(
      expect.arrayContaining([
        "brand",
        "BaseError",
        "isBaseError",
        "DomainError",
        "ApplicationError",
        "InfrastructureError",
      ]),
    );
  });

  it("re-exports the same implementations as the inner modules", () => {
    const result = core.map(core.ok(2), (n) => n * 2);

    expect(result).toEqual({ ok: true, value: 4 });
    expect(new core.DomainError("X", "y")).toBeInstanceOf(core.BaseError);
  });
});
