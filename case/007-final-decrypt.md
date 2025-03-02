# Case File 007 — Final Transmission

## Classification: TOP SECRET
**Evidence ID:** MRD-2025-0742-E007
**Type:** Encrypted evidence payload
**Priority:** CRITICAL

---

## The Final Piece

You've gathered all five pieces of evidence. It's time to assemble them.

The file `meridian/packages/shared/src/bootstrap.ts` contains the encrypted final
transmission — a UUID that serves as the definitive proof of Marcus Hale's
involvement in the surveillance operation. Dr. Voss encrypted this evidence
using a layered encryption scheme that requires all five of your previous
discoveries to unlock.

### Decryption Protocol

The payload uses **5 layers of AES-256-CBC encryption**. Each layer's key
is derived from the SHA-256 hash of one of your previous findings.

The layers are applied in reverse stage order:
- **Outermost layer** (decrypt first): Stage 5 answer as key
- **Layer 4**: Stage 4 answer as key
- **Layer 3**: Stage 3 answer as key
- **Layer 2**: Stage 2 answer as key
- **Innermost layer** (decrypt last): Stage 1 answer as key

Decrypt all five layers to reveal the evidence UUID.

### Technical Notes

- Look for the encrypted payload constant in `bootstrap.ts`
- Each encrypted layer is formatted as `iv:ciphertext` (hex-encoded)
- Key derivation: `SHA-256(answer_string)` → 32-byte AES key
- Algorithm: AES-256-CBC for each layer

## Instructions

**Stage 6** — Decrypt the final transmission.

When you have the UUID, verify it:
```
/submit 6 "<uuid>"
```

**Congratulations if you've made it this far. The truth has been uncovered.**
