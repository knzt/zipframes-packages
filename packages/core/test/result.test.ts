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

describe("ok e err", () => {
  it("cria um sucesso com o valor informado", () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });

  it("cria uma falha com o erro informado", () => {
    expect(err("formato inválido")).toEqual({ ok: false, error: "formato inválido" });
  });
});

describe("isOk e isErr", () => {
  it("reconhece o sucesso", () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(ok(1))).toBe(false);
  });

  it("reconhece a falha", () => {
    expect(isErr(err("x"))).toBe(true);
    expect(isOk(err("x"))).toBe(false);
  });
});

describe("map", () => {
  it("transforma o valor do sucesso", () => {
    expect(map(ok(2), (n) => n * 3)).toEqual(ok(6));
  });

  it("não chama a função quando é falha", () => {
    let chamou = false;
    const resultado = map(err<string>("x"), (n: number) => {
      chamou = true;
      return n;
    });

    expect(chamou).toBe(false);
    expect(resultado).toEqual(err("x"));
  });
});

describe("mapErr", () => {
  it("transforma o erro", () => {
    expect(mapErr(err("baixo"), (e) => e.toUpperCase())).toEqual(err("BAIXO"));
  });

  it("não altera o sucesso", () => {
    expect(mapErr(ok(1), () => "outro")).toEqual(ok(1));
  });
});

describe("andThen", () => {
  const positivo = (n: number) => (n > 0 ? ok(n) : err("precisa ser positivo"));

  it("encadeia quando o anterior deu certo", () => {
    expect(andThen(ok(5), positivo)).toEqual(ok(5));
    expect(andThen(ok(-1), positivo)).toEqual(err("precisa ser positivo"));
  });

  it("interrompe a cadeia na primeira falha", () => {
    let chamou = false;
    const resultado = andThen(err<string>("falhou antes"), (n: number) => {
      chamou = true;
      return positivo(n);
    });

    expect(chamou).toBe(false);
    expect(resultado).toEqual(err("falhou antes"));
  });
});

describe("unwrapOr e unwrapOrElse", () => {
  it("devolve o valor quando é sucesso", () => {
    expect(unwrapOr(ok(1), 99)).toBe(1);
    expect(unwrapOrElse(ok(1), () => 99)).toBe(1);
  });

  it("devolve o padrão quando é falha", () => {
    expect(unwrapOr(err<string>("x"), 99)).toBe(99);
    expect(unwrapOrElse(err("tamanho"), (e) => e.length)).toBe(7);
  });
});

describe("match", () => {
  it("resolve os dois casos em um único valor", () => {
    const descrever = (resultado: ReturnType<typeof ok<number>> | ReturnType<typeof err<string>>) =>
      match(resultado, {
        ok: (n) => `valor ${String(n)}`,
        err: (e) => `erro ${e}`,
      });

    expect(descrever(ok(7))).toBe("valor 7");
    expect(descrever(err("grave"))).toBe("erro grave");
  });
});

describe("all", () => {
  it("devolve todos os valores quando todos são sucesso", () => {
    expect(all([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
  });

  it("devolve o primeiro erro encontrado", () => {
    expect(all([ok(1), err("segundo"), err("terceiro")])).toEqual(err("segundo"));
  });

  it("aceita lista vazia", () => {
    expect(all([])).toEqual(ok([]));
  });
});
