/** One-shot generator for iteration-3 league/NHL expansion JSON. Run: node scripts/gen-iteration3-data.mjs */
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// [name, positions, rating, goals, assists, cleanSheets?]
function fbEra(entries) {
  return entries.map((e) => (e.length === 5 ? [...e, 0] : e));
}

function fbClub(eras) {
  const out = {};
  for (const [era, players] of Object.entries(eras)) out[era] = fbEra(players);
  return out;
}

const FB_LEAGUES_EXTRA = {
  // La Liga (+4 → 10)
  "Real Betis": fbClub({
    "1980s": [["Manuel Sanchis", ["CB", "DF"], 82, 2, 1], ["Juanito", ["ST", "FW"], 83, 12, 4], ["Hipolito Rincon", ["CM", "MF"], 80, 6, 5], ["Francisco Espejo", ["GK"], 79, 0, 0, 9], ["Manolo Sanchez", ["RW", "FW"], 78, 8, 4], ["Rafael Gordillo", ["LB", "DF"], 80, 2, 4]],
    "1990s": [["Finidi George", ["RW", "FW"], 84, 10, 8], ["Alfonso", ["ST", "FW"], 85, 16, 4], ["Juanito", ["CM", "MF"], 83, 6, 6], ["Prats", ["GK"], 80, 0, 0, 10], ["Alexis", ["LB", "DF"], 81, 2, 4], ["Oli", ["ST", "FW"], 82, 12, 3]],
    "2000s": [["Joaquin", ["RW", "FW"], 86, 8, 12], ["Rafael Sobis", ["ST", "FW"], 83, 12, 4], ["Arzu", ["CM", "MF"], 82, 5, 5], ["Contreras", ["GK"], 81, 0, 0, 11], ["Damia", ["CB", "DF"], 80, 2, 1], ["Edu", ["CM", "MF"], 81, 4, 6]],
    "2010s": [["Joaquin", ["RW", "FW"], 84, 6, 10], ["Ruben Castro", ["ST", "FW"], 84, 16, 3], ["Ceballos", ["CM", "MF"], 83, 4, 6], ["Adan", ["GK"], 82, 0, 0, 11], ["Mandi", ["CB", "DF"], 83, 2, 1], ["Feddal", ["CB", "DF"], 81, 2, 1]],
    "2020s": [["Nabil Fekir", ["CM", "MF"], 86, 10, 8], ["Borja Iglesias", ["ST", "FW"], 83, 14, 3], ["Guido Rodriguez", ["CM", "MF"], 84, 3, 4], ["Bravo", ["GK"], 82, 0, 0, 10], ["Pezzella", ["CB", "DF"], 83, 2, 1], ["Juanmi", ["ST", "FW"], 82, 10, 3]],
  }),
  "Real Sociedad": fbClub({
    "1980s": [["Lopez Ufarte", ["ST", "FW"], 84, 14, 5], ["Zamora", ["GK"], 82, 0, 0, 11], ["Arconada", ["GK"], 85, 0, 0, 13], ["Satrustegui", ["ST", "FW"], 83, 12, 4], ["Lopez Rekarte", ["CM", "MF"], 81, 5, 6], ["Idigoras", ["CB", "DF"], 80, 2, 1]],
    "1990s": [["Kovacevic", ["ST", "FW"], 84, 14, 4], ["Nayim", ["RW", "FW"], 83, 8, 8], ["Alkorta", ["CB", "DF"], 84, 3, 1], ["Alberto", ["GK"], 81, 0, 0, 10], ["De Pedro", ["CM", "MF"], 82, 6, 6], ["Ljubinkovic", ["CM", "MF"], 80, 4, 5]],
    "2000s": [["Nihat Kahveci", ["ST", "FW"], 85, 16, 5], ["Gorka Iraizoz", ["GK"], 83, 0, 0, 12], ["Xabi Prieto", ["CM", "MF"], 85, 8, 10], ["Labaka", ["CB", "DF"], 81, 2, 1], ["Skoubo", ["ST", "FW"], 80, 10, 3], ["De La Bella", ["LB", "DF"], 80, 2, 4]],
    "2010s": [["Inigo Martinez", ["CB", "DF"], 85, 3, 1], ["Illarramendi", ["CM", "MF"], 84, 4, 6], ["Oyarzabal", ["LW", "FW"], 85, 12, 6], ["Rulli", ["GK"], 84, 0, 0, 12], ["Zurutuza", ["CM", "MF"], 82, 4, 6], ["Yuri Berchiche", ["LB", "DF"], 83, 3, 5]],
    "2020s": [["Mikel Oyarzabal", ["LW", "FW"], 86, 14, 6], ["David Silva", ["CM", "MF"], 87, 6, 10], ["Merino", ["CM", "MF"], 85, 6, 8], ["Remiro", ["GK"], 84, 0, 0, 12], ["Zubimendi", ["CM", "MF"], 85, 4, 6], ["Take Kubo", ["RW", "FW"], 84, 8, 6]],
  }),
  "Athletic Bilbao": fbClub({
    "1980s": [["Julio Salinas", ["ST", "FW"], 84, 14, 4], ["Sarriko", ["CM", "MF"], 83, 6, 6], ["Andrinua", ["CB", "DF"], 82, 2, 1], ["Zubizarreta", ["GK"], 86, 0, 0, 14], ["Urrutia", ["LW", "FW"], 81, 10, 5], ["Goiko", ["CB", "DF"], 80, 2, 1]],
    "1990s": [["Julen Guerrero", ["CM", "MF"], 86, 10, 8], ["Zubizarreta", ["GK"], 87, 0, 0, 15], ["Larrazabal", ["LB", "DF"], 82, 2, 4], ["Alkorta", ["CB", "DF"], 84, 3, 1], ["Urzaiz", ["ST", "FW"], 84, 14, 3], ["Valverde", ["CM", "MF"], 81, 4, 5]],
    "2000s": [["Fernando Llorente", ["ST", "FW"], 86, 16, 4], ["Iraola", ["RB", "DF"], 84, 4, 6], ["Yeste", ["CM", "MF"], 83, 6, 8], ["Iraizoz", ["GK"], 84, 0, 0, 13], ["Aduriz", ["ST", "FW"], 84, 14, 4], ["Amorebieta", ["CB", "DF"], 82, 2, 1]],
    "2010s": [["Aritz Aduriz", ["ST", "FW"], 86, 18, 5], ["Williams", ["ST", "FW"], 84, 12, 4], ["Muniain", ["LW", "FW"], 85, 8, 8], ["Kepa", ["GK"], 84, 0, 0, 12], ["Laporte", ["CB", "DF"], 86, 3, 1], ["Iturraspe", ["CM", "MF"], 82, 4, 4]],
    "2020s": [["Inaki Williams", ["ST", "FW"], 85, 12, 4], ["Nico Williams", ["LW", "FW"], 86, 10, 8], ["Yeray", ["CB", "DF"], 84, 2, 1], ["Unai Simon", ["GK"], 86, 0, 0, 14], ["Vesga", ["CM", "MF"], 83, 4, 4], ["Sancet", ["CM", "MF"], 84, 8, 6]],
  }),
  "Celta Vigo": fbClub({
    "1980s": [["Hajduk", ["ST", "FW"], 82, 12, 4], ["Marcos", ["GK"], 80, 0, 0, 10], ["Merino", ["CM", "MF"], 79, 4, 5], ["Pirri", ["CB", "DF"], 78, 2, 1], ["Vladimir", ["ST", "FW"], 81, 10, 3], ["Amarillo", ["CM", "MF"], 78, 3, 4]],
    "1990s": [["Moacir", ["ST", "FW"], 83, 14, 4], ["Catanha", ["ST", "FW"], 84, 16, 3], ["Mostovoi", ["RW", "FW"], 85, 10, 10], ["Pinto", ["GK"], 81, 0, 0, 11], ["Mario", ["CB", "DF"], 80, 2, 1], ["Giovanella", ["CM", "MF"], 79, 4, 5]],
    "2000s": [["Mostovoi", ["RW", "FW"], 86, 10, 12], ["Baiano", ["ST", "FW"], 82, 12, 3], ["Silvinho", ["LB", "DF"], 83, 2, 6], ["Pinto", ["GK"], 82, 0, 0, 11], ["Nuno", ["CM", "MF"], 81, 5, 6], ["Placente", ["LB", "DF"], 80, 2, 4]],
    "2010s": [["Nolito", ["LW", "FW"], 84, 10, 8], ["Aspas", ["ST", "FW"], 86, 16, 6], ["Hugo Mallo", ["RB", "DF"], 83, 3, 5], ["Ruben Blanco", ["GK"], 82, 0, 0, 11], ["Cabral", ["CB", "DF"], 83, 2, 1], ["Wass", ["CM", "MF"], 82, 4, 6]],
    "2020s": [["Iago Aspas", ["ST", "FW"], 87, 16, 8], ["Brais Mendez", ["CM", "MF"], 84, 8, 6], ["Hugo Mallo", ["RB", "DF"], 82, 3, 5], ["Villar", ["GK"], 83, 0, 0, 11], ["Aidoo", ["CB", "DF"], 82, 2, 1], ["Beltran", ["CM", "MF"], 83, 6, 6]],
  }),
  // Serie A (+4 → 10)
  Fiorentina: fbClub({
    "1980s": [["Roberto Baggio", ["ST", "FW"], 88, 16, 8], ["Passarella", ["CB", "DF"], 86, 4, 2], ["Sergio Battistini", ["CB", "DF"], 83, 2, 1], ["Tancredi", ["GK"], 82, 0, 0, 11], ["Daniel Passarella", ["CB", "DF"], 85, 3, 1], ["Francini", ["LB", "DF"], 81, 2, 4]],
    "1990s": [["Gabriel Batistuta", ["ST", "FW"], 92, 24, 4], ["Rui Costa", ["CM", "MF"], 90, 10, 14], ["Toldo", ["GK"], 86, 0, 0, 14], ["Chiesa", ["RW", "FW"], 85, 12, 8], ["Torricelli", ["RB", "DF"], 83, 3, 5], ["Amoroso", ["ST", "FW"], 82, 12, 3]],
    "2000s": [["Adrian Mutu", ["ST", "FW"], 86, 16, 5], ["Fiore", ["CM", "MF"], 84, 8, 8], ["Ujfalusi", ["CB", "DF"], 84, 2, 1], ["Frey", ["GK"], 83, 0, 0, 12], ["Borgonovo", ["ST", "FW"], 82, 10, 4], ["Obodo", ["CM", "MF"], 80, 4, 5]],
    "2010s": [["Bernardeschi", ["RW", "FW"], 86, 10, 8], ["Ilicic", ["CM", "MF"], 85, 10, 8], ["Astori", ["CB", "DF"], 84, 2, 1], ["Neto", ["GK"], 84, 0, 0, 12], ["Kalinic", ["ST", "FW"], 84, 14, 4], ["Badelj", ["CM", "MF"], 83, 4, 6]],
    "2020s": [["Vlahovic", ["ST", "FW"], 86, 18, 4], ["Castrovilli", ["CM", "MF"], 84, 6, 6], ["Milenkovic", ["CB", "DF"], 85, 3, 1], ["Terracciano", ["GK"], 83, 0, 0, 11], ["Ikone", ["LW", "FW"], 84, 8, 8], ["Bonaventura", ["CM", "MF"], 85, 6, 8]],
  }),
  Atalanta: fbClub({
    "1980s": [["Evair", ["ST", "FW"], 82, 12, 4], ["Filisetti", ["GK"], 79, 0, 0, 9], ["Magistrelli", ["ST", "FW"], 80, 10, 3], ["Ercolani", ["CB", "DF"], 78, 2, 1], ["Perico", ["CM", "MF"], 79, 4, 5], ["Cani", ["RW", "FW"], 78, 6, 4]],
    "1990s": [["Filippo Inzaghi", ["ST", "FW"], 86, 18, 3], ["Perna", ["CB", "DF"], 80, 2, 1], ["Ferrante", ["ST", "FW"], 81, 12, 3], ["Fontolan", ["CM", "MF"], 79, 4, 5], ["Rossini", ["GK"], 78, 0, 0, 9], ["Mazzola", ["CM", "MF"], 80, 5, 5]],
    "2000s": [["Sergio Floccari", ["ST", "FW"], 81, 12, 3], ["Doni", ["GK"], 80, 0, 0, 10], ["Tarantino", ["CB", "DF"], 79, 2, 1], ["Zurdo", ["ST", "FW"], 80, 10, 3], ["Valentin", ["CM", "MF"], 78, 4, 4], ["Manfredini", ["CB", "DF"], 78, 2, 1]],
    "2010s": [["Alejandro Gomez", ["LW", "FW"], 86, 12, 10], ["Papu Gomez", ["LW", "FW"], 87, 14, 10], ["Toloi", ["CB", "DF"], 84, 2, 1], ["Berisha", ["GK"], 83, 0, 0, 11], ["Cristante", ["CM", "MF"], 84, 6, 6], ["Freuler", ["CM", "MF"], 85, 4, 6]],
    "2020s": [["Lookman", ["LW", "FW"], 86, 14, 8], ["Scamacca", ["ST", "FW"], 85, 16, 4], ["De Roon", ["CM", "MF"], 85, 4, 6], ["Musso", ["GK"], 84, 0, 0, 12], ["Scalvini", ["CB", "DF"], 84, 2, 1], ["Ederson", ["CM", "MF"], 84, 6, 6]],
  }),
  Torino: fbClub({
    "1980s": [["Francesco Graziani", ["ST", "FW"], 86, 16, 5], ["Pulici", ["ST", "FW"], 85, 14, 4], ["Marini", ["GK"], 82, 0, 0, 11], ["Brio", ["CB", "DF"], 83, 2, 1], ["Facchetti", ["CB", "DF"], 84, 2, 2], ["Pezzey", ["CM", "MF"], 82, 6, 6]],
    "1990s": [["Gianluigi Lentini", ["RW", "FW"], 86, 10, 10], ["Carnevale", ["ST", "FW"], 83, 12, 4], ["Sordo", ["CM", "MF"], 81, 5, 6], ["Comotto", ["CB", "DF"], 80, 2, 1], ["Lucarelli", ["ST", "FW"], 82, 12, 3], ["Fontana", ["GK"], 79, 0, 0, 10]],
    "2000s": [["Alessio Cerci", ["RW", "FW"], 83, 10, 6], ["Barone", ["CM", "MF"], 80, 4, 5], ["Viera", ["ST", "FW"], 81, 12, 3], ["Fontana", ["GK"], 80, 0, 0, 10], ["Stellone", ["ST", "FW"], 80, 10, 3], ["Barzagli", ["CB", "DF"], 82, 2, 1]],
    "2010s": [["Andrea Belotti", ["ST", "FW"], 87, 20, 4], ["Falque", ["RW", "FW"], 83, 8, 8], ["Benassi", ["CM", "MF"], 83, 6, 5], ["Sirigu", ["GK"], 84, 0, 0, 12], ["N'Koulou", ["CB", "DF"], 83, 2, 1], ["De Silvestri", ["RB", "DF"], 82, 3, 5]],
    "2020s": [["Antonio Sanabria", ["ST", "FW"], 84, 14, 3], ["Bremer", ["CB", "DF"], 86, 3, 1], ["Lukic", ["CM", "MF"], 84, 4, 6], ["Milinkovic-Savic", ["GK"], 83, 0, 0, 11], ["Vlasic", ["CM", "MF"], 85, 8, 8], ["Buongiorno", ["CB", "DF"], 84, 2, 1]],
  }),
  Udinese: fbClub({
    "1980s": [["Paolo Rossi", ["ST", "FW"], 88, 18, 4], ["Bergomi", ["CB", "DF"], 84, 2, 1], ["Zico", ["CM", "MF"], 90, 14, 10], ["Tacconi", ["GK"], 83, 0, 0, 12], ["Fanna", ["RB", "DF"], 81, 3, 5], ["Bruno Ferraro", ["CM", "MF"], 80, 4, 5]],
    "1990s": [["Oliver Bierhoff", ["ST", "FW"], 87, 18, 4], ["Amoroso", ["ST", "FW"], 84, 14, 3], ["Calori", ["CB", "DF"], 82, 2, 1], ["Turchetta", ["GK"], 80, 0, 0, 10], ["Pizarro", ["ST", "FW"], 83, 12, 4], ["Pierpaolo Bisoli", ["CM", "MF"], 80, 4, 5]],
    "2000s": [["Antonio Di Natale", ["ST", "FW"], 88, 20, 5], ["Quagliarella", ["ST", "FW"], 84, 14, 4], ["Zapata", ["ST", "FW"], 83, 12, 3], ["Handanovic", ["GK"], 85, 0, 0, 13], ["Inler", ["CM", "MF"], 83, 4, 5], ["Benatia", ["CB", "DF"], 83, 2, 1]],
    "2010s": [["Antonio Di Natale", ["ST", "FW"], 86, 16, 4], ["De Paul", ["CM", "MF"], 86, 8, 10], ["Handanovic", ["GK"], 87, 0, 0, 14], ["Benatia", ["CB", "DF"], 84, 2, 1], ["Badu", ["CM", "MF"], 82, 4, 5], ["Danilo", ["CB", "DF"], 83, 2, 1]],
    "2020s": [["Gerard Deulofeu", ["RW", "FW"], 84, 8, 8], ["Beto", ["ST", "FW"], 84, 14, 3], ["Pereyra", ["CM", "MF"], 84, 6, 8], ["Silvestri", ["GK"], 82, 0, 0, 11], ["Bijol", ["CB", "DF"], 83, 2, 1], ["Walace", ["CM", "MF"], 83, 3, 4]],
  }),
  // Bundesliga (+5 → 10)
  Freiburg: fbClub({
    "1990s": [["Gunter", ["ST", "FW"], 79, 10, 3], ["Zeybel", ["GK"], 77, 0, 0, 9], ["Schuster", ["CM", "MF"], 78, 4, 4], ["Reich", ["CB", "DF"], 77, 2, 1], ["Zuberbuhler", ["GK"], 78, 0, 0, 9], ["Bode", ["ST", "FW"], 80, 10, 3]],
    "2000s": [["Mohr", ["RW", "FW"], 80, 8, 6], ["Gould", ["ST", "FW"], 79, 10, 3], ["Butt", ["GK"], 80, 0, 0, 10], ["Demichelis", ["CB", "DF"], 81, 2, 1], ["Kruse", ["CM", "MF"], 80, 5, 5], ["Strech", ["ST", "FW"], 78, 8, 2]],
    "2010s": [["Petersen", ["ST", "FW"], 84, 14, 3], ["Ginter", ["CB", "DF"], 84, 3, 1], ["Schwolow", ["GK"], 82, 0, 0, 11], ["Grifo", ["CM", "MF"], 83, 6, 8], ["Gulde", ["CB", "DF"], 81, 2, 1], ["Hofler", ["CM", "MF"], 82, 3, 4]],
    "2020s": [["Nicolas Hofler", ["CM", "MF"], 83, 4, 5], ["Grifo", ["CM", "MF"], 85, 8, 10], ["Atubolu", ["GK"], 82, 0, 0, 11], ["Ginter", ["CB", "DF"], 84, 2, 1], ["Doan", ["RW", "FW"], 84, 10, 6], ["Holer", ["ST", "FW"], 82, 10, 3]],
  }),
  "Borussia Monchengladbach": fbClub({
    "1990s": [["Martin Dahlin", ["ST", "FW"], 85, 16, 4], ["Kamps", ["GK"], 81, 0, 0, 11], ["Strupar", ["ST", "FW"], 82, 12, 3], ["Wynhoff", ["CM", "MF"], 80, 4, 5], ["Kohler", ["CB", "DF"], 81, 2, 1], ["Schneider", ["CM", "MF"], 82, 6, 6]],
    "2000s": [["Dante", ["CB", "DF"], 84, 3, 1], ["Neuhaus", ["CM", "MF"], 81, 5, 5], ["Heimeroth", ["GK"], 79, 0, 0, 10], ["Kurzawa", ["ST", "FW"], 80, 10, 3], ["Jorgensen", ["CM", "MF"], 80, 4, 5], ["Domovchiyski", ["ST", "FW"], 79, 8, 2]],
    "2010s": [["Marco Reus", ["LW", "FW"], 87, 14, 10], ["Raffael", ["ST", "FW"], 85, 14, 6], ["Sommer", ["GK"], 86, 0, 0, 14], ["Christensen", ["CB", "DF"], 84, 2, 1], ["Stindl", ["CM", "MF"], 84, 10, 6], ["Hazard", ["LW", "FW"], 84, 10, 8]],
    "2020s": [["Jonas Hofmann", ["RW", "FW"], 84, 8, 10], ["Plea", ["ST", "FW"], 83, 12, 4], ["Sommer", ["GK"], 85, 0, 0, 13], ["Elvedi", ["CB", "DF"], 84, 2, 1], ["Neuhaus", ["CM", "MF"], 84, 6, 6], ["Thuram", ["ST", "FW"], 84, 12, 4]],
  }),
  Stuttgart: fbClub({
    "1990s": [["Giovane Elber", ["ST", "FW"], 88, 20, 5], ["Bobic", ["ST", "FW"], 86, 16, 4], ["Balakov", ["CM", "MF"], 87, 10, 12], ["Ziegler", ["GK"], 83, 0, 0, 12], ["Berger", ["CB", "DF"], 82, 2, 1], ["Soldo", ["CB", "DF"], 83, 2, 1]],
    "2000s": [["Kurz", ["ST", "FW"], 83, 14, 3], ["Hitzlsperger", ["CM", "MF"], 83, 6, 5], ["Wenzel", ["GK"], 80, 0, 0, 10], ["Delpiero", ["ST", "FW"], 82, 10, 4], ["Ljuboja", ["ST", "FW"], 81, 10, 3], [" Fernando Meira", ["CB", "DF"], 80, 2, 1]],
    "2010s": [["Gomez", ["ST", "FW"], 85, 16, 4], ["Didavi", ["CM", "MF"], 84, 8, 8], ["Ulreich", ["GK"], 83, 0, 0, 12], ["Baumgartl", ["CB", "DF"], 81, 2, 1], ["Werner", ["ST", "FW"], 84, 14, 4], ["Kostic", ["LW", "FW"], 84, 8, 8]],
    "2020s": [["Silas", ["RW", "FW"], 84, 10, 6], ["Guirassy", ["ST", "FW"], 86, 18, 4], ["Kobel", ["GK"], 85, 0, 0, 13], ["Anton", ["CB", "DF"], 83, 2, 1], ["Endo", ["CM", "MF"], 84, 4, 6], ["Millot", ["LW", "FW"], 83, 8, 6]],
  }),
  "Eintracht Frankfurt": fbClub({
    "1990s": [["Yeboah", ["ST", "FW"], 86, 18, 4], ["Okoronkwo", ["ST", "FW"], 83, 12, 3], ["Ognjenovic", ["ST", "FW"], 82, 12, 3], ["Wohlfahrt", ["GK"], 81, 0, 0, 11], ["Schurr", ["CB", "DF"], 80, 2, 1], ["Reich", ["CM", "MF"], 79, 4, 5]],
    "2000s": [["Amanatidis", ["ST", "FW"], 84, 14, 4], ["Fink", ["CM", "MF"], 82, 6, 6], ["Weidenfeller", ["GK"], 83, 0, 0, 12], ["Rehmer", ["CB", "DF"], 80, 2, 1], ["Pröll", ["ST", "FW"], 81, 10, 3], ["Chris", ["CM", "MF"], 79, 4, 4]],
    "2010s": [["Seferovic", ["ST", "FW"], 84, 14, 3], ["Hasebe", ["CM", "MF"], 84, 3, 5], ["Trapp", ["GK"], 84, 0, 0, 12], ["Abraham", ["CB", "DF"], 83, 2, 1], ["Gacinovic", ["CM", "MF"], 83, 6, 8], ["Rebic", ["LW", "FW"], 84, 10, 6]],
    "2020s": [["Kolo Muani", ["ST", "FW"], 86, 16, 6], ["Kamada", ["CM", "MF"], 85, 8, 8], ["Trapp", ["GK"], 85, 0, 0, 13], ["Tuta", ["CB", "DF"], 84, 2, 1], ["Gotze", ["CM", "MF"], 84, 6, 8], ["Knauff", ["RW", "FW"], 82, 6, 6]],
  }),
  Hoffenheim: fbClub({
    "1990s": [["Schiel", ["ST", "FW"], 76, 8, 2], ["Kirschbaum", ["GK"], 75, 0, 0, 8], ["Enders", ["CM", "MF"], 75, 3, 3], ["Mayer", ["CB", "DF"], 74, 1, 1], ["Zimmer", ["ST", "FW"], 74, 6, 2], ["Roth", ["CM", "MF"], 73, 2, 3]],
    "2000s": [["Obasi", ["ST", "FW"], 82, 12, 4], ["Demba Ba", ["ST", "FW"], 84, 14, 3], ["Compper", ["CB", "DF"], 80, 2, 1], ["Haas", ["GK"], 78, 0, 0, 9], ["Vorsah", ["CB", "DF"], 79, 2, 1], ["Edu", ["CM", "MF"], 78, 4, 4]],
    "2010s": [["Modeste", ["ST", "FW"], 84, 16, 3], ["Wagner", ["ST", "FW"], 83, 12, 4], ["Baumann", ["GK"], 83, 0, 0, 11], ["Sule", ["CB", "DF"], 84, 3, 1], ["Amiri", ["CM", "MF"], 84, 6, 8], ["Kramaric", ["ST", "FW"], 85, 16, 5]],
    "2020s": [["Kramaric", ["ST", "FW"], 85, 14, 6], ["Baumgartner", ["CM", "MF"], 84, 8, 6], ["Baumann", ["GK"], 84, 0, 0, 12], ["Vogt", ["CB", "DF"], 83, 2, 1], ["Skov", ["ST", "FW"], 83, 12, 3], ["Bebou", ["ST", "FW"], 82, 10, 4]],
  }),
  // Ligue 1 (+5 → 10)
  Nice: fbClub({
    "1990s": [["Ginola", ["LW", "FW"], 87, 10, 12], ["Martini", ["GK"], 82, 0, 0, 11], ["D'Onofrio", ["CB", "DF"], 81, 2, 1], ["Vahirua", ["RW", "FW"], 83, 8, 8], ["Rousset", ["ST", "FW"], 82, 12, 3], ["Pedretti", ["CM", "MF"], 80, 4, 5]],
    "2000s": [["Pauleta", ["ST", "FW"], 86, 18, 4], ["Ezequiel", ["ST", "FW"], 82, 12, 3], ["Hilton", ["CB", "DF"], 82, 2, 1], ["Letizi", ["GK"], 81, 0, 0, 11], ["Cisse", ["ST", "FW"], 81, 10, 3], ["Sab", ["CM", "MF"], 80, 4, 5]],
    "2010s": [["Belhanda", ["CM", "MF"], 84, 8, 8], ["Balotelli", ["ST", "FW"], 85, 16, 3], ["Cardinale", ["GK"], 81, 0, 0, 10], ["Dante", ["CB", "DF"], 84, 2, 1], ["Le Bihan", ["ST", "FW"], 82, 12, 3], ["Seri", ["CM", "MF"], 83, 3, 6]],
    "2020s": [["Gouiri", ["ST", "FW"], 84, 14, 4], ["Thuram", ["ST", "FW"], 84, 12, 4], ["Schmeichel", ["GK"], 84, 0, 0, 12], ["Todibo", ["CB", "DF"], 84, 2, 1], ["Boudaoui", ["CM", "MF"], 83, 4, 5], ["Laborde", ["ST", "FW"], 83, 12, 3]],
  }),
  Rennes: fbClub({
    "1990s": [["Guivarc'h", ["ST", "FW"], 84, 14, 3], ["Bernard", ["GK"], 81, 0, 0, 11], ["Despeyroux", ["ST", "FW"], 80, 10, 3], ["Abeilard", ["CB", "DF"], 79, 2, 1], ["Pouchkarevski", ["CM", "MF"], 78, 4, 4], ["Bancarel", ["RB", "DF"], 78, 2, 4]],
    "2000s": [["Olof Mellberg", ["CB", "DF"], 84, 3, 1], ["Briand", ["ST", "FW"], 83, 12, 4], ["Dawid", ["GK"], 80, 0, 0, 10], ["Piquionne", ["ST", "FW"], 81, 10, 3], ["Yanga-Mbiwa", ["CB", "DF"], 80, 2, 1], ["Tettey", ["CM", "MF"], 80, 3, 4]],
    "2010s": [["Ben Arfa", ["RW", "FW"], 85, 10, 10], ["Gourcuff", ["CM", "MF"], 84, 8, 8], ["Costil", ["GK"], 83, 0, 0, 11], ["Theate", ["CB", "DF"], 82, 2, 1], ["Sarr", ["RW", "FW"], 83, 8, 6], ["Hunou", ["ST", "FW"], 82, 10, 3]],
    "2020s": [["Gouiri", ["ST", "FW"], 85, 16, 5], ["Terrier", ["LW", "FW"], 84, 12, 6], ["Mendy", ["GK"], 84, 0, 0, 12], ["Aguerd", ["CB", "DF"], 84, 2, 1], ["Bourigeaud", ["CM", "MF"], 84, 6, 8], ["Tait", ["CM", "MF"], 83, 6, 6]],
  }),
  Lens: fbClub({
    "1990s": [["Smicer", ["LW", "FW"], 84, 10, 8], ["Fischer", ["GK"], 81, 0, 0, 11], ["Rabe", ["ST", "FW"], 80, 10, 3], ["Debever", ["CB", "DF"], 79, 2, 1], ["Noro", ["CM", "MF"], 78, 4, 4], ["Dhorasso", ["CM", "MF"], 81, 5, 6]],
    "2000s": [["Dhorasso", ["CM", "MF"], 83, 6, 8], ["Cletus", ["ST", "FW"], 81, 12, 3], ["Itandje", ["GK"], 79, 0, 0, 10], ["Dembinski", ["CB", "DF"], 78, 2, 1], ["Roche", ["CM", "MF"], 79, 4, 5], ["Roux", ["ST", "FW"], 80, 10, 3]],
    "2010s": [["Gomis", ["ST", "FW"], 83, 12, 3], ["Lopez", ["ST", "FW"], 82, 10, 3], ["Radu", ["GK"], 80, 0, 0, 10], ["Gradit", ["CB", "DF"], 82, 2, 1], ["Bellegarde", ["CM", "MF"], 81, 4, 5], ["Sarr", ["RW", "FW"], 80, 6, 4]],
    "2020s": [["Sotoca", ["ST", "FW"], 84, 14, 4], ["Said", ["RW", "FW"], 83, 10, 6], ["Samba", ["GK"], 84, 0, 0, 12], ["Gradit", ["CB", "DF"], 84, 2, 1], ["Fofana", ["CM", "MF"], 84, 6, 6], ["Wahi", ["ST", "FW"], 83, 12, 3]],
  }),
  Nantes: fbClub({
    "1990s": [["Japhet N'Doram", ["CM", "MF"], 84, 8, 8], ["Lamblot", ["GK"], 80, 0, 0, 10], ["Halilhodzic", ["ST", "FW"], 81, 10, 3], ["Loko", ["ST", "FW"], 82, 12, 3], ["Marechal", ["CB", "DF"], 80, 2, 1], ["Sylvain", ["RW", "FW"], 79, 6, 4]],
    "2000s": [["Moldovan", ["ST", "FW"], 82, 12, 3], ["Ducourtioux", ["CM", "MF"], 80, 4, 5], ["Riou", ["GK"], 80, 0, 0, 10], ["Dakuo", ["CB", "DF"], 79, 2, 1], ["Puyo", ["ST", "FW"], 78, 8, 2], ["Veisse", ["CM", "MF"], 78, 3, 4]],
    "2010s": [["Gigi Buffon", ["GK"], 82, 0, 0, 11], ["Gomis", ["ST", "FW"], 83, 12, 3], ["Duplex", ["ST", "FW"], 81, 10, 3], ["Viscontini", ["GK"], 79, 0, 0, 9], ["Dubois", ["RB", "DF"], 82, 3, 5], ["Harit", ["RW", "FW"], 83, 6, 8]],
    "2020s": [["Mohamed", ["ST", "FW"], 84, 14, 4], ["Simon", ["LW", "FW"], 84, 8, 8], ["Lafont", ["GK"], 84, 0, 0, 12], ["Castelletto", ["CB", "DF"], 83, 2, 1], ["Chirivella", ["CM", "MF"], 82, 3, 6], ["Blas", ["CM", "MF"], 84, 8, 6]],
  }),
  Strasbourg: fbClub({
    "1990s": [["Lacis", ["CM", "MF"], 81, 5, 6], ["Martini", ["GK"], 79, 0, 0, 10], ["Daf", ["CB", "DF"], 80, 2, 1], ["Zitelli", ["ST", "FW"], 79, 10, 3], ["N'Daw", ["CM", "MF"], 78, 3, 4], ["Muller", ["ST", "FW"], 78, 8, 2]],
    "2000s": [["Maurice", ["ST", "FW"], 80, 10, 3], ["Erhardt", ["GK"], 78, 0, 0, 9], ["Fanni", ["CB", "DF"], 79, 2, 1], ["Kone", ["ST", "FW"], 80, 10, 3], ["Probst", ["RW", "FW"], 78, 6, 4], ["Cole", ["CM", "MF"], 77, 3, 4]],
    "2010s": [["Benzia", ["CM", "MF"], 82, 6, 6], ["Bodmer", ["CM", "MF"], 81, 4, 5], ["Kamara", ["GK"], 80, 0, 0, 10], ["Sane", ["CB", "DF"], 81, 2, 1], ["Ajorque", ["ST", "FW"], 82, 12, 3], ["Simakan", ["CB", "DF"], 82, 2, 1]],
    "2020s": [["Diallo", ["ST", "FW"], 84, 14, 4], ["Thomasson", ["CM", "MF"], 83, 6, 6], ["Sels", ["GK"], 83, 0, 0, 11], ["Sobol", ["LB", "DF"], 82, 2, 5], ["Bellegarde", ["CM", "MF"], 83, 6, 8], ["Sobol", ["LB", "DF"], 81, 2, 4]],
  }),
};

// [name, pos, rating, goals, assists, savePct?]
function hkEra(entries) {
  return entries.map((e) => (e.length === 5 ? [...e, 0] : e));
}

function hkClub(eras) {
  const out = {};
  for (const [era, players] of Object.entries(eras)) out[era] = hkEra(players);
  return out;
}

const HK_PART3 = {
  Jets: hkClub({
    "1990s": [["Teemu Selanne", ["RW"], 92, 40, 36], ["Teppo Numminen", ["D"], 86, 8, 36], ["Ed Olczyk", ["C"], 84, 24, 32], ["Bob Essensa", ["G"], 84, 0, 2, 0.902], ["Thomas Steen", ["C"], 85, 22, 40], ["Keith Tkachuk", ["LW"], 86, 28, 26]],
    "2010s": [["Blake Wheeler", ["RW"], 87, 26, 38], ["Mark Scheifele", ["C"], 86, 26, 34], ["Dustin Byfuglien", ["D"], 86, 12, 32], ["Connor Hellebuyck", ["G"], 88, 0, 2, 0.912], ["Jacob Trouba", ["D"], 85, 8, 26], ["Kyle Connor", ["LW"], 86, 28, 30]],
    "2020s": [["Kyle Connor", ["LW"], 88, 32, 34], ["Mark Scheifele", ["C"], 87, 28, 36], ["Josh Morrissey", ["D"], 87, 10, 38], ["Connor Hellebuyck", ["G"], 90, 0, 2, 0.918], ["Nino Niederreiter", ["RW"], 84, 22, 24], ["Morgan Barron", ["C"], 80, 14, 16]],
  }),
  Stars: hkClub({
    "1970s": [["Bill Goldsworthy", ["RW"], 84, 26, 28], ["Dennis Hextall", ["C"], 80, 18, 24], ["Gary Gambucci", ["LW"], 79, 16, 20], ["Gilles Meloche", ["G"], 82, 0, 2, 0.892], ["J.P. Parise", ["LW"], 83, 22, 28], ["Lou Nanne", ["D"], 81, 6, 24]],
    "1980s": [["Neal Broten", ["C"], 86, 22, 44], ["Brian Bellows", ["RW"], 85, 28, 28], ["Curt Giles", ["D"], 82, 8, 26], ["Jon Casey", ["G"], 83, 0, 2, 0.898], ["Dino Ciccarelli", ["RW"], 87, 32, 30], ["Scott Young", ["LW"], 81, 18, 22]],
    "1990s": [["Mike Modano", ["C"], 91, 32, 44], ["Brett Hull", ["RW"], 90, 34, 28], ["Derian Hatcher", ["D"], 85, 8, 24], ["Ed Belfour", ["G"], 90, 0, 2, 0.912], ["Joe Nieuwendyk", ["C"], 88, 26, 34], ["Jamie Langenbrunner", ["RW"], 84, 22, 32]],
    "2000s": [["Mike Modano", ["C"], 90, 28, 40], ["Marty Turco", ["G"], 87, 0, 2, 0.908], ["Sergei Zubov", ["D"], 88, 10, 40], ["Brenden Morrow", ["LW"], 84, 22, 26], ["Brad Richards", ["C"], 87, 24, 48], ["Jere Lehtinen", ["RW"], 84, 18, 24]],
    "2010s": [["Jamie Benn", ["LW"], 89, 28, 36], ["Tyler Seguin", ["C"], 88, 28, 38], ["John Klingberg", ["D"], 86, 10, 36], ["Ben Bishop", ["G"], 86, 0, 2, 0.908], ["Alexander Radulov", ["RW"], 85, 22, 32], ["Radek Faksa", ["C"], 82, 16, 20]],
    "2020s": [["Jason Robertson", ["LW"], 90, 34, 44], ["Joe Pavelski", ["C"], 86, 24, 30], ["Miro Heiskanen", ["D"], 88, 10, 38], ["Jake Oettinger", ["G"], 88, 0, 2, 0.912], ["Roope Hintz", ["C"], 86, 26, 32], ["Mason Marchment", ["LW"], 84, 22, 26]],
  }),
  Ducks: hkClub({
    "1990s": [["Paul Kariya", ["LW"], 91, 32, 44], ["Teemu Selanne", ["RW"], 93, 42, 38], ["Guy Hebert", ["G"], 84, 0, 2, 0.902], ["Sandis Ozolinsh", ["D"], 86, 12, 36], ["Patrik Kjellberg", ["C"], 80, 18, 22], ["Jason Marshall", ["D"], 80, 6, 20]],
    "2000s": [["Teemu Selanne", ["RW"], 90, 34, 32], ["Scott Niedermayer", ["D"], 90, 12, 40], ["Jean-Sebastien Giguere", ["G"], 88, 0, 2, 0.912], ["Chris Pronger", ["D"], 89, 10, 32], ["Andy McDonald", ["C"], 84, 22, 28], ["Ryan Getzlaf", ["C"], 86, 22, 44]],
    "2010s": [["Ryan Getzlaf", ["C"], 89, 22, 48], ["Corey Perry", ["RW"], 88, 30, 28], ["Cam Fowler", ["D"], 86, 10, 32], ["John Gibson", ["G"], 86, 0, 2, 0.908], ["Rickard Rakell", ["RW"], 85, 26, 24], ["Ryan Kesler", ["C"], 85, 18, 24]],
    "2020s": [["Trevor Zegras", ["C"], 84, 22, 30], ["Troy Terry", ["RW"], 85, 24, 28], ["Cam Fowler", ["D"], 84, 8, 28], ["John Gibson", ["G"], 84, 0, 2, 0.902], ["Adam Henrique", ["C"], 83, 18, 22], ["Jamie Drysdale", ["D"], 83, 8, 24]],
  }),
  Kings: hkClub({
    "1970s": [["Marcel Dionne", ["C"], 92, 36, 48], ["Dave Taylor", ["RW"], 86, 26, 32], ["Butch Goring", ["C"], 84, 22, 32], ["Rogie Vachon", ["G"], 85, 0, 2, 0.898], ["Charlie Simmer", ["LW"], 86, 32, 30], ["Larry Murphy", ["D"], 84, 10, 32]],
    "1980s": [["Luc Robitaille", ["LW"], 90, 36, 36], ["Bernie Nicholls", ["C"], 87, 28, 44], ["Steve Duchesne", ["D"], 85, 12, 32], ["Kelly Hrudey", ["G"], 84, 0, 2, 0.898], ["Jimmy Carson", ["C"], 84, 28, 32], ["Dave Taylor", ["RW"], 85, 24, 28]],
    "1990s": [["Luc Robitaille", ["LW"], 88, 28, 32], ["Wayne Gretzky", ["C"], 94, 28, 68], ["Rob Blake", ["D"], 89, 12, 36], ["Kelly Hrudey", ["G"], 84, 0, 2, 0.898], ["Jari Kurri", ["RW"], 86, 22, 28], ["Tony Granato", ["RW"], 83, 22, 26]],
    "2000s": [["Anze Kopitar", ["C"], 88, 24, 40], ["Dustin Brown", ["RW"], 84, 22, 26], ["Rob Blake", ["D"], 86, 10, 32], ["Jonathan Quick", ["G"], 87, 0, 2, 0.908], ["Alexander Frolov", ["LW"], 84, 24, 26], ["Derek Armstrong", ["C"], 81, 16, 24]],
    "2010s": [["Anze Kopitar", ["C"], 90, 24, 44], ["Drew Doughty", ["D"], 90, 10, 38], ["Jonathan Quick", ["G"], 88, 0, 2, 0.912], ["Jeff Carter", ["C"], 86, 26, 24], ["Dustin Brown", ["RW"], 84, 20, 24], ["Tyler Toffoli", ["RW"], 84, 22, 22]],
    "2020s": [["Anze Kopitar", ["C"], 87, 22, 38], ["Adrian Kempe", ["LW"], 86, 28, 30], ["Drew Doughty", ["D"], 87, 8, 34], ["Cam Talbot", ["G"], 84, 0, 2, 0.905], ["Kevin Fiala", ["LW"], 85, 24, 32], ["Quinton Byfield", ["C"], 82, 18, 22]],
  }),
  Canucks: hkClub({
    "1970s": [["Dennis Ververgaert", ["C"], 82, 22, 26], ["Bobby Schmautz", ["RW"], 80, 20, 22], ["Gerry O'Flaherty", ["LW"], 79, 18, 20], ["Gary Smith", ["G"], 81, 0, 2, 0.892], ["Dennis Kearns", ["D"], 80, 8, 24], ["Rosaire Paiement", ["C"], 81, 20, 26]],
    "1980s": [["Thomas Gradin", ["C"], 86, 26, 38], ["Ivan Hlinka", ["C"], 84, 22, 36], ["Richard Brodeur", ["G"], 83, 0, 2, 0.895], ["Harold Snepsts", ["D"], 81, 6, 20], ["Patrik Sundstrom", ["RW"], 84, 24, 32], ["Tony Tanti", ["LW"], 85, 32, 28]],
    "1990s": [["Pavel Bure", ["RW"], 93, 44, 28], ["Trevor Linden", ["C"], 87, 26, 32], ["Kirk McLean", ["G"], 85, 0, 2, 0.902], ["Alexander Mogilny", ["RW"], 89, 32, 38], ["Ed Jovanovski", ["D"], 84, 8, 24], ["Markus Naslund", ["LW"], 86, 28, 30]],
    "2000s": [["Markus Naslund", ["LW"], 89, 32, 36], ["Todd Bertuzzi", ["LW"], 87, 28, 32], ["Roberto Luongo", ["G"], 90, 0, 2, 0.912], ["Daniel Sedin", ["LW"], 88, 28, 36], ["Henrik Sedin", ["C"], 88, 18, 52], ["Mattias Ohlund", ["D"], 85, 10, 28]],
    "2010s": [["Henrik Sedin", ["C"], 88, 16, 48], ["Daniel Sedin", ["LW"], 87, 24, 32], ["Roberto Luongo", ["G"], 87, 0, 2, 0.912], ["Ryan Kesler", ["C"], 86, 22, 26], ["Alex Edler", ["D"], 84, 8, 26], ["Bo Horvat", ["C"], 85, 24, 28]],
    "2020s": [["Elias Pettersson", ["C"], 88, 28, 38], ["Quinn Hughes", ["D"], 88, 10, 42], ["Thatcher Demko", ["G"], 86, 0, 2, 0.908], ["J.T. Miller", ["C"], 86, 24, 34], ["Brock Boeser", ["RW"], 85, 26, 26], ["Bo Horvat", ["C"], 85, 24, 28]],
  }),
  Coyotes: hkClub({
    "1990s": [["Keith Tkachuk", ["LW"], 89, 32, 28], ["Jeremy Roenick", ["C"], 88, 32, 34], ["Nikolai Khabibulin", ["G"], 86, 0, 2, 0.905], ["Teppo Numminen", ["D"], 85, 8, 32], ["Rick Tocchet", ["RW"], 85, 26, 28], ["Shane Doan", ["RW"], 84, 22, 26]],
    "2000s": [["Shane Doan", ["RW"], 87, 26, 30], ["Derek Morris", ["D"], 83, 8, 26], ["Marty Turco", ["G"], 84, 0, 2, 0.902], ["Radim Vrbata", ["RW"], 84, 24, 26], ["Ed Jovanovski", ["D"], 84, 8, 24], ["Keith Yandle", ["D"], 84, 8, 32]],
    "2010s": [["Shane Doan", ["RW"], 84, 20, 24], ["Oliver Ekman-Larsson", ["D"], 86, 12, 32], ["Mike Smith", ["G"], 85, 0, 2, 0.905], ["Radim Vrbata", ["RW"], 84, 22, 24], ["Max Domi", ["C"], 83, 18, 28], ["Clayton Keller", ["RW"], 84, 24, 28]],
    "2020s": [["Clayton Keller", ["RW"], 86, 28, 32], ["Nick Schmaltz", ["C"], 85, 22, 36], ["Jakob Chychrun", ["D"], 85, 10, 28], ["Karel Vejmelka", ["G"], 83, 0, 2, 0.902], ["Lawson Crouse", ["LW"], 83, 22, 18], ["Clayton Keller", ["RW"], 85, 26, 30]],
  }),
  "Blue Jackets": hkClub({
    "2000s": [["Rick Nash", ["LW"], 88, 32, 26], ["Sergei Fedorov", ["C"], 87, 22, 36], ["Pascal Leclaire", ["G"], 83, 0, 2, 0.898], ["Rostislav Klesla", ["D"], 82, 6, 20], ["Geoff Sanderson", ["LW"], 83, 22, 22], ["Jan Hejda", ["D"], 81, 4, 18]],
    "2010s": [["Rick Nash", ["LW"], 87, 28, 26], ["Sergei Bobrovsky", ["G"], 90, 0, 2, 0.918], ["Seth Jones", ["D"], 87, 10, 32], ["Ryan Johansen", ["C"], 86, 24, 36], ["Artemi Panarin", ["LW"], 88, 26, 40], ["Cam Atkinson", ["RW"], 85, 26, 24]],
    "2020s": [["Johnny Gaudreau", ["LW"], 89, 26, 44], ["Zach Werenski", ["D"], 87, 10, 34], ["Elvis Merzlikins", ["G"], 85, 0, 2, 0.905], ["Patrik Laine", ["RW"], 86, 28, 24], ["Boone Jenner", ["C"], 84, 22, 22], ["Jake Bean", ["D"], 81, 6, 20]],
  }),
  Sabres: hkClub({
    "1970s": [["Gilbert Perreault", ["C"], 93, 32, 52], ["Rick Martin", ["LW"], 90, 38, 28], ["Rene Robert", ["RW"], 88, 30, 40], ["Roger Crozier", ["G"], 86, 0, 2, 0.902], ["Jerry Korab", ["D"], 83, 6, 22], ["Jim Schoenfeld", ["D"], 82, 8, 24]],
    "1980s": [["Gilbert Perreault", ["C"], 90, 26, 44], ["Pierre Turgeon", ["C"], 88, 28, 40], ["Tom Barrasso", ["G"], 87, 0, 2, 0.905], ["Phil Housley", ["D"], 88, 14, 48], ["Dave Andreychuk", ["LW"], 86, 28, 30], ["Alexander Mogilny", ["RW"], 89, 34, 38]],
    "1990s": [["Dominik Hasek", ["G"], 95, 0, 2, 0.928], ["Pierre Turgeon", ["C"], 90, 30, 42], ["Pat LaFontaine", ["C"], 91, 32, 52], ["Alexander Mogilny", ["RW"], 91, 36, 40], ["Michael Peca", ["C"], 84, 20, 30], ["Brian Campbell", ["D"], 84, 8, 28]],
    "2000s": [["Thomas Vanek", ["LW"], 87, 28, 28], ["Jason Pominville", ["RW"], 84, 22, 28], ["Ryan Miller", ["G"], 88, 0, 2, 0.912], ["Brian Campbell", ["D"], 86, 8, 32], ["Tim Connolly", ["C"], 83, 18, 30], ["Drew Stafford", ["RW"], 83, 22, 22]],
    "2010s": [["Jack Eichel", ["C"], 89, 28, 38], ["Sam Reinhart", ["C"], 86, 26, 30], ["Ryan O'Reilly", ["C"], 87, 22, 36], ["Robin Lehner", ["G"], 85, 0, 2, 0.905], ["Rasmus Ristolainen", ["D"], 84, 8, 26], ["Evander Kane", ["LW"], 85, 24, 22]],
    "2020s": [["Tage Thompson", ["C"], 88, 32, 28], ["Rasmus Dahlin", ["D"], 87, 12, 36], ["Ukko-Pekka Luukkonen", ["G"], 85, 0, 2, 0.908], ["Alex Tuch", ["RW"], 85, 24, 26], ["Dylan Cozens", ["C"], 84, 22, 26], ["Rasmus Dahlin", ["D"], 86, 10, 34]],
  }),
  Predators: hkClub({
    "1990s": [["Cliff Ronning", ["C"], 84, 22, 36], ["Tom Fitzgerald", ["RW"], 80, 16, 20], ["Mike Dunham", ["G"], 82, 0, 2, 0.895], ["Greg Johnson", ["C"], 81, 16, 22], ["Bill Huard", ["D"], 79, 6, 18], ["Denis Arkhipov", ["C"], 80, 14, 18]],
    "2000s": [["Paul Kariya", ["LW"], 88, 26, 40], ["Steve Sullivan", ["LW"], 84, 22, 30], ["Chris Mason", ["G"], 84, 0, 2, 0.902], ["Shea Weber", ["D"], 87, 12, 28], ["Jason Arnott", ["C"], 86, 26, 32], ["Martin Erat", ["RW"], 83, 18, 28]],
    "2010s": [["Pekka Rinne", ["G"], 90, 0, 2, 0.918], ["Roman Josi", ["D"], 90, 12, 40], ["Filip Forsberg", ["LW"], 88, 28, 30], ["P.K. Subban", ["D"], 87, 10, 32], ["Ryan Johansen", ["C"], 86, 22, 36], ["James Neal", ["RW"], 85, 26, 22]],
    "2020s": [["Roman Josi", ["D"], 89, 14, 42], ["Filip Forsberg", ["LW"], 87, 28, 32], ["Juuse Saros", ["G"], 88, 0, 2, 0.912], ["Matt Duchene", ["C"], 85, 24, 34], ["Ryan O'Reilly", ["C"], 86, 22, 36], ["Nino Niederreiter", ["RW"], 83, 20, 22]],
  }),
  Hurricanes: hkClub({
    "1990s": [["Ron Francis", ["C"], 90, 22, 52], ["Jeff Sanderson", ["LW"], 84, 24, 28], ["Glen Wesley", ["D"], 84, 8, 26], ["Arturs Irbe", ["G"], 86, 0, 2, 0.905], ["Ray Sheppard", ["RW"], 83, 24, 20], ["Kevin Dineen", ["C"], 84, 22, 28]],
    "2000s": [["Rod Brind'Amour", ["C"], 87, 20, 30], ["Eric Staal", ["C"], 89, 32, 36], ["Cam Ward", ["G"], 87, 0, 2, 0.908], ["Glen Wesley", ["D"], 82, 6, 22], ["Justin Williams", ["RW"], 85, 24, 28], ["Cory Stillman", ["LW"], 84, 22, 30]],
    "2010s": [["Eric Staal", ["C"], 86, 26, 32], ["Justin Faulk", ["D"], 86, 10, 28], ["Cam Ward", ["G"], 84, 0, 2, 0.902], ["Jeff Skinner", ["LW"], 86, 26, 24], ["Victor Rask", ["C"], 84, 20, 26], ["Sebastian Aho", ["C"], 86, 26, 32]],
    "2020s": [["Sebastian Aho", ["C"], 89, 28, 38], ["Andrei Svechnikov", ["RW"], 87, 28, 30], ["Jacob Slavin", ["D"], 86, 6, 26], ["Frederik Andersen", ["G"], 86, 0, 2, 0.908], ["Teuvo Teravainen", ["LW"], 85, 22, 36], ["Seth Jarvis", ["C"], 84, 24, 24]],
  }),
  Flyers: hkClub({
    "1970s": [["Bobby Clarke", ["C"], 92, 24, 52], ["Bill Barber", ["LW"], 89, 32, 34], ["Bernie Parent", ["G"], 92, 0, 2, 0.912], ["Reggie Leach", ["RW"], 87, 38, 22], ["Jim Watson", ["D"], 83, 6, 22], ["Moose Dupont", ["D"], 82, 8, 24]],
    "1980s": [["Mark Howe", ["D"], 90, 14, 48], ["Tim Kerr", ["RW"], 88, 36, 24], ["Pelle Lindbergh", ["G"], 89, 0, 2, 0.908], ["Brian Propp", ["LW"], 87, 28, 32], ["Ron Sutter", ["C"], 83, 20, 28], ["Dave Poulin", ["C"], 84, 22, 30]],
    "1990s": [["Eric Lindros", ["C"], 93, 36, 44], ["John LeClair", ["LW"], 90, 34, 32], ["Rod Brind'Amour", ["C"], 86, 22, 34], ["Eric Desjardins", ["D"], 87, 10, 36], ["Ron Hextall", ["G"], 86, 0, 2, 0.902], ["Mikael Renberg", ["RW"], 84, 24, 24]],
    "2000s": [["Peter Forsberg", ["C"], 91, 22, 52], ["Simon Gagne", ["LW"], 87, 28, 28], ["Keith Primeau", ["C"], 86, 24, 32], ["Kimmo Timonen", ["D"], 86, 8, 32], ["Martin Biron", ["G"], 85, 0, 2, 0.905], ["Mike Richards", ["C"], 86, 24, 34]],
    "2010s": [["Claude Giroux", ["C"], 90, 24, 44], ["Jakub Voracek", ["RW"], 87, 22, 38], ["Wayne Simmonds", ["RW"], 85, 24, 24], ["Steve Mason", ["G"], 84, 0, 2, 0.902], ["Kimmo Timonen", ["D"], 84, 6, 28], ["Sean Couturier", ["C"], 86, 22, 30]],
    "2020s": [["Claude Giroux", ["C"], 86, 20, 40], ["Travis Konecny", ["RW"], 85, 24, 28], ["Ivan Provorov", ["D"], 85, 8, 26], ["Carter Hart", ["G"], 84, 0, 2, 0.902], ["Kevin Hayes", ["C"], 84, 18, 28], ["Tony DeAngelo", ["D"], 83, 10, 28]],
  }),
  Kraken: hkClub({
    "2020s": [["Matty Beniers", ["C"], 84, 22, 28], ["Jordan Eberle", ["RW"], 85, 24, 28], ["Adam Larsson", ["D"], 83, 4, 18], ["Philipp Grubauer", ["G"], 84, 0, 2, 0.902], ["Vince Dunn", ["D"], 84, 8, 26], ["Jared McCann", ["LW"], 83, 22, 22]],
  }),
};

fs.writeFileSync(join(root, "scripts", "fb-leagues-extra.json"), JSON.stringify(FB_LEAGUES_EXTRA, null, 2));
fs.writeFileSync(join(root, "scripts", "hk-part3.json"), JSON.stringify(HK_PART3, null, 2));
console.log(`fb-leagues-extra: ${Object.keys(FB_LEAGUES_EXTRA).length} clubs`);
console.log(`hk-part3: ${Object.keys(HK_PART3).length} teams`);
