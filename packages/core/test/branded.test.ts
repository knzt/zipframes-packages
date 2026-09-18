import { describe, expect, it } from "vitest";

import { brand } from "../src/branded/index.js";
import type { Brand, Unbrand } from "../src/branded/index.js";

type Email = Brand<string, "Email">;
type UserId = Brand<string, "UserId">;
type FrameCount = Brand<number, "FrameCount">;

describe("brand", () => {
  it("mantém o valor original em tempo de execução", () => {
    const email: Email = brand<Email>("hellen@example.com");

    expect(email).toBe("hellen@example.com");
    expect(typeof email).toBe("string");
  });

  it("funciona com outros primitivos", () => {
    const frames: FrameCount = brand<FrameCount>(42);

    expect(frames).toBe(42);
    expect(frames + 1).toBe(43);
  });

  it("continua aceitando o valor marcado onde se espera o primitivo", () => {
    const email: Email = brand<Email>("hellen@example.com");
    const cru: string = email;
    const desmarcado: Unbrand<Email> = email;

    expect(cru).toBe(desmarcado);
  });

  it("recusa, em tempo de compilação, um primitivo cru e outra marca", () => {
    const email: Email = brand<Email>("hellen@example.com");

    // @ts-expect-error uma string crua não é um Email
    const semMarca: Email = "hellen@example.com";

    // @ts-expect-error um Email não é um UserId
    const outraMarca: UserId = email;

    expect(semMarca).toBe(outraMarca);
  });
});
