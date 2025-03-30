import { createDecipheriv, createHash } from "crypto";
import { readFileSync } from "fs";

const answers = [
  "ELARA WAS HERE FIND THE ENCRYPTION KEY",
  "meridian-backdoor-sigma-7",
  "normalizeKeySchedule:sigma:7:cascade:true",
  "47.6062N-122.3321W-locker-4417",
  "james-park-ARC00142",
];

function decrypt(ct: string, pw: string): string {
  const key = createHash("sha256").update(pw).digest();
  const [ivH, encH] = ct.split(":");
  const decipher = createDecipheriv("aes-256-cbc", key, Buffer.from(ivH, "hex"));
  return decipher.update(encH, "hex", "utf8") + decipher.final("utf8");
}

const content = readFileSync("meridian/packages/shared/src/bootstrap.ts", "utf-8");
const match = content.match(/ENCRYPTED_PAYLOAD = "([^"]+)"/);
if (!match) {
  console.log("ERROR: payload not found");
  process.exit(1);
}

let payload = match[1];
for (let i = answers.length - 1; i >= 0; i--) {
  payload = decrypt(payload, answers[i]);
}
console.log("Final evidence UUID:", payload);
