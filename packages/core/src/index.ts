export type { Ok, Err, Result } from "./result/index.js";
export {
  ok,
  err,
  isOk,
  isErr,
  map,
  mapErr,
  andThen,
  unwrapOr,
  unwrapOrElse,
  match,
  all,
} from "./result/index.js";

export type { Brand, Unbrand } from "./branded/index.js";
export { brand } from "./branded/index.js";

export type { ErrorKind, BaseErrorOptions } from "./errors/index.js";
export {
  BaseError,
  isBaseError,
  DomainError,
  ApplicationError,
  InfrastructureError,
} from "./errors/index.js";
