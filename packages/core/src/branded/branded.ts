declare const brandTag: unique symbol;

/**
 * Brand tags a primitive with a name, so TypeScript rejects a raw string where
 * an Email is expected.
 */
export type Brand<TValue, TBrand extends string> = TValue & {
  readonly [brandTag]: TBrand;
};

/**
 * Strips the tag, giving back the primitive underneath.
 *
 * TypeScript cannot infer the left side of an intersection, so the mapping
 * goes through the matching primitive, which is what value objects tag in
 * practice.
 */
export type Unbrand<TBranded> = TBranded extends string
  ? string
  : TBranded extends number
    ? number
    : TBranded extends boolean
      ? boolean
      : TBranded extends bigint
        ? bigint
        : TBranded;

/**
 * Tags a value that has already been validated.
 *
 * @example
 * type Email = Brand<string, "Email">;
 * const email = brand<Email>("hellen@example.com");
 */
export const brand = <TBranded extends Brand<unknown, string>>(
  value: Unbrand<TBranded>,
): TBranded => value as unknown as TBranded;
