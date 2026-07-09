import { readFileSync } from "fs";

const s = readFileSync(
  "C:/Users/user/.cursor/projects/c-Users-user-Desktop-3/agent-tools/666c085d-d8d7-41ff-a7d7-97d976073b34.txt",
  "utf8",
);

const keys = [
  "goals:",
  "assists:",
  "cleanSheets:",
  "name:",
  "clubId",
  "season:",
  "rating:",
  "ovr:",
  "ALL_PLAYERS",
  "PLAYER_DATA",
];
for (const k of keys) {
  const i = s.indexOf(k);
  if (i < 0) continue;
  console.log("\n---", k, "---");
  console.log(s.slice(i, i + 280));
}

// try player object pattern
const re = /\{id:"([^"]+)",name:"([^"]+)",[^}]*goals:(\d+)[^}]*assists:(\d+)/g;
let n = 0;
while (re.exec(s) && n++ < 3) {}
console.log("\npattern1 matches", n);
