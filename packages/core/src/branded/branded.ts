declare const brandTag: unique symbol;

/**
 * Brand marca um tipo primitivo com um nome, de modo que o TypeScript recuse
 * uma string crua onde se espera um Email.
 *
 * A marca existe apenas em tempo de compilação: em tempo de execução o valor
 * continua sendo o primitivo original.
 */
export type Brand<TValue, TBrand extends string> = TValue & {
  readonly [brandTag]: TBrand;
};

/**
 * Remove a marca, devolvendo o primitivo que está por baixo.
 *
 * O TypeScript não consegue inferir o lado esquerdo de uma interseção, então a
 * volta é feita pelo primitivo correspondente, que é o que os value objects
 * marcam na prática.
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
 * Aplica a marca a um valor já validado.
 *
 * Só deve ser chamada por quem acabou de validar o valor, normalmente o parse
 * de um value object. Fora daí, ela é uma afirmação sem prova.
 *
 * @example
 * type Email = Brand<string, "Email">;
 * const email = brand<Email>("hellen@example.com");
 */
export const brand = <TBranded extends Brand<unknown, string>>(
  value: Unbrand<TBranded>,
): TBranded => value as unknown as TBranded;
