import fs from "fs";

const boost = {
  "Lakers|1960s": [["Rudy LaRusso", "PF", 82, 12, 9, 2, 0.8, 0.5], ["Happy Hairston", "PF", 80, 11, 8, 2, 0.6, 0.4]],
  "Lakers|1970s": [["Jim McMillian", "PF", 83, 14, 7, 3, 0.8, 0.4], ["Michael Cooper", "SG", 84, 10, 4, 4, 1.2, 0.6]],
  "Lakers|1980s": [["A.C. Green", "PF", 84, 12, 8, 1, 0.8, 0.5], ["Bob McAdoo", "C", 88, 18, 8, 2, 0.6, 1.2]],
  "Lakers|1990s": [["Eddie Jones", "SG", 86, 16, 4, 3, 1.8, 0.6], ["Robert Horry", "PF", 85, 10, 7, 3, 1, 1.2]],
  "Lakers|2000s": [["Derek Fisher", "PG", 82, 9, 2, 3, 0.8, 0.1], ["Andrew Bynum", "C", 84, 12, 9, 1, 0.5, 1.8]],
  "Lakers|2010s": [["Kyle Kuzma", "PF", 83, 16, 6, 2, 0.8, 0.5], ["Lonzo Ball", "PG", 82, 10, 6, 7, 1.3, 0.6]],
  "Lakers|2020s": [["D'Angelo Russell", "PG", 83, 18, 3, 6, 1, 0.3], ["Rui Hachimura", "PF", 81, 13, 5, 1, 0.6, 0.4]],
  "Bulls|1960s": [["Bob Love", "SF", 86, 21, 6, 2, 0.8, 0.3], ["Chet Walker", "SF", 85, 18, 6, 3, 0.8, 0.3]],
  "Bulls|1970s": [["Norm Van Lier", "PG", 84, 12, 4, 7, 1.5, 0.2], ["Bob Love", "SF", 87, 22, 6, 2, 0.8, 0.3]],
  "Bulls|1980s": [["Orlando Woolridge", "SF", 84, 18, 5, 2, 0.8, 0.5], ["Quintin Dailey", "SG", 82, 16, 3, 3, 0.8, 0.2]],
  "Bulls|1990s": [["Horace Grant", "PF", 86, 14, 10, 2, 0.8, 1.2], ["John Paxson", "PG", 82, 8, 2, 4, 0.8, 0.1]],
  "Bulls|2000s": [["Luol Deng", "SF", 85, 16, 6, 3, 1, 0.6], ["Kirk Hinrich", "PG", 82, 12, 3, 5, 1, 0.2]],
  "Bulls|2010s": [["Jimmy Butler", "SG", 88, 18, 5, 4, 1.5, 0.6], ["Joakim Noah", "C", 86, 12, 11, 4, 0.8, 1.2]],
  "Bulls|2020s": [["DeMar DeRozan", "SF", 87, 24, 5, 5, 1, 0.5], ["Nikola Vucevic", "C", 84, 18, 10, 3, 0.6, 0.8]],
  "Celtics|1960s": [["Sam Jones", "SG", 90, 18, 5, 3, 1, 0.3], ["Tom Heinsohn", "PF", 88, 18, 8, 2, 0.5, 0.4]],
  "Celtics|1970s": [["Dave Cowens", "C", 91, 18, 14, 4, 1, 1], ["Jo Jo White", "PG", 89, 18, 4, 6, 1, 0.3]],
  "Celtics|1980s": [["Dennis Johnson", "PG", 88, 14, 4, 6, 1.5, 0.8], ["Kevin McHale", "PF", 92, 20, 9, 2, 0.6, 1.8]],
  "Celtics|1990s": [["Antoine Walker", "PF", 86, 18, 8, 3, 1, 0.8], ["Dee Brown", "PG", 80, 12, 3, 4, 1.2, 0.3]],
  "Celtics|2000s": [["Rajon Rondo", "PG", 88, 11, 5, 9, 1.8, 0.2], ["Kendrick Perkins", "C", 82, 8, 8, 1, 0.5, 1.5]],
  "Celtics|2010s": [["Kyrie Irving", "PG", 90, 24, 4, 6, 1.2, 0.4], ["Al Horford", "C", 86, 14, 8, 4, 0.8, 1.2]],
  "Celtics|2020s": [["Kristaps Porzingis", "C", 87, 20, 7, 2, 0.6, 1.8], ["Derrick White", "SG", 85, 15, 4, 5, 1, 0.8]],
  "Warriors|1960s": [["Nate Thurmond", "C", 90, 18, 18, 3, 0.8, 2.5], ["Rick Barry", "SF", 92, 26, 7, 4, 1.5, 0.5]],
  "Warriors|1970s": [["Rick Barry", "SF", 91, 24, 7, 5, 1.5, 0.5], ["Jamaal Wilkes", "SF", 87, 18, 6, 3, 1.2, 0.4]],
  "Warriors|1980s": [["Chris Mullin", "SF", 90, 22, 5, 4, 1.2, 0.4], ["Tim Hardaway", "PG", 88, 18, 3, 9, 1.5, 0.2]],
  "Warriors|1990s": [["Chris Webber", "PF", 89, 20, 10, 4, 1.2, 1.5], ["Latrell Sprewell", "SG", 87, 20, 4, 4, 1.5, 0.5]],
  "Warriors|2000s": [["Jason Richardson", "SG", 85, 18, 5, 3, 0.8, 0.4], ["Baron Davis", "PG", 86, 18, 4, 8, 1.5, 0.3]],
  "Warriors|2010s": [["Klay Thompson", "SG", 90, 22, 4, 2, 0.9, 0.6], ["Draymond Green", "PF", 88, 12, 8, 7, 1.2, 1.2]],
  "Warriors|2020s": [["Andrew Wiggins", "SF", 84, 17, 5, 2, 1, 0.8], ["Jonathan Kuminga", "SF", 82, 16, 5, 2, 0.8, 0.5]],
  "Heat|1980s": [["Rony Seikaly", "C", 84, 16, 10, 1, 0.6, 1.2], ["Glen Rice", "SG", 86, 20, 5, 2, 0.8, 0.3]],
  "Heat|1990s": [["Tim Hardaway", "PG", 89, 18, 3, 8, 1.5, 0.2], ["Alonzo Mourning", "C", 91, 18, 10, 2, 0.8, 2.8]],
  "Heat|2000s": [["Udonis Haslem", "PF", 82, 10, 8, 1, 0.6, 0.3], ["Eddie Jones", "SG", 85, 15, 4, 3, 1.5, 0.5]],
  "Heat|2010s": [["Chris Bosh", "PF", 88, 18, 7, 2, 0.8, 1], ["Goran Dragic", "PG", 85, 16, 4, 5, 1, 0.2]],
  "Heat|2020s": [["Bam Adebayo", "C", 90, 18, 10, 4, 1.2, 0.9], ["Tyler Herro", "SG", 84, 20, 5, 4, 0.8, 0.3]],
  "Spurs|1960s": [["George Gervin", "SG", 91, 26, 5, 3, 1.2, 0.5], ["Artis Gilmore", "C", 88, 18, 12, 2, 0.5, 2]],
  "Spurs|1970s": [["George Gervin", "SG", 92, 27, 5, 3, 1.2, 0.5], ["James Silas", "SG", 84, 16, 3, 4, 1, 0.2]],
  "Spurs|1980s": [["David Robinson", "C", 94, 24, 12, 3, 1.2, 3.5], ["Avery Johnson", "PG", 82, 10, 3, 7, 1, 0.2]],
  "Spurs|1990s": [["David Robinson", "C", 95, 22, 11, 3, 1.2, 3], ["Sean Elliott", "SF", 85, 16, 5, 2, 0.8, 0.4]],
  "Spurs|2000s": [["Tony Parker", "PG", 90, 18, 3, 6, 1, 0.2], ["Manu Ginobili", "SG", 89, 16, 4, 4, 1.3, 0.3]],
  "Spurs|2010s": [["LaMarcus Aldridge", "PF", 88, 20, 8, 2, 0.6, 1.2], ["Patty Mills", "PG", 80, 10, 2, 3, 0.8, 0.1]],
  "Spurs|2020s": [["Dejounte Murray", "PG", 86, 18, 5, 7, 1.5, 0.4], ["Keldon Johnson", "SF", 82, 16, 6, 2, 0.8, 0.3]],
  "Nets|1970s": [["Julius Erving", "SF", 93, 28, 8, 5, 1.5, 1.2], ["Brian Taylor", "PG", 82, 14, 3, 5, 1.2, 0.2]],
  "Nets|1980s": [["Drazen Petrovic", "SG", 88, 20, 3, 4, 1, 0.2], ["Buck Williams", "PF", 85, 14, 10, 2, 0.8, 0.8]],
  "Nets|1990s": [["Kenny Anderson", "PG", 86, 16, 4, 8, 1.2, 0.2], ["Derrick Coleman", "PF", 87, 18, 10, 3, 0.8, 1]],
  "Nets|2000s": [["Jason Kidd", "PG", 92, 14, 7, 9, 1.8, 0.3], ["Vince Carter", "SG", 89, 24, 5, 5, 1.2, 0.6]],
  "Nets|2010s": [["Brook Lopez", "C", 86, 20, 7, 2, 0.6, 1.8], ["Joe Johnson", "SG", 85, 16, 4, 4, 0.8, 0.3]],
  "Nets|2020s": [["Mikal Bridges", "SF", 85, 16, 4, 3, 1, 0.8], ["Cam Thomas", "SG", 82, 20, 3, 2, 0.6, 0.2]],
  "Knicks|1960s": [["Willis Reed", "C", 91, 20, 14, 2, 0.5, 1.2], ["Walt Frazier", "PG", 93, 20, 6, 8, 1.8, 0.3]],
  "Knicks|1970s": [["Walt Frazier", "PG", 92, 18, 5, 7, 1.5, 0.3], ["Earl Monroe", "SG", 88, 18, 4, 4, 1, 0.2]],
  "Knicks|1980s": [["Bernard King", "SF", 91, 26, 6, 3, 0.8, 0.3], ["Mark Jackson", "PG", 84, 12, 4, 8, 1, 0.2]],
  "Knicks|1990s": [["Allan Houston", "SG", 87, 18, 4, 3, 0.8, 0.2], ["Larry Johnson", "PF", 85, 14, 8, 3, 0.6, 0.4]],
  "Knicks|2000s": [["Amar'e Stoudemire", "PF", 89, 24, 8, 2, 0.6, 1], ["J.R. Smith", "SG", 82, 14, 3, 2, 0.8, 0.2]],
  "Knicks|2010s": [["Carmelo Anthony", "SF", 90, 24, 7, 3, 0.8, 0.5], ["Jalen Brunson", "PG", 86, 18, 3, 6, 0.8, 0.2]],
  "Knicks|2020s": [["Julius Randle", "PF", 87, 22, 9, 5, 0.8, 0.4], ["OG Anunoby", "SF", 84, 14, 5, 2, 1.2, 0.6]],
  "Mavericks|1980s": [["Rolando Blackman", "SG", 86, 20, 4, 3, 1, 0.3], ["Mark Aguirre", "SF", 87, 22, 5, 3, 0.8, 0.4]],
  "Mavericks|1990s": [["Jason Kidd", "PG", 90, 16, 7, 9, 1.8, 0.3], ["Michael Finley", "SG", 87, 20, 5, 3, 1, 0.4]],
  "Mavericks|2000s": [["Josh Howard", "SF", 85, 16, 6, 2, 1, 0.6], ["Jason Terry", "SG", 84, 15, 3, 4, 1, 0.2]],
  "Mavericks|2010s": [["Kristaps Porzingis", "C", 88, 22, 9, 2, 0.6, 1.8], ["Jalen Brunson", "PG", 84, 16, 3, 5, 0.8, 0.2]],
  "Mavericks|2020s": [["Kyrie Irving", "PG", 89, 25, 5, 5, 1, 0.4], ["Daniel Gafford", "C", 82, 12, 8, 1, 0.5, 1.8]],
  "Suns|1960s": [["Dick Van Arsdale", "SG", 84, 16, 4, 4, 0.8, 0.2], ["Paul Silas", "PF", 82, 12, 10, 2, 0.6, 0.4]],
  "Suns|1970s": [["Paul Westphal", "SG", 88, 20, 4, 5, 1.2, 0.3], ["Alvan Adams", "C", 85, 16, 10, 4, 1, 1.2]],
  "Suns|1980s": [["Larry Nance", "PF", 86, 16, 8, 3, 1, 1.5], ["Walter Davis", "SG", 87, 22, 4, 4, 1, 0.3]],
  "Suns|1990s": [["Dan Majerle", "SG", 85, 14, 5, 3, 1, 0.6], ["Kevin Johnson", "PG", 88, 18, 3, 9, 1.5, 0.2]],
  "Suns|2000s": [["Amar'e Stoudemire", "PF", 91, 26, 9, 2, 0.6, 1.5], ["Shawn Marion", "SF", 87, 18, 10, 2, 1.2, 0.8]],
  "Suns|2010s": [["Devin Booker", "SG", 90, 26, 4, 6, 0.9, 0.3], ["Deandre Ayton", "C", 86, 18, 11, 2, 0.8, 1.2]],
  "Suns|2020s": [["Bradley Beal", "SG", 86, 18, 4, 4, 0.8, 0.4], ["Jusuf Nurkic", "C", 83, 12, 10, 3, 0.6, 1]],
  "Bucks|1960s": [["Bob Dandridge", "SF", 86, 18, 6, 3, 1, 0.6], ["Jon McGlocklin", "SG", 83, 15, 4, 4, 0.8, 0.2]],
  "Bucks|1970s": [["Bob Dandridge", "SF", 87, 18, 6, 3, 1, 0.6], ["Brian Winters", "SG", 84, 16, 4, 4, 1, 0.2]],
  "Bucks|1980s": [["Sidney Moncrief", "SG", 90, 18, 5, 5, 1.5, 0.4], ["Terry Cummings", "PF", 86, 18, 8, 2, 1, 0.6]],
  "Bucks|1990s": [["Glenn Robinson", "SF", 87, 22, 6, 3, 1, 0.6], ["Ray Allen", "SG", 89, 20, 5, 4, 1.2, 0.3]],
  "Bucks|2000s": [["Michael Redd", "SG", 88, 22, 4, 3, 1, 0.3], ["Andrew Bogut", "C", 85, 12, 10, 2, 0.6, 1.8]],
  "Bucks|2010s": [["Khris Middleton", "SF", 88, 18, 5, 4, 1, 0.4], ["Jrue Holiday", "PG", 87, 16, 4, 7, 1.5, 0.5]],
  "Bucks|2020s": [["Damian Lillard", "PG", 90, 25, 4, 7, 0.9, 0.3], ["Brook Lopez", "C", 84, 14, 6, 2, 0.5, 2]],
  "Nuggets|1970s": [["David Thompson", "SG", 90, 24, 5, 4, 1.2, 0.8], ["Dan Issel", "C", 87, 20, 10, 3, 0.6, 0.5]],
  "Nuggets|1980s": [["Alex English", "SF", 92, 26, 6, 4, 0.8, 0.5], ["Fat Lever", "PG", 86, 16, 7, 7, 2, 0.5]],
  "Nuggets|1990s": [["Dikembe Mutombo", "C", 90, 12, 12, 1, 0.5, 3.5], ["Mahmoud Abdul-Rauf", "PG", 84, 16, 2, 4, 0.8, 0.1]],
  "Nuggets|2000s": [["Carmelo Anthony", "SF", 92, 26, 7, 3, 1, 0.5], ["Marcus Camby", "C", 85, 10, 11, 2, 0.8, 2.8]],
  "Nuggets|2010s": [["Jamal Murray", "PG", 86, 18, 4, 5, 1, 0.4], ["Gary Harris", "SG", 82, 14, 3, 3, 1, 0.3]],
  "Nuggets|2020s": [["Jamal Murray", "PG", 88, 22, 4, 6, 1, 0.4], ["Michael Porter Jr.", "SF", 84, 16, 6, 2, 0.6, 0.5]],
  "Clippers|1960s": [["Bob McAdoo", "C", 88, 24, 12, 3, 0.8, 1.5], ["Randy Smith", "SG", 83, 18, 4, 5, 1.2, 0.3]],
  "Clippers|1970s": [["Bob McAdoo", "C", 89, 26, 13, 3, 0.8, 1.5], ["World B. Free", "SG", 87, 22, 4, 5, 1, 0.3]],
  "Clippers|1980s": [["Danny Manning", "PF", 86, 18, 7, 3, 1, 0.8], ["Ron Harper", "SG", 85, 16, 5, 4, 1.5, 0.8]],
  "Clippers|1990s": [["Elton Brand", "PF", 90, 20, 10, 3, 0.8, 1.5], ["Lamar Odom", "PF", 86, 16, 8, 4, 0.8, 0.8]],
  "Clippers|2000s": [["Chris Kaman", "C", 84, 16, 10, 2, 0.5, 1.2], ["Cuttino Mobley", "SG", 83, 15, 4, 3, 0.8, 0.3]],
  "Clippers|2010s": [["Lou Williams", "SG", 86, 18, 3, 4, 0.8, 0.2], ["Montrezl Harrell", "C", 84, 14, 7, 2, 0.6, 0.8]],
  "Clippers|2020s": [["Norman Powell", "SG", 84, 16, 3, 2, 0.8, 0.3], ["Ivica Zubac", "C", 83, 12, 10, 1, 0.4, 1.2]],
  "Rockets|1960s": [["Calvin Murphy", "SG", 85, 18, 3, 4, 1, 0.2], ["Rudy Tomjanovich", "SF", 84, 20, 7, 3, 0.8, 0.4]],
  "Rockets|1970s": [["Calvin Murphy", "SG", 84, 17, 3, 4, 1, 0.2], ["Rudy Tomjanovich", "SF", 83, 18, 6, 3, 0.8, 0.4]],
  "Rockets|1980s": [["Otis Thorpe", "PF", 83, 14, 9, 2, 0.6, 0.5], ["John Lucas", "PG", 82, 12, 3, 7, 1, 0.2]],
  "Rockets|1990s": [["Robert Horry", "PF", 84, 10, 7, 3, 1, 1.2], ["Mario Elie", "SG", 80, 10, 3, 2, 0.8, 0.2]],
  "Rockets|2000s": [["Shane Battier", "SF", 83, 12, 5, 2, 0.8, 0.8], ["Luis Scola", "PF", 84, 14, 8, 2, 0.6, 0.3]],
  "Rockets|2010s": [["Eric Gordon", "SG", 84, 16, 3, 2, 0.8, 0.3], ["Clint Capela", "C", 85, 14, 11, 1, 0.8, 1.5]],
  "Rockets|2020s": [["Jabari Smith Jr.", "PF", 82, 14, 7, 2, 0.6, 0.8], ["Dillon Brooks", "SF", 81, 14, 4, 2, 0.9, 0.3]],
  "Thunder|1960s": [["Lenny Wilkens", "PG", 88, 16, 5, 7, 1.5, 0.2], ["Bob Rule", "C", 82, 18, 9, 2, 0.5, 1]],
  "Thunder|1970s": [["Dennis Johnson", "PG", 87, 16, 5, 5, 1.5, 0.8], ["Gus Williams", "PG", 85, 18, 3, 6, 1.5, 0.3]],
  "Thunder|1980s": [["Dale Ellis", "SG", 86, 18, 4, 3, 0.8, 0.3], ["Xavier McDaniel", "PF", 86, 18, 7, 3, 0.8, 0.8]],
  "Thunder|1990s": [["Detlef Schrempf", "SF", 86, 16, 6, 4, 0.8, 0.4], ["Sam Perkins", "PF", 82, 12, 7, 2, 0.6, 0.6]],
  "Thunder|2000s": [["Serge Ibaka", "PF", 85, 12, 8, 1, 0.8, 2.5], ["James Harden", "SG", 86, 16, 4, 4, 1.2, 0.3]],
  "Thunder|2010s": [["Paul George", "SF", 89, 22, 7, 4, 1.5, 0.5], ["Steven Adams", "C", 84, 12, 9, 2, 0.8, 1]],
  "Thunder|2020s": [["Chet Holmgren", "C", 86, 17, 8, 3, 0.8, 2.5], ["Lu Dort", "SG", 80, 12, 4, 2, 1.2, 0.4]],
};

const clubs = {};
for (const [key, players] of Object.entries(boost)) {
  const [club, era] = key.split("|");
  clubs[club] ??= {};
  clubs[club][era] = players.map(
    (p) => `      b("${p[0]}", ["${p[1]}"], ${p.slice(2).join(", ")})`,
  );
}

let out = `import type { ClubEraPool, Seed } from "./types";

const b = (
  name: string,
  positions: string[],
  rating: number,
  ppg: number,
  rpg: number,
  apg: number,
  spg = 1,
  bpg = 0.5,
): Seed => ({
  name,
  positions,
  rating,
  stats: { ppg, rpg, apg, spg, bpg },
});

/** +2 depth players per core NBA_POOL club×era (15 franchises). */
export const NBA_CORE_BOOST: ClubEraPool = {
`;

for (const [club, eras] of Object.entries(clubs)) {
  out += `  ${club}: {\n`;
  for (const [era, lines] of Object.entries(eras)) {
    out += `    "${era}": [\n${lines.join(",\n")},\n    ],\n`;
  }
  out += `  },\n`;
}
out += "};\n";

fs.writeFileSync("scripts/seeds/nba-core-boost.ts", out);
console.log("wrote", Object.keys(boost).length, "combos to nba-core-boost.ts");
