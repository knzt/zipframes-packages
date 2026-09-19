import { err, ok } from "@zipframes/core/result";
import type { Brand } from "@zipframes/core";

import { defineValueObject } from "../base/index.js";

// DDD codes ANATEL has never assigned (Plano Geral de Códigos Nacionais).
// Everything else in the 11-99 range, with a non-zero second digit, is a
// real area code.
const UNASSIGNED_DDD = new Set([
  20, 23, 25, 26, 29, 30, 36, 39, 40, 50, 52, 56, 57, 58, 59, 60, 70, 72, 76, 78, 80, 90,
]);

const isValidDdd = (ddd: number): boolean => ddd >= 11 && ddd <= 99 && !UNASSIGNED_DDD.has(ddd);

// A mobile local number has 9 digits: the mandatory leading 9 (added
// nationwide since 2016), followed by a prefix of 6-9 carried over from the
// 8-digit numbers it replaced. A landline has 8 digits, starting 2-5.
const MOBILE_LOCAL_NUMBER = /^9[6-9]\d{7}$/;
const LANDLINE_LOCAL_NUMBER = /^[2-5]\d{7}$/;

const ALLOWED_CHARACTERS = /^[\d()+\-\s]+$/;

export const Phone = defineValueObject({
  name: "Phone",
  parse: (raw: string) => {
    if (!ALLOWED_CHARACTERS.test(raw)) {
      return err({
        code: "INVALID_CHARACTERS",
        message: "phone must contain only digits and the usual formatting characters",
      });
    }

    // The country code is optional on input and never kept: every phone
    // this value object represents is Brazilian.
    const digitsOnly = raw.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");

    if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
      return err({
        code: "INVALID_LENGTH",
        message: "phone must have 10 digits (landline) or 11 digits (mobile), DDD included",
      });
    }

    const ddd = Number(digitsOnly.slice(0, 2));
    const localNumber = digitsOnly.slice(2);

    if (!isValidDdd(ddd)) {
      return err({ code: "INVALID_DDD", message: `${String(ddd)} is not an assigned DDD` });
    }

    const isMobile = localNumber.length === 9;
    const pattern = isMobile ? MOBILE_LOCAL_NUMBER : LANDLINE_LOCAL_NUMBER;
    if (!pattern.test(localNumber)) {
      return err({
        code: "INVALID_LOCAL_NUMBER",
        message: isMobile
          ? "a 9-digit mobile number must start with 9 followed by 6, 7, 8 or 9"
          : "an 8-digit landline number must start with 2, 3, 4 or 5",
      });
    }

    return ok(digitsOnly);
  },
});

export type Phone = Brand<string, "Phone">;
