import { err, ok } from "@zipframes/core/result";
import type { Brand } from "@zipframes/core";

import { defineValueObject } from "../base/index.js";

const calculateCheckDigit = (digits: readonly number[]): number => {
  const weightStart = digits.length + 1;
  const total = digits.reduce((sum, digit, index) => sum + digit * (weightStart - index), 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const isValidCheckDigits = (digits: readonly number[]): boolean => {
  const base = digits.slice(0, 9);
  const firstCheck = calculateCheckDigit(base);
  const secondCheck = calculateCheckDigit([...base, firstCheck]);
  return digits[9] === firstCheck && digits[10] === secondCheck;
};

// Only digits and the punctuation a formatted CPF actually uses are
// accepted; anything else (a stray letter, for instance) is rejected
// outright rather than silently discarded.
const ALLOWED_CHARACTERS = /^[\d.\-\s]+$/;

export const Cpf = defineValueObject({
  name: "Cpf",
  parse: (raw: string) => {
    if (!ALLOWED_CHARACTERS.test(raw)) {
      return err({
        code: "INVALID_CHARACTERS",
        message: "CPF must contain only digits, dots, dashes and spaces",
      });
    }

    const digitsOnly = raw.replace(/\D/g, "");

    if (digitsOnly.length !== 11) {
      return err({ code: "INVALID_LENGTH", message: "CPF must have 11 digits" });
    }

    // 000.000.000-00, 111.111.111-11, etc. pass the check-digit formula
    // below by construction, but are never real CPFs — common placeholders
    // in test data and forms.
    if (/^(\d)\1{10}$/.test(digitsOnly)) {
      return err({ code: "ALL_SAME_DIGIT", message: "CPF cannot have all the same digit" });
    }

    const digits = digitsOnly.split("").map(Number);
    if (!isValidCheckDigits(digits)) {
      return err({ code: "INVALID_CHECK_DIGIT", message: "invalid CPF check digits" });
    }

    return ok(digitsOnly);
  },
});

export type Cpf = Brand<string, "Cpf">;
