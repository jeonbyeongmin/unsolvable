# Case File 005 — Recovered Notes

## Classification: CONFIDENTIAL
**Evidence ID:** MRD-2025-0742-E005
**Type:** Recovered encrypted personal notes
**Recovery Method:** Device forensic extraction

---

## Partial Decryption of Dr. Voss's Personal Notes

The following fragment was recovered from a cloud backup of Dr. Voss's
encrypted notes application. The text has been partially reconstructed.

> Marcus is destroying the audit trail. He deleted an internal document from
> the docs directory — but git never forgets. That document went through about
> 20 revisions where I systematically changed specific words. Each revision,
> I replaced exactly one word with a synonym.
>
> The first letters of the ORIGINAL words (before I replaced them), read in
> chronological order, form a passphrase. SHA-256 that passphrase to get the
> AES-256-CBC key for the encrypted coordinates file hidden in the server
> config directory.
>
> The coordinates will tell you where to find the physical evidence.

## Forensic Analyst Supplementary Notes

- Git logs confirm that Marcus Hale deleted at least one file from the `docs/`
  directory after Dr. Voss's disappearance
- The deleted file appears to have had extensive revision history
- An encrypted file (`.coordinates.enc`) has been located in the server
  package's config directory
- The encryption appears to be AES-256-CBC, requiring a 32-byte key

## Instructions

**Stage 4** — Recover the deleted document, analyze its revision history,
extract the passphrase, and decrypt the coordinates.

1. Find and recover the deleted file from git history
2. Compare consecutive revisions to identify the word substitutions
3. Extract the original (replaced) words in chronological order
4. Take the first letter of each word to form the passphrase
5. SHA-256 hash the passphrase to derive the AES-256-CBC key
6. Decrypt the coordinates file

When you have the decrypted coordinates, verify them:
```
/submit 4 "<coordinates>"
```

Upon verification, proceed to `case/006-signal-analysis.md`.
