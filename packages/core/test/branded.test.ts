import { describe, expect, it } from "vitest";

import { brand } from "../src/branded/index.js";
import type { Brand, Unbrand } from "../src/branded/index.js";

type Email = Brand<string, "Email">;
type UserId = Brand<string, "UserId">;
type FrameCount = Brand<number, "FrameCount">;

describe("brand", () => {
  it("keeps the original value at runtime", () => {
    const email: Email = brand<Email>("hellen@example.com");

    expect(email).toBe("hellen@example.com");
    expect(typeof email).toBe("string");
  });

  it("works with other primitives", () => {
    const frames: FrameCount = brand<FrameCount>(42);

    expect(frames).toBe(42);
    expect(frames + 1).toBe(43);
  });

  it("is still accepted where the primitive is expected", () => {
    const email: Email = brand<Email>("hellen@example.com");
    const raw: string = email;
    const unbranded: Unbrand<Email> = email;

    expect(raw).toBe(unbranded);
  });

  it("rejects a raw primitive and a different brand at compile time", () => {
    const email: Email = brand<Email>("hellen@example.com");

    // @ts-expect-error a raw string is not an Email
    const unmarked: Email = "hellen@example.com";

    // @ts-expect-error an Email is not a UserId
    const otherBrand: UserId = email;

    expect(unmarked).toBe(otherBrand);
  });
});
