/**
 * Result representa o desfecho de uma operação que pode falhar de forma
 * esperada: validação de formato, violação de invariante, regra de negócio.
 *
 * Erros esperados são valores, não exceções. Exceções ficam reservadas para
 * falhas inesperadas, que ninguém sabia tratar.
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

/** Cria um resultado de sucesso. */
export const ok = <TValue>(value: TValue): Ok<TValue> => ({ ok: true, value });

/** Cria um resultado de falha. */
export const err = <TError>(error: TError): Err<TError> => ({ ok: false, error });

/** Estreita o tipo para o caso de sucesso. */
export const isOk = <TValue, TError>(result: Result<TValue, TError>): result is Ok<TValue> =>
  result.ok;

/** Estreita o tipo para o caso de falha. */
export const isErr = <TValue, TError>(result: Result<TValue, TError>): result is Err<TError> =>
  !result.ok;

/** Transforma o valor de sucesso, mantendo a falha intacta. */
export const map = <TValue, TError, TNext>(
  result: Result<TValue, TError>,
  fn: (value: TValue) => TNext,
): Result<TNext, TError> => (result.ok ? ok(fn(result.value)) : result);

/** Transforma o erro, mantendo o sucesso intacto. */
export const mapErr = <TValue, TError, TNextError>(
  result: Result<TValue, TError>,
  fn: (error: TError) => TNextError,
): Result<TValue, TNextError> => (result.ok ? result : err(fn(result.error)));

/** Encadeia outra operação que também pode falhar. */
export const andThen = <TValue, TError, TNext, TNextError>(
  result: Result<TValue, TError>,
  fn: (value: TValue) => Result<TNext, TNextError>,
): Result<TNext, TError | TNextError> => (result.ok ? fn(result.value) : result);

/** Devolve o valor de sucesso ou o padrão informado. */
export const unwrapOr = <TValue, TError>(
  result: Result<TValue, TError>,
  fallback: TValue,
): TValue => (result.ok ? result.value : fallback);

/** Devolve o valor de sucesso ou o padrão calculado a partir do erro. */
export const unwrapOrElse = <TValue, TError>(
  result: Result<TValue, TError>,
  fn: (error: TError) => TValue,
): TValue => (result.ok ? result.value : fn(result.error));

/** Resolve os dois casos em um único valor. */
export const match = <TValue, TError, TOut>(
  result: Result<TValue, TError>,
  handlers: {
    readonly ok: (value: TValue) => TOut;
    readonly err: (error: TError) => TOut;
  },
): TOut => (result.ok ? handlers.ok(result.value) : handlers.err(result.error));

/**
 * Combina vários resultados em um só. Devolve todos os valores quando todos
 * são sucesso, ou o primeiro erro encontrado.
 *
 * Útil ao construir um agregado a partir de vários value objects.
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
