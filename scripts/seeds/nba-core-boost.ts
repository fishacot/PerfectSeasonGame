import type { ClubEraPool, Seed } from "./types";

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
  Lakers: {
    "1960s": [
      b("Rudy LaRusso", ["PF"], 82, 12, 9, 2, 0.8, 0.5),
      b("Happy Hairston", ["PF"], 80, 11, 8, 2, 0.6, 0.4),
    ],
    "1970s": [
      b("Jim McMillian", ["PF"], 83, 14, 7, 3, 0.8, 0.4),
      b("Michael Cooper", ["SG"], 84, 10, 4, 4, 1.2, 0.6),
    ],
    "1980s": [
      b("A.C. Green", ["PF"], 84, 12, 8, 1, 0.8, 0.5),
      b("Bob McAdoo", ["C"], 88, 18, 8, 2, 0.6, 1.2),
    ],
    "1990s": [
      b("Eddie Jones", ["SG"], 86, 16, 4, 3, 1.8, 0.6),
      b("Robert Horry", ["PF"], 85, 10, 7, 3, 1, 1.2),
    ],
    "2000s": [
      b("Derek Fisher", ["PG"], 82, 9, 2, 3, 0.8, 0.1),
      b("Andrew Bynum", ["C"], 84, 12, 9, 1, 0.5, 1.8),
    ],
    "2010s": [
      b("Kyle Kuzma", ["PF"], 83, 16, 6, 2, 0.8, 0.5),
      b("Lonzo Ball", ["PG"], 82, 10, 6, 7, 1.3, 0.6),
    ],
    "2020s": [
      b("D'Angelo Russell", ["PG"], 83, 18, 3, 6, 1, 0.3),
      b("Rui Hachimura", ["PF"], 81, 13, 5, 1, 0.6, 0.4),
    ],
  },
  Bulls: {
    "1960s": [
      b("Bob Love", ["SF"], 86, 21, 6, 2, 0.8, 0.3),
      b("Chet Walker", ["SF"], 85, 18, 6, 3, 0.8, 0.3),
    ],
    "1970s": [
      b("Norm Van Lier", ["PG"], 84, 12, 4, 7, 1.5, 0.2),
      b("Bob Love", ["SF"], 87, 22, 6, 2, 0.8, 0.3),
    ],
    "1980s": [
      b("Orlando Woolridge", ["SF"], 84, 18, 5, 2, 0.8, 0.5),
      b("Quintin Dailey", ["SG"], 82, 16, 3, 3, 0.8, 0.2),
    ],
    "1990s": [
      b("Horace Grant", ["PF"], 86, 14, 10, 2, 0.8, 1.2),
      b("John Paxson", ["PG"], 82, 8, 2, 4, 0.8, 0.1),
    ],
    "2000s": [
      b("Luol Deng", ["SF"], 85, 16, 6, 3, 1, 0.6),
      b("Kirk Hinrich", ["PG"], 82, 12, 3, 5, 1, 0.2),
    ],
    "2010s": [
      b("Jimmy Butler", ["SG"], 88, 18, 5, 4, 1.5, 0.6),
      b("Joakim Noah", ["C"], 86, 12, 11, 4, 0.8, 1.2),
    ],
    "2020s": [
      b("DeMar DeRozan", ["SF"], 87, 24, 5, 5, 1, 0.5),
      b("Nikola Vucevic", ["C"], 84, 18, 10, 3, 0.6, 0.8),
    ],
  },
  Celtics: {
    "1960s": [
      b("Sam Jones", ["SG"], 90, 18, 5, 3, 1, 0.3),
      b("Tom Heinsohn", ["PF"], 88, 18, 8, 2, 0.5, 0.4),
    ],
    "1970s": [
      b("Dave Cowens", ["C"], 91, 18, 14, 4, 1, 1),
      b("Jo Jo White", ["PG"], 89, 18, 4, 6, 1, 0.3),
    ],
    "1980s": [
      b("Dennis Johnson", ["PG"], 88, 14, 4, 6, 1.5, 0.8),
      b("Kevin McHale", ["PF"], 92, 20, 9, 2, 0.6, 1.8),
    ],
    "1990s": [
      b("Antoine Walker", ["PF"], 86, 18, 8, 3, 1, 0.8),
      b("Dee Brown", ["PG"], 80, 12, 3, 4, 1.2, 0.3),
    ],
    "2000s": [
      b("Rajon Rondo", ["PG"], 88, 11, 5, 9, 1.8, 0.2),
      b("Kendrick Perkins", ["C"], 82, 8, 8, 1, 0.5, 1.5),
    ],
    "2010s": [
      b("Kyrie Irving", ["PG"], 90, 24, 4, 6, 1.2, 0.4),
      b("Al Horford", ["C"], 86, 14, 8, 4, 0.8, 1.2),
    ],
    "2020s": [
      b("Kristaps Porzingis", ["C"], 87, 20, 7, 2, 0.6, 1.8),
      b("Derrick White", ["SG"], 85, 15, 4, 5, 1, 0.8),
    ],
  },
  Warriors: {
    "1960s": [
      b("Nate Thurmond", ["C"], 90, 18, 18, 3, 0.8, 2.5),
      b("Rick Barry", ["SF"], 92, 26, 7, 4, 1.5, 0.5),
    ],
    "1970s": [
      b("Rick Barry", ["SF"], 91, 24, 7, 5, 1.5, 0.5),
      b("Jamaal Wilkes", ["SF"], 87, 18, 6, 3, 1.2, 0.4),
    ],
    "1980s": [
      b("Chris Mullin", ["SF"], 90, 22, 5, 4, 1.2, 0.4),
      b("Tim Hardaway", ["PG"], 88, 18, 3, 9, 1.5, 0.2),
    ],
    "1990s": [
      b("Chris Webber", ["PF"], 89, 20, 10, 4, 1.2, 1.5),
      b("Latrell Sprewell", ["SG"], 87, 20, 4, 4, 1.5, 0.5),
    ],
    "2000s": [
      b("Jason Richardson", ["SG"], 85, 18, 5, 3, 0.8, 0.4),
      b("Baron Davis", ["PG"], 86, 18, 4, 8, 1.5, 0.3),
    ],
    "2010s": [
      b("Klay Thompson", ["SG"], 90, 22, 4, 2, 0.9, 0.6),
      b("Draymond Green", ["PF"], 88, 12, 8, 7, 1.2, 1.2),
    ],
    "2020s": [
      b("Andrew Wiggins", ["SF"], 84, 17, 5, 2, 1, 0.8),
      b("Jonathan Kuminga", ["SF"], 82, 16, 5, 2, 0.8, 0.5),
    ],
  },
  Heat: {
    "1980s": [
      b("Rony Seikaly", ["C"], 84, 16, 10, 1, 0.6, 1.2),
      b("Glen Rice", ["SG"], 86, 20, 5, 2, 0.8, 0.3),
    ],
    "1990s": [
      b("Tim Hardaway", ["PG"], 89, 18, 3, 8, 1.5, 0.2),
      b("Alonzo Mourning", ["C"], 91, 18, 10, 2, 0.8, 2.8),
    ],
    "2000s": [
      b("Udonis Haslem", ["PF"], 82, 10, 8, 1, 0.6, 0.3),
      b("Eddie Jones", ["SG"], 85, 15, 4, 3, 1.5, 0.5),
    ],
    "2010s": [
      b("Chris Bosh", ["PF"], 88, 18, 7, 2, 0.8, 1),
      b("Goran Dragic", ["PG"], 85, 16, 4, 5, 1, 0.2),
    ],
    "2020s": [
      b("Bam Adebayo", ["C"], 90, 18, 10, 4, 1.2, 0.9),
      b("Tyler Herro", ["SG"], 84, 20, 5, 4, 0.8, 0.3),
    ],
  },
  Spurs: {
    "1960s": [
      b("George Gervin", ["SG"], 91, 26, 5, 3, 1.2, 0.5),
      b("Artis Gilmore", ["C"], 88, 18, 12, 2, 0.5, 2),
    ],
    "1970s": [
      b("George Gervin", ["SG"], 92, 27, 5, 3, 1.2, 0.5),
      b("James Silas", ["SG"], 84, 16, 3, 4, 1, 0.2),
    ],
    "1980s": [
      b("David Robinson", ["C"], 94, 24, 12, 3, 1.2, 3.5),
      b("Avery Johnson", ["PG"], 82, 10, 3, 7, 1, 0.2),
    ],
    "1990s": [
      b("David Robinson", ["C"], 95, 22, 11, 3, 1.2, 3),
      b("Sean Elliott", ["SF"], 85, 16, 5, 2, 0.8, 0.4),
    ],
    "2000s": [
      b("Tony Parker", ["PG"], 90, 18, 3, 6, 1, 0.2),
      b("Manu Ginobili", ["SG"], 89, 16, 4, 4, 1.3, 0.3),
    ],
    "2010s": [
      b("LaMarcus Aldridge", ["PF"], 88, 18.3, 8.2, 2.0, 0.6, 1.1),
      b("Patty Mills", ["PG"], 80, 10.2, 2.2, 3.5, 0.8, 0.1),
    ],
    "2020s": [
      b("Dejounte Murray", ["PG"], 86, 18, 5, 7, 1.5, 0.4),
      b("Keldon Johnson", ["SF"], 82, 16, 6, 2, 0.8, 0.3),
    ],
  },
  Nets: {
    "1970s": [
      b("Julius Erving", ["SF"], 93, 28, 8, 5, 1.5, 1.2),
      b("Brian Taylor", ["PG"], 82, 14, 3, 5, 1.2, 0.2),
    ],
    "1980s": [
      b("Drazen Petrovic", ["SG"], 88, 20, 3, 4, 1, 0.2),
      b("Buck Williams", ["PF"], 85, 14, 10, 2, 0.8, 0.8),
    ],
    "1990s": [
      b("Kenny Anderson", ["PG"], 86, 16, 4, 8, 1.2, 0.2),
      b("Derrick Coleman", ["PF"], 87, 18, 10, 3, 0.8, 1),
    ],
    "2000s": [
      b("Jason Kidd", ["PG"], 92, 14, 7, 9, 1.8, 0.3),
      b("Vince Carter", ["SG"], 89, 24, 5, 5, 1.2, 0.6),
    ],
    "2010s": [
      b("Brook Lopez", ["C"], 86, 20, 7, 2, 0.6, 1.8),
      b("Joe Johnson", ["SG"], 85, 16, 4, 4, 0.8, 0.3),
    ],
    "2020s": [
      b("Mikal Bridges", ["SF"], 85, 16, 4, 3, 1, 0.8),
      b("Cam Thomas", ["SG"], 82, 20, 3, 2, 0.6, 0.2),
    ],
  },
  Knicks: {
    "1960s": [
      b("Willis Reed", ["C"], 91, 20, 14, 2, 0.5, 1.2),
      b("Walt Frazier", ["PG"], 93, 20, 6, 8, 1.8, 0.3),
    ],
    "1970s": [
      b("Walt Frazier", ["PG"], 92, 18, 5, 7, 1.5, 0.3),
      b("Earl Monroe", ["SG"], 88, 18, 4, 4, 1, 0.2),
    ],
    "1980s": [
      b("Bernard King", ["SF"], 91, 26, 6, 3, 0.8, 0.3),
      b("Mark Jackson", ["PG"], 84, 12, 4, 8, 1, 0.2),
    ],
    "1990s": [
      b("Allan Houston", ["SG"], 87, 18, 4, 3, 0.8, 0.2),
      b("Larry Johnson", ["PF"], 85, 14, 8, 3, 0.6, 0.4),
    ],
    "2000s": [
      b("Amar'e Stoudemire", ["PF"], 89, 24, 8, 2, 0.6, 1),
      b("J.R. Smith", ["SG"], 82, 14, 3, 2, 0.8, 0.2),
    ],
    "2010s": [
      b("Carmelo Anthony", ["SF"], 90, 24, 7, 3, 0.8, 0.5),
      b("Jalen Brunson", ["PG"], 86, 18, 3, 6, 0.8, 0.2),
    ],
    "2020s": [
      b("Julius Randle", ["PF"], 87, 22, 9, 5, 0.8, 0.4),
      b("OG Anunoby", ["SF"], 84, 14, 5, 2, 1.2, 0.6),
    ],
  },
  Mavericks: {
    "1980s": [
      b("Rolando Blackman", ["SG"], 86, 20, 4, 3, 1, 0.3),
      b("Mark Aguirre", ["SF"], 87, 22, 5, 3, 0.8, 0.4),
    ],
    "1990s": [
      b("Jason Kidd", ["PG"], 90, 16, 7, 9, 1.8, 0.3),
      b("Michael Finley", ["SG"], 87, 20, 5, 3, 1, 0.4),
    ],
    "2000s": [
      b("Josh Howard", ["SF"], 85, 16, 6, 2, 1, 0.6),
      b("Jason Terry", ["SG"], 84, 15, 3, 4, 1, 0.2),
    ],
    "2010s": [
      b("Kristaps Porzingis", ["C"], 88, 22, 9, 2, 0.6, 1.8),
      b("Jalen Brunson", ["PG"], 84, 16, 3, 5, 0.8, 0.2),
    ],
    "2020s": [
      b("Kyrie Irving", ["PG"], 89, 25, 5, 5, 1, 0.4),
      b("Daniel Gafford", ["C"], 82, 12, 8, 1, 0.5, 1.8),
    ],
  },
  Suns: {
    "1960s": [
      b("Dick Van Arsdale", ["SG"], 84, 16, 4, 4, 0.8, 0.2),
      b("Paul Silas", ["PF"], 82, 12, 10, 2, 0.6, 0.4),
    ],
    "1970s": [
      b("Paul Westphal", ["SG"], 88, 20, 4, 5, 1.2, 0.3),
      b("Alvan Adams", ["C"], 85, 16, 10, 4, 1, 1.2),
    ],
    "1980s": [
      b("Larry Nance", ["PF"], 86, 16, 8, 3, 1, 1.5),
      b("Walter Davis", ["SG"], 87, 22, 4, 4, 1, 0.3),
    ],
    "1990s": [
      b("Dan Majerle", ["SG"], 85, 14, 5, 3, 1, 0.6),
      b("Kevin Johnson", ["PG"], 88, 18, 3, 9, 1.5, 0.2),
    ],
    "2000s": [
      b("Amar'e Stoudemire", ["PF"], 91, 26, 9, 2, 0.6, 1.5),
      b("Shawn Marion", ["SF"], 87, 18, 10, 2, 1.2, 0.8),
    ],
    "2010s": [
      b("Devin Booker", ["SG"], 90, 26, 4, 6, 0.9, 0.3),
      b("Deandre Ayton", ["C"], 86, 18, 11, 2, 0.8, 1.2),
    ],
    "2020s": [
      b("Bradley Beal", ["SG"], 86, 18, 4, 4, 0.8, 0.4),
      b("Jusuf Nurkic", ["C"], 83, 12, 10, 3, 0.6, 1),
    ],
  },
  Bucks: {
    "1960s": [
      b("Bob Dandridge", ["SF"], 86, 18, 6, 3, 1, 0.6),
      b("Jon McGlocklin", ["SG"], 83, 15, 4, 4, 0.8, 0.2),
    ],
    "1970s": [
      b("Bob Dandridge", ["SF"], 87, 18, 6, 3, 1, 0.6),
      b("Brian Winters", ["SG"], 84, 16, 4, 4, 1, 0.2),
    ],
    "1980s": [
      b("Sidney Moncrief", ["SG"], 90, 18, 5, 5, 1.5, 0.4),
      b("Terry Cummings", ["PF"], 86, 18, 8, 2, 1, 0.6),
    ],
    "1990s": [
      b("Glenn Robinson", ["SF"], 87, 22, 6, 3, 1, 0.6),
      b("Ray Allen", ["SG"], 89, 20, 5, 4, 1.2, 0.3),
    ],
    "2000s": [
      b("Michael Redd", ["SG"], 88, 22, 4, 3, 1, 0.3),
      b("Andrew Bogut", ["C"], 85, 12, 10, 2, 0.6, 1.8),
    ],
    "2010s": [
      b("Khris Middleton", ["SF"], 88, 18, 5, 4, 1, 0.4),
      b("Jrue Holiday", ["PG"], 87, 16, 4, 7, 1.5, 0.5),
    ],
    "2020s": [
      b("Damian Lillard", ["PG"], 90, 25, 4, 7, 0.9, 0.3),
      b("Brook Lopez", ["C"], 84, 14, 6, 2, 0.5, 2),
    ],
  },
  Nuggets: {
    "1970s": [
      b("David Thompson", ["SG"], 90, 24, 5, 4, 1.2, 0.8),
      b("Dan Issel", ["C"], 87, 20, 10, 3, 0.6, 0.5),
    ],
    "1980s": [
      b("Alex English", ["SF"], 92, 26, 6, 4, 0.8, 0.5),
      b("Fat Lever", ["PG"], 86, 16, 7, 7, 2, 0.5),
    ],
    "1990s": [
      b("Dikembe Mutombo", ["C"], 90, 12, 12, 1, 0.5, 3.5),
      b("Mahmoud Abdul-Rauf", ["PG"], 84, 16, 2, 4, 0.8, 0.1),
    ],
    "2000s": [
      b("Carmelo Anthony", ["SF"], 92, 26, 7, 3, 1, 0.5),
      b("Marcus Camby", ["C"], 85, 10, 11, 2, 0.8, 2.8),
    ],
    "2010s": [
      b("Jamal Murray", ["PG"], 86, 18, 4, 5, 1, 0.4),
      b("Gary Harris", ["SG"], 82, 14, 3, 3, 1, 0.3),
    ],
    "2020s": [
      b("Jamal Murray", ["PG"], 88, 22, 4, 6, 1, 0.4),
      b("Michael Porter Jr.", ["SF"], 84, 16, 6, 2, 0.6, 0.5),
    ],
  },
  Clippers: {
    "1960s": [
      b("Bob McAdoo", ["C"], 88, 24, 12, 3, 0.8, 1.5),
      b("Randy Smith", ["SG"], 83, 18, 4, 5, 1.2, 0.3),
    ],
    "1970s": [
      b("Bob McAdoo", ["C"], 89, 26, 13, 3, 0.8, 1.5),
      b("World B. Free", ["SG"], 87, 22, 4, 5, 1, 0.3),
    ],
    "1980s": [
      b("Danny Manning", ["PF"], 86, 18, 7, 3, 1, 0.8),
      b("Ron Harper", ["SG"], 85, 16, 5, 4, 1.5, 0.8),
    ],
    "1990s": [
      b("Elton Brand", ["PF"], 90, 20, 10, 3, 0.8, 1.5),
      b("Lamar Odom", ["PF"], 86, 16, 8, 4, 0.8, 0.8),
    ],
    "2000s": [
      b("Chris Kaman", ["C"], 84, 16, 10, 2, 0.5, 1.2),
      b("Cuttino Mobley", ["SG"], 83, 15, 4, 3, 0.8, 0.3),
    ],
    "2010s": [
      b("Lou Williams", ["SG"], 86, 18, 3, 4, 0.8, 0.2),
      b("Montrezl Harrell", ["C"], 84, 14, 7, 2, 0.6, 0.8),
    ],
    "2020s": [
      b("Norman Powell", ["SG"], 84, 16, 3, 2, 0.8, 0.3),
      b("Ivica Zubac", ["C"], 83, 12, 10, 1, 0.4, 1.2),
    ],
  },
  Rockets: {
    "1960s": [
      b("Calvin Murphy", ["SG"], 85, 18, 3, 4, 1, 0.2),
      b("Rudy Tomjanovich", ["SF"], 84, 20, 7, 3, 0.8, 0.4),
    ],
    "1970s": [
      b("Calvin Murphy", ["SG"], 84, 17, 3, 4, 1, 0.2),
      b("Rudy Tomjanovich", ["SF"], 83, 18, 6, 3, 0.8, 0.4),
    ],
    "1980s": [
      b("Otis Thorpe", ["PF"], 83, 14, 9, 2, 0.6, 0.5),
      b("John Lucas", ["PG"], 82, 12, 3, 7, 1, 0.2),
    ],
    "1990s": [
      b("Robert Horry", ["PF"], 84, 10, 7, 3, 1, 1.2),
      b("Mario Elie", ["SG"], 80, 10, 3, 2, 0.8, 0.2),
    ],
    "2000s": [
      b("Shane Battier", ["SF"], 83, 12, 5, 2, 0.8, 0.8),
      b("Luis Scola", ["PF"], 84, 14, 8, 2, 0.6, 0.3),
    ],
    "2010s": [
      b("Eric Gordon", ["SG"], 84, 16, 3, 2, 0.8, 0.3),
      b("Clint Capela", ["C"], 85, 14, 11, 1, 0.8, 1.5),
    ],
    "2020s": [
      b("Jabari Smith Jr.", ["PF"], 82, 14, 7, 2, 0.6, 0.8),
      b("Dillon Brooks", ["SF"], 81, 14, 4, 2, 0.9, 0.3),
    ],
  },
  Thunder: {
    "1960s": [
      b("Lenny Wilkens", ["PG"], 88, 16, 5, 7, 1.5, 0.2),
      b("Bob Rule", ["C"], 82, 18, 9, 2, 0.5, 1),
    ],
    "1970s": [
      b("Dennis Johnson", ["PG"], 87, 16, 5, 5, 1.5, 0.8),
      b("Gus Williams", ["PG"], 85, 18, 3, 6, 1.5, 0.3),
    ],
    "1980s": [
      b("Dale Ellis", ["SG"], 86, 18, 4, 3, 0.8, 0.3),
      b("Xavier McDaniel", ["PF"], 86, 18, 7, 3, 0.8, 0.8),
    ],
    "1990s": [
      b("Detlef Schrempf", ["SF"], 86, 16, 6, 4, 0.8, 0.4),
      b("Sam Perkins", ["PF"], 82, 12, 7, 2, 0.6, 0.6),
    ],
    "2000s": [
      b("Serge Ibaka", ["PF"], 85, 12, 8, 1, 0.8, 2.5),
      b("James Harden", ["SG"], 86, 16, 4, 4, 1.2, 0.3),
    ],
    "2010s": [
      b("Paul George", ["SF"], 89, 22, 7, 4, 1.5, 0.5),
      b("Steven Adams", ["C"], 84, 12, 9, 2, 0.8, 1),
    ],
    "2020s": [
      b("Chet Holmgren", ["C"], 86, 17, 8, 3, 0.8, 2.5),
      b("Lu Dort", ["SG"], 80, 12, 4, 2, 1.2, 0.4),
    ],
  },
};
