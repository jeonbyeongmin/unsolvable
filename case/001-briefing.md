# Case Briefing — Project Meridian

## Classification: CONFIDENTIAL

**Date:** 2025-08-11
**From:** Director of Security, External Affairs Division
**To:** Lead Investigator

---

## Summary

Dr. Elara Voss, age 34, cryptographic engineer at Arcturus Labs since 2021,
disappeared on the evening of July 28th, 2025. In the weeks prior to her
disappearance, colleagues noted increasingly unusual behavior:

- Working past midnight on at least 9 occasions
- Making commits at irregular hours
- Requesting access to production deployment logs (denied)
- Asking colleagues about "dead drops" in version control systems

Her final commit was pushed at 10:15 AM on July 28th. She has not been seen
since.

## The Repository

The Meridian codebase is a monorepo containing five packages:

- **`meridian/packages/crypto`** — Cryptographic primitives and key management
- **`meridian/packages/server`** — Backend message routing and storage
- **`meridian/packages/client-sdk`** — Client-side encryption and API
- **`meridian/packages/shared`** — Shared utilities and configuration
- **`meridian/packages/web`** — Web frontend components

The repository also contains 150 test fixture files under `meridian/test/fixtures/messages/`
and extensive git history spanning the full development timeline.

## Known Actors

| Name               | Role                 | Notes                                            |
| ------------------ | -------------------- | ------------------------------------------------ |
| **Dr. Elara Voss** | Lead Crypto Engineer | Missing. Primary suspect for evidence embedding. |
| **Marcus Hale**    | Senior Developer     | Made cleanup commits after Voss's disappearance. |
| **James Park**     | Backend Developer    | Worked closely with Voss on server package.      |
| **Sarah Chen**     | Frontend Lead        | Primarily web package.                           |
| **David Kim**      | DevOps Engineer      | Infrastructure and deployment.                   |
| **Alex Rivera**    | Junior Developer     | General contributions.                           |

## Your First Lead

Proceed to **`case/002-intercepted-email.md`** — our team intercepted a
partial email from Dr. Voss that may indicate how she hid her first piece
of evidence.

---

_"The truth is always in the code." — Dr. Elara Voss, internal Slack message, June 2025_
