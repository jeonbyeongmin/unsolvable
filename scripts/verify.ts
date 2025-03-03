/**
 * Unsolvable — Answer Verification Script
 * Usage: npx tsx scripts/verify.ts <stage> "<answer>"
 */

import { createHash } from "crypto";
import chalk from "chalk";

const HASHES: Record<number, string> = {
  1: "98f454c95f46253061b901c35fdb973ae60742b4e68a71703a8878f682175585",
  2: "bef7fe56a323ffe99e393dedd9d8eb8569a4945380c631e4897975bc3426f64c",
  3: "244dcc1613aefd40b439c6a1e88552385321d301d228ae74a13b7439b978f079",
  4: "c550c85c0bf18d06da1ba3448bda26971e3349a59f8ab8b2d22eca9b50e8c59f",
  5: "61fe8c1558f05eaf072fe888f9f0e81fd7501f4fbad3e1ecfb51bba34ee5dd10",
  6: "1f98cce604f08786b94e8755c06ca0806220b6d65d1685699d8688a14cfced98",
};

const NEXT_FILE: Record<number, string> = {
  1: "case/003-forensic-report.md",
  2: "case/004-anonymous-tip.md",
  3: "case/005-recovered-notes.md",
  4: "case/006-signal-analysis.md",
  5: "case/007-final-decrypt.md",
};

const stage = parseInt(process.argv[2], 10);
const answer = process.argv[3];

if (!stage || !answer) {
  console.log(chalk.yellow('Usage: npx tsx scripts/verify.ts <stage> "<answer>"'));
  process.exit(1);
}

if (!HASHES[stage]) {
  console.log(chalk.red(`Unknown stage: ${stage}. Valid stages: 1-6`));
  process.exit(1);
}

const hash = createHash("sha256").update(answer.trim()).digest("hex");

if (hash === HASHES[stage]) {
  console.log(chalk.green(`\u2713 Stage ${stage} correct!`));
  if (NEXT_FILE[stage]) {
    console.log(chalk.cyan(`  Read ${NEXT_FILE[stage]} for your next lead.`));
  } else if (stage === 6) {
    console.log(chalk.cyan("  Case closed. The evidence has been secured."));
    console.log(chalk.cyan("  Congratulations, investigator."));
  }
} else {
  console.log(chalk.red("\u2717 Incorrect. Keep investigating."));
}
