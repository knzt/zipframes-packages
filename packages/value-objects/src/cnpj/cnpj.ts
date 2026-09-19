import { err, ok } from "@zipframes/core/result";
import type { Brand } from "@zipframes/core";

import { defineValueObject } from "../base/index.js";

const FIRST_CHECK_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_CHECK_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const calculateCheckDigit = (digits: readonly number[], weights: readonly number[]): number => {
  const total = digits.reduce((sum, digit, index) => sum + digit * weights[index]!, 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const isValidCheckDigits = (digits: readonly number[]): boolean => {
  const base = digits.slice(0, 12);
  const firstCheck = calculateCheckDigit(base, FIRST_CHECK_WEIGHTS);
  const secondCheck = calculateCheckDigit([...base, firstCheck], SECOND_CHECK_WEIGHTS);
  return digits[12] === firstCheck && digits[13] === secondCheck;
};

// Only digits and the punctuation a formatted CNPJ actually uses are
// accepted; anything else is rejected outright rather than silently
// discarded.
const ALLOWED_CHARACTERS = /^[\d./\-\s]+$/;

export const Cnpj = defineValueObject({
  name: "Cnpj",
  parse: (raw: string) => {
    if (!ALLOWED_CHARACTERS.test(raw)) {
      return err({
        code: "INVALID_CHARACTERS",
        message: "CNPJ must contain only digits, dots, slashes, dashes and spaces",
      });
    }

    const digitsOnly = raw.replace(/\D/g, "");

    if (digitsOnly.length !== 14) {
      return err({ code: "INVALID_LENGTH", message: "CNPJ must have 14 digits" });
    }

    // 00.000.000/0000-00, 11.111.111/1111-11, etc. pass the check-digit
    // formula below by construction, but are never real CNPJs.
    if (/^(\d)\1{13}$/.test(digitsOnly)) {
      return err({ code: "ALL_SAME_DIGIT", message: "CNPJ cannot have all the same digit" });
    }

    const digits = digitsOnly.split("").map(Number);
    if (!isValidCheckDigits(digits)) {
      return err({ code: "INVALID_CHECK_DIGIT", message: "invalid CNPJ check digits" });
    }

    return ok(digitsOnly);
  },
});

export type Cnpj = Brand<string, "Cnpj">;
