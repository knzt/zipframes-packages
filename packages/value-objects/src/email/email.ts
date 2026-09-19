import { err, ok } from "@zipframes/core/result";
import type { Brand } from "@zipframes/core";

import { defineValueObject } from "../base/index.js";

// Pragmatic, not RFC 5322: rejects the obviously wrong (no @, no domain, a
// space) without trying to be the final authority on what an email is. The
// only way to really know an address is valid is to send it a message.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 255;

export const Email = defineValueObject({
  name: "Email",
  parse: (raw: string) => {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      return err({ code: "EMPTY", message: "email must not be empty" });
    }
    if (trimmed.length > MAX_LENGTH) {
      return err({
        code: "TOO_LONG",
        message: `email must be at most ${String(MAX_LENGTH)} characters`,
      });
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      return err({ code: "INVALID_FORMAT", message: "invalid email format" });
    }

    // Normalized to lowercase, per docs/domain/dominio.md: two accounts
    // must not be able to differ only by case.
    return ok(trimmed.toLowerCase());
  },
});

export type Email = Brand<string, "Email">;
