import { describe, expect, it } from "vitest";

import {
  all,
  andThen,
  err,
  isErr,
  isOk,
  map,
  mapErr,
  match,
  ok,
  unwrapOr,
  unwrapOrElse,
} from "../src/result/index.js";

describe("ok and err", () => {
  it("creates a success holding the given value", () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });

  it("creates a failure holding the given error", () => {
    expect(err("invalid format")).toEqual({ ok: false, error: "invalid format" });
  });
});

describe("isOk and isErr", () => {
  it("recognizes a success", () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(ok(1))).toBe(false);
  });

  it("recognizes a failure", () => {
    expect(isErr(err("x"))).toBe(true);
    expect(isOk(err("x"))).toBe(false);
  });
});

describe("map", () => {
  it("transforms the success value", () => {
    expect(map(ok(2), (n) => n * 3)).toEqual(ok(6));
  });

  it("does not call the function on a failure", () => {
    let called = false;
    const result = map(err<string>("x"), (n: number) => {
      called = true;
      return n;
    });

    expect(called).toBe(false);
    expect(result).toEqual(err("x"));
  });
});

describe("mapErr", () => {
  it("transforms the error", () => {
    expect(mapErr(err("low"), (e) => e.toUpperCase())).toEqual(err("LOW"));
  });

  it("leaves a success untouched", () => {
    expect(mapErr(ok(1), () => "other")).toEqual(ok(1));
  });
});

describe("andThen", () => {
  const positive = (n: number) => (n > 0 ? ok(n) : err("must be positive"));

  it("chains when the previous step succeeded", () => {
    expect(andThen(ok(5), positive)).toEqual(ok(5));
    expect(andThen(ok(-1), positive)).toEqual(err("must be positive"));
  });

  it("short-circuits on the first failure", () => {
    let called = false;
    const result = andThen(err<string>("failed earlier"), (n: number) => {
      called = true;
      return positive(n);
    });

    expect(called).toBe(false);
    expect(result).toEqual(err("failed earlier"));
  });
});

describe("unwrapOr and unwrapOrElse", () => {
  it("returns the value on a success", () => {
    expect(unwrapOr(ok(1), 99)).toBe(1);
    expect(unwrapOrElse(ok(1), () => 99)).toBe(1);
  });

  it("returns the fallback on a failure", () => {
    expect(unwrapOr(err<string>("x"), 99)).toBe(99);
    expect(unwrapOrElse(err("length"), (e) => e.length)).toBe(6);
  });
});

describe("match", () => {
  it("collapses both cases into a single value", () => {
    const describeResult = (
      result: ReturnType<typeof ok<number>> | ReturnType<typeof err<string>>,
    ) =>
      match(result, {
        ok: (n) => `value ${String(n)}`,
        err: (e) => `error ${e}`,
      });

    expect(describeResult(ok(7))).toBe("value 7");
    expect(describeResult(err("fatal"))).toBe("error fatal");
  });
});

describe("all", () => {
  it("returns every value when all succeed", () => {
    expect(all([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
  });

  it("returns the first error it finds", () => {
    expect(all([ok(1), err("second"), err("third")])).toEqual(err("second"));
  });

  it("accepts an empty list", () => {
    expect(all([])).toEqual(ok([]));
  });
});
