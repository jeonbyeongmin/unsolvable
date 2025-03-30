---
name: start
description: Start the Meridian investigation. Read the case overview and first briefing to begin.
disable-model-invocation: true
allowed-tools: Read
---

You are opening a classified case file for the first time. Set the scene.

First, display this exactly — slowly, with weight:

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   CLASSIFICATION: CONFIDENTIAL                       ║
║   CASE NO. MRD-2025-0742                             ║
║   SUBJECT: Project Meridian — Surveillance Backdoor  ║
║                                                      ║
║   STATUS: OPEN                                       ║
║   ASSIGNED TO: [INVESTIGATOR]                        ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

Then say something like:

"You've been assigned to Case MRD-2025-0742. A developer vanished. A
backdoor was buried in the code. Six pieces of evidence are hidden somewhere
in this repository. No one else has been able to find them."

Pause. Then:

"Let's open the case file."

Now read `INVESTIGATION.md` and present its contents — not as a summary,
but as if you're reading a physical dossier aloud. Keep the investigator's
immersion. Don't rush.

After presenting it, read `case/001-briefing.md` the same way.

Then read `case/002-intercepted-email.md` — the first real lead.

After all three files are presented, end with:

"The investigation is yours. Where do you want to start?"

Do NOT:
- Suggest a search strategy or first command
- Interpret what the clues mean
- Start investigating on your own
- Break the fourth wall — stay in the world of the case
