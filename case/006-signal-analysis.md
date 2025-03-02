# Case File 006 — Signal Intelligence Report

## Classification: CONFIDENTIAL
**Evidence ID:** MRD-2025-0742-E006
**Type:** Signal analysis findings
**Prepared by:** Signals Intelligence Division

---

## Test Fixture Data Analysis

Our analysts believe the test fixture data in this repository isn't purely
synthetic. Someone embedded a real message in the timing metadata of chat
messages.

### Hypothesis

Among the 150 fixture files and approximately 19,000 messages, one specific
user sent messages where the **millisecond values of their timestamps aren't
random** — they form an ASCII-encoded message when read in chronological
order. This message contains the name and employee ID of Dr. Voss's inside
contact at Arcturus Labs.

### Technical Details

- Test fixtures are located in `meridian/test/fixtures/messages/`
- Each fixture file contains an array of message objects with timestamps
- Timestamps include millisecond precision
- Normal users' millisecond values are uniformly distributed (0-999)
- The anomalous user's millisecond values are constrained to a specific range
  consistent with printable ASCII character codes

### Approach

1. Identify which user's millisecond values are statistically anomalous
2. There are multiple users with slightly unusual timing patterns — only
   one produces a coherent message when decoded
3. Sort the anomalous user's messages chronologically across all fixture files
4. Extract the millisecond component from each timestamp
5. Convert each millisecond value to its ASCII character equivalent

## Instructions

**Stage 5** — Identify the anomalous user and decode their hidden message.

When you have the contact's name and ID, verify it:
```
/submit 5 "<name-and-id>"
```

Upon verification, proceed to `case/007-final-decrypt.md`.
