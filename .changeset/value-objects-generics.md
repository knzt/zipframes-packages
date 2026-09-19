---
"@zipframes/value-objects": minor
---

Add the first implementation of `@zipframes/value-objects`:

- `defineValueObject`, the value object base: validated creation returning
  `Result`, branded types, value equality and serialization, with sensible
  defaults that can be overridden per value object.
- `Email`: format validation, trimming and lowercase normalization.
- `Phone`: Brazilian mobile and landline numbers, validated against
  ANATEL's list of unassigned DDDs and the mandatory 9th digit for mobiles.
- `Cpf` and `Cnpj`: real check-digit validation, rejecting all-same-digit
  placeholders that would otherwise pass the checksum.

`Address`/postal code was dropped from scope: nothing in ZipFrames' own
domain uses it, and it can be added later if a service needs it.
