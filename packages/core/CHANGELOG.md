# @zipframes/core

## 0.1.0

### Minor Changes

- [#7](https://github.com/knzt/zipframes-packages/pull/7) [`451d0a6`](https://github.com/knzt/zipframes-packages/commit/451d0a6ed136d70aea209721a6b5f21331ca3a2f) Thanks [@knzt](https://github.com/knzt)! - Add the first implementation of `@zipframes/core`:

  - `Result<TValue, TError>` with `ok`, `err`, `isOk`, `isErr`, `map`, `mapErr`, `andThen`, `unwrapOr`, `unwrapOrElse`, `match` and `all`.
  - `Brand`, `brand` and `Unbrand`, for tagging primitives at compile time.
  - `BaseError` and the origin-based errors `DomainError`, `ApplicationError` and `InfrastructureError`, plus the semantic errors `ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`, `TimeoutError` and `UnavailableError`. Infrastructure errors carry a `retryable` flag.
  - Subpath exports: `@zipframes/core/result`, `@zipframes/core/errors` and `@zipframes/core/branded`, alongside the package root.
