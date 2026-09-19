import { describe, expect, it } from "vitest";

import { Phone } from "../src/phone/index.js";

describe("valid mobile numbers", () => {
  it.each([
    ["(11) 96789-1234", "11967891234"],
    ["(21) 97890-1234", "21978901234"],
    ["11967891234", "11967891234"],
    ["+55 (11) 96789-1234", "11967891234"],
    ["55 11 96789 1234", "11967891234"],
  ])("accepts %s", (raw, expected) => {
    expect(Phone.create(raw)).toEqual({ ok: true, value: expected });
  });
});

describe("valid landline numbers", () => {
  it.each([
    ["(11) 2345-6789", "1123456789"],
    ["(85) 3234-5678", "8532345678"],
    ["1123456789", "1123456789"],
  ])("accepts %s", (raw, expected) => {
    expect(Phone.create(raw)).toEqual({ ok: true, value: expected });
  });
});

describe("length", () => {
  it("rejects fewer than 10 digits", () => {
    expect(Phone.create("112345678")).toMatchObject({
      ok: false,
      error: { valueObject: "Phone", code: "INVALID_LENGTH" },
    });
  });

  it("rejects more than 11 digits", () => {
    expect(Phone.create("119678912345")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LENGTH" },
    });
  });
});

describe("DDD", () => {
  it("rejects a DDD ANATEL never assigned", () => {
    expect(Phone.create("(20) 96789-1234")).toMatchObject({
      ok: false,
      error: { code: "INVALID_DDD" },
    });
  });

  it.each([23, 30, 40, 50, 60, 70, 80, 90])("rejects the unassigned DDD %i", (ddd) => {
    expect(Phone.create(`(${String(ddd)}) 96789-1234`)).toMatchObject({
      ok: false,
      error: { code: "INVALID_DDD" },
    });
  });

  it("accepts DDDs at the edges of the valid range", () => {
    expect(Phone.create("(11) 96789-1234").ok).toBe(true);
    expect(Phone.create("(99) 96789-1234").ok).toBe(true);
  });
});

describe("local number format", () => {
  it("rejects a 9-digit number that does not start with 9", () => {
    expect(Phone.create("(11) 86789-1234")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LOCAL_NUMBER" },
    });
  });

  it("rejects a mobile number whose prefix after the leading 9 is out of range", () => {
    expect(Phone.create("(11) 90789-1234")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LOCAL_NUMBER" },
    });
  });

  it("rejects an 8-digit landline starting with 0 or 1", () => {
    expect(Phone.create("(11) 1234-5678")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LOCAL_NUMBER" },
    });
  });

  it("rejects an 8-digit landline starting with 6-9", () => {
    expect(Phone.create("(11) 6234-5678")).toMatchObject({
      ok: false,
      error: { code: "INVALID_LOCAL_NUMBER" },
    });
  });
});

describe("country code", () => {
  it("strips a leading +55 country code", () => {
    expect(Phone.create("+5511967891234")).toEqual({ ok: true, value: "11967891234" });
  });

  it("does not strip 55 when it is actually the DDD, not a country code", () => {
    // DDD 55 is Rio Grande do Sul; "5534567890" is a 10-digit landline
    // where 55 is the area code, not a country prefix to remove.
    expect(Phone.create("5534567890")).toEqual({ ok: true, value: "5534567890" });
  });
});

describe("character validation", () => {
  it("rejects a letter mixed into an otherwise valid number", () => {
    expect(Phone.create("(11) 96789-1234x")).toMatchObject({
      ok: false,
      error: { code: "INVALID_CHARACTERS" },
    });
  });

  it("rejects an empty string", () => {
    expect(Phone.create("")).toMatchObject({ ok: false, error: { code: "INVALID_CHARACTERS" } });
  });
});

describe("is, equals and serialization", () => {
  it("is agrees with create", () => {
    expect(Phone.is("(11) 96789-1234")).toBe(true);
    expect(Phone.is("(20) 96789-1234")).toBe(false);
  });

  it("treats the same number written two ways as equal", () => {
    const a = Phone.create("(11) 96789-1234");
    const b = Phone.create("+55 11 96789 1234");
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(Phone.equals(a.value, b.value)).toBe(true);
  });

  it("serializes to digits only, the same normalized form it validates", () => {
    const result = Phone.create("(11) 96789-1234");
    if (!result.ok) throw new Error("expected a valid value");

    expect(Phone.toJSON(result.value)).toBe("11967891234");
    expect(Phone.toString(result.value)).toBe("11967891234");
  });
});
