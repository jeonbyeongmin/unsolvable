---
name: init
description: Initialize or reset the investigation progress
disable-model-invocation: true
allowed-tools: Write, Read
---

Reset the investigation progress by writing this file:

**File:** `.progress`

```json
{
  "started": "<current ISO timestamp>",
  "completed": []
}
```

Then display:

```
Investigation progress has been reset.
Type /start to begin.
```

If `.progress` already existed and had completed stages, warn before resetting:
"You have progress on stages [list]. This will erase it. Proceed?"

Only reset after the investigator confirms.
