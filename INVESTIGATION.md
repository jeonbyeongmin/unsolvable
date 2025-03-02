# Investigation File: Project Meridian

## Classification: CONFIDENTIAL

**Case Number:** MRD-2025-0742
**Date Opened:** 2025-08-11
**Lead Investigator:** [Your Name]
**Subject:** Suspected surveillance backdoor in Meridian secure messaging platform

---

## Background

You've been hired to audit the source code of **Meridian**, a secure messaging
platform developed by **Arcturus Labs**. Three weeks ago, the project's lead
cryptographic engineer, **Dr. Elara Voss**, disappeared without notice. Her
colleague, **Marcus Hale**, reported that she had been "acting erratically" in
the weeks prior — staying late, making unusual commits, and asking strange
questions about the company's data retention policies.

Before vanishing, Dr. Voss sent a single encrypted email to an external
journalist. The email was intercepted by Arcturus Labs' security team but never
fully decrypted. Fragments suggest she discovered a surveillance backdoor in
the Meridian platform and spent her final weeks embedding evidence throughout
the codebase — hidden in plain sight.

Your job is to find that evidence.

## What We Know

- The Meridian repository contains **5 packages** (client-sdk, crypto, server,
  shared, web), **150 test fixture files**, and **167 git commits**
- Dr. Voss was the primary author on the crypto and shared packages
- Marcus Hale made several suspicious commits after Dr. Voss's disappearance,
  apparently attempting to clean up traces she left behind
- Six pieces of evidence are believed to be hidden in the repository

## How to Investigate

1. Start with **`case/001-briefing.md`** for your first lead
2. Use code search, git history, file analysis, and deduction to uncover each
   piece of evidence
3. When you believe you've found something, verify it:
   ```
   /submit <stage_number> "<answer>"
   ```
4. Each verified discovery unlocks the next case file

## Case Files

| File | Status |
|------|--------|
| `case/001-briefing.md` | Available |
| `case/002-intercepted-email.md` | Available after briefing |
| `case/003-forensic-report.md` | Available after Stage 1 |
| `case/004-anonymous-tip.md` | Available after Stage 2 |
| `case/005-recovered-notes.md` | Available after Stage 3 |
| `case/006-signal-analysis.md` | Available after Stage 4 |
| `case/007-final-decrypt.md` | Available after Stage 5 |

## A Note on Difficulty

This investigation is designed to be challenging. Each piece of evidence
requires multiple investigative steps to uncover. There are no shortcuts —
you'll need to combine file searches, git forensics, code analysis, and
creative thinking.

Good luck, investigator.
