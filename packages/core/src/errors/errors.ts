import { BaseError } from "./base-error.js";
import type { ErrorKind } from "./base-error.js";

/**
 * Invariante do domínio violada: um e-mail com formato inválido, uma
 * transição de status que a máquina de estados não permite.
 */
export class DomainError extends BaseError {
  readonly kind: ErrorKind = "domain";
}

/**
 * Regra de caso de uso barrou a operação: um recurso não encontrado, um
 * conflito com o estado atual, uma permissão ausente.
 */
export class ApplicationError extends BaseError {
  readonly kind: ErrorKind = "application";
}

/**
 * Falha em uma dependência externa: banco, broker, storage, rede.
 *
 * Costuma ser transitória, e é o tipo que orienta a política de retry.
 */
export class InfrastructureError extends BaseError {
  readonly kind: ErrorKind = "infrastructure";
}
