import { describe, expect, it } from "vitest";

import * as core from "../src/index.js";

describe("superfície pública do pacote", () => {
  it("exporta os utilitários de Result", () => {
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

  it("exporta o utilitário de marca e os erros base", () => {
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

  it("entrega as mesmas implementações dos módulos internos", () => {
    const resultado = core.map(core.ok(2), (n) => n * 2);

    expect(resultado).toEqual({ ok: true, value: 4 });
    expect(new core.DomainError("X", "y")).toBeInstanceOf(core.BaseError);
  });
});
