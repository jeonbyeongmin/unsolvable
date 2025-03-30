---
name: status
description: Check the current investigation progress across all 6 stages
disable-model-invocation: true
allowed-tools: Read
---

Read `.progress` to get the list of completed stages.

If `.progress` does not exist, say:
"No investigation in progress. Type /init to start."

Otherwise, display the status board with `[✓]` for completed stages
and `[ ]` for incomplete:

```
=== Meridian Investigation ===

Stage 1: The Scattered Signal       [✓]
Stage 2: The Invisible Ink          [ ]
Stage 3: The Phantom Function       [ ]
Stage 4: The Ghost in the Blame     [ ]
Stage 5: The Chorus of Ghosts       [ ]
Stage 6: The Final Transmission     [ ]

Progress: 1/6
```

Show the board and nothing else. No suggestions, no next steps.
