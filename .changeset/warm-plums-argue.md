---
"@zipframes/core": minor
---

Add the first implementation of `@zipframes/core`:

- `Result<TValue, TError>` with `ok`, `err`, `isOk`, `isErr`, `map`, `mapErr`, `andThen`, `unwrapOr`, `unwrapOrElse`, `match` and `all`.
- `Brand`, `brand` and `Unbrand`, for tagging primitives at compile time.
- `BaseError` and the origin-based errors `DomainError`, `ApplicationError` and `InfrastructureError`, plus the semantic errors `ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`, `TimeoutError` and `UnavailableError`. Infrastructure errors carry a `retryable` flag.
- Subpath exports: `@zipframes/core/result`, `@zipframes/core/errors` and `@zipframes/core/branded`, alongside the package root.
