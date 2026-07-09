import type { ClubEraPool, Seed } from "./types";
const f = (name: string, positions: string[], rating: number, goals: number, assists: number, cleanSheets = 0): Seed => ({ name, positions, rating, stats: positions.includes("GK") ? { goals: 0, assists: 0, cleanSheets } : { goals, assists } });
/** +2 depth per existing football club×era pool. */
export const FOOTBALL_CORE_BOOST: ClubEraPool = {
  "Arsenal": {
    "1990s": [
      f("Nigel Winterburn", ["LB","DF"], 84, 2, 5),
      f("David Seaman", ["GK"], 90, 0, 0, 17),
    ],
    "2000s": [
      f("Sol Campbell", ["CB","DF"], 88, 3, 1),
      f("Freddie Ljungberg", ["RW","FW"], 86, 10, 8),
    ],
    "2010s": [
      f("Theo Walcott", ["RW","FW"], 84, 12, 6),
      f("Petr Cech", ["GK"], 87, 0, 0, 14),
    ],
    "2020s": [
      f("Gabriel Magalhaes", ["CB","DF"], 85, 3, 1),
      f("Aaron Ramsdale", ["GK"], 84, 0, 0, 12),
    ],
  },
  "Manchester United": {
    "1990s": [
      f("Andy Cole", ["ST","FW"], 88, 22, 6),
      f("Gary Neville", ["RB","DF"], 86, 2, 6),
    ],
    "2000s": [
      f("Nemanja Vidic", ["CB","DF"], 89, 3, 1),
      f("Carlos Tevez", ["ST","FW"], 87, 18, 6),
    ],
    "2010s": [
      f("Juan Mata", ["CM","MF"], 86, 8, 10),
      f("Victor Lindelof", ["CB","DF"], 84, 2, 1),
    ],
    "2020s": [
      f("Luke Shaw", ["LB","DF"], 85, 2, 6),
      f("Andre Onana", ["GK"], 84, 0, 0, 11),
    ],
  },
  "Liverpool": {
    "1990s": [
      f("Steve McManaman", ["RW","FW"], 85, 8, 12),
      f("Bruce Grobbelaar", ["GK"], 84, 0, 0, 12),
    ],
    "2000s": [
      f("Dirk Kuyt", ["ST","FW"], 85, 14, 6),
      f("Pepe Reina", ["GK"], 87, 0, 0, 15),
    ],
    "2010s": [
      f("James Milner", ["CM","MF"], 85, 6, 8),
      f("Andy Robertson", ["LB","DF"], 87, 3, 10),
    ],
    "2020s": [
      f("Cody Gakpo", ["LW","FW"], 84, 12, 6),
      f("Trent Alexander-Arnold", ["RB","DF"], 87, 4, 12),
    ],
  },
  "Manchester City": {
    "1990s": [
      f("Niall Quinn", ["ST","FW"], 82, 12, 4),
      f("Andy Morrison", ["CB","DF"], 80, 2, 1),
    ],
    "2000s": [
      f("Carlos Tevez", ["ST","FW"], 88, 20, 6),
      f("Joe Hart", ["GK"], 86, 0, 0, 14),
    ],
    "2010s": [
      f("Raheem Sterling", ["RW","FW"], 88, 18, 10),
      f("Aymeric Laporte", ["CB","DF"], 87, 3, 1),
    ],
    "2020s": [
      f("Bernardo Silva", ["CM","MF"], 89, 8, 10),
      f("Ruben Dias", ["CB","DF"], 88, 2, 1),
    ],
  },
  "Chelsea": {
    "1990s": [
      f("Ruud Gullit", ["CM","MF"], 88, 10, 10),
      f("Mark Hughes", ["ST","FW"], 86, 14, 5),
    ],
    "2000s": [
      f("Michael Essien", ["CM","MF"], 88, 6, 5),
      f("Ashley Cole", ["LB","DF"], 88, 2, 6),
    ],
    "2010s": [
      f("Willian", ["RW","FW"], 86, 10, 10),
      f("Thibaut Courtois", ["GK"], 89, 0, 0, 16),
    ],
    "2020s": [
      f("Reece James", ["RB","DF"], 86, 4, 6),
      f("Robert Sanchez", ["GK"], 83, 0, 0, 11),
    ],
  },
  "Tottenham": {
    "1990s": [
      f("Jurgen Klinsmann", ["ST","FW"], 88, 18, 6),
      f("Sol Campbell", ["CB","DF"], 87, 3, 1),
    ],
    "2000s": [
      f("Aaron Lennon", ["RW","FW"], 84, 8, 8),
      f("Paul Robinson", ["GK"], 84, 0, 0, 13),
    ],
    "2010s": [
      f("Dele Alli", ["CM","MF"], 86, 12, 8),
      f("Jan Vertonghen", ["CB","DF"], 86, 4, 2),
    ],
    "2020s": [
      f("Richarlison", ["ST","FW"], 84, 12, 4),
      f("Guglielmo Vicario", ["GK"], 84, 0, 0, 12),
    ],
  },
  "Newcastle": {
    "1990s": [
      f("Les Ferdinand", ["ST","FW"], 87, 18, 5),
      f("Rob Lee", ["CM","MF"], 84, 8, 6),
    ],
    "2000s": [
      f("Michael Owen", ["ST","FW"], 86, 16, 4),
      f("Nicky Butt", ["CM","MF"], 83, 4, 4),
    ],
    "2010s": [
      f("Demba Ba", ["ST","FW"], 84, 14, 3),
      f("Moussa Sissoko", ["CM","MF"], 83, 5, 5),
    ],
    "2020s": [
      f("Kieran Trippier", ["RB","DF"], 86, 3, 8),
      f("Sven Botman", ["CB","DF"], 84, 2, 1),
    ],
  },
  "Aston Villa": {
    "1990s": [
      f("Gareth Southgate", ["CB","DF"], 82, 1, 1),
      f("Ugo Ehiogu", ["CB","DF"], 83, 2, 1),
    ],
    "2000s": [
      f("Stiliyan Petrov", ["CM","MF"], 85, 6, 6),
      f("Gabriel Agbonlahor", ["ST","FW"], 83, 12, 4),
    ],
    "2010s": [
      f("Jack Grealish", ["LW","FW"], 86, 8, 10),
      f("Tyrone Mings", ["CB","DF"], 83, 2, 1),
    ],
    "2020s": [
      f("Leon Bailey", ["RW","FW"], 84, 10, 6),
      f("Pau Torres", ["CB","DF"], 85, 2, 1),
    ],
  },
  "Barcelona": {
    "1980s": [
      f("Mark Hughes", ["ST","FW"], 85, 14, 5),
      f("Migueli", ["CB","DF"], 84, 2, 1),
    ],
    "1990s": [
      f("Rivaldo", ["LW","FW"], 91, 20, 10),
      f("Luis Enrique", ["CM","MF"], 86, 8, 8),
    ],
    "2000s": [
      f("Deco", ["CM","MF"], 88, 8, 12),
      f("Victor Valdes", ["GK"], 87, 0, 0, 15),
    ],
    "2010s": [
      f("Neymar", ["LW","FW"], 92, 22, 14),
      f("Marc-Andre ter Stegen", ["GK"], 89, 0, 0, 16),
    ],
    "2020s": [
      f("Raphinha", ["RW","FW"], 86, 14, 8),
      f("Jules Kounde", ["CB","DF"], 86, 2, 2),
    ],
  },
  "Real Madrid": {
    "1980s": [
      f("Juanito", ["CM","MF"], 86, 10, 8),
      f("Sanchis", ["CB","DF"], 87, 3, 2),
    ],
    "1990s": [
      f("Predrag Mijatovic", ["ST","FW"], 88, 18, 6),
      f("Fernando Hierro", ["CB","DF"], 89, 6, 4),
    ],
    "2000s": [
      f("Ruud van Nistelrooy", ["ST","FW"], 90, 24, 4),
      f("Iker Casillas", ["GK"], 91, 0, 0, 17),
    ],
    "2010s": [
      f("Gareth Bale", ["RW","FW"], 90, 18, 10),
      f("Keylor Navas", ["GK"], 88, 0, 0, 15),
    ],
    "2020s": [
      f("Rodrygo", ["RW","FW"], 86, 14, 8),
      f("Eder Militao", ["CB","DF"], 87, 3, 1),
    ],
  },
  "Atletico Madrid": {
    "1980s": [
      f("Luis Aragones", ["CM","MF"], 84, 8, 6),
      f("Juanito", ["ST","FW"], 83, 12, 4),
    ],
    "1990s": [
      f("Paulo Futre", ["LW","FW"], 86, 12, 8),
      f("Roberto", ["CB","DF"], 84, 2, 2),
    ],
    "2000s": [
      f("Maxi Rodriguez", ["RW","FW"], 86, 12, 8),
      f("Leo Franco", ["GK"], 83, 0, 0, 12),
    ],
    "2010s": [
      f("Filipe Luis", ["LB","DF"], 87, 3, 8),
      f("Saul Niguez", ["CM","MF"], 86, 8, 6),
    ],
    "2020s": [
      f("Alvaro Morata", ["ST","FW"], 85, 16, 4),
      f("Jose Maria Gimenez", ["CB","DF"], 85, 3, 1),
    ],
  },
  "Sevilla": {
    "1980s": [
      f("Juan Arza", ["ST","FW"], 80, 10, 4),
      f("Paco Buyo", ["GK"], 83, 0, 0, 12),
    ],
    "1990s": [
      f("Davor Suker", ["ST","FW"], 86, 16, 5),
      f("Diego Simeone", ["CM","MF"], 85, 5, 4),
    ],
    "2000s": [
      f("Julio Baptista", ["CM","MF"], 84, 10, 6),
      f("Javi Varas", ["GK"], 81, 0, 0, 10),
    ],
    "2010s": [
      f("Ever Banega", ["CM","MF"], 86, 6, 10),
      f("Coke", ["RB","DF"], 83, 3, 5),
    ],
    "2020s": [
      f("Lucas Ocampos", ["LW","FW"], 84, 12, 6),
      f("Marcao", ["CB","DF"], 82, 2, 1),
    ],
  },
  "Valencia": {
    "1980s": [
      f("Mario Kempes", ["ST","FW"], 88, 18, 6),
      f("Ricardo", ["GK"], 80, 0, 0, 10),
    ],
    "1990s": [
      f("Claudio Lopez", ["ST","FW"], 85, 14, 5),
      f("Miguel Angel Angulo", ["CM","MF"], 83, 8, 6),
    ],
    "2000s": [
      f("Vicente", ["LW","FW"], 86, 10, 10),
      f("Miguel Angel Angulo", ["CM","MF"], 84, 8, 6),
    ],
    "2010s": [
      f("Paco Alcacer", ["ST","FW"], 85, 16, 4),
      f("Nicolas Otamendi", ["CB","DF"], 86, 3, 1),
    ],
    "2020s": [
      f("Jose Luis Gaya", ["LB","DF"], 84, 3, 6),
      f("Yunus Musah", ["CM","MF"], 83, 5, 5),
    ],
  },
  "Villarreal": {
    "1980s": [
      f("Fernando", ["CM","MF"], 79, 5, 4),
      f("Reina Sr.", ["GK"], 78, 0, 0, 9),
    ],
    "1990s": [
      f("Victor", ["ST","FW"], 81, 12, 3),
      f("Javi Gracia", ["CM","MF"], 80, 4, 5),
    ],
    "2000s": [
      f("Juan Roman Riquelme", ["CM","MF"], 90, 10, 14),
      f("Marcos Senna", ["CM","MF"], 85, 6, 6),
    ],
    "2010s": [
      f("Nicolas Sansone", ["LW","FW"], 83, 10, 6),
      f("Mario Gaspar", ["RB","DF"], 82, 3, 3),
    ],
    "2020s": [
      f("Alexander Sorloth", ["ST","FW"], 84, 16, 4),
      f("Pau Torres", ["CB","DF"], 85, 2, 1),
    ],
  },
  "AC Milan": {
    "1980s": [
      f("Roberto Donadoni", ["RW","FW"], 87, 10, 10),
      f("Walter Bianchi", ["GK"], 84, 0, 0, 13),
    ],
    "1990s": [
      f("Roberto Donadoni", ["RW","FW"], 86, 8, 10),
      f("Demetrio Albertini", ["CM","MF"], 88, 6, 10),
    ],
    "2000s": [
      f("Clarence Seedorf", ["CM","MF"], 90, 8, 10),
      f("Gennaro Gattuso", ["CM","MF"], 87, 4, 4),
    ],
    "2010s": [
      f("Suso", ["RW","FW"], 85, 8, 10),
      f("Alessio Romagnoli", ["CB","DF"], 86, 2, 1),
    ],
    "2020s": [
      f("Ante Rebic", ["LW","FW"], 84, 10, 6),
      f("Fikayo Tomori", ["CB","DF"], 85, 2, 1),
    ],
  },
  "Inter Milan": {
    "1980s": [
      f("Karl-Heinz Rummenigge", ["ST","FW"], 90, 20, 6),
      f("Giuseppe Bergomi", ["CB","DF"], 87, 3, 2),
    ],
    "1990s": [
      f("Youri Djorkaeff", ["ST","FW"], 88, 14, 8),
      f("Nicola Berti", ["CM","MF"], 85, 8, 6),
    ],
    "2000s": [
      f("Dejan Stankovic", ["CM","MF"], 87, 8, 8),
      f("Maicon", ["RB","DF"], 88, 4, 8),
    ],
    "2010s": [
      f("Ivan Perisic", ["LW","FW"], 87, 10, 10),
      f("Miranda", ["CB","DF"], 86, 3, 1),
    ],
    "2020s": [
      f("Hakan Calhanoglu", ["CM","MF"], 87, 8, 12),
      f("Alessandro Bastoni", ["CB","DF"], 87, 2, 2),
    ],
  },
  "Juventus": {
    "1980s": [
      f("Zbigniew Boniek", ["CM","MF"], 89, 12, 10),
      f("Claudio Gentile", ["CB","DF"], 86, 2, 2),
    ],
    "1990s": [
      f("Fabrizio Ravanelli", ["ST","FW"], 87, 16, 4),
      f("Antonio Conte", ["CM","MF"], 85, 6, 6),
    ],
    "2000s": [
      f("Zlatan Ibrahimovic", ["ST","FW"], 89, 20, 6),
      f("Lilian Thuram", ["CB","DF"], 89, 2, 3),
    ],
    "2010s": [
      f("Miralem Pjanic", ["CM","MF"], 87, 6, 10),
      f("Giorgio Chiellini", ["CB","DF"], 89, 3, 1),
    ],
    "2020s": [
      f("Angel Di Maria", ["RW","FW"], 87, 10, 12),
      f("Gleison Bremer", ["CB","DF"], 86, 3, 1),
    ],
  },
  "Napoli": {
    "1980s": [
      f("Ciro Ferrara", ["CB","DF"], 85, 2, 2),
      f("Giuseppe Bruscolotti", ["GK"], 82, 0, 0, 11),
    ],
    "1990s": [
      f("Fabio Pecchia", ["CM","MF"], 82, 5, 6),
      f("Francesco Toldo", ["GK"], 84, 0, 0, 12),
    ],
    "2000s": [
      f("Ezequiel Lavezzi", ["LW","FW"], 85, 10, 8),
      f("Christian Maggio", ["RB","DF"], 83, 4, 6),
    ],
    "2010s": [
      f("Lorenzo Insigne", ["LW","FW"], 87, 14, 10),
      f("Kalidou Koulibaly", ["CB","DF"], 88, 3, 1),
    ],
    "2020s": [
      f("Matteo Politano", ["RW","FW"], 83, 8, 6),
      f("Amir Rrahmani", ["CB","DF"], 84, 2, 1),
    ],
  },
  "Roma": {
    "1980s": [
      f("Bruno Conti", ["RW","FW"], 86, 8, 10),
      f("Stefano Negrin", ["GK"], 81, 0, 0, 10),
    ],
    "1990s": [
      f("Vincenzo Montella", ["ST","FW"], 85, 16, 4),
      f("Aldair", ["CB","DF"], 87, 2, 2),
    ],
    "2000s": [
      f("Mirko Vucinic", ["ST","FW"], 84, 12, 5),
      f("Philippe Mexes", ["CB","DF"], 84, 3, 1),
    ],
    "2010s": [
      f("Radja Nainggolan", ["CM","MF"], 87, 8, 6),
      f("Kostas Manolas", ["CB","DF"], 85, 2, 1),
    ],
    "2020s": [
      f("Lorenzo Pellegrini", ["CM","MF"], 86, 8, 10),
      f("Gianluca Mancini", ["CB","DF"], 84, 3, 1),
    ],
  },
  "Lazio": {
    "1980s": [
      f("Giuseppe Favalli", ["LB","DF"], 81, 2, 4),
      f("Walter Zenga", ["GK"], 83, 0, 0, 11),
    ],
    "1990s": [
      f("Pavel Nedved", ["CM","MF"], 89, 10, 8),
      f("Alessandro Nesta", ["CB","DF"], 90, 2, 2),
    ],
    "2000s": [
      f("Hernan Crespo", ["ST","FW"], 88, 18, 4),
      f("Fabio Liverani", ["CM","MF"], 83, 4, 5),
    ],
    "2010s": [
      f("Ciro Immobile", ["ST","FW"], 88, 24, 5),
      f("Sergej Milinkovic-Savic", ["CM","MF"], 87, 8, 10),
    ],
    "2020s": [
      f("Luis Alberto", ["CM","MF"], 86, 8, 12),
      f("Ivan Provedel", ["GK"], 84, 0, 0, 12),
    ],
  },
  "Bayern Munich": {
    "1990s": [
      f("Mehmet Scholl", ["CM","MF"], 88, 10, 12),
      f("Thomas Helmer", ["CB","DF"], 85, 4, 2),
    ],
    "2000s": [
      f("Lucio", ["CB","DF"], 88, 4, 2),
      f("Mark van Bommel", ["CM","MF"], 87, 6, 6),
    ],
    "2010s": [
      f("Jerome Boateng", ["CB","DF"], 88, 3, 2),
      f("David Alaba", ["LB","DF"], 88, 4, 6),
    ],
    "2020s": [
      f("Leroy Sane", ["LW","FW"], 87, 12, 10),
      f("Dayot Upamecano", ["CB","DF"], 86, 2, 1),
    ],
  },
  "Borussia Dortmund": {
    "1990s": [
      f("Andreas Moller", ["CM","MF"], 87, 8, 10),
      f("Stefan Klos", ["GK"], 83, 0, 0, 12),
    ],
    "2000s": [
      f("Jakub Blaszczykowski", ["RW","FW"], 84, 8, 6),
      f("Neven Subotic", ["CB","DF"], 85, 3, 1),
    ],
    "2010s": [
      f("Marco Reus", ["LW","FW"], 88, 14, 10),
      f("Mats Hummels", ["CB","DF"], 88, 4, 2),
    ],
    "2020s": [
      f("Julian Brandt", ["CM","MF"], 85, 8, 8),
      f("Mats Hummels", ["CB","DF"], 86, 3, 1),
    ],
  },
  "RB Leipzig": {
    "1990s": [
      f("Dirk Schuster", ["CM","MF"], 79, 5, 5),
      f("René Müller", ["GK"], 78, 0, 0, 9),
    ],
    "2000s": [
      f("Benjamin Köhler", ["CM","MF"], 78, 4, 4),
      f("René Adler", ["GK"], 79, 0, 0, 10),
    ],
    "2010s": [
      f("Timo Werner", ["ST","FW"], 85, 18, 5),
      f("Dayot Upamecano", ["CB","DF"], 84, 2, 1),
    ],
    "2020s": [
      f("Dominik Szoboszlai", ["CM","MF"], 85, 8, 10),
      f("Lois Openda", ["ST","FW"], 84, 16, 4),
    ],
  },
  "Bayer Leverkusen": {
    "1990s": [
      f("Paulo Sergio", ["ST","FW"], 84, 12, 5),
      f("Hans-Jorg Butt", ["GK"], 82, 0, 0, 11),
    ],
    "2000s": [
      f("Dimitar Berbatov", ["ST","FW"], 87, 16, 5),
      f("Lucio", ["CB","DF"], 87, 4, 2),
    ],
    "2010s": [
      f("Kevin Volland", ["ST","FW"], 83, 12, 4),
      f("Bernd Leno", ["GK"], 85, 0, 0, 13),
    ],
    "2020s": [
      f("Victor Boniface", ["ST","FW"], 84, 16, 4),
      f("Jeremie Frimpong", ["RB","DF"], 85, 4, 8),
    ],
  },
  "Wolfsburg": {
    "1990s": [
      f("Jonathan Akpoborie", ["ST","FW"], 79, 10, 3),
      f("Kirschbaum", ["GK"], 77, 0, 0, 9),
    ],
    "2000s": [
      f("Grafite", ["ST","FW"], 85, 18, 5),
      f("Diego Benaglio", ["GK"], 83, 0, 0, 11),
    ],
    "2010s": [
      f("Kevin De Bruyne", ["CM","MF"], 87, 8, 12),
      f("Naldo", ["CB","DF"], 84, 4, 2),
    ],
    "2020s": [
      f("Maximilian Arnold", ["CM","MF"], 83, 5, 8),
      f("Koen Casteels", ["GK"], 84, 0, 0, 12),
    ],
  },
  "PSG": {
    "1990s": [
      f("Rai", ["CM","MF"], 86, 8, 10),
      f("Bernard Lama", ["GK"], 83, 0, 0, 12),
    ],
    "2000s": [
      f("Ronaldinho", ["LW","FW"], 91, 14, 12),
      f("Pauleta", ["ST","FW"], 87, 18, 4),
    ],
    "2010s": [
      f("Marco Verratti", ["CM","MF"], 89, 4, 10),
      f("Marquinhos", ["CB","DF"], 88, 3, 1),
    ],
    "2020s": [
      f("Achraf Hakimi", ["RB","DF"], 87, 4, 8),
      f("Gianluigi Donnarumma", ["GK"], 88, 0, 0, 14),
    ],
  },
  "Marseille": {
    "1990s": [
      f("Jean-Pierre Papin", ["ST","FW"], 89, 18, 4),
      f("Fabien Barthez", ["GK"], 87, 0, 0, 14),
    ],
    "2000s": [
      f("Didier Drogba", ["ST","FW"], 89, 20, 5),
      f("Steve Mandanda", ["GK"], 85, 0, 0, 13),
    ],
    "2010s": [
      f("Dimitri Payet", ["CM","MF"], 87, 8, 12),
      f("Steve Mandanda", ["GK"], 86, 0, 0, 14),
    ],
    "2020s": [
      f("Pierre-Emerick Aubameyang", ["ST","FW"], 85, 14, 4),
      f("Pau Lopez", ["GK"], 82, 0, 0, 11),
    ],
  },
  "Lyon": {
    "1990s": [
      f("Ludovic Giuly", ["RW","FW"], 83, 10, 7),
      f("Gregory Coupet", ["GK"], 83, 0, 0, 12),
    ],
    "2000s": [
      f("Juninho", ["CM","MF"], 89, 12, 10),
      f("Karim Benzema", ["ST","FW"], 87, 16, 5),
    ],
    "2010s": [
      f("Alexandre Lacazette", ["ST","FW"], 87, 20, 4),
      f("Nabil Fekir", ["CM","MF"], 86, 10, 8),
    ],
    "2020s": [
      f("Alexandre Lacazette", ["ST","FW"], 85, 18, 4),
      f("Anthony Lopes", ["GK"], 83, 0, 0, 11),
    ],
  },
  "Monaco": {
    "1990s": [
      f("Youri Djorkaeff", ["ST","FW"], 86, 14, 7),
      f("Fabien Barthez", ["GK"], 85, 0, 0, 13),
    ],
    "2000s": [
      f("Fernando Morientes", ["ST","FW"], 86, 14, 4),
      f("Jerome Rothen", ["LW","FW"], 83, 6, 10),
    ],
    "2010s": [
      f("Radamel Falcao", ["ST","FW"], 88, 20, 4),
      f("Kylian Mbappe", ["ST","FW"], 87, 16, 5),
    ],
    "2020s": [
      f("Wissam Ben Yedder", ["ST","FW"], 84, 16, 4),
      f("Aurelien Tchouameni", ["CM","MF"], 85, 4, 4),
    ],
  },
  "Lille": {
    "1990s": [
      f("Stephane Paille", ["ST","FW"], 80, 10, 3),
      f("Sylva", ["GK"], 77, 0, 0, 9),
    ],
    "2000s": [
      f("Eden Hazard", ["LW","FW"], 83, 8, 6),
      f("Landreau", ["GK"], 81, 0, 0, 10),
    ],
    "2010s": [
      f("Eden Hazard", ["LW","FW"], 89, 14, 10),
      f("Riyad Mahrez", ["RW","FW"], 85, 10, 8),
    ],
    "2020s": [
      f("Jonathan David", ["ST","FW"], 85, 16, 4),
      f("Edon Zhegrova", ["RW","FW"], 82, 6, 6),
    ],
  },
};
