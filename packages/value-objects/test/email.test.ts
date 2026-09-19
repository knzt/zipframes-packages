import { describe, expect, it } from "vitest";

import { Email } from "../src/email/index.js";

describe("valid emails", () => {
  it.each([
    "hellen@example.com",
    "hellen.santos@example.com",
    "hellen+zipframes@example.co.uk",
    "h@e.io",
    "hellen_santos-123@example-domain.com",
  ])("accepts %s", (raw) => {
    expect(Email.create(raw)).toEqual({ ok: true, value: raw.toLowerCase() });
  });

  it("normalizes to lowercase", () => {
    expect(Email.create("Hellen@Example.COM")).toEqual({ ok: true, value: "hellen@example.com" });
  });

  it("trims surrounding whitespace", () => {
    expect(Email.create("  hellen@example.com  ")).toEqual({
      ok: true,
      value: "hellen@example.com",
    });
  });

  it("accepts an email right at the length limit", () => {
    const local = "a".repeat(64);
    const domain = "b".repeat(186) + ".com";
    const raw = `${local}@${domain}`;
    expect(raw.length).toBe(255);
    expect(Email.create(raw)).toEqual({ ok: true, value: raw });
  });
});

describe("invalid emails", () => {
  it("rejects an empty string", () => {
    expect(Email.create("")).toEqual({
      ok: false,
      error: { valueObject: "Email", code: "EMPTY", message: "email must not be empty" },
    });
  });

  it("rejects a string that is only whitespace", () => {
    expect(Email.create("   ")).toMatchObject({ ok: false, error: { code: "EMPTY" } });
  });

  it("rejects an email over the length limit", () => {
    const local = "a".repeat(65);
    const domain = "b".repeat(186) + ".com";
    const raw = `${local}@${domain}`;
    expect(raw.length).toBe(256);
    expect(Email.create(raw)).toMatchObject({ ok: false, error: { code: "TOO_LONG" } });
  });

  it.each([
    "no-at-sign.example.com",
    "@example.com",
    "hellen@",
    "hellen@example",
    "hellen @example.com",
    "hellen@exam ple.com",
    "hellen@@example.com",
  ])("rejects %s", (raw) => {
    expect(Email.create(raw)).toMatchObject({
      ok: false,
      error: { valueObject: "Email", code: "INVALID_FORMAT" },
    });
  });
});

describe("is", () => {
  it("agrees with create", () => {
    expect(Email.is("hellen@example.com")).toBe(true);
    expect(Email.is("not-an-email")).toBe(false);
  });
});

describe("equals, toJSON and toString", () => {
  it("treats two emails with the same normalized value as equal", () => {
    const a = Email.create("Hellen@Example.com");
    const b = Email.create("hellen@example.com");
    if (!a.ok || !b.ok) throw new Error("expected both to be valid");

    expect(Email.equals(a.value, b.value)).toBe(true);
  });

  it("serializes to the normalized string", () => {
    const result = Email.create("Hellen@Example.com");
    if (!result.ok) throw new Error("expected a valid value");

    expect(Email.toJSON(result.value)).toBe("hellen@example.com");
    expect(Email.toString(result.value)).toBe("hellen@example.com");
    expect(JSON.stringify({ email: result.value })).toBe('{"email":"hellen@example.com"}');
  });
});
