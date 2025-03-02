# Case File 004 — Anonymous Tip

## Classification: CONFIDENTIAL
**Evidence ID:** MRD-2025-0742-E004
**Type:** Anonymous informant communication
**Date Received:** 2025-08-05

---

## Encrypted Channel Transcript

The following message was received via an encrypted dead drop. The sender's
identity has not been verified, but the information is consistent with our
existing evidence.

> The word "sigma" from the backdoor key isn't just a codename — it's a
> trigger. There's a function in the crypto package that behaves differently
> when it encounters "sigma" as an algorithm parameter. Trace the call chain.
> You'll find it routes through at least 4 files before reaching the
> exfiltration code.
>
> The backdoor activates only under a specific combination of parameters
> scattered across multiple files in the crypto package. Find the function,
> its trigger conditions, and the exact activation signature.
>
> The answer is in the format:
> `functionName:algorithm:rounds:mode:value`
>
> Don't trust the public API surface — the real behavior is buried in the
> internal modules.

## Analyst Notes

- The "sigma" reference connects directly to the Stage 2 finding
- The crypto package (`meridian/packages/crypto/src/`) contains multiple modules
  handling key scheduling, transformations, and cipher rounds
- The backdoor appears to be a conditional code path that only activates
  under specific parameter combinations
- Parameters may be defined as defaults or constants across several files

## Instructions

**Stage 3** — Trace the backdoor activation path in the crypto package.

Find the function that responds to "sigma", trace its call chain through
the crypto internals, and determine the exact parameter combination that
triggers the backdoor.

When you have the activation signature, verify it:
```
/submit 3 "<functionName:algorithm:rounds:mode:value>"
```

Upon verification, proceed to `case/005-recovered-notes.md`.
