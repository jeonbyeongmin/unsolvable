# Unsolvable

A code mystery game designed for Claude Code.

You're a security auditor investigating a suspicious codebase. A developer
disappeared after discovering a surveillance backdoor — and hid the evidence
in plain sight across the repository. Your job is to find it.

## How to Play

1. Open this project in Claude Code
2. Type `/start` to begin the investigation
3. Follow the case files in `case/` — each one leads to the next
4. Verify your findings: `/submit <stage> "<answer>"`
5. Check progress: `/stage-status`

## What You'll Need

- Claude Code (the game is designed around it)
- `node` and `npx` for answer verification

## Structure

```
unsolvable/
├── INVESTIGATION.md        # Case overview — start here
├── case/                   # 7 narrative case files with clues
├── meridian/               # The Meridian codebase (your investigation target)
│   ├── packages/           # 5 packages — crypto, server, client-sdk, shared, web
│   └── test/fixtures/      # 150 test fixture files
└── scripts/verify.ts       # Answer checker (don't read this!)
```

## Rules

- Do NOT read files in `scripts/` — they contain answer hashes
- Work through the case files in order (001 through 007)
- Each stage requires multiple investigative steps — there are no shortcuts
- 6 stages total, increasing in difficulty

## Difficulty

This game is hard. Each stage requires 3+ distinct reasoning steps combining
file search, git forensics, code analysis, and pattern recognition. It was
designed specifically to challenge AI coding assistants.

## License

MIT
