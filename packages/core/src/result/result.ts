/**
 * Result represents the outcome of an operation that can fail in an expected
 * way: format validation, a broken invariant, a business rule.
 *
 * Expected errors are values, not exceptions. Exceptions are reserved for
 * unexpected failures, the ones nobody knew how to handle.
 */
export type Ok<TValue> = {
  readonly ok: true;
  readonly value: TValue;
};

export type Err<TError> = {
  readonly ok: false;
  readonly error: TError;
};

export type Result<TValue, TError> = Ok<TValue> | Err<TError>;

/** Creates a successful result. */
export const ok = <TValue>(value: TValue): Ok<TValue> => ({ ok: true, value });

/** Creates a failed result. */
export const err = <TError>(error: TError): Err<TError> => ({ ok: false, error });

/** Narrows the type to the success case. */
export const isOk = <TValue, TError>(result: Result<TValue, TError>): result is Ok<TValue> =>
  result.ok;

/** Narrows the type to the failure case. */
export const isErr = <TValue, TError>(result: Result<TValue, TError>): result is Err<TError> =>
  !result.ok;

/** Transforms the success value, leaving a failure untouched. */
export const map = <TValue, TError, TNext>(
  result: Result<TValue, TError>,
  fn: (value: TValue) => TNext,
): Result<TNext, TError> => (result.ok ? ok(fn(result.value)) : result);

/** Transforms the error, leaving a success untouched. */
export const mapErr = <TValue, TError, TNextError>(
  result: Result<TValue, TError>,
  fn: (error: TError) => TNextError,
): Result<TValue, TNextError> => (result.ok ? result : err(fn(result.error)));

/** Chains another operation that can also fail. */
export const andThen = <TValue, TError, TNext, TNextError>(
  result: Result<TValue, TError>,
  fn: (value: TValue) => Result<TNext, TNextError>,
): Result<TNext, TError | TNextError> => (result.ok ? fn(result.value) : result);

/** Returns the success value or the given fallback. */
export const unwrapOr = <TValue, TError>(
  result: Result<TValue, TError>,
  fallback: TValue,
): TValue => (result.ok ? result.value : fallback);

/** Returns the success value or a fallback computed from the error. */
export const unwrapOrElse = <TValue, TError>(
  result: Result<TValue, TError>,
  fn: (error: TError) => TValue,
): TValue => (result.ok ? result.value : fn(result.error));

/** Collapses both cases into a single value. */
export const match = <TValue, TError, TOut>(
  result: Result<TValue, TError>,
  handlers: {
    readonly ok: (value: TValue) => TOut;
    readonly err: (error: TError) => TOut;
  },
): TOut => (result.ok ? handlers.ok(result.value) : handlers.err(result.error));

/**
 * Combines several results into one. Returns every value when all of them
 * succeed, or the first error it finds.
 *
 * Useful when building an aggregate out of several value objects.
 */
export const all = <TValue, TError>(
  results: readonly Result<TValue, TError>[],
): Result<TValue[], TError> => {
  const values: TValue[] = [];

  for (const result of results) {
    if (!result.ok) {
      return result;
    }
    values.push(result.value);
  }

  return ok(values);
};
