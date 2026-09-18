import { describe, expect, it } from "vitest";

import {
  ApplicationError,
  BaseError,
  DomainError,
  InfrastructureError,
  isBaseError,
} from "../src/errors/index.js";

describe("DomainError", () => {
  it("guarda código, mensagem e origem", () => {
    const erro = new DomainError("INVALID_EMAIL", "e-mail em formato inválido");

    expect(erro.code).toBe("INVALID_EMAIL");
    expect(erro.message).toBe("e-mail em formato inválido");
    expect(erro.kind).toBe("domain");
    expect(erro.name).toBe("DomainError");
  });

  it("continua sendo um Error", () => {
    const erro = new DomainError("X", "y");

    expect(erro).toBeInstanceOf(Error);
    expect(erro).toBeInstanceOf(BaseError);
    expect(erro.stack).toBeDefined();
  });
});

describe("kind por tipo de erro", () => {
  it("distingue as três origens", () => {
    expect(new DomainError("A", "a").kind).toBe("domain");
    expect(new ApplicationError("B", "b").kind).toBe("application");
    expect(new InfrastructureError("C", "c").kind).toBe("infrastructure");
  });
});

describe("details e cause", () => {
  it("guarda detalhes quando informados", () => {
    const erro = new ApplicationError("VIDEO_NOT_FOUND", "vídeo não encontrado", {
      details: { videoId: "abc" },
    });

    expect(erro.details).toEqual({ videoId: "abc" });
  });

  it("deixa os detalhes indefinidos quando não informados", () => {
    expect(new ApplicationError("X", "y").details).toBeUndefined();
  });

  it("preserva a causa original", () => {
    const original = new Error("conexão recusada");
    const erro = new InfrastructureError("BROKER_UNAVAILABLE", "broker indisponível", {
      cause: original,
    });

    expect(erro.cause).toBe(original);
  });
});

describe("toJSON", () => {
  it("serializa sem detalhes quando não há", () => {
    expect(new DomainError("INVALID_STATUS", "transição inválida").toJSON()).toEqual({
      name: "DomainError",
      kind: "domain",
      code: "INVALID_STATUS",
      message: "transição inválida",
    });
  });

  it("inclui os detalhes quando há", () => {
    const erro = new DomainError("INVALID_STATUS", "transição inválida", {
      details: { de: "DONE", para: "PROCESSING" },
    });

    expect(erro.toJSON()).toEqual({
      name: "DomainError",
      kind: "domain",
      code: "INVALID_STATUS",
      message: "transição inválida",
      details: { de: "DONE", para: "PROCESSING" },
    });
  });
});

describe("subclasses dos serviços", () => {
  class VideoNotFoundError extends ApplicationError {
    constructor(videoId: string) {
      super("VIDEO_NOT_FOUND", "vídeo não encontrado", { details: { videoId } });
    }
  }

  it("herdam origem e ganham o próprio nome", () => {
    const erro = new VideoNotFoundError("abc");

    expect(erro.name).toBe("VideoNotFoundError");
    expect(erro.kind).toBe("application");
    expect(erro).toBeInstanceOf(ApplicationError);
    expect(erro.details).toEqual({ videoId: "abc" });
  });
});

describe("isBaseError", () => {
  it("reconhece os erros do pacote", () => {
    expect(isBaseError(new DomainError("A", "a"))).toBe(true);
    expect(isBaseError(new InfrastructureError("B", "b"))).toBe(true);
  });

  it("recusa qualquer outra coisa", () => {
    expect(isBaseError(new Error("comum"))).toBe(false);
    expect(isBaseError("texto")).toBe(false);
    expect(isBaseError(undefined)).toBe(false);
  });
});
