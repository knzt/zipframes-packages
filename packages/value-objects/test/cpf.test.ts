import { describe, expect, it } from "vitest";

import { Cpf } from "../src/cpf/index.js";

describe("valid CPFs", () => {
  it.each(["111.444.777-35", "529.982.360-65", "390.533.247-71", "012.345.678-90"])(
    "accepts %s formatted with dots and dash",
    (formatted) => {
      const digitsOnly = formatted.replace(/\D/g, "");
      expect(Cpf.create(formatted)).toEqual({ ok: true, value: digitsOnly });
    },
  );

  it.each(["11144477735", "52998236065"])("accepts %s already as digits only", (raw) => {
    expect(Cpf.create(raw)).toEqual({ ok: true, value: raw });
  });
});

describe("invalid length", () => {
  it("rejects fewer than 11 digits", () => {
    expect(Cpf.create("1234567890")).toMatchObject({
      ok: false,
      error: { valueObject: "Cpf", code: "INVALID_LENGTH" },
    });
  });

  it("rejects more than 11 digits", () => {
    expect(Cpf.create("123456789012")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LENGTH" },
    });
  });

  it("rejects an empty string", () => {
    expect(Cpf.create("")).toMatchObject({ ok: false, error: { code: "INVALID_CHARACTERS" } });
  });

  it("rejects a string with only formatting punctuation and no digits", () => {
    expect(Cpf.create("...-...-...")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LENGTH" },
    });
  });
});

describe("all digits the same", () => {
  it.each(["000.000.000-00", "111.111.111-11", "222.222.222-22", "999.999.999-99"])(
    "rejects %s even though the check digits are mathematically valid",
    (formatted) => {
      expect(Cpf.create(formatted)).toMatchObject({
        ok: false,
        error: { valueObject: "Cpf", code: "ALL_SAME_DIGIT" },
      });
    },
  );
});

describe("invalid check digits", () => {
  it("rejects a CPF with the last digit changed", () => {
    // 111.444.777-35 is valid; -36 is not.
    expect(Cpf.create("111.444.777-36")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHECK_DIGIT" },
    });
  });

  it("rejects a CPF with the first check digit changed", () => {
    expect(Cpf.create("111.444.777-45")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHECK_DIGIT" },
    });
  });

  it("rejects a valid CPF with a transposed digit", () => {
    // 111.444.777-35 with the last two base digits swapped.
    expect(Cpf.create("111.444.747.35".replace(".", "-").replace(".", ""))).toMatchObject({
      ok: false,
    });
  });
});

describe("formatting is ignored on input", () => {
  it("accepts dots and dash", () => {
    expect(Cpf.create("111.444.777-35").ok).toBe(true);
  });

  it("accepts spaces mixed in", () => {
    expect(Cpf.create("111 444 777 35").ok).toBe(true);
  });

  it("rejects a letter mixed into an otherwise valid CPF", () => {
    expect(Cpf.create("111.444.777-35abc")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHARACTERS" },
    });
  });
});

describe("is, equals and serialization", () => {
  it("is agrees with create", () => {
    expect(Cpf.is("111.444.777-35")).toBe(true);
    expect(Cpf.is("111.111.111-11")).toBe(false);
  });

  it("treats the same CPF written two ways as equal", () => {
    const a = Cpf.create("111.444.777-35");
    const b = Cpf.create("11144477735");
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(Cpf.equals(a.value, b.value)).toBe(true);
  });

  it("serializes to digits only, the same normalized form it validates", () => {
    const result = Cpf.create("111.444.777-35");
    if (!result.ok) throw new Error("expected a valid value");

    expect(Cpf.toJSON(result.value)).toBe("11144477735");
    expect(Cpf.toString(result.value)).toBe("11144477735");
  });
});
