import { err, ok } from "@zipframes/core/result";
import type { Brand, Result } from "@zipframes/core";

/**
 * Error shape every value object defined here produces on invalid input.
 *
 * `valueObject` is filled in automatically from the `name` given to
 * `defineValueObject`; the parse function only needs to return `code` and
 * `message`.
 */
export type ValueObjectError = {
  readonly valueObject: string;
  readonly code: string;
  readonly message: string;
};

export type ParseResult<TValue> = Result<TValue, Omit<ValueObjectError, "valueObject">>;

export type DefineValueObjectOptions<TName extends string, TRaw, TValue> = {
  /**
   * Name of the value object, used in error messages and in the branded
   * type. Passing "Email" here is what makes `create` return a
   * `Brand<TValue, "Email">`. Write it as a literal — a `name` computed at
   * runtime would widen to `string` and the brand would lose its meaning.
   */
  readonly name: TName;

  /**
   * Validates and normalizes the raw input. Called by `create`. Never
   * throws: an invalid value is an expected outcome, returned as `err`.
   */
  readonly parse: (raw: TRaw) => ParseResult<TValue>;

  /**
   * How to turn a valid value into its JSON/string form. Defaults to the
   * identity function, which is correct whenever `TValue` is already the
   * primitive that should be serialized (a string, a number).
   */
  readonly serialize?: (value: TValue) => unknown;

  /**
   * How to compare two valid values. Defaults to `===`, which is correct
   * for primitives. Override it if `TValue` is not a primitive.
   */
  readonly equals?: (a: TValue, b: TValue) => boolean;
};

export type ValueObjectDefinition<TRaw, TValue, TName extends string> = {
  /** Validates `raw` and returns the branded value, or the error. */
  readonly create: (raw: TRaw) => Result<Brand<TValue, TName>, ValueObjectError>;

  /** True when `raw` would be accepted by `create`. */
  readonly is: (raw: TRaw) => boolean;

  /** Value equality between two instances of this value object. */
  readonly equals: (a: Brand<TValue, TName>, b: Brand<TValue, TName>) => boolean;

  /** The value in the form adapters should persist or send over the wire. */
  readonly toJSON: (value: Brand<TValue, TName>) => unknown;

  /** A readable representation, for logs and error messages. */
  readonly toString: (value: Brand<TValue, TName>) => string;
};

const identity = <TValue>(value: TValue): TValue => value;
const strictEquals = <TValue>(a: TValue, b: TValue): boolean => a === b;

/**
 * Defines a value object: a validated, immutable, branded value compared by
 * content rather than by reference.
 *
 * This is a factory, not a base class to extend — see
 * `docs/value-objects.md` for why. `create` returns the raw value itself,
 * tagged with the brand; there is no wrapper object holding it, so a value
 * object here is exactly as cheap as the primitive underneath it.
 *
 * @example
 * const Email = defineValueObject<string, string>({
 *   name: "Email",
 *   parse: (raw) =>
 *     EMAIL_PATTERN.test(raw)
 *       ? ok(raw.trim().toLowerCase())
 *       : err({ code: "INVALID_FORMAT", message: "invalid email format" }),
 * });
 * type Email = ReturnType<typeof Email.create> extends Result<infer T, unknown> ? T : never;
 */
export function defineValueObject<TName extends string, TRaw, TValue = TRaw>(
  options: DefineValueObjectOptions<TName, TRaw, TValue>,
): ValueObjectDefinition<TRaw, TValue, TName> {
  const serialize = options.serialize ?? (identity as (value: TValue) => unknown);
  const compare = options.equals ?? (strictEquals as (a: TValue, b: TValue) => boolean);

  type Branded = Brand<TValue, TName>;

  const create = (raw: TRaw): Result<Branded, ValueObjectError> => {
    const parsed = options.parse(raw);
    if (!parsed.ok) {
      return err({ valueObject: options.name, ...parsed.error });
    }
    return ok(parsed.value as Branded);
  };

  const is = (raw: TRaw): boolean => options.parse(raw).ok;

  const equals = (a: Branded, b: Branded): boolean => compare(a as TValue, b as TValue);

  const toJSON = (value: Branded): unknown => serialize(value as TValue);

  const toString = (value: Branded): string => {
    const serialized = serialize(value as TValue);
    return typeof serialized === "string" ? serialized : JSON.stringify(serialized);
  };

  return { create, is, equals, toJSON, toString };
}
