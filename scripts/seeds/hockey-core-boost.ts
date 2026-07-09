import type { ClubEraPool, Seed } from "./types";

const h = (
  name: string,
  positions: string[],
  rating: number,
  goals: number,
  assists: number,
  savePct = 0,
): Seed => ({
  name,
  positions,
  rating,
  stats: { goals, assists, savePct },
});

/** +2 depth per existing NHL club×era */
export const HOCKEY_CORE_BOOST: ClubEraPool = {
  Canadiens: {
    "1950s": [
      h("Bernie Geoffrion", ["RW"], 89, 28, 26),
      h("Dickie Moore", ["LW"], 87, 26, 30),
    ],
    "1960s": [
      h("Henri Richard", ["C"], 88, 20, 32),
      h("Jacques Lemaire", ["C"], 87, 20, 30),
    ],
    "1970s": [
      h("Guy Lafleur", ["RW"], 95, 48, 52),
      h("Larry Robinson", ["D"], 90, 12, 48),
    ],
    "1980s": [
      h("Patrick Roy", ["G"], 93, 0, 2, 0.91),
      h("Chris Nilan", ["D"], 80, 6, 12),
    ],
    "1990s": [
      h("Vincent Damphousse", ["C"], 86, 26, 38),
      h("Kirk Muller", ["C"], 83, 20, 30),
    ],
    "2000s": [
      h("Saku Koivu", ["C"], 86, 20, 36),
      h("Andrei Markov", ["D"], 87, 8, 40),
    ],
    "2010s": [
      h("Max Pacioretty", ["LW"], 87, 28, 26),
      h("P.K. Subban", ["D"], 88, 12, 36),
    ],
    "2020s": [
      h("Nick Suzuki", ["C"], 83, 22, 32),
      h("Cole Caufield", ["RW"], 82, 24, 20),
    ],
  },
  Oilers: {
    "1970s": [
      h("Paul Coffey", ["D"], 83, 8, 28),
      h("Glen Anderson", ["LW"], 79, 12, 16),
    ],
    "1980s": [
      h("Jari Kurri", ["RW"], 90, 46, 56),
      h("Paul Coffey", ["D"], 92, 16, 56),
    ],
    "1990s": [
      h("Doug Weight", ["C"], 83, 18, 48),
      h("Ryan Smyth", ["LW"], 83, 24, 26),
    ],
    "2000s": [
      h("Shawn Horcoff", ["C"], 83, 20, 36),
      h("Ales Hemsky", ["RW"], 84, 18, 40),
    ],
    "2010s": [
      h("Connor McDavid", ["C"], 96, 42, 72),
      h("Leon Draisaitl", ["C"], 92, 38, 52),
    ],
    "2020s": [
      h("Evan Bouchard", ["D"], 85, 12, 40),
      h("Stuart Skinner", ["G"], 84, 0, 1, 0.908),
    ],
  },
  Bruins: {
    "1950s": [
      h("Milt Schmidt", ["C"], 89, 22, 36),
      h("Woody Dumart", ["LW"], 85, 20, 26),
    ],
    "1960s": [
      h("Bobby Orr", ["D"], 97, 20, 58),
      h("Phil Esposito", ["C"], 93, 42, 50),
    ],
    "1970s": [
      h("Bobby Orr", ["D"], 95, 16, 52),
      h("Terry O'Reilly", ["RW"], 84, 22, 28),
    ],
    "1980s": [
      h("Ray Bourque", ["D"], 93, 18, 52),
      h("Cam Neely", ["RW"], 90, 36, 26),
    ],
    "1990s": [
      h("Ray Bourque", ["D"], 92, 14, 46),
      h("Adam Oates", ["C"], 90, 16, 58),
    ],
    "2000s": [
      h("Zdeno Chara", ["D"], 89, 10, 26),
      h("Marc Savard", ["C"], 86, 20, 46),
    ],
    "2010s": [
      h("Patrice Bergeron", ["C"], 90, 22, 36),
      h("Brad Marchand", ["LW"], 88, 28, 30),
    ],
    "2020s": [
      h("David Pastrnak", ["RW"], 90, 36, 40),
      h("Charlie McAvoy", ["D"], 87, 8, 36),
    ],
  },
  Blackhawks: {
    "1960s": [
      h("Bobby Hull", ["LW"], 93, 42, 26),
      h("Stan Mikita", ["C"], 92, 30, 46),
    ],
    "1970s": [
      h("Tony Esposito", ["G"], 90, 0, 2, 0.908),
      h("Pit Martin", ["C"], 82, 18, 28),
    ],
    "1980s": [
      h("Denis Savard", ["C"], 90, 30, 50),
      h("Chris Chelios", ["D"], 89, 10, 40),
    ],
    "1990s": [
      h("Chris Chelios", ["D"], 90, 8, 38),
      h("Ed Belfour", ["G"], 91, 0, 2, 0.912),
    ],
    "2000s": [
      h("Patrick Kane", ["RW"], 89, 26, 40),
      h("Duncan Keith", ["D"], 89, 8, 36),
    ],
    "2010s": [
      h("Patrick Kane", ["RW"], 92, 30, 46),
      h("Jonathan Toews", ["C"], 89, 22, 30),
    ],
    "2020s": [
      h("Connor Bedard", ["C"], 85, 22, 26),
      h("Seth Jones", ["D"], 84, 8, 30),
    ],
  },
  "Red Wings": {
    "1950s": [
      h("Gordie Howe", ["RW"], 96, 36, 40),
      h("Ted Lindsay", ["LW"], 91, 30, 36),
    ],
    "1960s": [
      h("Gordie Howe", ["RW"], 94, 28, 36),
      h("Norm Ullman", ["C"], 87, 24, 36),
    ],
    "1970s": [
      h("Marcel Dionne", ["C"], 91, 34, 46),
      h("Reed Larson", ["D"], 83, 12, 30),
    ],
    "1980s": [
      h("Steve Yzerman", ["C"], 91, 30, 46),
      h("Brad Park", ["D"], 87, 8, 36),
    ],
    "1990s": [
      h("Steve Yzerman", ["C"], 92, 26, 40),
      h("Nicklas Lidstrom", ["D"], 94, 12, 46),
    ],
    "2000s": [
      h("Pavel Datsyuk", ["C"], 91, 22, 40),
      h("Henrik Zetterberg", ["C"], 90, 24, 36),
    ],
    "2010s": [
      h("Henrik Zetterberg", ["C"], 88, 20, 32),
      h("Dylan Larkin", ["C"], 85, 22, 30),
    ],
    "2020s": [
      h("Dylan Larkin", ["C"], 86, 26, 34),
      h("Moritz Seider", ["D"], 85, 6, 28),
    ],
  },
  Penguins: {
    "1960s": [
      h("Andy Bathgate", ["RW"], 83, 18, 26),
      h("Ken Schinkel", ["RW"], 79, 14, 18),
    ],
    "1970s": [
      h("Jean Pronovost", ["RW"], 83, 26, 26),
      h("Ron Stackhouse", ["D"], 80, 8, 26),
    ],
    "1980s": [
      h("Mario Lemieux", ["C"], 97, 52, 76),
      h("Paul Coffey", ["D"], 92, 16, 56),
    ],
    "1990s": [
      h("Jaromir Jagr", ["RW"], 95, 40, 56),
      h("Ron Francis", ["C"], 89, 20, 50),
    ],
    "2000s": [
      h("Sidney Crosby", ["C"], 94, 30, 50),
      h("Evgeni Malkin", ["C"], 93, 32, 46),
    ],
    "2010s": [
      h("Sidney Crosby", ["C"], 95, 28, 46),
      h("Kris Letang", ["D"], 88, 10, 36),
    ],
    "2020s": [
      h("Sidney Crosby", ["C"], 90, 26, 40),
      h("Kris Letang", ["D"], 85, 8, 30),
    ],
  },
  Rangers: {
    "1950s": [
      h("Andy Bathgate", ["RW"], 90, 26, 36),
      h("Harry Howell", ["D"], 85, 6, 26),
    ],
    "1960s": [
      h("Rod Gilbert", ["RW"], 89, 30, 36),
      h("Jean Ratelle", ["C"], 90, 28, 40),
    ],
    "1970s": [
      h("Brad Park", ["D"], 90, 12, 46),
      h("Rod Gilbert", ["RW"], 87, 26, 30),
    ],
    "1980s": [
      h("Mark Messier", ["C"], 91, 26, 40),
      h("Brian Leetch", ["D"], 91, 14, 50),
    ],
    "1990s": [
      h("Mark Messier", ["C"], 92, 24, 38),
      h("Brian Leetch", ["D"], 90, 12, 46),
    ],
    "2000s": [
      h("Jaromir Jagr", ["RW"], 92, 36, 50),
      h("Henrik Lundqvist", ["G"], 91, 0, 2, 0.918),
    ],
    "2010s": [
      h("Henrik Lundqvist", ["G"], 90, 0, 2, 0.918),
      h("Artemi Panarin", ["LW"], 89, 26, 40),
    ],
    "2020s": [
      h("Artemi Panarin", ["LW"], 88, 24, 38),
      h("Adam Fox", ["D"], 88, 8, 40),
    ],
  },
  "Maple Leafs": {
    "1950s": [
      h("Ted Kennedy", ["C"], 88, 20, 30),
      h("Max Bentley", ["C"], 87, 22, 32),
    ],
    "1960s": [
      h("Dave Keon", ["C"], 90, 22, 30),
      h("Frank Mahovlich", ["LW"], 91, 30, 36),
    ],
    "1970s": [
      h("Darryl Sittler", ["C"], 90, 30, 46),
      h("Borje Salming", ["D"], 91, 10, 40),
    ],
    "1980s": [
      h("Wendel Clark", ["LW"], 86, 26, 22),
      h("Borje Salming", ["D"], 89, 8, 38),
    ],
    "1990s": [
      h("Doug Gilmour", ["C"], 90, 22, 50),
      h("Mats Sundin", ["C"], 91, 30, 36),
    ],
    "2000s": [
      h("Mats Sundin", ["C"], 89, 26, 34),
      h("Tomas Kaberle", ["D"], 85, 6, 36),
    ],
    "2010s": [
      h("Auston Matthews", ["C"], 91, 36, 26),
      h("Morgan Rielly", ["D"], 86, 8, 34),
    ],
    "2020s": [
      h("Auston Matthews", ["C"], 93, 38, 28),
      h("William Nylander", ["RW"], 87, 28, 30),
    ],
  },
  Avalanche: {
    "1980s": [
      h("Peter Stastny", ["C"], 89, 30, 46),
      h("Michel Goulet", ["LW"], 88, 32, 30),
    ],
    "1990s": [
      h("Joe Sakic", ["C"], 94, 34, 50),
      h("Peter Forsberg", ["C"], 95, 26, 46),
    ],
    "2000s": [
      h("Joe Sakic", ["C"], 92, 28, 46),
      h("Milan Hejduk", ["RW"], 87, 26, 26),
    ],
    "2010s": [
      h("Nathan MacKinnon", ["C"], 92, 30, 46),
      h("Gabriel Landeskog", ["LW"], 87, 22, 26),
    ],
    "2020s": [
      h("Nathan MacKinnon", ["C"], 95, 36, 50),
      h("Cale Makar", ["D"], 92, 16, 50),
    ],
  },
  Lightning: {
    "1990s": [
      h("Roman Hamrlik", ["D"], 83, 8, 26),
      h("Brian Bradley", ["C"], 82, 20, 30),
    ],
    "2000s": [
      h("Martin St. Louis", ["RW"], 89, 26, 40),
      h("Vincent Lecavalier", ["C"], 90, 30, 36),
    ],
    "2010s": [
      h("Steven Stamkos", ["C"], 91, 34, 30),
      h("Nikita Kucherov", ["RW"], 93, 32, 46),
    ],
    "2020s": [
      h("Nikita Kucherov", ["RW"], 94, 34, 50),
      h("Victor Hedman", ["D"], 89, 8, 38),
    ],
  },
  Capitals: {
    "1970s": [
      h("Mike Maruk", ["C"], 83, 26, 30),
      h("Rick Green", ["D"], 82, 8, 26),
    ],
    "1980s": [
      h("Mike Gartner", ["RW"], 90, 34, 30),
      h("Scott Stevens", ["D"], 89, 8, 36),
    ],
    "1990s": [
      h("Peter Bondra", ["RW"], 89, 32, 26),
      h("Adam Oates", ["C"], 89, 16, 56),
    ],
    "2000s": [
      h("Alexander Ovechkin", ["LW"], 95, 44, 36),
      h("Nicklas Backstrom", ["C"], 89, 20, 50),
    ],
    "2010s": [
      h("Alexander Ovechkin", ["LW"], 94, 42, 34),
      h("John Carlson", ["D"], 88, 10, 38),
    ],
    "2020s": [
      h("Alexander Ovechkin", ["LW"], 89, 34, 26),
      h("John Carlson", ["D"], 86, 8, 36),
    ],
  },
  "Golden Knights": {
    "2010s": [
      h("William Karlsson", ["C"], 85, 24, 26),
      h("Jonathan Marchessault", ["RW"], 84, 22, 26),
    ],
    "2020s": [
      h("Jack Eichel", ["C"], 88, 26, 36),
      h("Mark Stone", ["RW"], 87, 22, 36),
    ],
  },
};
