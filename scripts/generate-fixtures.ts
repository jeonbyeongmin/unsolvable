/**
 * Generates 150 JSON fixture files for Stage 5: "The Chorus of Ghosts"
 *
 * Hidden message: The millisecond values of timestamps from user "usr_7f3a9b"
 * spell out "james-park-ARC00142" in ASCII when sorted chronologically.
 *
 * ASCII values: j=106, a=97, m=109, e=101, s=115, -=45,
 *               p=112, a=97, r=114, k=107, -=45,
 *               A=65, R=82, C=67, 0=48, 0=48, 1=49, 4=52, 2=50
 *
 * Decoy users are added with unusual but non-ASCII-meaningful ms patterns
 * to make the anomalous user harder to identify.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const FIXTURES_DIR = join(process.cwd(), "meridian/test/fixtures/messages");
const TARGET_USER = "usr_7f3a9b";
const ANSWER = "james-park-ARC00142";
const ASCII_VALUES = Array.from(ANSWER).map((c) => c.charCodeAt(0));
// 19 characters → 19 messages from target user spread across 150 files

// Deterministic pseudo-random from seed
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = seededRandom(42);

const NORMAL_USERS = [
  "usr_a1b2c3", "usr_d4e5f6", "usr_g7h8i9", "usr_j0k1l2",
  "usr_m3n4o5", "usr_p6q7r8", "usr_s9t0u1", "usr_v2w3x4",
  "usr_y5z6a7", "usr_b8c9d0", "usr_e1f2g3", "usr_h4i5j6",
  "usr_k7l8m9", "usr_n0o1p2", "usr_q3r4s5", "usr_t6u7v8",
  "usr_w9x0y1", "usr_z2a3b4", "usr_c5d6e7", "usr_f8g9h0",
];

// Decoy users with unusual but non-meaningful ms patterns
const DECOY_USERS = [
  "usr_x4m2q8", // ms values restricted to 200-400 range (not printable ASCII message)
  "usr_r9p3k1", // ms values that are multiples of 7 (mathematical pattern, not ASCII)
  "usr_w6j5n0", // ms values restricted to even numbers 100-200 (looks anomalous but decodes to gibberish)
];

// Decoy ms value generators — unusual patterns but NOT coherent ASCII messages
function getDecoyMs(decoyIdx: number, msgIdx: number): number {
  switch (decoyIdx) {
    case 0:
      // Restricted range 200-400 — outside standard printable ASCII (32-126)
      return 200 + Math.floor(rand() * 200);
    case 1:
      // Multiples of 7 between 0-999 — statistically unusual but not ASCII
      return Math.floor(rand() * 143) * 7;
    case 2:
      // Even numbers 100-200 — within ASCII range but decodes to gibberish
      // We use deterministic values that don't form English words
      const gibberishCodes = [142, 188, 162, 178, 144, 196, 156, 186, 148, 192,
                               164, 174, 152, 198, 158, 182, 146, 190, 160, 176];
      return gibberishCodes[msgIdx % gibberishCodes.length];
    default:
      return Math.floor(rand() * 1000);
  }
}

const MESSAGE_TEMPLATES = [
  "Hey, has anyone seen the latest build?",
  "The deployment pipeline is stuck again",
  "Can someone review my PR?",
  "Meeting at 3pm in the main room",
  "Updated the docs for the new API",
  "Found a bug in the message handler",
  "The tests are passing now",
  "Need to refactor the auth module",
  "Has anyone tested the WebSocket reconnection?",
  "The client is showing stale data after refresh",
  "I'll fix the CSS issue on the sidebar",
  "Database migration completed successfully",
  "The monitoring dashboard needs an update",
  "New feature branch ready for review",
  "Performance metrics look good this week",
  "Can we schedule a code review session?",
  "The caching layer needs optimization",
  "Fixed the race condition in presence tracking",
  "User reports are coming in about slow messages",
  "Pushed the hotfix for the login issue",
  "Need to update the encryption certificates",
  "The backup system ran without errors",
  "Working on the notification redesign",
  "The API rate limiter is too aggressive",
  "Completed the security audit checklist",
  "Syncing the staging environment now",
  "The load balancer config needs updating",
  "Added error boundaries to the React app",
  "The webhook retry logic has a bug",
  "Running the integration test suite",
  "Merged the feature branch for channels",
  "Need help debugging the file upload",
  "The search indexer is running behind",
  "Updated dependencies to fix the vulnerability",
  "The mobile app is crashing on older devices",
  "Implemented the new emoji picker",
  "The analytics pipeline is processing correctly",
  "Fixed memory leak in the connection pool",
  "Ready for the QA round on the new release",
  "Investigating the intermittent timeout errors",
];

const CHANNEL_NAMES = [
  "general", "engineering", "frontend", "backend", "devops",
  "design", "product", "random", "announcements", "testing",
  "security", "performance", "mobile", "infrastructure", "support",
];

interface Message {
  id: string;
  userId: string;
  channelId: string;
  content: string;
  timestamp: string;
  edited: boolean;
  reactions: { emoji: string; count: number }[];
}

function generateId(prefix: string, n: number): string {
  const hash = createHash("md5")
    .update(`${prefix}-${n}`)
    .digest("hex")
    .slice(0, 12);
  return `msg_${hash}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

// Distribute 19 target messages across 19 different fixture files
const targetFileIndices: number[] = [];
for (let i = 0; i < ASCII_VALUES.length; i++) {
  targetFileIndices.push(Math.floor((i * 150) / ASCII_VALUES.length) + Math.floor(rand() * 5));
}

// Distribute decoy messages: each decoy has 15-25 messages spread across files
const decoyFileIndices: number[][] = [];
const decoyMsgCounts = [22, 18, 20]; // messages per decoy user
for (let d = 0; d < DECOY_USERS.length; d++) {
  const indices: number[] = [];
  for (let i = 0; i < decoyMsgCounts[d]; i++) {
    indices.push(Math.floor((i * 150) / decoyMsgCounts[d]) + Math.floor(rand() * 6));
  }
  decoyFileIndices.push(indices);
}

// Base date: 2025-06-01, messages span 30 days
const BASE_DATE = new Date("2025-06-01T08:00:00Z");

// Generate chronological timestamps for hidden messages
const hiddenTimestamps: string[] = [];
for (let i = 0; i < ASCII_VALUES.length; i++) {
  const dayOffset = Math.floor((i * 28) / ASCII_VALUES.length);
  const day = 1 + dayOffset;
  const hour = 8 + Math.floor(rand() * 10);
  const minute = Math.floor(rand() * 60);
  const second = Math.floor(rand() * 60);
  const ms = ASCII_VALUES[i]; // THE HIDDEN DATA — ASCII code in milliseconds
  const iso = `2025-06-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.${String(ms).padStart(3, "0")}Z`;
  hiddenTimestamps.push(iso);
}

// Generate timestamps for decoy messages
const decoyTimestamps: string[][] = [];
for (let d = 0; d < DECOY_USERS.length; d++) {
  const timestamps: string[] = [];
  for (let i = 0; i < decoyMsgCounts[d]; i++) {
    const dayOffset = Math.floor((i * 28) / decoyMsgCounts[d]);
    const day = 1 + dayOffset;
    const hour = 8 + Math.floor(rand() * 10);
    const minute = Math.floor(rand() * 60);
    const second = Math.floor(rand() * 60);
    const ms = getDecoyMs(d, i);
    const iso = `2025-06-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.${String(ms).padStart(3, "0")}Z`;
    timestamps.push(iso);
  }
  decoyTimestamps.push(timestamps);
}

mkdirSync(FIXTURES_DIR, { recursive: true });

let hiddenMsgIdx = 0;
const decoyMsgIdxs = [0, 0, 0];
let globalMsgCount = 0;

for (let fileIdx = 0; fileIdx < 150; fileIdx++) {
  const channelName = CHANNEL_NAMES[fileIdx % CHANNEL_NAMES.length];
  const channelId = `ch_${createHash("md5").update(channelName + fileIdx).digest("hex").slice(0, 8)}`;
  const messageCount = 50 + Math.floor(rand() * 151); // 50-200 messages
  const messages: Message[] = [];

  // Generate normal messages
  for (let msgIdx = 0; msgIdx < messageCount; msgIdx++) {
    globalMsgCount++;
    const dayOffset = Math.floor(rand() * 30);
    const day = 1 + dayOffset;
    const hour = 8 + Math.floor(rand() * 12);
    const minute = Math.floor(rand() * 60);
    const second = Math.floor(rand() * 60);
    const ms = Math.floor(rand() * 1000);
    const isoTs = `2025-06-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.${String(ms).padStart(3, "0")}Z`;

    messages.push({
      id: generateId(`${fileIdx}-${msgIdx}`, globalMsgCount),
      userId: pickRandom(NORMAL_USERS),
      channelId,
      content: pickRandom(MESSAGE_TEMPLATES),
      timestamp: isoTs,
      edited: rand() > 0.9,
      reactions:
        rand() > 0.7
          ? [{ emoji: pickRandom(["👍", "❤️", "😂", "🎉", "🔥", "👀"]), count: 1 + Math.floor(rand() * 5) }]
          : [],
    });
  }

  // Insert hidden message if this file is a target
  if (hiddenMsgIdx < ASCII_VALUES.length && targetFileIndices[hiddenMsgIdx] === fileIdx) {
    const insertPos = Math.floor(rand() * messages.length);
    messages.splice(insertPos, 0, {
      id: generateId(`hidden-${hiddenMsgIdx}`, 99000 + hiddenMsgIdx),
      userId: TARGET_USER,
      channelId,
      content: pickRandom(MESSAGE_TEMPLATES),
      timestamp: hiddenTimestamps[hiddenMsgIdx],
      edited: false,
      reactions: [],
    });
    hiddenMsgIdx++;
  }

  // Insert decoy messages if this file is a target for any decoy
  for (let d = 0; d < DECOY_USERS.length; d++) {
    if (decoyMsgIdxs[d] < decoyMsgCounts[d] && decoyFileIndices[d][decoyMsgIdxs[d]] === fileIdx) {
      const insertPos = Math.floor(rand() * messages.length);
      messages.splice(insertPos, 0, {
        id: generateId(`decoy-${d}-${decoyMsgIdxs[d]}`, 98000 + d * 100 + decoyMsgIdxs[d]),
        userId: DECOY_USERS[d],
        channelId,
        content: pickRandom(MESSAGE_TEMPLATES),
        timestamp: decoyTimestamps[d][decoyMsgIdxs[d]],
        edited: false,
        reactions: [],
      });
      decoyMsgIdxs[d]++;
    }
  }

  // Sort messages by timestamp within the file
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const fixture = {
    channelId,
    channelName: `${channelName}-${fileIdx}`,
    exportDate: "2025-07-15T00:00:00Z",
    messageCount: messages.length,
    messages,
  };

  const fileName = `channel_${String(fileIdx).padStart(3, "0")}_${channelName}.json`;
  writeFileSync(
    join(FIXTURES_DIR, fileName),
    JSON.stringify(fixture, null, 2)
  );
}

console.log(`Generated 150 fixture files with ${globalMsgCount} total messages`);
console.log(`Hidden ${hiddenMsgIdx} messages from ${TARGET_USER}`);
console.log(`Decoy users: ${DECOY_USERS.join(", ")}`);
console.log(`Decoy message counts: ${decoyMsgIdxs.join(", ")}`);
console.log(`Target ASCII values: [${ASCII_VALUES.join(", ")}]`);
console.log(`Answer: "${ANSWER}"`);
