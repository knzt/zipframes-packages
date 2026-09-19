import { describe, expect, expectTypeOf, it } from "vitest";

import { err, ok } from "@zipframes/core/result";
import type { Brand } from "@zipframes/core";

import { defineValueObject } from "../src/base/index.js";

// A tiny value object used only to exercise the base: a positive integer.
const PositiveInt = defineValueObject({
  name: "PositiveInt",
  parse: (raw: number) =>
    Number.isInteger(raw) && raw > 0
      ? ok(raw)
      : err({ code: "NOT_POSITIVE_INT", message: "must be a positive integer" }),
});
type PositiveInt = Brand<number, "PositiveInt">;

describe("create", () => {
  it("accepts a valid value and brands it", () => {
    const result = PositiveInt.create(5);
    expect(result).toEqual({ ok: true, value: 5 });
  });

  it("rejects an invalid value with the value object's name attached", () => {
    const result = PositiveInt.create(-1);
    expect(result).toEqual({
      ok: false,
      error: {
        valueObject: "PositiveInt",
        code: "NOT_POSITIVE_INT",
        message: "must be a positive integer",
      },
    });
  });

  it("never throws on invalid input", () => {
    expect(() => PositiveInt.create(0)).not.toThrow();
  });
});

describe("is", () => {
  it("mirrors what create would accept, without needing to unwrap a Result", () => {
    expect(PositiveInt.is(5)).toBe(true);
    expect(PositiveInt.is(-1)).toBe(false);
    expect(PositiveInt.is(1.5)).toBe(false);
  });
});

describe("equals", () => {
  it("compares by value, the default for primitives", () => {
    const a = PositiveInt.create(5);
    const b = PositiveInt.create(5);
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(PositiveInt.equals(a.value, b.value)).toBe(true);
  });

  it("tells different values apart", () => {
    const a = PositiveInt.create(5);
    const b = PositiveInt.create(6);
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(PositiveInt.equals(a.value, b.value)).toBe(false);
  });

  it("can be overridden for values that are not primitives", () => {
    type Point = { x: number; y: number };
    const PointVO = defineValueObject({
      name: "Point",
      parse: (raw: Point) => ok(raw),
      equals: (a: Point, b: Point) => a.x === b.x && a.y === b.y,
    });

    const a = PointVO.create({ x: 1, y: 2 });
    const b = PointVO.create({ x: 1, y: 2 });
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(PointVO.equals(a.value, b.value)).toBe(true);
  });
});

describe("toJSON", () => {
  it("defaults to identity for a primitive value", () => {
    const result = PositiveInt.create(5);
    if (!result.ok) throw new Error("expected a valid value");

    expect(PositiveInt.toJSON(result.value)).toBe(5);
  });

  it("can be overridden to serialize differently from the internal shape", () => {
    const Cents = defineValueObject({
      name: "Cents",
      parse: (raw: number) => ok(raw),
      serialize: (value: number) => (value / 100).toFixed(2),
    });

    const result = Cents.create(1050);
    if (!result.ok) throw new Error("expected a valid value");

    expect(Cents.toJSON(result.value)).toBe("10.50");
  });
});

describe("toString", () => {
  it("falls back to JSON.stringify when the serialized value is not a string", () => {
    const result = PositiveInt.create(5);
    if (!result.ok) throw new Error("expected a valid value");

    // PositiveInt serializes to a number, so toString falls back to JSON.
    expect(PositiveInt.toString(result.value)).toBe("5");
  });

  it("returns a string serialization as-is, without extra quoting", () => {
    const Upper = defineValueObject({
      name: "Upper",
      parse: (raw: string) => ok(raw.toUpperCase()),
    });

    const result = Upper.create("abc");
    if (!result.ok) throw new Error("expected a valid value");

    expect(Upper.toString(result.value)).toBe("ABC");
  });
});

describe("branded type", () => {
  it("makes create's result assignable to the value object's own type", () => {
    const result = PositiveInt.create(5);
    if (!result.ok) throw new Error("expected a valid value");

    expectTypeOf(result.value).toEqualTypeOf<PositiveInt>();
  });

  it("rejects a raw, unvalidated value at compile time", () => {
    // @ts-expect-error a raw number is not a PositiveInt
    const raw: PositiveInt = 5;
    expect(raw).toBe(5);
  });

  it("keeps two different value objects' brands apart, even with the same underlying type", () => {
    const OtherInt = defineValueObject({
      name: "OtherInt",
      parse: (raw: number) => ok(raw),
    });
    const positive = PositiveInt.create(5);
    const other = OtherInt.create(5);
    if (!positive.ok || !other.ok) throw new Error("expected both to be valid");

    // @ts-expect-error a PositiveInt is not an OtherInt, despite both being numbers
    const mixed: PositiveInt = other.value;
    expect(mixed).toBe(positive.value);
  });
});
