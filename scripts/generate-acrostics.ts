/**
 * Stage 1: Embeds acrostic comments across source files.
 *
 * The message: "ELARA WAS HERE FIND THE ENCRYPTION KEY"
 * Split into 31 single-character fragments (spaces removed), each embedded
 * as a review comment marked with review(EVR) — Elara Voss Review.
 *
 * Red herring review comments are also added with tags:
 * MPH (Marcus P. Hale), JKP (James K. Park), SC (Sarah Chen),
 * DK (David Kim), AR (Alex Rivera)
 *
 * ~100 review comments total, only 31 are EVR (the real signal).
 * Files must be read in git creation order to reassemble the message.
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, extname } from "path";

const FULL_MESSAGE = "ELARA WAS HERE FIND THE ENCRYPTION KEY";
const ENCODED_CHARS = Array.from(FULL_MESSAGE.replace(/ /g, ""));
// 31 chars: E,L,A,R,A,W,A,S,H,E,R,E,F,I,N,D,T,H,E,E,N,C,R,Y,P,T,I,O,N,K,E,Y

// For each character, plausible code review comment words starting with that letter
const WORD_MAP: Record<string, string[]> = {
  E: ["Ensure", "Execute", "Extract", "Evaluate", "Enable", "Emit"],
  L: ["Load", "Link", "Log", "Limit", "Launch", "List"],
  A: ["Apply", "Audit", "Analyze", "Allocate", "Attach", "Assert"],
  R: ["Run", "Reset", "Retrieve", "Resolve", "Return", "Register"],
  W: ["Write", "Wrap", "Watch", "Wait"],
  S: ["Send", "Store", "Sync", "Set", "Stream", "Schedule"],
  H: ["Handle", "Hash", "Hook", "Halt"],
  F: ["Filter", "Fetch", "Format", "Flush", "Forward"],
  I: ["Initialize", "Import", "Invoke", "Inspect", "Index"],
  N: ["Normalize", "Notify", "Navigate", "Negotiate"],
  D: ["Dispatch", "Decode", "Derive", "Deliver"],
  T: ["Transform", "Track", "Trigger", "Transmit", "Transfer"],
  C: ["Connect", "Create", "Cache", "Configure", "Compile"],
  P: ["Process", "Parse", "Propagate", "Prepare"],
  O: ["Orchestrate", "Observe", "Open", "Output"],
  K: ["Keep", "Key"],
  Y: ["Yield"],
};

// Red herring reviewer tags and their "review style" comment starters
const HERRING_TAGS = ["MPH", "JKP", "SC", "DK", "AR"];

const HERRING_COMMENTS = [
  "Consider refactoring this into a helper",
  "Validate input before processing",
  "Add error handling for edge cases",
  "This could benefit from caching",
  "Check for null/undefined here",
  "Performance: consider lazy loading",
  "May need rate limiting in production",
  "Verify this handles concurrent access",
  "Should we add retry logic here?",
  "Clean up unused imports above",
  "Potential memory leak if not disposed",
  "Move this constant to config",
  "Add unit test coverage for this path",
  "Break this into smaller functions",
  "Type assertion needed for safety",
  "Review timeout value — seems low",
  "Audit log entry missing here",
  "Session validation should come first",
  "Handle the disconnect edge case",
  "Replace magic number with named constant",
  "Batch these operations for throughput",
  "Guard clause would simplify this",
  "Normalize before comparison",
  "Key rotation needed per policy",
  "Encrypt before persisting to storage",
  "Fallback mechanism for service outage",
  "Track metrics for this operation",
  "Output format should match spec v2",
  "Index this field for query perf",
  "Yield control to event loop periodically",
  "Reduce coupling between modules",
  "Abstract the transport layer",
  "Defer initialization until first use",
  "Compress payload before transmission",
  "Sync state across replicas",
  "Limit concurrency to prevent overload",
  "Schedule cleanup during idle window",
  "Forward context through middleware chain",
  "Parse strictly per RFC 7230",
  "Propagate errors to caller",
  "Register shutdown hook for cleanup",
  "Stream large responses to avoid OOM",
  "Watch for file descriptor leaks",
  "Cache invalidation strategy needed",
  "Connect with backoff on retry",
  "Filter sensitive fields from logs",
  "Negotiate protocol version on handshake",
  "Observe and emit lifecycle events",
  "Pin dependency version for stability",
  "Queue overflow handling missing",
  "Transfer ownership semantics unclear",
  "Wrap in transaction for atomicity",
  "Allocate buffer from pool",
  "Dispatch async to avoid blocking",
  "Invoke callback with proper context",
  "Launch workers in round-robin order",
  "Decode charset per Content-Type header",
  "Attach correlation ID for tracing",
  "Prepare rollback plan for migration",
  "Hash comparison must be timing-safe",
];

// Filler phrases for EVR review comments (to look like real code reviews)
const EVR_FILLERS = [
  "data stream before validation step",
  "channel integrity on each heartbeat",
  "protocol buffer sequence alignment",
  "message queue before processing batch",
  "authentication flow at entry point",
  "key rotation cycle per schedule",
  "session token before each request",
  "rate limiter at gateway threshold",
  "connection pool on initialization",
  "event dispatch after state change",
  "buffer allocation for large payloads",
  "cache layer before database query",
  "encryption state after handshake",
  "error boundary around async calls",
  "timeout handler for stale connections",
  "serialization format for wire protocol",
  "compression ratio check on output",
  "retry logic with exponential backoff",
  "input sanitization before transform",
  "metric emission at critical paths",
  "circuit breaker state transitions",
  "load balancer health check response",
  "graceful shutdown sequence order",
  "dependency injection container setup",
  "middleware chain execution order",
  "resource cleanup on process exit",
  "telemetry data before aggregation",
  "schema validation at API boundary",
  "thread pool sizing configuration",
  "garbage collection pressure monitoring",
  "deadlock detection in lock manager",
];

function getAllSourceFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        ["node_modules", ".git", "dist", "test", "scripts", "game"].includes(
          entry.name
        )
      )
        continue;
      results.push(...getAllSourceFiles(fullPath));
    } else if (
      [".ts", ".tsx"].includes(extname(entry.name)) &&
      !entry.name.endsWith(".d.ts")
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

const ROOT = process.cwd();
const allFiles = getAllSourceFiles(join(ROOT, "meridian", "packages"));
allFiles.sort();

if (allFiles.length < ENCODED_CHARS.length) {
  console.error(
    `Need ${ENCODED_CHARS.length} files but only found ${allFiles.length}`
  );
  process.exit(1);
}

// Select files evenly distributed for EVR comments
const step = Math.floor(allFiles.length / ENCODED_CHARS.length);
const evrFiles: string[] = [];
for (let i = 0; i < ENCODED_CHARS.length; i++) {
  const idx = Math.min(i * step, allFiles.length - 1);
  evrFiles.push(allFiles[idx]);
}

// Track word usage to avoid repetition
const usedWords: Record<string, number> = {};

function getWord(char: string): string {
  const words = WORD_MAP[char.toUpperCase()];
  if (!words) throw new Error(`No words for character: ${char}`);
  let best = words[0];
  let bestCount = Infinity;
  for (const w of words) {
    const count = usedWords[w] || 0;
    if (count < bestCount) {
      bestCount = count;
      best = w;
    }
  }
  usedWords[best] = (usedWords[best] || 0) + 1;
  return best;
}

// Deterministic seed for reproducible red herring placement
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

const rng = seededRandom(42);

function insertComment(filePath: string, comment: string): void {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Find insertion point after imports/header comments
  let insertIdx = 0;
  for (let j = 0; j < lines.length; j++) {
    if (
      lines[j].startsWith("import ") ||
      lines[j].startsWith(" * ") ||
      lines[j].startsWith("//")
    ) {
      insertIdx = j + 1;
    } else if (lines[j].trim() === "") {
      if (insertIdx > 0) break;
    } else {
      break;
    }
  }

  lines.splice(insertIdx, 0, comment);
  writeFileSync(filePath, lines.join("\n"));
}

// ============================================================
// Phase 1: Embed EVR (Elara Voss Review) acrostic comments
// ============================================================
console.log("=== Embedding EVR review comments (signal) ===");
const evrFileSet = new Set(evrFiles);

for (let i = 0; i < ENCODED_CHARS.length; i++) {
  const file = evrFiles[i];
  const char = ENCODED_CHARS[i];
  const word = getWord(char);
  const filler = EVR_FILLERS[i % EVR_FILLERS.length];
  const comment = `// review(EVR): ${word} ${filler}`;

  insertComment(file, comment);

  const relPath = file.replace(ROOT + "/", "");
  console.log(
    `[${i + 1}/${ENCODED_CHARS.length}] ${char} → "${word}" → ${relPath}`
  );
}

// ============================================================
// Phase 2: Embed red herring review comments (~65 total)
// ============================================================
console.log("\n=== Embedding red herring review comments (noise) ===");

// Select files for herring comments (avoiding EVR files where possible for variety)
const herringFiles = allFiles.filter((f) => !evrFileSet.has(f));
// Also add some to EVR files to increase confusion
const allTargetFiles = [...herringFiles, ...evrFiles];

let herringCount = 0;
const TARGET_HERRINGS = 65;

for (let i = 0; i < TARGET_HERRINGS; i++) {
  const fileIdx = Math.floor(rng() * allTargetFiles.length);
  const file = allTargetFiles[fileIdx];
  const tag = HERRING_TAGS[i % HERRING_TAGS.length];
  const commentText = HERRING_COMMENTS[i % HERRING_COMMENTS.length];
  const comment = `// review(${tag}): ${commentText}`;

  insertComment(file, comment);
  herringCount++;

  const relPath = file.replace(ROOT + "/", "");
  console.log(`[herring ${i + 1}/${TARGET_HERRINGS}] ${tag} → ${relPath}`);
}

console.log(`\n=== Summary ===`);
console.log(`EVR comments (signal): ${ENCODED_CHARS.length}`);
console.log(`Red herring comments: ${herringCount}`);
console.log(`Total review comments: ${ENCODED_CHARS.length + herringCount}`);
console.log(`Message: "${FULL_MESSAGE}"`);
console.log("Files must be sorted by git creation date to read the message.");
