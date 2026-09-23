#!/usr/bin/env bash
set -euo pipefail

name="${1:-}"
if [[ ! "$name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
  printf 'Usage: ./scripts/set-secret.sh VAR_NAME\n' >&2
  exit 2
fi

value="$(osascript - "$name" <<'APPLESCRIPT'
on run argv
  set secretName to item 1 of argv
  set answer to display dialog ("Paste the value for " & secretName) default answer "" with hidden answer buttons {"Cancel", "Save"} default button "Save"
  return text returned of answer
end run
APPLESCRIPT
)"
if [[ -z "$value" || "$value" == *$'\n'* ]]; then
  printf 'No value saved.\n' >&2
  exit 1
fi

cd "$(dirname "$0")/.."
SECRET_NAME="$name" SECRET_VALUE="$value" node -e '
const fs = require("node:fs");
const path = ".env.local";
const name = process.env.SECRET_NAME;
const line = `${name}=${JSON.stringify(process.env.SECRET_VALUE)}`;
const source = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
const rows = source.split(/\r?\n/).filter(row => row && !row.startsWith(`${name}=`));
rows.push(line);
fs.writeFileSync(path, `${rows.join("\n")}\n`, { mode: 0o600 });
fs.chmodSync(path, 0o600);
console.log(`${name} saved to gitignored .env.local`);
'
