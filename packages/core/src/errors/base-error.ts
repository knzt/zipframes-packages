/**
 * Origem do erro, usada para decidir o tratamento sem inspecionar a classe.
 *
 * - domain: uma invariante do domínio foi violada
 * - application: uma regra de caso de uso barrou a operação
 * - infrastructure: uma dependência externa falhou
 */
export type ErrorKind = "domain" | "application" | "infrastructure";

export type BaseErrorOptions = {
  readonly details?: Record<string, unknown>;
  readonly cause?: unknown;
};

/**
 * Erro base dos pacotes e dos serviços.
 *
 * Carrega um código estável, legível por máquina, e detalhes opcionais. Não
 * conhece HTTP nem mensagens para o usuário final: a tradução do erro é
 * trabalho da camada de apresentação.
 */
export abstract class BaseError extends Error {
  abstract readonly kind: ErrorKind;

  readonly code: string;
  readonly details: Record<string, unknown> | undefined;

  constructor(code: string, message: string, options: BaseErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = new.target.name;
    this.code = code;
    this.details = options.details;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      kind: this.kind,
      code: this.code,
      message: this.message,
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}

/** Estreita um valor desconhecido para BaseError. */
export const isBaseError = (value: unknown): value is BaseError => value instanceof BaseError;
