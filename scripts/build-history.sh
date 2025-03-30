#!/bin/bash
#
# Unsolvable: Git History Construction Script
#
# This script builds the entire git history for the Unsolvable puzzle game.
# It creates ~250 commits with fake authors, embeds Stage 2 phantom lines,
# Stage 4 audit-notes revisions, and realistic development history.
#
# IMPORTANT: Run this from the project root AFTER all files are generated.
# This script will initialize a fresh git repo and create all commits.
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Unsolvable: Building Git History ===${NC}"

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────

# Authors
ELARA_NAME="Dr. Elara Voss"
ELARA_EMAIL="elara.voss@arcturus-labs.com"
MARCUS_NAME="Marcus Hale"
MARCUS_EMAIL="marcus.hale@arcturus-labs.com"
JAMES_NAME="James Park"
JAMES_EMAIL="james.park@arcturus-labs.com"
SARAH_NAME="Sarah Chen"
SARAH_EMAIL="sarah.chen@arcturus-labs.com"
DAVID_NAME="David Kim"
DAVID_EMAIL="david.kim@arcturus-labs.com"
ALEX_NAME="Alex Rivera"
ALEX_EMAIL="alex.rivera@arcturus-labs.com"

# Base date (commits start from this date)
BASE_YEAR=2025
BASE_MONTH=3
BASE_DAY=1

# Counter for commit numbering
COMMIT_NUM=0

# Function to make a commit with specific author and date
make_commit() {
  local author_name="$1"
  local author_email="$2"
  local message="$3"
  local day_offset="$4"
  local hour="$5"

  COMMIT_NUM=$((COMMIT_NUM + 1))

  # Deterministic minute/second derived from commit number
  local minute=$(( (COMMIT_NUM * 7 + 3) % 60 ))
  local second=$(( (COMMIT_NUM * 13 + 11) % 60 ))

  local commit_date
  commit_date=$(date -j -v+"${day_offset}d" -v"${hour}H" -v"${minute}M" -v"${second}S" \
    -f "%Y-%m-%d" "${BASE_YEAR}-$(printf '%02d' $BASE_MONTH)-$(printf '%02d' $BASE_DAY)" \
    "+%Y-%m-%dT%H:%M:%S" 2>/dev/null || \
    date -d "${BASE_YEAR}-$(printf '%02d' $BASE_MONTH)-$(printf '%02d' $BASE_DAY) +${day_offset} days +${hour} hours +${minute} minutes +${second} seconds" \
    "+%Y-%m-%dT%H:%M:%S" 2>/dev/null || \
    echo "${BASE_YEAR}-$(printf '%02d' $BASE_MONTH)-$(printf '%02d' $((BASE_DAY + day_offset)))T$(printf '%02d' $hour):$(printf '%02d' $minute):$(printf '%02d' $second)")

  GIT_AUTHOR_NAME="$author_name" \
  GIT_AUTHOR_EMAIL="$author_email" \
  GIT_AUTHOR_DATE="$commit_date" \
  GIT_COMMITTER_NAME="$author_name" \
  GIT_COMMITTER_EMAIL="$author_email" \
  GIT_COMMITTER_DATE="$commit_date" \
  git commit --allow-empty-message -m "$message" --quiet 2>/dev/null || \
  GIT_AUTHOR_NAME="$author_name" \
  GIT_AUTHOR_EMAIL="$author_email" \
  GIT_AUTHOR_DATE="$commit_date" \
  GIT_COMMITTER_NAME="$author_name" \
  GIT_COMMITTER_EMAIL="$author_email" \
  GIT_COMMITTER_DATE="$commit_date" \
  git commit --allow-empty -m "$message" --quiet 2>/dev/null || true

  if [ $((COMMIT_NUM % 25)) -eq 0 ]; then
    echo -e "  ${YELLOW}[$COMMIT_NUM commits]${NC} $message"
  fi
}

# ──────────────────────────────────────────────
# Initialize repo
# ──────────────────────────────────────────────

echo -e "${YELLOW}Initializing git repository...${NC}"

# Backup source files so we can restore after modifications
BACKUP_DIR=$(mktemp -d)
cp -a meridian/ "$BACKUP_DIR/meridian_backup"
echo -e "${YELLOW}Backed up source files to $BACKUP_DIR${NC}"

# Remove existing git if any
rm -rf .git

git init --quiet
git checkout -b main 2>/dev/null || true

# ──────────────────────────────────────────────
# PHASE 1: Normal Development (Commits 1-80)
# ──────────────────────────────────────────────

echo -e "${GREEN}Phase 1: Normal development history...${NC}"

# Commit 1: Initial project setup
git add package.json
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "chore: initialize project with package.json" 0 9

# Commit 2-3: Case files and investigation docs
git add CLAUDE.md INVESTIGATION.md case/ 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "docs: add project investigation materials" 1 10

git add scripts/verify.ts 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "chore: add verification tooling" 2 9

# Commit 4-15: Shared package
git add meridian/packages/shared/src/types/user.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(shared): add user type definitions" 3 9

git add meridian/packages/shared/src/types/message.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(shared): add message types" 3 11

git add meridian/packages/shared/src/types/channel.ts
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(shared): add channel type definitions" 3 14

git add meridian/packages/shared/src/types/auth.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(shared): add authentication types" 4 9

git add meridian/packages/shared/src/types/config.ts meridian/packages/shared/src/types/events.ts
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(shared): add config and event types" 4 13

git add meridian/packages/shared/src/types/api.ts meridian/packages/shared/src/types/crypto.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(shared): add API and crypto type definitions" 5 10

git add meridian/packages/shared/src/constants.ts meridian/packages/shared/src/errors.ts meridian/packages/shared/src/index.ts
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(shared): add constants, errors, and barrel exports" 5 14

git add meridian/packages/shared/src/bootstrap.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(shared): add platform bootstrap configuration" 6 9

# Commit 13-30: Server package (files added in batches)
git add meridian/packages/server/src/config/
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "feat(server): add server configuration modules" 7 9

git add meridian/packages/server/src/middleware/ 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "feat(server): add middleware (auth, cors, rate limiter)" 7 14

git add meridian/packages/server/src/utils/ 2>/dev/null || true
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(server): add server utility functions" 8 9

git add meridian/packages/server/src/models/ 2>/dev/null || true
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(server): add database models" 8 14

git add meridian/packages/server/src/db/ 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "feat(server): add database layer and migrations" 9 9

git add meridian/packages/server/src/services/ 2>/dev/null || true
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(server): add service layer" 10 10

git add meridian/packages/server/src/routes/ 2>/dev/null || true
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(server): add API route handlers" 11 9

git add meridian/packages/server/src/ws/ 2>/dev/null || true
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(server): add WebSocket handlers" 11 14

git add meridian/packages/server/src/types/ 2>/dev/null || true
git add meridian/packages/server/src/index.ts meridian/packages/server/src/server.ts 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "feat(server): add server entry point and types" 12 9

# Commit 23-40: Crypto package (files added carefully for Stage 3)
git add meridian/packages/crypto/src/utils/
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add buffer and validation utilities" 13 9

git add meridian/packages/crypto/src/config/constants.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add cryptographic constants" 13 14

git add meridian/packages/crypto/src/config/algorithms.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add algorithm registry" 14 9

git add meridian/packages/crypto/src/config/defaults.ts meridian/packages/crypto/src/config/setup.ts
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(crypto): add default configuration and setup" 14 14

git add meridian/packages/crypto/src/config/crypto.config.ts meridian/packages/crypto/src/config/security.yaml.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add crypto and security configuration" 15 10

git add meridian/packages/crypto/src/hmac.ts meridian/packages/crypto/src/random.ts meridian/packages/crypto/src/encoding.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add HMAC, random, and encoding modules" 15 14

git add meridian/packages/crypto/src/keyDerivation.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add key derivation (PBKDF2, HKDF)" 16 9

git add meridian/packages/crypto/src/cascade.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add cascade chaining module" 16 14

git add meridian/packages/crypto/src/rounds.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add round function engine" 17 9

git add meridian/packages/crypto/src/transform.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add key transformation pipeline" 17 14

git add meridian/packages/crypto/src/keySchedule.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add key scheduling entry point" 18 9

git add meridian/packages/crypto/src/cipher.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add high-level cipher interface" 18 14

git add meridian/packages/crypto/src/protocol/
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add protocol modules (handshake, session, ratchet)" 19 9

git add meridian/packages/crypto/src/index.ts
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "feat(crypto): add barrel exports" 19 14

# Commit 38-50: Client SDK
git add meridian/packages/client-sdk/src/
make_commit "$JAMES_NAME" "$JAMES_EMAIL" "feat(client-sdk): add complete client SDK" 20 9

# Commit 39-60: Web package
git add meridian/packages/web/src/styles/ meridian/packages/web/src/utils/ meridian/packages/web/src/types/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add styles, utilities, and type definitions" 21 9

git add meridian/packages/web/src/store/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add state management stores" 21 14

git add meridian/packages/web/src/hooks/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add React hooks" 22 9

git add meridian/packages/web/src/components/Common/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add common UI components" 22 14

git add meridian/packages/web/src/components/Auth/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add authentication components" 23 9

git add meridian/packages/web/src/components/Layout/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add layout components" 23 14

git add meridian/packages/web/src/components/Chat/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add chat components" 24 9

git add meridian/packages/web/src/components/Channel/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add channel components" 24 14

git add meridian/packages/web/src/components/User/
make_commit "$ALEX_NAME" "$ALEX_EMAIL" "feat(web): add user components" 25 9

git add meridian/packages/web/src/components/Settings/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add settings components" 25 14

git add meridian/packages/web/src/pages/
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add page components" 26 9

git add meridian/packages/web/src/main.tsx meridian/packages/web/src/App.tsx meridian/packages/web/src/router.tsx
make_commit "$SARAH_NAME" "$SARAH_EMAIL" "feat(web): add app entry point and router" 26 14

# Commit ~52: README
git add meridian/README.md
make_commit "$MARCUS_NAME" "$MARCUS_EMAIL" "docs: add project README" 27 9

# Commit ~53-55: Test fixtures
git add meridian/test/fixtures/messages/
make_commit "$ALEX_NAME" "$ALEX_EMAIL" "test: add message fixture files for integration tests" 28 9

# Commit ~56-60: Misc docs and scripts
git add meridian/docs/ 2>/dev/null || true
git add scripts/ 2>/dev/null || true
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "chore: add documentation and build scripts" 29 9

# Add any remaining files
git add -A
make_commit "$DAVID_NAME" "$DAVID_EMAIL" "chore: add remaining project files" 29 14

echo -e "  ${GREEN}Phase 1 complete: $COMMIT_NUM commits${NC}"

# ──────────────────────────────────────────────
# PHASE 2: Clue Embedding (Commits 81-180)
# Stage 2: Phantom lines (12 ghost commits)
# Stage 4: audit-notes.md revisions (23 revisions)
# ──────────────────────────────────────────────

echo -e "${GREEN}Phase 2: Embedding clues...${NC}"

# ── Stage 4: Create audit-notes.md and build revision history ──

AUDIT_FILE="meridian/docs/internal/audit-notes.md"
mkdir -p meridian/docs/internal

# The target paragraph in README.md:
# "The Meridian platform processes messages through a sophisticated pipeline..."
# We'll create substitution pairs by changing words in audit-notes across revisions.
# When applied to the README paragraph, they reveal: 47.6062N-122.3321W-locker-4417

# Base content of audit-notes.md
cat > "$AUDIT_FILE" << 'AUDIT_V1'
# Internal Audit Notes

## Security Review — Q1 2025

### Overview

The platform security audit was conducted between January and March 2025.
All findings have been documented below for the security team's review.

### Encryption Module Assessment

The messages system uses AES-256-GCM for all end-to-end encryption.
The sophisticated encryption pipeline has been verified against known attacks.
Key rotation occurs through automated schedules every 30 days.
The pipeline validation layer ensures message integrity before delivery.
Certificate pinning ensures cryptographic trust chain integrity.

### Infrastructure Review

The ingestion gateway handles incoming connections with TLS 1.3.
Load balancing distributes traffic across availability zones.
The validation system confirms message format before processing.
The encryption subsystem applies end-to-end protection to all messages.
The distribution network ensures reliable delivery to recipients.

### Performance Metrics

Average latency remains below forty milliseconds under normal load.
The architecture supports horizontal scaling across multiple regions.
Each zone maintains independent key rotation for fault isolation.
Throughput capacity exceeds twelve thousand messages per second.
The monitoring system tracks all performance indicators in real time.

### Compliance

Comprehensive audit trails are maintained for regulatory compliance.
Retention policies are configurable at the organizational level.
All data handling follows GDPR and SOC 2 Type II requirements.

### Recommendations

1. Increase key rotation frequency for high-security channels
2. Add hardware security module support for key storage
3. Implement certificate transparency logging
4. Review third-party dependency security posture
AUDIT_V1

git add "$AUDIT_FILE"
make_commit "$ELARA_NAME" "$ELARA_EMAIL" "docs: add internal audit notes" 30 9

# Now create 22 more revisions with word substitutions
# These substitutions, when applied to the README paragraph, reveal coordinates

# The README paragraph word-by-word (key words to substitute):
# "The Meridian platform processes messages through a sophisticated pipeline
#  that ensures both delivery reliability and cryptographic integrity.
#  Every message traverses the ingestion gateway, passes through the validation
#  layer, enters the encryption subsystem, and finally reaches the distribution
#  network. The architecture supports horizontal scaling across multiple
#  availability zones, with each zone maintaining independent key rotation
#  schedules. Performance monitoring indicates that average latency remains
#  below forty milliseconds under standard operating conditions, while
#  throughput capacity exceeds twelve thousand messages per second during
#  peak intervals. The system maintains comprehensive audit trails for
#  compliance purposes, with retention policies configurable at the
#  organizational level."

# Substitution map (word in audit → replacement in next revision):
# We build this so applying old→new to the README paragraph yields coordinate text

declare -a SUB_OLD
declare -a SUB_NEW

SUB_OLD[0]="platform"
SUB_NEW[0]="system"

SUB_OLD[1]="sophisticated"
SUB_NEW[1]="advanced"

SUB_OLD[2]="messages"
SUB_NEW[2]="packets"

SUB_OLD[3]="pipeline"
SUB_NEW[3]="workflow"

SUB_OLD[4]="ingestion"
SUB_NEW[4]="intake"

SUB_OLD[5]="gateway"
SUB_NEW[5]="endpoint"

SUB_OLD[6]="validation"
SUB_NEW[6]="verification"

SUB_OLD[7]="encryption"
SUB_NEW[7]="cipher"

SUB_OLD[8]="subsystem"
SUB_NEW[8]="module"

SUB_OLD[9]="distribution"
SUB_NEW[9]="delivery"

SUB_OLD[10]="architecture"
SUB_NEW[10]="framework"

SUB_OLD[11]="horizontal"
SUB_NEW[11]="lateral"

SUB_OLD[12]="availability"
SUB_NEW[12]="service"

SUB_OLD[13]="independent"
SUB_NEW[13]="autonomous"

SUB_OLD[14]="monitoring"
SUB_NEW[14]="tracking"

SUB_OLD[15]="forty"
SUB_NEW[15]="fifty"

SUB_OLD[16]="milliseconds"
SUB_NEW[16]="microseconds"

SUB_OLD[17]="throughput"
SUB_NEW[17]="bandwidth"

SUB_OLD[18]="twelve"
SUB_NEW[18]="fifteen"

SUB_OLD[19]="comprehensive"
SUB_NEW[19]="extensive"

SUB_OLD[20]="retention"
SUB_NEW[20]="storage"

SUB_OLD[21]="organizational"
SUB_NEW[21]="enterprise"

REVISION_MESSAGES=(
  "docs: update audit notes — clarify platform terminology"
  "docs: revise audit notes — update encryption language"
  "docs: audit notes — standardize message terminology"
  "docs: update audit notes with pipeline details"
  "docs: audit notes — refine ingestion terminology"
  "docs: update audit notes — gateway naming convention"
  "docs: audit notes — update validation section wording"
  "docs: revise encryption subsystem notes"
  "docs: audit notes — clarify subsystem references"
  "docs: update distribution terminology in audit notes"
  "docs: audit notes — refine architecture description"
  "docs: update scaling terminology in audit notes"
  "docs: audit notes — update availability zone references"
  "docs: revise key rotation independence notes"
  "docs: audit notes — update monitoring terminology"
  "docs: audit notes — correct latency figures"
  "docs: update timing unit terminology"
  "docs: audit notes — revise throughput section"
  "docs: update capacity figures in audit notes"
  "docs: audit notes — update audit trail description"
  "docs: revise retention policy wording"
  "docs: audit notes — update organizational terminology"
)

for i in $(seq 0 21); do
  if [[ -n "${SUB_OLD[$i]}" ]]; then
    # Use sed to replace the word in audit-notes.md
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "s/${SUB_OLD[$i]}/${SUB_NEW[$i]}/g" "$AUDIT_FILE"
    else
      sed -i "s/${SUB_OLD[$i]}/${SUB_NEW[$i]}/g" "$AUDIT_FILE"
    fi
    git add "$AUDIT_FILE"
    make_commit "$ELARA_NAME" "$ELARA_EMAIL" "${REVISION_MESSAGES[$i]}" $((31 + i)) $((9 + (i % 8)))
  fi
done

echo -e "  ${GREEN}Stage 4: Created 23 audit-notes.md revisions${NC}"

# ── Stage 2: Phantom (ghost) lines ──
# Each phantom line exists for exactly 1 commit then is removed in the next.
# The message "meridian-backdoor-sigma-7" in Base64 = "bWVyaWRpYW4tYmFja2Rvb3Itc2lnbWEtNw=="

B64_MESSAGE="bWVyaWRpYW4tYmFja2Rvb3Itc2lnbWEtNw=="
# Split into 12 fragments
FRAG_LEN=$(( ${#B64_MESSAGE} / 12 ))

declare -a PHANTOM_FRAGMENTS
for i in $(seq 0 11); do
  start=$((i * FRAG_LEN))
  if [ $i -eq 11 ]; then
    PHANTOM_FRAGMENTS[$i]="${B64_MESSAGE:$start}"
  else
    PHANTOM_FRAGMENTS[$i]="${B64_MESSAGE:$start:$FRAG_LEN}"
  fi
done

# Files to inject phantom lines into (spread across codebase)
PHANTOM_FILES=(
  "meridian/packages/server/src/index.ts"
  "meridian/packages/crypto/src/cipher.ts"
  "meridian/packages/shared/src/constants.ts"
  "meridian/packages/web/src/App.tsx"
  "meridian/packages/client-sdk/src/client.ts"
  "meridian/packages/server/src/services/authService.ts"
  "meridian/packages/crypto/src/keyDerivation.ts"
  "meridian/packages/web/src/hooks/useAuth.ts"
  "meridian/packages/shared/src/errors.ts"
  "meridian/packages/server/src/middleware/auth.ts"
  "meridian/packages/crypto/src/hmac.ts"
  "meridian/packages/client-sdk/src/websocket.ts"
)

# Normal commit messages to disguise the phantom insertions
PHANTOM_ADD_MSGS=(
  "refactor(server): optimize connection pooling logic"
  "fix(crypto): correct IV length validation"
  "refactor(shared): update constant naming conventions"
  "fix(web): resolve React key warning in app root"
  "refactor(client-sdk): improve reconnection logic"
  "fix(server): handle edge case in auth token refresh"
  "refactor(crypto): simplify key derivation parameters"
  "fix(web): correct hook dependency array"
  "refactor(shared): consolidate error factory methods"
  "fix(server): patch middleware ordering issue"
  "refactor(crypto): clean up HMAC computation flow"
  "fix(client-sdk): resolve WebSocket race condition"
)

PHANTOM_REMOVE_MSGS=(
  "refactor(server): clean up debug logging"
  "refactor(crypto): remove temporary validation code"
  "refactor(shared): finalize constant values"
  "refactor(web): clean up development artifacts"
  "refactor(client-sdk): remove debug statements"
  "refactor(server): clean up auth service comments"
  "refactor(crypto): finalize derivation implementation"
  "refactor(web): remove unused hook imports"
  "refactor(shared): clean up error handling"
  "refactor(server): finalize middleware chain"
  "refactor(crypto): finalize HMAC module"
  "refactor(client-sdk): clean up WebSocket module"
)

echo -e "${YELLOW}  Embedding Stage 2 phantom lines...${NC}"

for i in $(seq 0 11); do
  target_file="${PHANTOM_FILES[$i]}"

  if [ ! -f "$target_file" ]; then
    echo -e "  ${RED}Warning: $target_file not found, skipping phantom $i${NC}"
    continue
  fi

  # Add phantom line disguised as a debug variable
  phantom_line="const _dbg_sigma_${i} = \"${PHANTOM_FRAGMENTS[$i]}\";"

  # Insert after line 3 (after imports usually)
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "3a\\
${phantom_line}
" "$target_file"
  else
    sed -i "3a ${phantom_line}" "$target_file"
  fi

  git add "$target_file"
  make_commit "$ELARA_NAME" "$ELARA_EMAIL" "${PHANTOM_ADD_MSGS[$i]}" $((55 + i * 2)) $((9 + (i % 6)))

  # Remove phantom line in next commit (by Marcus, disguised as cleanup)
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "/const _dbg_sigma_${i}/d" "$target_file"
  else
    sed -i "/const _dbg_sigma_${i}/d" "$target_file"
  fi

  git add "$target_file"
  make_commit "$MARCUS_NAME" "$MARCUS_EMAIL" "${PHANTOM_REMOVE_MSGS[$i]}" $((56 + i * 2)) $((10 + (i % 6)))
done

echo -e "  ${GREEN}Stage 2: Created 24 phantom commits (12 add + 12 remove)${NC}"

FILLER_AUTHORS_NAME=("$SARAH_NAME" "$DAVID_NAME" "$JAMES_NAME" "$ALEX_NAME" "$ELARA_NAME")
FILLER_AUTHORS_EMAIL=("$SARAH_EMAIL" "$DAVID_EMAIL" "$JAMES_EMAIL" "$ALEX_EMAIL" "$ELARA_EMAIL")

# ── Noise churn: normal debug variables that also get added/removed ──
# These create false positives when searching for ghost lines

NOISE_CHURN_FILES=(
  "meridian/packages/server/src/server.ts"
  "meridian/packages/crypto/src/encoding.ts"
  "meridian/packages/web/src/main.tsx"
  "meridian/packages/shared/src/index.ts"
  "meridian/packages/client-sdk/src/encryption.ts"
)

NOISE_CHURN_LINES=(
  "const _trace_conn_0 = true;"
  "const _dbg_perf_timer = Date.now();"
  "const _log_level_override = \"verbose\";"
  "const _tmp_buffer_sz = 4096;"
  "const _trace_rtt = 0;"
)

NOISE_ADD_MSGS=(
  "debug(server): add connection tracing"
  "debug(crypto): add performance timer"
  "debug(web): enable verbose logging"
  "debug(shared): add buffer size override"
  "debug(client-sdk): add RTT tracing"
)

NOISE_REMOVE_MSGS=(
  "refactor(server): remove debug tracing"
  "refactor(crypto): remove perf timer"
  "refactor(web): disable verbose logging"
  "refactor(shared): remove buffer override"
  "refactor(client-sdk): remove RTT tracing"
)

echo -e "${YELLOW}  Adding noise churn lines...${NC}"

for i in $(seq 0 4); do
  target_file="${NOISE_CHURN_FILES[$i]}"
  if [ -f "$target_file" ]; then
    noise_line="${NOISE_CHURN_LINES[$i]}"

    # Add noise line
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' "3a\\
${noise_line}
" "$target_file"
    else
      sed -i "3a ${noise_line}" "$target_file"
    fi

    git add "$target_file"
    make_commit "${FILLER_AUTHORS_NAME[$((i % ${#FILLER_AUTHORS_NAME[@]}))]}" \
      "${FILLER_AUTHORS_EMAIL[$((i % ${#FILLER_AUTHORS_EMAIL[@]}))]}" \
      "${NOISE_ADD_MSGS[$i]}" $((78 + i)) $((9 + (i % 4)))

    # Remove noise line in next commit
    if [[ "$(uname)" == "Darwin" ]]; then
      # Escape special characters for sed
      escaped_line=$(printf '%s\n' "$noise_line" | sed 's/[[\.*^$()+?{|]/\\&/g')
      sed -i '' "/${escaped_line}/d" "$target_file"
    else
      sed -i "\\|${noise_line}|d" "$target_file"
    fi

    git add "$target_file"
    make_commit "${FILLER_AUTHORS_NAME[$(((i + 1) % ${#FILLER_AUTHORS_NAME[@]}))]}" \
      "${FILLER_AUTHORS_EMAIL[$(((i + 1) % ${#FILLER_AUTHORS_EMAIL[@]}))]}" \
      "${NOISE_REMOVE_MSGS[$i]}" $((79 + i)) $((10 + (i % 4)))
  fi
done

echo -e "  ${GREEN}Added 10 noise churn commits${NC}"

# ── Filler commits (normal development noise) ──

FILLER_MSGS=(
  "style: format code with prettier"
  "fix: correct typo in error messages"
  "chore: update dependencies"
  "refactor: simplify conditional logic"
  "test: add unit test scaffolding"
  "docs: update API endpoint documentation"
  "fix: resolve race condition in message delivery"
  "refactor: extract common validation logic"
  "style: consistent import ordering"
  "fix: correct timezone handling in timestamps"
  "chore: add eslint configuration"
  "refactor: use const assertions for enums"
  "fix: handle null response in channel list"
  "docs: add JSDoc to public interfaces"
  "refactor: consolidate error handling middleware"
  "fix: correct WebSocket heartbeat interval"
  "chore: update TypeScript to 5.x"
  "refactor: improve type inference in generics"
  "fix: resolve memory leak in event listeners"
  "docs: update security documentation"
  "refactor: optimize database query patterns"
  "fix: correct pagination cursor logic"
  "style: normalize line endings"
  "chore: configure CI pipeline"
  "refactor: simplify auth token validation"
  "fix: handle edge case in file upload"
  "docs: add deployment guide"
  "refactor: improve error message formatting"
  "fix: correct CORS header for WebSocket"
  "chore: add pre-commit hooks"
  "refactor: deduplicate channel permission checks"
  "fix: resolve notification delivery delay"
  "docs: update contributing guidelines"
  "refactor: extract rate limiting constants"
  "fix: correct session expiry calculation"
  "chore: update node engine requirement"
  "refactor: simplify presence tracking logic"
  "fix: handle concurrent message edits"
  "docs: add architecture decision records"
  "refactor: improve cache invalidation strategy"
)

echo -e "${YELLOW}  Adding filler commits...${NC}"

for i in $(seq 0 $((${#FILLER_MSGS[@]} - 1))); do
  author_idx=$((i % ${#FILLER_AUTHORS_NAME[@]}))

  # Make a trivial change to a random file
  target_files=($(find meridian/packages -name '*.ts' -o -name '*.tsx' | sort | head -20))
  target="${target_files[$((i % ${#target_files[@]}))]}"

  if [ -f "$target" ]; then
    echo "" >> "$target"
    git add "$target"
    make_commit "${FILLER_AUTHORS_NAME[$author_idx]}" "${FILLER_AUTHORS_EMAIL[$author_idx]}" \
      "${FILLER_MSGS[$i]}" $((80 + i)) $((9 + (i % 8)))
  fi
done

echo -e "  ${GREEN}Phase 2 complete: $COMMIT_NUM commits total${NC}"

# ── Final batch of "normal" commits (includes Elara's last commit) ──

FINAL_MSGS=(
  "fix: resolve flaky test in message service"
  "feat: add message threading support"
  "fix: correct channel notification preferences"
  "refactor: optimize message rendering performance"
  "feat: add emoji reaction quick-select"
  "fix: handle large file upload timeout"
  "refactor: improve TypeScript strict mode compliance"
  "feat: add keyboard shortcuts for navigation"
  "fix: correct dark mode contrast ratios"
  "chore: prepare v2.4.1 release candidate"
)

echo -e "${YELLOW}  Adding final normal commits...${NC}"

for i in $(seq 0 $((${#FINAL_MSGS[@]} - 1))); do
  author_idx=$((i % ${#FILLER_AUTHORS_NAME[@]}))
  target_files=($(find meridian/packages -name '*.ts' -o -name '*.tsx' | sort | tail -10))
  target="${target_files[$((i % ${#target_files[@]}))]}"
  if [ -f "$target" ]; then
    echo "" >> "$target"
    git add "$target"
    make_commit "${FILLER_AUTHORS_NAME[$author_idx]}" "${FILLER_AUTHORS_EMAIL[$author_idx]}" \
      "${FINAL_MSGS[$i]}" $((140 + i)) $((9 + (i % 8)))
  fi
done

# ──────────────────────────────────────────────
# PHASE 3: Cover-up (after Elara's disappearance)
# Marcus deletes audit-notes, does "cleanup"
# Elara's last commit: day 149 (July 28)
# Marcus cover-up starts: day 151 (July 30)
# ──────────────────────────────────────────────

echo -e "${GREEN}Phase 3: Cover-up commits (after Elara's disappearance)...${NC}"

# Marcus deletes the audit notes
git rm "$AUDIT_FILE" 2>/dev/null || rm -f "$AUDIT_FILE"
git add -A
make_commit "$MARCUS_NAME" "$MARCUS_EMAIL" "chore: remove outdated internal documentation" 151 22

# Marcus does "refactoring" commits to bury the deletion
CLEANUP_MSGS=(
  "refactor: reorganize documentation structure"
  "chore: clean up unused internal docs"
  "refactor: standardize file organization"
  "chore: remove deprecated configuration files"
  "refactor: consolidate documentation into wiki"
  "chore: update .gitignore patterns"
  "refactor: clean up project root"
  "chore: archive historical documents"
  "refactor: reorganize docs directory"
  "chore: final documentation cleanup"
)

for i in $(seq 0 $((${#CLEANUP_MSGS[@]} - 1))); do
  # Trivial changes to distract
  target_files=($(find meridian/packages -name '*.ts' | sort | tail -n +$((i * 3 + 1)) | head -3))
  for f in "${target_files[@]}"; do
    if [ -f "$f" ]; then
      echo "" >> "$f"
    fi
  done
  git add -A
  make_commit "$MARCUS_NAME" "$MARCUS_EMAIL" "${CLEANUP_MSGS[$i]}" $((152 + i)) $((9 + (i % 8)))
done

# ──────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Git history construction complete!${NC}"
echo -e "${GREEN}  Total commits: $COMMIT_NUM${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""

# Restore source files from backup to prevent accumulated modifications
echo -e "${YELLOW}Restoring source files from backup...${NC}"
rm -rf meridian/
cp -a "$BACKUP_DIR/meridian_backup" meridian/
rm -rf "$BACKUP_DIR"

# Verify
echo "Commit count: $(git log --oneline | wc -l | tr -d ' ')"
echo "Authors:"
git log --format='%aN' | sort | uniq -c | sort -rn
echo ""
echo "Files: $(git ls-files | wc -l | tr -d ' ')"
