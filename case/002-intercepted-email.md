# Case File 002 — Intercepted Email

## Classification: CONFIDENTIAL
**Evidence ID:** MRD-2025-0742-E002
**Type:** Intercepted electronic communication
**Date Intercepted:** 2025-07-25

---

## Context

The following email was intercepted by Arcturus Labs' internal security team.
It was sent from Dr. Voss's personal email account to an unidentified
recipient. The email was partially encrypted; our analysts recovered the
following fragments.

## Recovered Fragments

> **From:** e.voss_personal@[REDACTED]
> **To:** [REDACTED]
> **Subject:** RE: the audit
>
> [...] I've been leaving notes in my code reviews across the project — they
> look routine, but read the first letter of each one carefully. Only look
> at MY reviews — the others are just noise. [...]
>
> [...] every package has some of them. I used my initials as the reviewer
> tag so you'd know which ones are mine [...]
>
> [...] sort them by their file path — the project tree tells you the
> order. That's the only way to read them correctly [...]

## Analyst Notes

- Dr. Voss appears to have embedded a hidden message using an acrostic
  technique within code review comments
- The comments are distributed across the entire codebase
- Multiple reviewers appear to have left comments, but only Dr. Voss's
  contain the hidden message
- The comments must be read in **alphabetical order by file path** to
  extract the correct message

## Instructions

**Stage 1** — Find and decode Dr. Voss's hidden message in the code review
comments.

When you have the full message, verify it:
```
/submit 1 "<message>"
```

Upon verification, proceed to `case/003-forensic-report.md`.
