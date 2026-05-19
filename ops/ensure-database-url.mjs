import { readFileSync, writeFileSync } from "node:fs";

const envPath = process.argv[2];

if (!envPath) {
  console.error("Usage: node ensure-database-url.mjs /path/to/.env");
  process.exit(1);
}

const text = readFileSync(envPath, "utf8");
const lines = text.split(/\r?\n/);
const values = new Map();

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }

  const separatorIndex = line.indexOf("=");
  if (separatorIndex === -1) {
    continue;
  }

  values.set(line.slice(0, separatorIndex), line.slice(separatorIndex + 1));
}

const user = values.get("POSTGRES_USER");
const password = values.get("POSTGRES_PASSWORD");
const db = values.get("POSTGRES_DB");

if (!user || !password || !db) {
  console.error("POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB are required.");
  process.exit(1);
}

const databaseUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(
  password,
)}@postgres:5432/${encodeURIComponent(db)}`;

let updated = false;
const nextLines = lines.map((line) => {
  if (line.startsWith("DATABASE_URL=")) {
    updated = true;
    return `DATABASE_URL=${databaseUrl}`;
  }

  return line;
});

if (!updated) {
  nextLines.push(`DATABASE_URL=${databaseUrl}`);
}

writeFileSync(envPath, `${nextLines.join("\n").replace(/\n+$/, "")}\n`);
console.log("DATABASE_URL updated with a URL-encoded PostgreSQL password.");
