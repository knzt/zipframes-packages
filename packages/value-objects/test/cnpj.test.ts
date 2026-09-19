import { describe, expect, it } from "vitest";

import { Cnpj } from "../src/cnpj/index.js";

describe("valid CNPJs", () => {
  it.each([
    "11.222.333/0001-81",
    "04.252.799/0001-64",
    "33.000.175/0001-58",
    // Check digits computed as 0 (remainder < 2), exercising that branch
    // of the check-digit formula specifically.
    "00.806.360/8377-00",
  ])("accepts %s formatted with dots, slash and dash", (formatted) => {
    const digitsOnly = formatted.replace(/\D/g, "");
    expect(Cnpj.create(formatted)).toEqual({ ok: true, value: digitsOnly });
  });

  it("accepts a CNPJ already as digits only", () => {
    expect(Cnpj.create("11222333000181")).toEqual({ ok: true, value: "11222333000181" });
  });
});

describe("invalid length", () => {
  it("rejects fewer than 14 digits", () => {
    expect(Cnpj.create("1122233300018")).toMatchObject({
      ok: false,
      error: { valueObject: "Cnpj", code: "INVALID_LENGTH" },
    });
  });

  it("rejects more than 14 digits", () => {
    expect(Cnpj.create("112223330001811")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LENGTH" },
    });
  });
});

describe("all digits the same", () => {
  it.each(["00.000.000/0000-00", "11.111.111/1111-11", "99.999.999/9999-99"])(
    "rejects %s even though the check digits are mathematically valid",
    (formatted) => {
      expect(Cnpj.create(formatted)).toMatchObject({
        ok: false,
        error: { valueObject: "Cnpj", code: "ALL_SAME_DIGIT" },
      });
    },
  );
});

describe("invalid check digits", () => {
  it("rejects a CNPJ with the last digit changed", () => {
    expect(Cnpj.create("11.222.333/0001-82")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHECK_DIGIT" },
    });
  });

  it("rejects a CNPJ with the first check digit changed", () => {
    expect(Cnpj.create("11.222.333/0001-91")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHECK_DIGIT" },
    });
  });
});

describe("character validation", () => {
  it("rejects a letter mixed into an otherwise valid CNPJ", () => {
    expect(Cnpj.create("11.222.333/0001-81x")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHARACTERS" },
    });
  });

  it("rejects an empty string", () => {
    expect(Cnpj.create("")).toMatchObject({ ok: false, error: { code: "INVALID_CHARACTERS" } });
  });

  it("rejects a string with only formatting punctuation and no digits", () => {
    expect(Cnpj.create(".././-")).toMatchObject({ ok: false, error: { code: "INVALID_LENGTH" } });
  });
});

describe("is, equals and serialization", () => {
  it("is agrees with create", () => {
    expect(Cnpj.is("11.222.333/0001-81")).toBe(true);
    expect(Cnpj.is("11.111.111/1111-11")).toBe(false);
  });

  it("treats the same CNPJ written two ways as equal", () => {
    const a = Cnpj.create("11.222.333/0001-81");
    const b = Cnpj.create("11222333000181");
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(Cnpj.equals(a.value, b.value)).toBe(true);
  });

  it("serializes to digits only, the same normalized form it validates", () => {
    const result = Cnpj.create("11.222.333/0001-81");
    if (!result.ok) throw new Error("expected a valid value");

    expect(Cnpj.toJSON(result.value)).toBe("11222333000181");
    expect(Cnpj.toString(result.value)).toBe("11222333000181");
  });
});
