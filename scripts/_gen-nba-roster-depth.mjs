/** Generates scripts/build-nba-roster-depth.mjs with validated depth for all 157 club×era combos. */
import fs from "fs";

const p = (n, pos, r, ppg, rpg, apg, spg = 1, bpg = 0.5) =>
  [n, pos, r, ppg, rpg, apg, spg, bpg];

const CLUBS = {
  "76ers": {
    "1980s": [p("Caldwell Jones", "C", 80, 10, 9, 1, 0.5, 1.5), p("Clint Richardson", "SG", 76, 8, 3, 3, 1, 0.2), p("Franklin Edwards", "PG", 78, 10, 2, 4, 1, 0.2), p("Clemon Johnson", "C", 77, 8, 7, 2, 0.4, 0.6), p("Marc Iavaroni", "SF", 75, 7, 4, 2, 0.6, 0.3), p("Ed Sherod", "PG", 74, 6, 2, 4, 0.8, 0.1), p("Sam Williams", "PF", 76, 9, 6, 1, 0.5, 0.8), p("Steve Mix", "SF", 79, 12, 5, 2, 0.6, 0.3), p("Joe Bryant", "SF", 78, 11, 5, 2, 0.6, 0.4)],
    "1990s": [p("Hersey Hawkins", "SG", 84, 16, 4, 3, 1.2, 0.3), p("Dana Barros", "PG", 82, 14, 2, 5, 0.9, 0.1), p("Manute Bol", "C", 78, 4, 5, 1, 0.3, 3.2), p("Rick Mahorn", "PF", 79, 8, 7, 1, 0.5, 0.5), p("Mike Gminski", "C", 80, 12, 7, 2, 0.5, 0.8), p("Jeff Malone", "SG", 81, 16, 3, 2, 0.6, 0.2), p("Ron Anderson", "SF", 76, 10, 3, 2, 0.6, 0.2), p("Willie Burton", "SG", 77, 12, 3, 2, 0.8, 0.3), p("Clarence Weatherspoon", "PF", 80, 12, 8, 2, 0.8, 0.5)],
    "2000s": [p("Thaddeus Young", "SF", 82, 14, 6, 2, 1, 0.5), p("Willie Green", "SG", 78, 10, 3, 2, 0.7, 0.2), p("Rodney Carney", "SF", 75, 8, 3, 1, 0.8, 0.3), p("Marreese Speights", "PF", 77, 10, 5, 0.5, 0.4, 0.6), p("Lou Williams", "SG", 81, 14, 2, 3, 0.8, 0.2), p("Elton Brand", "PF", 84, 16, 9, 2, 0.6, 1), p("Jrue Holiday", "PG", 80, 12, 4, 5, 1.2, 0.4), p("Samuel Dalembert", "C", 80, 8, 9, 0.5, 0.5, 1.8), p("Andre Iguodala", "SF", 83, 14, 5, 4, 1.2, 0.6)],
    "2010s": [p("T.J. McConnell", "PG", 78, 8, 3, 5, 1, 0.2), p("Richaun Holmes", "C", 80, 10, 7, 1, 0.6, 1.2), p("Dario Saric", "PF", 80, 12, 6, 3, 0.6, 0.4), p("Ersan Ilyasova", "PF", 79, 12, 6, 1, 0.5, 0.4), p("Wilson Chandler", "SF", 80, 12, 5, 2, 0.7, 0.5), p("Mike Muscala", "C", 76, 8, 5, 1, 0.4, 0.6), p("Nik Stauskas", "SG", 76, 10, 3, 2, 0.5, 0.2), p("Markelle Fultz", "PG", 78, 12, 4, 5, 1, 0.4), p("Jahlil Okafor", "C", 79, 14, 7, 2, 0.4, 0.6)],
    "2020s": [p("De'Anthony Melton", "SG", 80, 10, 3, 3, 1.2, 0.5), p("Nicolas Batum", "SF", 78, 8, 5, 3, 0.7, 0.5), p("Paul Reed", "PF", 77, 8, 6, 1, 0.8, 0.8), p("Furkan Korkmaz", "SG", 76, 10, 3, 1, 0.5, 0.2), p("Montrezl Harrell", "C", 79, 12, 6, 1, 0.5, 0.6), p("Caleb Martin", "SF", 77, 10, 4, 2, 0.8, 0.4), p("Buddy Hield", "SG", 81, 14, 4, 2, 0.7, 0.2), p("Kelly Oubre Jr.", "SF", 80, 14, 5, 2, 0.9, 0.4), p("KJ Martin", "SF", 75, 8, 4, 1, 0.6, 0.5)],
  },
  Bucks: {
    "1960s": [p("Wayne Embry", "C", 82, 14, 10, 2, 0.5, 0.6), p("Flynn Robinson", "SG", 80, 14, 3, 3, 0.8, 0.2), p("Gary Keller", "PF", 76, 10, 7, 1, 0.5, 0.5), p("Fred Crawford", "SG", 77, 12, 4, 2, 0.8, 0.3), p("Len Chappell", "PF", 78, 12, 8, 2, 0.5, 0.4), p("Wali Jones", "PG", 77, 10, 3, 4, 0.8, 0.2), p("Dick Cunningham", "C", 76, 8, 9, 1, 0.4, 0.8), p("Guy Rodgers", "PG", 79, 10, 4, 7, 0.8, 0.2)],
    "1970s": [p("Swen Nater", "C", 80, 12, 10, 2, 0.5, 0.8), p("Harvey Catchings", "PF", 77, 8, 7, 2, 0.6, 0.8), p("Don Smith", "SG", 78, 12, 4, 3, 0.8, 0.3), p("Gary Brokaw", "SF", 77, 11, 4, 3, 0.8, 0.4), p("Alex English", "SF", 82, 16, 6, 3, 0.8, 0.5), p("Marques Johnson", "SF", 84, 18, 7, 4, 1, 0.6), p("Quinn Buckner", "PG", 78, 8, 4, 5, 1.2, 0.3), p("Lloyd Walton", "PG", 76, 7, 3, 5, 0.8, 0.2)],
    "1980s": [p("Ricky Pierce", "SG", 84, 18, 3, 3, 0.8, 0.2), p("Jack Sikma", "C", 86, 16, 10, 3, 0.8, 1.2), p("Paul Pressey", "SF", 82, 14, 6, 5, 1.2, 0.8), p("Craig Hodges", "SG", 79, 10, 3, 2, 0.6, 0.2), p("Alton Lister", "C", 77, 8, 8, 1, 0.4, 1.2), p("Kenny Green", "PF", 76, 9, 6, 1, 0.5, 0.5), p("Jay Humphries", "PG", 78, 10, 3, 5, 1, 0.3), p("Terry Cummings", "PF", 83, 16, 8, 2, 0.8, 0.5)],
    "1990s": [p("Vin Baker", "PF", 86, 18, 9, 3, 0.8, 1), p("Jon Barry", "SG", 79, 10, 3, 4, 0.8, 0.3), p("Ervin Johnson", "C", 77, 6, 8, 1, 0.4, 1), p("Shawn Respert", "SG", 76, 10, 2, 2, 0.6, 0.2), p("Sherell Ford", "SF", 75, 8, 4, 1, 0.6, 0.4), p("Vinny Del Negro", "SG", 78, 11, 3, 4, 0.6, 0.2), p("Robert Reid", "SF", 77, 10, 4, 3, 0.8, 0.5), p("Olden Polynice", "C", 78, 10, 8, 1, 0.4, 0.8)],
    "2000s": [p("Toni Kukoc", "SF", 82, 12, 5, 4, 0.8, 0.5), p("Desmond Mason", "SF", 80, 12, 6, 2, 0.8, 0.8), p("Zaza Pachulia", "C", 78, 8, 7, 1, 0.4, 0.5), p("Mo Williams", "PG", 81, 14, 3, 5, 0.8, 0.2), p("Bobby Simmons", "SF", 79, 12, 5, 2, 0.8, 0.3), p("Dan Gadzuric", "C", 76, 6, 7, 1, 0.3, 0.8), p("Keith Van Horn", "PF", 80, 14, 6, 2, 0.6, 0.4), p("Charlie Villanueva", "PF", 79, 12, 6, 1, 0.5, 0.4)],
    "2010s": [p("Eric Bledsoe", "PG", 84, 16, 4, 6, 1.2, 0.4), p("John Henson", "C", 80, 10, 8, 2, 0.6, 1.5), p("Ersan Ilyasova", "PF", 81, 12, 6, 1, 0.5, 0.4), p("Mirza Teletovic", "PF", 78, 10, 5, 1, 0.4, 0.3), p("Tony Snell", "SF", 77, 8, 3, 2, 0.6, 0.4), p("Matthew Dellavedova", "PG", 78, 8, 3, 5, 0.6, 0.2), p("Thon Maker", "C", 76, 6, 5, 1, 0.4, 1), p("George Hill", "PG", 82, 12, 3, 4, 0.8, 0.3)],
    "2020s": [p("Bobby Portis", "PF", 82, 14, 9, 2, 0.6, 0.4), p("Pat Connaughton", "SG", 78, 8, 5, 2, 0.6, 0.4), p("Grayson Allen", "SG", 79, 10, 3, 2, 0.6, 0.2), p("Jae Crowder", "PF", 78, 8, 5, 2, 0.6, 0.3), p("Malik Beasley", "SG", 79, 12, 3, 2, 0.7, 0.2), p("Andre Jackson Jr.", "SF", 76, 7, 5, 2, 0.8, 0.4), p("MarJon Beauchamp", "SF", 76, 8, 4, 1, 0.6, 0.3), p("Taurean Prince", "SF", 79, 9, 4, 2, 0.6, 0.3)],
  },
  Bulls: {
    "1960s": [p("Clem Haskins", "PG", 79, 12, 4, 5, 1, 0.2), p("Jim Washington", "PF", 78, 12, 8, 2, 0.6, 0.5), p("Don Kojis", "SF", 77, 14, 5, 2, 0.8, 0.3), p("Tom Boerwinkle", "C", 77, 8, 10, 3, 0.4, 1), p("Matt Guokas", "SG", 75, 8, 3, 3, 0.6, 0.2), p("Mickey Johnson", "SF", 76, 10, 5, 2, 0.6, 0.4), p("Fred Brown", "SG", 76, 10, 3, 2, 0.8, 0.2), p("Keith Erickson", "SF", 78, 10, 5, 3, 0.8, 0.4)],
    "1970s": [p("Tom Boerwinkle", "C", 80, 8, 11, 4, 0.4, 1.2), p("Wilbur Holland", "PG", 77, 12, 3, 5, 1.2, 0.2), p("Clifford Ray", "C", 79, 10, 9, 2, 0.5, 1.2), p("Mickey Johnson", "SF", 78, 12, 6, 3, 0.8, 0.5), p("Keith Magnuson", "SG", 76, 10, 3, 3, 0.8, 0.2), p("John Mengelt", "SG", 77, 12, 3, 4, 0.8, 0.2), p("Tom Henderson", "PG", 76, 8, 3, 5, 0.8, 0.2), p("Andrés Guibert", "PF", 77, 10, 7, 2, 0.5, 0.5)],
    "1980s": [p("Dave Greenwood", "PF", 81, 12, 9, 3, 0.8, 1), p("Brad Sellers", "C", 77, 10, 5, 2, 0.5, 0.8), p("Charles Oakley", "PF", 82, 10, 10, 2, 0.8, 0.4), p("Sam Vincent", "PG", 78, 10, 3, 5, 0.8, 0.2), p("Will Perdue", "C", 78, 8, 7, 1, 0.4, 0.8), p("B.J. Armstrong", "PG", 80, 12, 3, 4, 0.8, 0.2), p("Stacey King", "PF", 76, 8, 5, 1, 0.4, 0.4), p("Craig Hodges", "SG", 79, 10, 3, 2, 0.6, 0.2)],
    "1990s": [p("Steve Kerr", "PG", 80, 8, 2, 3, 0.6, 0.1), p("Bill Cartwright", "C", 79, 8, 6, 2, 0.4, 0.8), p("Will Perdue", "C", 78, 8, 7, 1, 0.4, 0.8), p("Jud Buechler", "SF", 76, 6, 4, 2, 0.6, 0.3), p("Ron Harper", "SG", 82, 12, 5, 4, 1.2, 0.6), p("Steve Smith", "SG", 80, 12, 3, 3, 0.8, 0.2), p("Dickey Simpkins", "PF", 75, 6, 5, 1, 0.4, 0.4), p("Bill Wennington", "C", 76, 6, 5, 1, 0.3, 0.5)],
    "2000s": [p("Tyrus Thomas", "PF", 78, 10, 7, 1, 0.8, 1.2), p("Andres Nocioni", "SF", 80, 12, 5, 2, 0.8, 0.4), p("Chris Duhon", "PG", 77, 8, 3, 5, 0.8, 0.2), p("Thabo Sefolosha", "SF", 78, 8, 4, 2, 0.8, 0.5), p("Aaron Gray", "C", 76, 6, 6, 1, 0.3, 0.6), p("Larry Hughes", "SG", 80, 14, 4, 4, 1, 0.4), p("Brad Miller", "C", 82, 12, 9, 3, 0.5, 0.6), p("Kirk Hinrich", "PG", 79, 11, 3, 5, 1, 0.2)],
    "2010s": [p("Taj Gibson", "PF", 81, 10, 7, 1, 0.5, 1), p("Kirk Hinrich", "PG", 79, 8, 3, 4, 0.8, 0.2), p("Mike Dunleavy", "SF", 78, 10, 4, 2, 0.6, 0.3), p("Tony Snell", "SF", 77, 8, 3, 2, 0.6, 0.4), p("Doug McDermott", "SF", 78, 10, 3, 2, 0.4, 0.2), p("Robin Lopez", "C", 79, 10, 6, 1, 0.4, 0.8), p("Rajon Rondo", "PG", 82, 8, 5, 7, 1, 0.3), p("Bobby Portis", "PF", 80, 12, 8, 2, 0.6, 0.4)],
    "2020s": [p("Alex Caruso", "SG", 82, 8, 4, 4, 1.2, 0.5), p("Coby White", "PG", 80, 14, 4, 4, 0.7, 0.3), p("Patrick Williams", "PF", 79, 10, 5, 2, 0.6, 0.5), p("Ayo Dosunmu", "SG", 79, 11, 3, 3, 0.8, 0.3), p("Jevon Carter", "PG", 77, 8, 3, 3, 0.8, 0.2), p("Andre Drummond", "C", 81, 10, 11, 1, 0.8, 1), p("Torrey Craig", "SF", 76, 7, 5, 1, 0.6, 0.4), p("Dalton Knecht", "SG", 76, 10, 4, 1, 0.5, 0.2)],
  },
  Cavaliers: {
    "1990s": [p("Terrell Brandon", "PG", 84, 16, 3, 7, 1.2, 0.2), p("Chris Mills", "SF", 79, 12, 5, 2, 0.8, 0.5), p("Bimbo Coles", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Steve Kerr", "PG", 78, 8, 2, 3, 0.6, 0.1), p("John Battle", "SG", 78, 12, 3, 3, 0.8, 0.2), p("Mark Price", "PG", 83, 16, 3, 8, 1, 0.2), p("Craig Ehlo", "SG", 79, 12, 4, 3, 0.8, 0.4), p("Larry Nance", "PF", 82, 14, 8, 3, 0.8, 1.2)],
    "2000s": [p("Donyell Marshall", "PF", 79, 10, 6, 2, 0.6, 0.5), p("Daniel Gibson", "PG", 78, 12, 3, 3, 0.8, 0.2), p("Anderson Varejao", "PF", 80, 8, 9, 2, 0.8, 0.5), p("Mo Williams", "PG", 81, 14, 3, 5, 0.8, 0.2), p("Antawn Jamison", "PF", 83, 16, 8, 2, 0.6, 0.4), p("Delonte West", "PG", 79, 12, 4, 5, 0.8, 0.3), p("Wally Szczerbiak", "SF", 80, 14, 4, 3, 0.6, 0.3), p("Ben Wallace", "C", 82, 6, 10, 2, 1, 2)],
    "2010s": [p("George Hill", "PG", 81, 12, 3, 4, 0.8, 0.3), p("J.R. Smith", "SG", 80, 12, 4, 2, 0.8, 0.3), p("Tristan Thompson", "PF", 79, 8, 9, 1, 0.6, 0.6), p("Matthew Dellavedova", "PG", 78, 8, 3, 5, 0.6, 0.2), p("Iman Shumpert", "SG", 78, 8, 4, 2, 0.8, 0.4), p("Kyle Korver", "SG", 82, 12, 3, 2, 0.6, 0.2), p("Channing Frye", "PF", 78, 10, 5, 1, 0.4, 0.5), p("Jordan Clarkson", "SG", 80, 14, 3, 2, 0.6, 0.2)],
    "2020s": [p("Darius Garland", "PG", 84, 18, 3, 7, 0.9, 0.2), p("Jarrett Allen", "C", 83, 12, 10, 2, 0.6, 1.5), p("Caris LeVert", "SG", 82, 16, 4, 4, 0.9, 0.4), p("Dean Wade", "PF", 76, 7, 5, 1, 0.6, 0.5), p("Isaac Okoro", "SF", 77, 9, 4, 2, 0.8, 0.4), p("Georges Niang", "PF", 78, 10, 4, 2, 0.4, 0.3), p("Max Strus", "SG", 79, 12, 4, 2, 0.6, 0.3), p("Sam Merrill", "SG", 76, 8, 3, 2, 0.5, 0.2)],
  },
  Celtics: {
    "1960s": [p("Tom Sanders", "SF", 80, 10, 6, 2, 0.8, 0.5), p("K.C. Jones", "PG", 79, 8, 4, 5, 1, 0.3), p("Willie Naulls", "PF", 81, 14, 7, 2, 0.6, 0.4), p("Don Nelson", "PF", 80, 12, 6, 2, 0.6, 0.4), p("Larry Siegfried", "SG", 78, 10, 3, 3, 0.8, 0.2), p("Jim Loscutoff", "SF", 76, 7, 5, 1, 0.5, 0.3), p("Frank Ramsey", "SG", 79, 12, 5, 2, 0.8, 0.3), p("Mel Counts", "C", 77, 8, 7, 1, 0.4, 0.8)],
    "1970s": [p("Don Nelson", "PF", 81, 13, 7, 2, 0.6, 0.4), p("Charlie Scott", "SG", 82, 16, 4, 4, 1, 0.3), p("Don Chaney", "SG", 79, 11, 4, 3, 1, 0.4), p("Dave Cowens", "C", 83, 16, 12, 3, 0.8, 1), p("Cedric Maxwell", "SF", 80, 12, 6, 3, 0.8, 0.5), p("Rick Robey", "C", 77, 10, 7, 1, 0.4, 0.8), p("Nate Archibald", "PG", 84, 18, 3, 8, 1.2, 0.2), p("M.L. Carr", "SF", 78, 12, 5, 2, 0.8, 0.4)],
    "1980s": [p("Danny Ainge", "SG", 82, 14, 4, 5, 1, 0.3), p("Bill Walton", "C", 80, 8, 9, 3, 0.5, 1.2), p("Jerry Sichting", "PG", 76, 8, 2, 4, 0.6, 0.1), p("Scott Wedman", "SF", 79, 12, 5, 2, 0.8, 0.4), p("Rick Carlisle", "SG", 76, 8, 3, 3, 0.6, 0.2), p("M.L. Carr", "SF", 78, 12, 5, 2, 0.8, 0.4), p("Greg Kite", "C", 75, 5, 6, 1, 0.3, 0.8), p("Brian Shaw", "PG", 77, 8, 3, 5, 0.8, 0.2)],
    "1990s": [p("Rick Fox", "SF", 80, 12, 5, 3, 0.8, 0.5), p("Robert Parish", "C", 82, 12, 8, 1, 0.5, 1), p("Brian Shaw", "PG", 78, 10, 4, 6, 0.8, 0.3), p("David Wesley", "SG", 79, 12, 3, 4, 0.8, 0.2), p("Dana Barros", "PG", 80, 14, 2, 5, 0.9, 0.1), p("Dominique Wilkins", "SF", 86, 20, 5, 3, 0.8, 0.4), p("Pervis Ellison", "C", 77, 10, 7, 2, 0.5, 1), p("Eric Montross", "C", 76, 8, 7, 1, 0.3, 0.8)],
    "2000s": [p("Tony Allen", "SG", 80, 8, 4, 2, 1.2, 0.5), p("Delonte West", "PG", 79, 12, 4, 5, 0.8, 0.3), p("Rasheed Wallace", "PF", 83, 12, 7, 2, 0.8, 1.2), p("Eddie House", "PG", 77, 10, 2, 3, 0.6, 0.1), p("Leon Powe", "PF", 76, 8, 5, 0.5, 0.4, 0.4), p("James Posey", "SF", 78, 8, 5, 2, 0.8, 0.4), p("Brian Scalabrine", "PF", 75, 6, 4, 1, 0.4, 0.3), p("Kendrick Perkins", "C", 78, 6, 8, 1, 0.4, 1.2)],
    "2010s": [p("Marcus Smart", "PG", 84, 12, 4, 6, 1.3, 0.5), p("Terry Rozier", "PG", 80, 12, 4, 4, 0.8, 0.3), p("Daniel Theis", "C", 79, 10, 7, 2, 0.5, 1), p("Semi Ojeleye", "PF", 76, 6, 5, 1, 0.5, 0.3), p("Grant Williams", "PF", 78, 8, 5, 2, 0.5, 0.5), p("Robert Williams III", "C", 81, 10, 9, 2, 0.8, 2), p("Gordon Hayward", "SF", 83, 14, 5, 4, 0.8, 0.4), p("Enes Kanter", "C", 78, 10, 8, 1, 0.4, 0.3)],
    "2020s": [p("Sam Hauser", "SF", 78, 9, 4, 1, 0.4, 0.3), p("Payton Pritchard", "PG", 80, 10, 4, 3, 0.6, 0.2), p("Al Horford", "C", 82, 10, 7, 3, 0.6, 1), p("Xavier Tillman", "PF", 76, 6, 5, 1, 0.6, 0.6), p("Luke Kornet", "C", 76, 6, 5, 1, 0.3, 1), p("Neemias Queta", "C", 76, 6, 6, 1, 0.3, 0.8), p("Jordan Walsh", "SF", 75, 6, 4, 1, 0.6, 0.4), p("Oshae Brissett", "SF", 77, 8, 5, 1, 0.5, 0.3)],
  },
  Clippers: {
    "1960s": [p("Flynn Robinson", "SG", 80, 14, 3, 3, 0.8, 0.2), p("Jim Krebs", "C", 77, 10, 8, 1, 0.4, 0.8), p("Rod Thorn", "SG", 79, 12, 4, 3, 0.8, 0.3), p("Fred Crawford", "SG", 77, 12, 4, 2, 0.8, 0.3), p("Darrall Imhoff", "C", 78, 10, 8, 1, 0.4, 1), p("Keith Erickson", "SF", 79, 10, 5, 3, 0.8, 0.4), p("John Barnhill", "PG", 76, 9, 3, 4, 0.8, 0.2), p("Don Ohl", "SG", 78, 12, 3, 3, 0.8, 0.2)],
    "1970s": [p("Randy Smith", "SG", 82, 18, 4, 5, 1.2, 0.3), p("Swen Nater", "C", 80, 12, 10, 2, 0.5, 0.8), p("Harvey Catchings", "PF", 77, 8, 7, 2, 0.6, 0.8), p("Kevin Porter", "PG", 80, 14, 4, 8, 1, 0.2), p("Sidney Wicks", "PF", 82, 16, 8, 3, 0.8, 0.5), p("Bill Walton", "C", 84, 14, 12, 4, 0.6, 2), p("Freeman Williams", "SG", 79, 14, 3, 3, 0.8, 0.2), p("Michael Brooks", "SF", 78, 12, 6, 2, 0.6, 0.4)],
    "1980s": [p("Benoit Benjamin", "C", 80, 14, 9, 2, 0.5, 2), p("Michael Cage", "PF", 79, 10, 10, 2, 0.6, 1.2), p("Norm Nixon", "PG", 82, 14, 3, 8, 1.5, 0.2), p("Marques Johnson", "SF", 83, 16, 6, 4, 0.8, 0.5), p("Charles Smith", "PF", 81, 14, 7, 2, 0.6, 1.5), p("Olden Polynice", "C", 78, 10, 8, 1, 0.4, 0.8), p("Doc Rivers", "PG", 79, 10, 3, 6, 1.2, 0.2), p("Kenny Smith", "PG", 78, 10, 2, 5, 0.8, 0.2)],
    "1990s": [p("Kenny Anderson", "PG", 83, 16, 4, 8, 1.2, 0.2), p("Derek Anderson", "SG", 80, 14, 4, 4, 1, 0.3), p("Corey Maggette", "SF", 82, 16, 5, 2, 0.8, 0.4), p("Eric Piatkowski", "SG", 78, 10, 4, 2, 0.8, 0.3), p("Lamar Odom", "PF", 82, 14, 8, 4, 0.8, 0.8), p("Quentin Richardson", "SG", 79, 12, 4, 2, 0.8, 0.3), p("Michael Olowokandi", "C", 78, 10, 8, 1, 0.5, 1.5), p("Tyrone Nesby", "SF", 77, 12, 4, 2, 0.8, 0.4)],
    "2000s": [p("Sam Cassell", "PG", 82, 14, 3, 6, 0.8, 0.2), p("Corey Maggette", "SF", 83, 18, 5, 3, 0.8, 0.4), p("Elton Brand", "PF", 85, 18, 10, 3, 0.8, 1.5), p("Quinton Ross", "SG", 76, 6, 3, 2, 0.8, 0.4), p("Daniel Ewing", "SG", 75, 8, 3, 3, 0.6, 0.2), p("Tim Thomas", "PF", 79, 12, 5, 1, 0.4, 0.4), p("Bobby Brown", "PG", 76, 10, 2, 4, 0.6, 0.2), p("James Singleton", "PF", 75, 7, 5, 1, 0.4, 0.3)],
    "2010s": [p("Patrick Beverley", "PG", 81, 9, 4, 4, 1.2, 0.3), p("Avery Bradley", "SG", 80, 12, 3, 2, 1, 0.3), p("Jamal Crawford", "SG", 83, 16, 3, 4, 0.6, 0.2), p("Blake Griffin", "PF", 86, 20, 8, 5, 0.8, 0.5), p("DeAndre Jordan", "C", 84, 10, 12, 1, 0.6, 1.5), p("J.J. Redick", "SG", 82, 14, 2, 2, 0.6, 0.1), p("Austin Rivers", "PG", 78, 10, 3, 3, 0.6, 0.2), p("Milos Teodosic", "PG", 77, 8, 3, 6, 0.6, 0.1)],
    "2020s": [p("Terance Mann", "SF", 79, 10, 5, 3, 0.7, 0.4), p("Amir Coffey", "SG", 77, 9, 3, 2, 0.5, 0.2), p("Mason Plumlee", "C", 78, 8, 7, 3, 0.5, 0.5), p("Nicolas Batum", "SF", 79, 8, 5, 3, 0.7, 0.5), p("Russell Westbrook", "PG", 82, 14, 6, 8, 1, 0.3), p("Daniel Theis", "C", 78, 8, 6, 1, 0.4, 0.8), p("Bones Hyland", "PG", 77, 10, 3, 4, 0.6, 0.2), p("P.J. Tucker", "PF", 78, 7, 5, 2, 0.6, 0.4)],
  },
  Grizzlies: {
    "2000s": [p("Pau Gasol", "PF", 86, 18, 9, 3, 0.6, 2), p("Jason Williams", "PG", 80, 12, 3, 7, 1, 0.2), p("Stromile Swift", "PF", 78, 10, 6, 1, 0.6, 1), p("James Posey", "SF", 79, 10, 5, 2, 0.8, 0.4), p("Lorenzen Wright", "C", 77, 10, 8, 1, 0.4, 1), p("Bonzi Wells", "SG", 80, 14, 5, 3, 1, 0.4), p("Eddie Gill", "PG", 75, 7, 2, 4, 0.6, 0.2), p("Dahntay Jones", "SF", 76, 7, 4, 2, 0.6, 0.4)],
    "2010s": [p("Mike Conley", "PG", 84, 16, 3, 6, 1, 0.2), p("Zach Randolph", "PF", 84, 16, 10, 2, 0.6, 0.3), p("Tony Allen", "SG", 81, 10, 4, 3, 1.4, 0.4), p("Courtney Lee", "SG", 79, 12, 3, 2, 0.8, 0.2), p("Jeff Green", "SF", 80, 14, 5, 2, 0.6, 0.4), p("Jaren Jackson Jr.", "PF", 83, 16, 6, 2, 0.8, 2), p("Dillon Brooks", "SF", 79, 14, 4, 2, 0.8, 0.3), p("Kyle Anderson", "SF", 79, 10, 6, 4, 0.8, 0.6)],
    "2020s": [p("Desmond Bane", "SG", 84, 18, 4, 4, 0.8, 0.4), p("Jaren Jackson Jr.", "PF", 86, 20, 6, 2, 0.8, 2.5), p("Marcus Smart", "PG", 82, 12, 4, 6, 1.2, 0.5), p("Luke Kennard", "SG", 79, 10, 3, 3, 0.5, 0.2), p("Santi Aldama", "PF", 78, 10, 6, 2, 0.6, 0.6), p("Vince Williams Jr.", "SG", 76, 8, 4, 3, 0.8, 0.3), p("Xavier Tillman", "PF", 76, 6, 5, 2, 0.6, 0.5), p("Scotty Pippen Jr.", "PG", 75, 7, 3, 3, 0.8, 0.2)],
  },
  Hawks: {
    "1990s": [p("Mookie Blaylock", "PG", 83, 12, 4, 7, 2, 0.3), p("Steve Smith", "SG", 84, 18, 4, 4, 0.8, 0.3), p("Dikembe Mutombo", "C", 86, 12, 12, 1, 0.5, 3), p("Christian Laettner", "PF", 80, 12, 7, 2, 0.6, 0.6), p("Alan Henderson", "PF", 78, 10, 6, 1, 0.5, 0.5), p("Bimbo Coles", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Lionel Simmons", "SF", 77, 12, 5, 3, 0.8, 0.4), p("Matt Geiger", "C", 76, 8, 7, 1, 0.3, 1)],
    "2000s": [p("Josh Smith", "PF", 83, 14, 8, 3, 1, 1.5), p("Al Horford", "PF", 84, 14, 9, 3, 0.8, 1), p("Marvin Williams", "PF", 79, 12, 6, 2, 0.6, 0.5), p("Zaza Pachulia", "C", 78, 8, 7, 1, 0.4, 0.5), p("Boris Diaw", "PF", 80, 12, 6, 4, 0.6, 0.4), p("Joe Johnson", "SG", 85, 18, 4, 4, 0.8, 0.3), p("Mike Bibby", "PG", 82, 14, 3, 6, 0.8, 0.2), p("Mookie Blaylock", "PG", 80, 10, 4, 6, 1.8, 0.3)],
    "2010s": [p("Kent Bazemore", "SF", 79, 12, 5, 3, 1, 0.6), p("Dennis Schroder", "PG", 81, 14, 3, 6, 0.8, 0.2), p("Taurean Prince", "SF", 79, 12, 5, 2, 0.6, 0.4), p("John Collins", "PF", 83, 16, 8, 2, 0.6, 0.8), p("De'Andre Hunter", "SF", 80, 14, 5, 2, 0.7, 0.4), p("Cam Reddish", "SF", 77, 10, 4, 2, 0.8, 0.4), p("Evan Turner", "SF", 78, 10, 5, 4, 0.8, 0.4), p("Dewayne Dedmon", "C", 78, 8, 8, 1, 0.4, 1)],
    "2020s": [p("De'Andre Hunter", "SF", 81, 14, 5, 2, 0.7, 0.4), p("Bogdan Bogdanovic", "SG", 82, 14, 4, 4, 0.7, 0.2), p("Clint Capela", "C", 83, 12, 11, 1, 0.6, 1.5), p("Onyeka Okongwu", "C", 79, 10, 8, 2, 0.6, 1), p("Dejounte Murray", "PG", 84, 16, 5, 7, 1.3, 0.4), p("Saddiq Bey", "SF", 79, 12, 5, 2, 0.6, 0.3), p("Wesley Matthews", "SG", 76, 7, 3, 2, 0.6, 0.2), p("Garrison Mathews", "SG", 75, 7, 2, 1, 0.4, 0.2)],
  },
  Heat: {
    "1980s": [p("Kevin Edwards", "SG", 80, 14, 4, 4, 1, 0.3), p("Grant Long", "PF", 79, 12, 7, 2, 0.6, 0.4), p("Ron Rothstein", "PG", 75, 8, 2, 5, 0.6, 0.1), p("Jon Sundvold", "SG", 77, 12, 3, 3, 0.6, 0.2), p("Billy Thompson", "SF", 76, 8, 5, 2, 0.6, 0.6), p("Mark West", "C", 77, 10, 8, 1, 0.4, 1), p("Sylvester Gray", "PF", 76, 10, 7, 1, 0.4, 0.5), p("Pat Cummings", "PF", 78, 12, 6, 2, 0.5, 0.4)],
    "1990s": [p("Steve Smith", "SG", 83, 16, 4, 4, 0.8, 0.3), p("Keith Askins", "SF", 76, 8, 4, 2, 0.8, 0.4), p("Brian Shaw", "PG", 78, 10, 4, 6, 0.8, 0.3), p("Harold Miner", "SG", 78, 12, 3, 2, 0.6, 0.2), p("Rony Seikaly", "C", 82, 16, 10, 2, 0.6, 1.5), p("Grant Long", "PF", 79, 12, 7, 2, 0.6, 0.4), p("Bimbo Coles", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Tony Smith", "PG", 76, 8, 3, 4, 0.8, 0.2)],
    "2000s": [p("Dwyane Wade", "SG", 88, 22, 5, 6, 1.5, 0.8), p("Shaquille O'Neal", "C", 87, 20, 10, 2, 0.5, 1.8), p("Gary Payton", "PG", 82, 10, 4, 5, 1.2, 0.3), p("Antoine Walker", "PF", 81, 14, 8, 3, 0.8, 0.5), p("Jason Williams", "PG", 79, 10, 3, 6, 0.8, 0.2), p("James Posey", "SF", 79, 8, 5, 2, 0.8, 0.4), p("Alonzo Mourning", "C", 84, 14, 9, 1, 0.5, 2.5), p("Wayne Simien", "PF", 75, 8, 5, 1, 0.4, 0.3)],
    "2010s": [p("Dwyane Wade", "SG", 86, 18, 5, 5, 1.2, 0.6), p("Hassan Whiteside", "C", 83, 14, 12, 1, 0.6, 2.5), p("Goran Dragic", "PG", 83, 16, 4, 5, 1, 0.2), p("Dion Waiters", "SG", 80, 14, 3, 4, 0.8, 0.3), p("Justise Winslow", "SF", 79, 10, 6, 3, 0.8, 0.5), p("Kelly Olynyk", "C", 79, 10, 6, 2, 0.5, 0.5), p("Wayne Ellington", "SG", 77, 10, 3, 2, 0.5, 0.2), p("James Johnson", "PF", 78, 10, 5, 3, 0.6, 0.5)],
    "2020s": [p("Duncan Robinson", "SG", 80, 12, 3, 2, 0.5, 0.2), p("Caleb Martin", "SF", 79, 10, 5, 2, 0.8, 0.5), p("Max Strus", "SG", 79, 12, 4, 2, 0.6, 0.3), p("Gabe Vincent", "PG", 79, 10, 3, 3, 0.7, 0.2), p("Kevin Love", "PF", 81, 12, 8, 3, 0.5, 0.3), p("Haywood Highsmith", "SF", 76, 7, 4, 2, 0.6, 0.3), p("Jaime Jaquez Jr.", "SF", 78, 10, 5, 3, 0.7, 0.4), p("Nikola Jovic", "PF", 76, 8, 4, 2, 0.5, 0.3)],
  },
  Hornets: {
    "1990s": [p("Larry Johnson", "PF", 84, 18, 8, 4, 0.8, 0.4), p("Kendall Gill", "SG", 81, 14, 5, 4, 1.2, 0.5), p("David Wingate", "SG", 77, 10, 4, 3, 0.8, 0.3), p("Alonzo Mourning", "C", 85, 18, 10, 2, 0.6, 2.8), p("Herb Williams", "C", 78, 8, 6, 2, 0.5, 1.2), p("Tony Smith", "PG", 76, 8, 3, 4, 0.8, 0.2), p("Muggsy Bogues", "PG", 80, 8, 2, 7, 1.2, 0.1), p("Rex Chapman", "SG", 79, 14, 3, 3, 0.6, 0.2)],
    "2000s": [p("Baron Davis", "PG", 84, 18, 4, 8, 1.5, 0.3), p("Gerald Wallace", "SF", 82, 14, 8, 3, 1.2, 0.8), p("Emeka Okafor", "C", 81, 12, 10, 1, 0.6, 1.5), p("Jason Richardson", "SG", 83, 18, 5, 3, 0.8, 0.4), p("David West", "PF", 84, 16, 8, 3, 0.6, 0.8), p("Tyson Chandler", "C", 82, 10, 10, 1, 0.5, 1.5), p("Matt Carroll", "SG", 76, 10, 3, 2, 0.5, 0.2), p("Primoz Brezec", "C", 75, 8, 5, 1, 0.3, 0.6)],
    "2010s": [p("Kemba Walker", "PG", 86, 20, 4, 6, 1, 0.3), p("Nicolas Batum", "SF", 82, 12, 5, 4, 0.8, 0.6), p("Marvin Williams", "PF", 79, 10, 5, 2, 0.6, 0.4), p("Michael Kidd-Gilchrist", "SF", 78, 10, 6, 2, 0.8, 0.6), p("Jeremy Lamb", "SG", 79, 12, 4, 2, 0.6, 0.3), p("Frank Kaminsky", "C", 78, 10, 5, 2, 0.5, 0.6), p("Cody Zeller", "C", 78, 10, 7, 2, 0.5, 0.8), p("Marco Belinelli", "SG", 77, 10, 3, 2, 0.5, 0.2)],
    "2020s": [p("LaMelo Ball", "PG", 84, 18, 5, 7, 1, 0.3), p("Miles Bridges", "SF", 82, 16, 6, 3, 0.7, 0.6), p("P.J. Washington", "PF", 79, 12, 6, 2, 0.6, 0.8), p("Terry Rozier", "SG", 81, 16, 4, 4, 0.8, 0.3), p("Mark Williams", "C", 79, 10, 9, 1, 0.5, 1.2), p("Grant Williams", "PF", 78, 8, 5, 2, 0.5, 0.5), p("Nick Richards", "C", 77, 8, 7, 1, 0.4, 1), p("Brandon Miller", "SF", 78, 14, 5, 3, 0.7, 0.5)],
  },
  Jazz: {
    "1990s": [p("Jeff Hornacek", "SG", 84, 14, 4, 4, 0.8, 0.2), p("Mark Eaton", "C", 80, 6, 9, 1, 0.3, 3.5), p("Bryon Russell", "SF", 79, 10, 5, 2, 0.8, 0.4), p("Greg Foster", "C", 76, 6, 6, 1, 0.3, 1), p("Howard Eisley", "PG", 78, 10, 3, 5, 0.8, 0.2), p("David Benoit", "PF", 77, 10, 6, 1, 0.5, 0.4), p("Adam Keefe", "PF", 76, 8, 6, 1, 0.4, 0.4), p("Blue Edwards", "SF", 77, 12, 4, 2, 0.6, 0.3)],
    "2000s": [p("Mehmet Okur", "C", 81, 12, 7, 2, 0.5, 0.5), p("Matt Harpring", "SF", 78, 10, 5, 2, 0.6, 0.3), p("Raja Bell", "SG", 80, 12, 4, 2, 0.8, 0.3), p("Gordan Giricek", "SG", 78, 12, 4, 3, 0.6, 0.2), p("Paul Millsap", "PF", 82, 14, 8, 2, 0.8, 0.6), p("Kyle Korver", "SG", 81, 12, 3, 2, 0.6, 0.2), p("C.J. Miles", "SG", 78, 12, 3, 2, 0.6, 0.2), p("Wesley Matthews", "SG", 79, 10, 3, 2, 0.8, 0.3)],
    "2010s": [p("Joe Ingles", "SF", 81, 10, 4, 5, 0.8, 0.3), p("Derrick Favors", "PF", 80, 12, 8, 1, 0.5, 1.2), p("Ricky Rubio", "PG", 81, 10, 4, 8, 1.5, 0.2), p("Jae Crowder", "PF", 79, 10, 5, 2, 0.8, 0.4), p("Royce O'Neale", "SF", 78, 8, 5, 3, 0.7, 0.4), p("Dante Exum", "PG", 77, 8, 3, 4, 0.6, 0.3), p("Alec Burks", "SG", 78, 12, 4, 2, 0.6, 0.2), p("Ed Davis", "C", 77, 8, 8, 1, 0.4, 0.6)],
    "2020s": [p("Collin Sexton", "PG", 82, 16, 3, 4, 0.8, 0.2), p("Jordan Clarkson", "SG", 83, 16, 4, 3, 0.6, 0.2), p("Walker Kessler", "C", 80, 10, 10, 1, 0.5, 2), p("Talen Horton-Tucker", "SG", 77, 10, 3, 3, 0.6, 0.3), p("Malik Beasley", "SG", 79, 12, 3, 2, 0.7, 0.2), p("John Collins", "PF", 82, 14, 8, 2, 0.6, 0.8), p("Keyonte George", "PG", 77, 12, 3, 4, 0.7, 0.2), p("Simone Fontecchio", "SF", 76, 9, 4, 2, 0.5, 0.3)],
  },
  Kings: {
    "1990s": [p("Mitch Richmond", "SG", 88, 22, 4, 4, 1.2, 0.3), p("Wayman Tisdale", "PF", 81, 14, 7, 2, 0.6, 0.5), p("Olden Polynice", "C", 78, 10, 8, 1, 0.4, 0.8), p("Spud Webb", "PG", 77, 10, 2, 5, 0.8, 0.1), p("Mahmoud Abdul-Rauf", "PG", 80, 16, 2, 4, 0.8, 0.1), p("Brian Grant", "PF", 78, 10, 8, 1, 0.5, 0.6), p("Tyrone Corbin", "SF", 77, 10, 5, 2, 0.6, 0.3), p("Walt Williams", "SF", 78, 12, 4, 3, 0.8, 0.3)],
    "2000s": [p("Peja Stojakovic", "SF", 86, 18, 5, 2, 0.6, 0.2), p("Brad Miller", "C", 82, 12, 9, 3, 0.5, 0.6), p("Bobby Jackson", "PG", 80, 14, 3, 4, 0.8, 0.2), p("Doug Christie", "SG", 81, 12, 5, 4, 1.5, 0.6), p("Kenny Thomas", "PF", 78, 10, 7, 2, 0.6, 0.4), p("Gerald Wallace", "SF", 80, 12, 7, 2, 1, 0.8), p("Bonzi Wells", "SG", 79, 12, 5, 3, 1, 0.4), p("John Salmons", "SF", 78, 12, 4, 3, 0.6, 0.3)],
    "2010s": [p("Tyreke Evans", "SG", 83, 16, 5, 5, 1, 0.4), p("Jason Thompson", "PF", 77, 10, 7, 1, 0.4, 0.5), p("Carl Landry", "PF", 79, 12, 6, 1, 0.4, 0.3), p("Ben McLemore", "SG", 78, 12, 3, 2, 0.6, 0.2), p("Garrett Temple", "SG", 76, 8, 3, 3, 0.6, 0.3), p("Willie Cauley-Stein", "C", 78, 10, 8, 2, 0.6, 1.2), p("Buddy Hield", "SG", 81, 16, 5, 3, 0.7, 0.2), p("Nemanja Bjelica", "PF", 78, 10, 6, 3, 0.5, 0.4)],
    "2020s": [p("Domantas Sabonis", "PF", 86, 18, 12, 5, 0.8, 0.5), p("Harrison Barnes", "SF", 80, 14, 5, 2, 0.6, 0.3), p("Kevin Huerter", "SG", 79, 12, 4, 3, 0.6, 0.3), p("Davion Mitchell", "PG", 78, 9, 3, 5, 0.8, 0.2), p("Keegan Murray", "PF", 80, 14, 7, 2, 0.7, 0.8), p("Trey Lyles", "PF", 77, 9, 5, 2, 0.4, 0.3), p("Alex Len", "C", 76, 7, 6, 1, 0.3, 0.8), p("Chris Duarte", "SG", 77, 10, 4, 2, 0.7, 0.3)],
  },
  Knicks: {
    "1960s": [p("Phil Jackson", "SF", 78, 7, 4, 2, 0.6, 0.4), p("Howard Komives", "PG", 79, 12, 3, 5, 1, 0.2), p("Mike Riordan", "SF", 77, 10, 4, 2, 0.8, 0.3), p("Johnny Egan", "PG", 76, 8, 2, 4, 0.8, 0.1), p("Bill Bradley", "SF", 82, 14, 4, 3, 0.8, 0.3), p("Emmette Bryant", "SG", 75, 7, 3, 3, 0.8, 0.2), p("Art Heyman", "SG", 78, 12, 4, 3, 0.8, 0.3), p("Dave Stallworth", "PF", 77, 10, 5, 2, 0.6, 0.3)],
    "1970s": [p("Phil Jackson", "SF", 78, 8, 5, 2, 0.6, 0.4), p("Howard Komives", "PG", 77, 10, 3, 4, 0.8, 0.2), p("Dave Stallworth", "PF", 78, 10, 5, 2, 0.6, 0.3), p("Mike Riordan", "SF", 77, 10, 4, 2, 0.8, 0.3), p("Emmette Bryant", "SG", 76, 8, 3, 3, 0.8, 0.2), p("Dean Meminger", "PG", 77, 8, 3, 4, 1, 0.2), p("Henry Bibby", "PG", 76, 9, 3, 4, 0.8, 0.2), p("Jim Barnett", "SG", 78, 12, 3, 3, 0.8, 0.2)],
    "1980s": [p("Kenny Walker", "SF", 80, 12, 5, 2, 0.8, 0.5), p("Trent Tucker", "SG", 79, 10, 3, 2, 0.8, 0.2), p("Bill Cartwright", "C", 82, 14, 8, 2, 0.5, 1), p("Louis Orr", "SF", 77, 10, 5, 2, 0.6, 0.4), p("Charles Smith", "PF", 80, 12, 6, 2, 0.6, 1.2), p("Rod Strickland", "PG", 81, 10, 3, 7, 1, 0.2), p("Maurice Cheeks", "PG", 82, 10, 3, 6, 1.2, 0.3), p("Johnny Newman", "SG", 78, 12, 3, 2, 0.8, 0.2)],
    "1990s": [p("Doc Rivers", "PG", 80, 10, 3, 6, 1.2, 0.2), p("Anthony Mason", "PF", 83, 10, 8, 4, 0.8, 0.3), p("Hubert Davis", "SG", 79, 10, 2, 2, 0.6, 0.1), p("Derek Harper", "PG", 82, 12, 3, 6, 1.2, 0.3), p("Herb Williams", "C", 78, 8, 6, 2, 0.5, 1.2), p("Greg Anthony", "PG", 79, 8, 3, 5, 1, 0.3), p("Walter Berry", "PF", 77, 10, 5, 2, 0.6, 0.4), p("Charlie Ward", "PG", 78, 8, 3, 5, 1, 0.2)],
    "2000s": [p("David Lee", "PF", 82, 14, 10, 2, 0.6, 0.3), p("Nate Robinson", "PG", 80, 12, 2, 4, 0.8, 0.2), p("Wilson Chandler", "SF", 80, 12, 6, 2, 0.8, 0.6), p("Quentin Richardson", "SG", 79, 12, 4, 2, 0.8, 0.3), p("Eddy Curry", "C", 78, 14, 6, 1, 0.3, 0.5), p("Jared Jeffries", "SF", 76, 6, 5, 2, 0.6, 0.8), p("Renaldo Balkman", "SF", 75, 6, 5, 1, 0.8, 0.6), p("Channing Frye", "PF", 78, 10, 5, 1, 0.4, 0.5)],
    "2010s": [p("Immanuel Quickley", "PG", 80, 12, 3, 4, 0.8, 0.2), p("Josh Hart", "SG", 81, 10, 7, 4, 0.8, 0.3), p("Tim Hardaway Jr.", "SG", 80, 14, 3, 2, 0.6, 0.2), p("Courtney Lee", "SG", 78, 10, 3, 2, 0.8, 0.2), p("Taj Gibson", "PF", 80, 10, 7, 1, 0.5, 0.8), p("Enes Kanter", "C", 78, 10, 8, 1, 0.4, 0.3), p("Mario Hezonja", "SF", 76, 8, 4, 2, 0.6, 0.3), p("Reggie Bullock", "SF", 77, 9, 4, 2, 0.5, 0.2)],
    "2020s": [p("Donte DiVincenzo", "SG", 81, 12, 4, 3, 1, 0.3), p("Josh Hart", "SG", 83, 10, 8, 4, 0.8, 0.3), p("Isaiah Hartenstein", "C", 82, 8, 9, 3, 0.6, 1), p("Precious Achiuwa", "PF", 79, 10, 7, 1, 0.6, 0.6), p("Miles McBride", "PG", 78, 9, 2, 3, 0.8, 0.2), p("Bojan Bogdanovic", "SF", 80, 14, 4, 2, 0.5, 0.2), p("Alec Burks", "SG", 78, 10, 3, 2, 0.6, 0.2), p("Mitchell Robinson", "C", 80, 8, 9, 1, 0.6, 1.5)],
  },
  Lakers: {
    "1960s": [p("Darrall Imhoff", "C", 79, 10, 8, 1, 0.4, 1), p("Leroy Ellis", "PF", 78, 9, 7, 1, 0.4, 0.5), p("Mel Counts", "C", 77, 8, 7, 1, 0.4, 0.8), p("Flynn Robinson", "SG", 78, 12, 3, 2, 0.8, 0.2), p("Tom Hawkins", "SF", 75, 8, 4, 2, 0.6, 0.3), p("Dick Garrett", "PG", 78, 10, 3, 4, 1, 0.2), p("Keith Erickson", "SF", 79, 10, 5, 3, 0.8, 0.4), p("Walt Hazzard", "PG", 80, 12, 3, 5, 0.8, 0.2)],
    "1970s": [p("Cazzie Russell", "SG", 82, 14, 4, 3, 0.8, 0.3), p("Don Ford", "PF", 78, 10, 6, 2, 0.6, 0.4), p("Kermit Washington", "PF", 79, 10, 9, 2, 0.6, 0.8), p("Brian Taylor", "PG", 77, 10, 3, 4, 1, 0.2), p("Mitch Kupchak", "PF", 78, 10, 6, 2, 0.5, 0.5), p("Don Chaney", "SG", 79, 11, 4, 3, 1, 0.4), p("Truck Robinson", "PF", 81, 14, 10, 3, 0.6, 0.5), p("Norm Nixon", "PG", 81, 14, 3, 7, 1.2, 0.2)],
    "1980s": [p("Kurt Rambis", "PF", 78, 6, 7, 1, 0.6, 0.4), p("Mychal Thompson", "C", 82, 14, 8, 2, 0.5, 1), p("Orlando Woolridge", "SF", 83, 16, 5, 2, 0.8, 0.5), p("Maurice Lucas", "PF", 81, 12, 8, 2, 0.6, 0.6), p("Wes Matthews", "PG", 77, 8, 2, 5, 0.8, 0.2), p("Mike McGee", "SG", 79, 12, 3, 2, 0.8, 0.3), p("Billy Thompson", "SF", 76, 8, 5, 2, 0.6, 0.6), p("Mark McNamara", "C", 75, 6, 6, 1, 0.3, 0.6)],
    "1990s": [p("Derek Fisher", "PG", 80, 8, 2, 3, 0.8, 0.1), p("Rick Fox", "SF", 81, 10, 5, 3, 0.8, 0.5), p("Elden Campbell", "C", 82, 12, 8, 1, 0.6, 1.5), p("Anthony Peeler", "SG", 79, 12, 3, 3, 0.8, 0.2), p("Sedale Threatt", "PG", 80, 10, 2, 5, 1, 0.2), p("Travis Knight", "C", 76, 6, 6, 1, 0.3, 1), p("Lindsey Hunter", "PG", 78, 9, 2, 4, 1, 0.2), p("Eddie Jones", "SG", 83, 14, 4, 3, 1.5, 0.5)],
    "2000s": [p("Ron Artest", "SF", 84, 12, 5, 3, 1.2, 0.6), p("Luke Walton", "SF", 78, 8, 5, 4, 0.6, 0.3), p("Sasha Vujacic", "SG", 77, 8, 2, 2, 0.6, 0.2), p("Smush Parker", "PG", 78, 12, 3, 4, 0.8, 0.2), p("Kwame Brown", "C", 76, 8, 6, 1, 0.4, 0.8), p("Brian Cook", "PF", 75, 8, 4, 1, 0.4, 0.3), p("Devean George", "SF", 77, 7, 4, 2, 0.6, 0.5), p("Trevor Ariza", "SF", 79, 10, 5, 2, 1, 0.6)],
    "2010s": [p("Kentavious Caldwell-Pope", "SG", 82, 12, 3, 2, 1, 0.3), p("Rajon Rondo", "PG", 83, 8, 5, 8, 1.2, 0.3), p("Danny Green", "SG", 81, 9, 4, 2, 0.8, 0.4), p("Alex Caruso", "SG", 80, 7, 4, 3, 1, 0.4), p("Jordan Clarkson", "SG", 81, 14, 3, 2, 0.6, 0.2), p("Nick Young", "SG", 78, 12, 2, 1, 0.6, 0.2), p("Wesley Matthews", "SG", 79, 8, 3, 2, 0.8, 0.2), p("JaVale McGee", "C", 78, 8, 6, 1, 0.4, 1.5)],
    "2020s": [p("Jarred Vanderbilt", "PF", 79, 6, 7, 1, 0.8, 0.4), p("Gabe Vincent", "PG", 78, 8, 2, 3, 0.6, 0.2), p("Christian Wood", "PF", 82, 14, 7, 2, 0.5, 0.8), p("Taurean Prince", "SF", 79, 9, 4, 2, 0.6, 0.3), p("Cam Reddish", "SF", 77, 8, 3, 1, 0.8, 0.3), p("Jaxson Hayes", "C", 76, 6, 5, 1, 0.4, 0.8), p("Max Christie", "SG", 76, 7, 3, 1, 0.5, 0.2), p("Dorian Finney-Smith", "PF", 78, 8, 5, 2, 0.6, 0.4)],
  },
  Magic: {
    "1990s": [p("Nick Anderson", "SG", 82, 16, 5, 3, 1, 0.5), p("Dennis Scott", "SF", 80, 14, 4, 2, 0.6, 0.3), p("Brian Shaw", "PG", 78, 10, 4, 6, 0.8, 0.3), p("Horace Grant", "PF", 83, 12, 9, 2, 0.8, 1), p("Donald Royal", "SF", 76, 10, 5, 2, 0.6, 0.3), p("Sam Vincent", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Jeff Turner", "PF", 76, 8, 5, 2, 0.4, 0.4), p("Anthony Bowie", "SG", 75, 8, 3, 3, 0.6, 0.2)],
    "2000s": [p("Hedo Turkoglu", "SF", 83, 14, 5, 4, 0.8, 0.5), p("Grant Hill", "SF", 84, 16, 6, 4, 0.8, 0.5), p("Jameer Nelson", "PG", 81, 12, 3, 5, 0.8, 0.2), p("Rashard Lewis", "PF", 84, 16, 5, 2, 0.8, 0.4), p("Courtney Lee", "SG", 78, 10, 3, 2, 0.8, 0.2), p("Marcin Gortat", "C", 79, 10, 8, 1, 0.4, 1), p("Matt Barnes", "SF", 78, 8, 5, 2, 0.8, 0.4), p("Keyon Dooling", "PG", 77, 10, 3, 4, 0.6, 0.2)],
    "2010s": [p("Nikola Vucevic", "C", 84, 16, 10, 3, 0.6, 0.8), p("Evan Fournier", "SG", 82, 16, 4, 3, 0.7, 0.2), p("Aaron Gordon", "PF", 82, 14, 7, 3, 0.7, 0.6), p("Terrence Ross", "SG", 80, 14, 4, 2, 0.7, 0.3), p("D.J. Augustin", "PG", 79, 12, 3, 5, 0.6, 0.2), p("Jonathan Isaac", "PF", 80, 12, 7, 2, 0.8, 1.2), p("Mo Bamba", "C", 78, 8, 7, 1, 0.4, 1.5), p("Markelle Fultz", "PG", 79, 12, 4, 5, 1, 0.4)],
    "2020s": [p("Franz Wagner", "SF", 82, 16, 5, 4, 0.8, 0.5), p("Jalen Suggs", "PG", 79, 12, 4, 4, 1, 0.4), p("Wendell Carter Jr.", "C", 81, 12, 9, 2, 0.5, 0.8), p("Gary Harris", "SG", 78, 10, 3, 3, 0.8, 0.3), p("Moritz Wagner", "C", 77, 10, 5, 2, 0.4, 0.4), p("Cole Anthony", "PG", 78, 12, 4, 4, 0.7, 0.3), p("Jonathan Isaac", "PF", 79, 10, 7, 2, 0.8, 1), p("Paolo Banchero", "PF", 84, 18, 7, 4, 0.7, 0.6)],
  },
  Mavericks: {
    "1980s": [p("Brad Davis", "PG", 79, 10, 3, 7, 0.8, 0.2), p("Derek Harper", "PG", 82, 14, 4, 7, 1.2, 0.3), p("Sam Perkins", "PF", 81, 14, 7, 2, 0.6, 0.6), p("Detlef Schrempf", "SF", 82, 14, 6, 4, 0.8, 0.4), p("Roy Tarpley", "PF", 80, 14, 8, 2, 0.8, 1), p("Uwe Blab", "C", 75, 6, 5, 1, 0.3, 0.8), p("James Donaldson", "C", 78, 10, 8, 1, 0.4, 1.2), p("Bill Wennington", "C", 76, 6, 5, 1, 0.3, 0.5)],
    "1990s": [p("Jim Jackson", "SG", 83, 18, 5, 3, 0.8, 0.3), p("Derek Harper", "PG", 82, 14, 4, 7, 1.2, 0.3), p("Sam Perkins", "PF", 80, 12, 7, 2, 0.6, 0.6), p("George McCloud", "SG", 78, 12, 4, 2, 0.6, 0.3), p("Robert Traylor", "PF", 77, 10, 7, 2, 0.5, 0.5), p("Hubert Davis", "SG", 79, 12, 3, 2, 0.6, 0.1), p("Shawn Bradley", "C", 78, 10, 8, 1, 0.4, 2.5), p("Ed O'Bannon", "SF", 76, 10, 5, 2, 0.6, 0.3)],
    "2000s": [p("Dirk Nowitzki", "PF", 90, 24, 8, 3, 0.6, 0.8), p("Steve Nash", "PG", 86, 16, 4, 9, 0.8, 0.2), p("Michael Finley", "SG", 84, 18, 5, 3, 0.8, 0.3), p("Jerry Stackhouse", "SG", 82, 16, 4, 3, 0.8, 0.3), p("Antoine Walker", "PF", 81, 14, 8, 3, 0.8, 0.5), p("Erick Dampier", "C", 79, 8, 9, 1, 0.4, 1.5), p("Josh Howard", "SF", 82, 14, 6, 2, 0.8, 0.5), p("DeSagana Diop", "C", 76, 4, 7, 1, 0.3, 1.2)],
    "2010s": [p("Seth Curry", "SG", 80, 12, 3, 3, 0.6, 0.2), p("Dorian Finney-Smith", "SF", 79, 10, 6, 2, 0.7, 0.5), p("Tim Hardaway Jr.", "SG", 81, 14, 3, 2, 0.6, 0.2), p("Dwight Powell", "C", 79, 10, 7, 2, 0.5, 0.6), p("Harrison Barnes", "SF", 81, 14, 5, 2, 0.6, 0.3), p("Delon Wright", "PG", 79, 10, 4, 4, 0.9, 0.4), p("Reggie Bullock", "SF", 78, 10, 4, 2, 0.6, 0.2), p("Maxi Kleber", "PF", 78, 8, 6, 2, 0.5, 0.8)],
    "2020s": [p("Tim Hardaway Jr.", "SG", 81, 14, 3, 2, 0.6, 0.2), p("Dorian Finney-Smith", "SF", 80, 10, 6, 2, 0.7, 0.5), p("Reggie Bullock", "SF", 78, 10, 4, 2, 0.6, 0.2), p("Maxi Kleber", "PF", 79, 8, 6, 2, 0.5, 0.8), p("Grant Williams", "PF", 78, 8, 5, 2, 0.5, 0.5), p("Derrick Jones Jr.", "SF", 78, 10, 4, 1, 0.7, 0.6), p("Dante Exum", "PG", 77, 8, 3, 4, 0.6, 0.3), p("Olivier-Maxence Prosper", "SF", 75, 7, 4, 1, 0.5, 0.3)],
  },
  Nets: {
    "1970s": [p("Billy Paultz", "C", 80, 14, 10, 2, 0.5, 1.2), p("John Williamson", "SG", 81, 16, 4, 3, 0.8, 0.3), p("Tim Bassett", "PF", 76, 10, 7, 2, 0.5, 0.5), p("Bubbles Hawkins", "SG", 77, 12, 4, 3, 0.8, 0.2), p("Kim Hughes", "C", 75, 8, 7, 1, 0.3, 0.8), p("Al Skinner", "SF", 76, 10, 5, 2, 0.6, 0.3), p("John Q. Trapp", "SF", 77, 12, 5, 2, 0.6, 0.3), p("Bill Melchionni", "PG", 78, 10, 3, 6, 0.8, 0.1)],
    "1980s": [p("Mike Gminski", "C", 81, 14, 8, 2, 0.5, 0.8), p("Otis Birdsong", "SG", 80, 14, 4, 4, 0.8, 0.3), p("Albert King", "SF", 79, 14, 5, 3, 0.8, 0.4), p("Mike O'Koren", "SF", 78, 12, 5, 3, 0.8, 0.3), p("Orlando Woolridge", "SF", 82, 16, 5, 2, 0.6, 0.4), p("Sam Bowie", "C", 77, 10, 8, 2, 0.4, 1.2), p("Micheal Ray Richardson", "PG", 82, 14, 5, 7, 1.5, 0.3), p("Kelvin Ransey", "PG", 77, 12, 3, 6, 0.8, 0.2)],
    "1990s": [p("Drazen Petrovic", "SG", 86, 18, 3, 3, 0.8, 0.2), p("Chris Morris", "SF", 78, 12, 5, 3, 0.8, 0.5), p("Derrick Coleman", "PF", 83, 16, 9, 3, 0.8, 0.8), p("Rafael Addison", "SG", 77, 12, 3, 3, 0.6, 0.2), p("Terry Mills", "PF", 79, 12, 6, 2, 0.5, 0.4), p("Ed O'Bannon", "SF", 76, 10, 5, 2, 0.6, 0.3), p("Sam Cassell", "PG", 80, 12, 3, 5, 0.8, 0.2), p("Shawn Bradley", "C", 78, 10, 8, 1, 0.4, 2.5)],
    "2000s": [p("Richard Jefferson", "SF", 83, 16, 5, 3, 0.8, 0.5), p("Kerry Kittles", "SG", 80, 14, 4, 3, 1, 0.3), p("Keith Van Horn", "PF", 81, 14, 6, 2, 0.6, 0.4), p("Kenyon Martin", "PF", 82, 14, 8, 2, 0.8, 1), p("Devin Harris", "PG", 81, 14, 3, 6, 1, 0.3), p("Jarrett Jack", "PG", 79, 12, 4, 5, 0.8, 0.2), p("Josh Boone", "PF", 75, 6, 6, 1, 0.4, 0.6), p("Bostjan Nachbar", "SF", 77, 10, 4, 2, 0.5, 0.3)],
    "2010s": [p("Spencer Dinwiddie", "PG", 83, 16, 4, 7, 0.8, 0.3), p("Caris LeVert", "SG", 83, 16, 4, 4, 0.9, 0.5), p("Allen Crabbe", "SG", 79, 12, 3, 2, 0.6, 0.2), p("D'Angelo Russell", "PG", 84, 18, 4, 6, 1, 0.3), p("Jarrett Allen", "C", 83, 12, 10, 2, 0.6, 1.5), p("Joe Harris", "SG", 81, 14, 4, 2, 0.5, 0.2), p("DeMarre Carroll", "SF", 78, 10, 4, 2, 0.6, 0.3), p("Rodions Kurucs", "SF", 75, 8, 4, 2, 0.6, 0.3)],
    "2020s": [p("Nic Claxton", "C", 83, 12, 9, 2, 0.8, 2), p("Cam Thomas", "SG", 82, 18, 3, 2, 0.6, 0.2), p("Dennis Schroder", "PG", 81, 14, 3, 6, 0.8, 0.2), p("Dorian Finney-Smith", "PF", 79, 9, 5, 2, 0.6, 0.4), p("Day'Ron Sharpe", "C", 77, 8, 7, 2, 0.5, 0.8), p("Cameron Johnson", "SF", 80, 12, 5, 2, 0.5, 0.3), p("Royce O'Neale", "SF", 78, 8, 5, 3, 0.7, 0.4), p("Lonnie Walker IV", "SG", 77, 10, 3, 2, 0.6, 0.2)],
  },
  Nuggets: {
    "1970s": [p("Bobby Jones", "SF", 84, 12, 6, 3, 1.2, 1.5), p("Ralph Simpson", "SG", 81, 14, 4, 4, 0.8, 0.3), p("Claude Terry", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Gus Gerard", "SF", 78, 12, 5, 3, 0.8, 0.4), p("Tom Burleson", "C", 77, 10, 8, 2, 0.4, 1), p("Monte Towe", "PG", 76, 8, 2, 4, 0.8, 0.1), p("John Q. Trapp", "SF", 77, 12, 5, 2, 0.6, 0.3), p("Billy Knight", "SF", 82, 18, 6, 3, 0.8, 0.4)],
    "1980s": [p("Fat Lever", "PG", 84, 16, 7, 7, 2, 0.5), p("TR Dunn", "SG", 78, 10, 4, 3, 1.2, 0.3), p("Wayne Cooper", "C", 79, 10, 8, 2, 0.5, 1.2), p("Calvin Natt", "SF", 81, 14, 6, 2, 0.8, 0.4), p("Mike Evans", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Lafayette Lever", "PG", 83, 14, 6, 7, 1.8, 0.3), p("Bill Hanzlik", "SF", 77, 10, 5, 3, 0.8, 0.4), p("Orlando Woolridge", "SF", 82, 16, 5, 2, 0.6, 0.4)],
    "1990s": [p("Chris Jackson", "PG", 80, 14, 3, 5, 0.8, 0.2), p("LaPhonso Ellis", "PF", 81, 14, 7, 2, 0.6, 0.6), p("Ervin Johnson", "C", 77, 6, 8, 1, 0.4, 1), p("Bryant Stith", "SG", 78, 12, 4, 3, 0.8, 0.3), p("Tony Battie", "C", 77, 8, 7, 1, 0.4, 1), p("Greg Anthony", "PG", 79, 10, 4, 6, 1, 0.3), p("Dale Ellis", "SG", 82, 16, 4, 2, 0.6, 0.2), p("Voshon Lenard", "SG", 78, 12, 3, 3, 0.6, 0.2)],
    "2000s": [p("Nene", "PF", 83, 14, 8, 2, 0.8, 0.8), p("Kenyon Martin", "PF", 83, 14, 8, 2, 0.8, 1), p("J.R. Smith", "SG", 80, 14, 4, 3, 0.8, 0.3), p("Chris Andersen", "C", 78, 8, 7, 1, 0.5, 1.5), p("Earl Boykins", "PG", 77, 12, 2, 4, 0.6, 0.1), p("Eduardo Najera", "PF", 76, 8, 6, 2, 0.6, 0.4), p("George Karl", "PG", 75, 8, 3, 5, 0.6, 0.2), p("Yakhouba Diawara", "SG", 75, 7, 3, 2, 0.6, 0.2)],
    "2010s": [p("Wilson Chandler", "SF", 81, 14, 6, 2, 0.8, 0.5), p("Paul Millsap", "PF", 84, 16, 8, 3, 0.8, 0.6), p("Will Barton", "SG", 80, 14, 5, 4, 0.8, 0.4), p("Mason Plumlee", "C", 79, 10, 8, 3, 0.5, 0.6), p("Trey Lyles", "PF", 77, 10, 5, 2, 0.5, 0.4), p("Monte Morris", "PG", 80, 12, 3, 5, 0.7, 0.2), p("Jerami Grant", "PF", 81, 12, 5, 2, 0.7, 0.8), p("Torrey Craig", "SF", 77, 8, 5, 2, 0.6, 0.4)],
    "2020s": [p("Aaron Gordon", "PF", 83, 14, 6, 3, 0.7, 0.6), p("Kentavious Caldwell-Pope", "SG", 81, 11, 3, 2, 0.9, 0.3), p("Christian Braun", "SG", 79, 10, 4, 2, 0.7, 0.3), p("Peyton Watson", "SF", 76, 8, 5, 2, 0.6, 0.6), p("Reggie Jackson", "PG", 79, 12, 3, 4, 0.6, 0.2), p("Bruce Brown", "SG", 80, 10, 5, 3, 0.8, 0.4), p("Zeke Nnaji", "PF", 76, 8, 5, 1, 0.4, 0.5), p("Justin Holiday", "SF", 76, 7, 3, 2, 0.6, 0.3)],
  },
  Pacers: {
    "1990s": [p("Detlef Schrempf", "SF", 84, 16, 6, 4, 0.8, 0.4), p("Derrick McKey", "SF", 81, 12, 6, 3, 0.8, 0.6), p("Antonio Davis", "PF", 80, 12, 8, 2, 0.6, 1), p("Mark Jackson", "PG", 82, 12, 4, 8, 1, 0.2), p("Dale Davis", "PF", 79, 10, 9, 1, 0.5, 1), p("Sam Perkins", "PF", 80, 12, 7, 2, 0.6, 0.6), p("Derrick Phelps", "PG", 76, 8, 3, 5, 0.8, 0.2), p("Haywood Workman", "PG", 77, 8, 4, 6, 0.8, 0.2)],
    "2000s": [p("Jermaine O'Neal", "PF", 86, 18, 10, 2, 0.6, 2.5), p("Stephen Jackson", "SF", 83, 16, 5, 4, 1, 0.5), p("Jamaal Tinsley", "PG", 79, 10, 4, 7, 1.2, 0.4), p("Danny Granger", "SF", 84, 18, 5, 3, 0.8, 0.5), p("Mike Dunleavy", "SF", 80, 12, 5, 3, 0.6, 0.3), p("Troy Murphy", "PF", 81, 14, 8, 2, 0.5, 0.5), p("Jeff Foster", "C", 77, 6, 8, 1, 0.4, 0.8), p("Marquis Daniels", "SG", 78, 12, 4, 4, 0.8, 0.4)],
    "2010s": [p("Lance Stephenson", "SG", 81, 12, 6, 4, 0.8, 0.3), p("George Hill", "PG", 82, 14, 3, 5, 0.9, 0.3), p("C.J. Miles", "SG", 79, 12, 4, 2, 0.6, 0.2), p("Thaddeus Young", "PF", 82, 14, 6, 2, 1, 0.5), p("Bojan Bogdanovic", "SF", 81, 16, 4, 2, 0.5, 0.2), p("Domantas Sabonis", "PF", 84, 14, 10, 4, 0.6, 0.4), p("Tyreke Evans", "SG", 80, 14, 5, 4, 0.8, 0.3), p("Myles Turner", "C", 83, 14, 8, 2, 0.6, 2.5)],
    "2020s": [p("Myles Turner", "C", 84, 14, 8, 2, 0.6, 2.5), p("Buddy Hield", "SG", 81, 14, 4, 2, 0.7, 0.2), p("Aaron Nesmith", "SF", 78, 10, 4, 2, 0.6, 0.3), p("T.J. McConnell", "PG", 80, 10, 4, 6, 1, 0.2), p("Obi Toppin", "PF", 78, 10, 5, 2, 0.5, 0.4), p("Bennedict Mathurin", "SG", 80, 14, 4, 2, 0.6, 0.2), p("Andrew Nembhard", "PG", 78, 10, 3, 5, 0.8, 0.2), p("Isaiah Jackson", "C", 77, 8, 7, 1, 0.5, 1.2)],
  },
  Pelicans: {
    "2000s": [p("David West", "PF", 84, 16, 8, 3, 0.6, 0.8), p("Chris Paul", "PG", 90, 18, 5, 10, 2, 0.2), p("Tyson Chandler", "C", 83, 10, 10, 1, 0.5, 1.5), p("Peja Stojakovic", "SF", 84, 16, 5, 2, 0.6, 0.2), p("Rasheed Wright", "PG", 75, 8, 3, 4, 0.6, 0.2), p("Desmond Mason", "SF", 79, 12, 6, 2, 0.8, 0.8), p("Marcus Thornton", "SG", 80, 14, 3, 2, 0.7, 0.2), p("James Posey", "SF", 78, 8, 5, 2, 0.8, 0.4)],
    "2010s": [p("Jrue Holiday", "PG", 86, 16, 4, 7, 1.5, 0.5), p("Eric Gordon", "SG", 82, 16, 3, 3, 0.8, 0.3), p("Ryan Anderson", "PF", 81, 14, 6, 1, 0.4, 0.3), p("E'Twaun Moore", "SG", 77, 10, 3, 2, 0.6, 0.2), p("Darius Miller", "SF", 76, 8, 4, 2, 0.5, 0.3), p("Solomon Hill", "SF", 76, 7, 4, 2, 0.5, 0.3), p("Nikola Mirotic", "PF", 80, 12, 6, 2, 0.5, 0.4), p("Jahlil Okafor", "C", 78, 12, 7, 2, 0.4, 0.6)],
    "2020s": [p("Brandon Ingram", "SF", 86, 22, 6, 5, 0.8, 0.6), p("Jonas Valanciunas", "C", 83, 14, 10, 2, 0.5, 0.8), p("Herbert Jones", "SF", 81, 12, 4, 3, 1, 0.6), p("Larry Nance Jr.", "PF", 79, 10, 6, 2, 0.6, 0.5), p("Trey Murphy III", "SF", 80, 14, 5, 2, 0.6, 0.4), p("Jose Alvarado", "PG", 77, 9, 3, 4, 1, 0.3), p("CJ McCollum", "SG", 83, 18, 4, 4, 0.8, 0.3), p("Jordan Hawkins", "SG", 76, 10, 3, 2, 0.5, 0.2)],
  },
  Pistons: {
    "1980s": [p("Kelly Tripucka", "SG", 82, 18, 4, 3, 0.8, 0.2), p("John Long", "SG", 79, 14, 3, 3, 0.8, 0.2), p("Bill Laimbeer", "C", 82, 14, 9, 2, 0.5, 0.5), p("Vinnie Johnson", "SG", 80, 14, 3, 2, 0.6, 0.2), p("James Edwards", "C", 78, 10, 6, 1, 0.4, 0.8), p("Rick Mahorn", "PF", 80, 10, 8, 2, 0.5, 0.5), p("Otis Smith", "SG", 77, 12, 4, 3, 0.8, 0.4), p("Fennis Dembo", "SG", 75, 8, 4, 2, 0.6, 0.2)],
    "1990s": [p("Allan Houston", "SG", 83, 16, 4, 3, 0.8, 0.2), p("Lindsey Hunter", "PG", 79, 12, 3, 5, 1, 0.3), p("Terry Mills", "PF", 80, 12, 6, 2, 0.5, 0.4), p("Don Reid", "PF", 76, 8, 5, 1, 0.4, 0.6), p("Jerome Williams", "PF", 78, 8, 8, 2, 0.6, 0.5), p("Bison Dele", "C", 77, 10, 7, 1, 0.4, 1), p("Atis Roundtree", "PF", 75, 8, 6, 1, 0.4, 0.4), p("Mark Macon", "SG", 76, 10, 3, 2, 0.8, 0.3)],
    "2000s": [p("Chauncey Billups", "PG", 86, 18, 3, 6, 1.2, 0.2), p("Rip Hamilton", "SG", 84, 16, 3, 3, 0.8, 0.2), p("Tayshaun Prince", "SF", 82, 12, 5, 3, 1, 1), p("Antonio McDyess", "PF", 81, 12, 8, 1, 0.6, 0.8), p("Corliss Williamson", "PF", 79, 12, 6, 2, 0.5, 0.4), p("Lindsey Hunter", "PG", 77, 8, 3, 4, 0.8, 0.2), p("Aaron McKie", "SG", 78, 10, 4, 4, 0.8, 0.3), p("Darko Milicic", "C", 76, 8, 5, 1, 0.3, 1.2)],
    "2010s": [p("Reggie Jackson", "PG", 82, 16, 4, 5, 0.8, 0.2), p("Kentavious Caldwell-Pope", "SG", 81, 13, 3, 2, 1, 0.3), p("Ish Smith", "PG", 78, 10, 3, 5, 0.8, 0.2), p("Ersan Ilyasova", "PF", 79, 12, 6, 1, 0.5, 0.4), p("Langston Galloway", "PG", 77, 10, 3, 3, 0.6, 0.2), p("Jon Leuer", "PF", 76, 8, 5, 1, 0.4, 0.3), p("Bruce Brown", "SG", 79, 10, 5, 3, 0.8, 0.4), p("Luke Kennard", "SG", 78, 10, 3, 3, 0.5, 0.2)],
    "2020s": [p("Isaiah Stewart", "C", 80, 10, 8, 2, 0.5, 1.2), p("Saddiq Bey", "SF", 80, 14, 5, 2, 0.6, 0.3), p("Killian Hayes", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Marvin Bagley III", "PF", 78, 12, 7, 2, 0.5, 0.5), p("Bojan Bogdanovic", "SF", 81, 16, 4, 2, 0.5, 0.2), p("Monte Morris", "PG", 79, 11, 3, 5, 0.7, 0.2), p("James Wiseman", "C", 77, 10, 7, 1, 0.4, 1), p("Evan Fournier", "SG", 78, 10, 3, 2, 0.5, 0.2)],
  },
  Raptors: {
    "2000s": [p("Morris Peterson", "SF", 80, 14, 5, 3, 0.8, 0.4), p("Alvin Williams", "PG", 79, 12, 4, 6, 0.8, 0.2), p("Jerome Williams", "PF", 78, 8, 8, 2, 0.6, 0.5), p("Antonio Davis", "PF", 81, 12, 8, 2, 0.6, 1), p("Jalen Rose", "SG", 82, 16, 4, 4, 0.8, 0.3), p("Rafer Alston", "PG", 78, 10, 3, 6, 0.8, 0.2), p("Matt Bonner", "PF", 76, 8, 5, 1, 0.4, 0.3), p("Pape Sow", "C", 75, 6, 6, 1, 0.3, 0.6)],
    "2010s": [p("Jonas Valanciunas", "C", 83, 14, 10, 2, 0.5, 0.8), p("DeMar DeRozan", "SG", 86, 22, 4, 4, 0.8, 0.3), p("Terrence Ross", "SG", 80, 14, 4, 2, 0.7, 0.3), p("Patrick Patterson", "PF", 78, 10, 5, 1, 0.5, 0.4), p("Lou Williams", "SG", 82, 16, 3, 4, 0.8, 0.2), p("Serge Ibaka", "PF", 83, 12, 7, 1, 0.6, 1.5), p("Fred VanVleet", "PG", 82, 14, 4, 6, 1, 0.3), p("Pascal Siakam", "PF", 84, 16, 7, 4, 0.8, 0.6)],
    "2020s": [p("OG Anunoby", "SF", 84, 14, 5, 2, 1.2, 0.6), p("Gary Trent Jr.", "SG", 80, 14, 3, 2, 0.7, 0.2), p("Chris Boucher", "PF", 79, 10, 7, 1, 0.5, 1.2), p("Precious Achiuwa", "PF", 78, 10, 7, 1, 0.6, 0.6), p("Scottie Barnes", "SF", 84, 16, 7, 5, 0.9, 0.8), p("Immanuel Quickley", "PG", 81, 14, 4, 5, 0.8, 0.2), p("RJ Barrett", "SF", 81, 16, 5, 3, 0.7, 0.3), p("Gradey Dick", "SG", 76, 9, 3, 2, 0.5, 0.2)],
  },
  Rockets: {
    "1960s": [p("Don Kojis", "SF", 79, 14, 6, 2, 0.8, 0.3), p("Gary Keller", "PF", 76, 10, 7, 1, 0.5, 0.5), p("Jim Barnett", "SG", 78, 12, 4, 3, 0.8, 0.2), p("Jon McGlocklin", "SG", 79, 14, 4, 4, 0.8, 0.2), p("Dick Cunningham", "C", 76, 8, 9, 1, 0.4, 0.8), p("Jimmy Walker", "PG", 78, 12, 3, 4, 0.8, 0.2), p("Pat Riley", "SG", 77, 10, 4, 3, 0.8, 0.3), p("John Block", "C", 78, 12, 8, 2, 0.4, 0.8)],
    "1970s": [p("Mike Newlin", "SG", 81, 16, 4, 4, 0.8, 0.3), p("Kevin Porter", "PG", 80, 14, 4, 8, 1, 0.2), p("John Lucas", "PG", 80, 12, 3, 7, 1, 0.2), p("Moses Malone", "C", 86, 18, 14, 2, 0.5, 1.2), p("Robert Reid", "SF", 79, 12, 5, 4, 0.8, 0.5), p("Allen Leavell", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Calvin Murphy", "SG", 82, 16, 3, 4, 1, 0.2), p("Bill Willoughby", "SF", 76, 10, 5, 2, 0.6, 0.4)],
    "1980s": [p("Akeem Olajuwon", "C", 90, 22, 12, 2, 1, 3), p("Clyde Drexler", "SG", 88, 20, 6, 6, 1.5, 0.8), p("Otis Thorpe", "PF", 81, 14, 9, 2, 0.6, 0.5), p("Vernon Maxwell", "SG", 80, 14, 3, 4, 0.8, 0.2), p("Kenny Smith", "PG", 81, 12, 3, 5, 0.8, 0.2), p("Matt Bullard", "PF", 76, 8, 4, 2, 0.4, 0.3), p("Mario Elie", "SG", 78, 10, 3, 2, 0.8, 0.2), p("Carl Herrera", "PF", 77, 10, 7, 1, 0.5, 0.6)],
    "1990s": [p("Clyde Drexler", "SG", 87, 18, 6, 5, 1.2, 0.6), p("Vernon Maxwell", "SG", 80, 14, 3, 4, 0.8, 0.2), p("Kenny Smith", "PG", 80, 12, 3, 5, 0.8, 0.2), p("Mario Elie", "SG", 78, 10, 3, 2, 0.8, 0.2), p("Matt Bullard", "PF", 76, 8, 4, 2, 0.4, 0.3), p("Carl Herrera", "PF", 77, 10, 7, 1, 0.5, 0.6), p("Charles Barkley", "PF", 86, 18, 10, 4, 0.8, 0.5), p("Scottie Pippen", "SF", 85, 14, 6, 5, 1.2, 0.6)],
    "2000s": [p("Tracy McGrady", "SG", 90, 26, 6, 5, 1.2, 0.6), p("Yao Ming", "C", 88, 20, 10, 2, 0.4, 2), p("Cuttino Mobley", "SG", 81, 16, 4, 3, 0.8, 0.3), p("Steve Francis", "PG", 84, 18, 5, 6, 1.2, 0.3), p("Luis Scola", "PF", 82, 14, 8, 2, 0.6, 0.3), p("Chuck Hayes", "PF", 77, 6, 7, 2, 0.6, 0.4), p("Rafer Alston", "PG", 79, 12, 4, 6, 0.8, 0.2), p("Carl Landry", "PF", 78, 12, 6, 1, 0.4, 0.3)],
    "2010s": [p("Patrick Beverley", "PG", 81, 9, 4, 4, 1.2, 0.3), p("Trevor Ariza", "SF", 81, 12, 5, 2, 1, 0.6), p("P.J. Tucker", "PF", 79, 8, 6, 2, 0.6, 0.3), p("Eric Gordon", "SG", 82, 16, 3, 2, 0.8, 0.3), p("Ryan Anderson", "PF", 80, 14, 6, 1, 0.4, 0.3), p("Lou Williams", "SG", 82, 16, 3, 4, 0.8, 0.2), p("Kenneth Faried", "PF", 78, 10, 8, 1, 0.5, 0.5), p("Danuel House Jr.", "SF", 77, 10, 4, 2, 0.6, 0.3)],
    "2020s": [p("Alperen Sengun", "C", 84, 16, 9, 4, 0.8, 0.8), p("Jalen Green", "SG", 82, 18, 4, 3, 0.7, 0.3), p("Fred VanVleet", "PG", 83, 14, 4, 6, 1, 0.3), p("Tari Eason", "SF", 78, 10, 6, 2, 0.9, 0.6), p("Amen Thompson", "SG", 79, 12, 6, 4, 0.9, 0.5), p("Cam Whitmore", "SF", 76, 10, 4, 1, 0.6, 0.3), p("Jeff Green", "PF", 78, 10, 5, 2, 0.5, 0.4), p("Aaron Holiday", "PG", 76, 8, 2, 3, 0.6, 0.2)],
  },
  Spurs: {
    "1960s": [p("James Silas", "SG", 82, 16, 3, 4, 1, 0.2), p("Swen Nater", "C", 80, 12, 10, 2, 0.5, 0.8), p("Mike Gale", "PG", 78, 12, 4, 5, 1, 0.2), p("Billy Paultz", "C", 79, 12, 9, 2, 0.5, 1), p("Glen Combs", "SG", 77, 12, 3, 3, 0.8, 0.2), p("John Beasley", "PG", 78, 12, 4, 5, 0.8, 0.2), p("Coby Dietrick", "C", 76, 8, 7, 2, 0.4, 0.8), p("Red Robbins", "PF", 77, 10, 8, 2, 0.5, 0.5)],
    "1970s": [p("James Silas", "SG", 83, 16, 3, 4, 1, 0.2), p("Mike Mitchell", "SF", 82, 18, 5, 3, 0.8, 0.4), p("Billy Paultz", "C", 80, 12, 9, 2, 0.5, 1), p("Artis Gilmore", "C", 86, 18, 12, 2, 0.5, 2), p("Mike Gale", "PG", 78, 12, 4, 5, 1, 0.2), p("John Beasley", "PG", 78, 12, 4, 5, 0.8, 0.2), p("Swen Nater", "C", 79, 10, 9, 2, 0.5, 0.8), p("George Gervin", "SG", 84, 22, 5, 3, 1, 0.4)],
    "1980s": [p("Mike Mitchell", "SF", 83, 18, 5, 3, 0.8, 0.4), p("Artis Gilmore", "C", 84, 14, 10, 2, 0.5, 1.5), p("Steve Johnson", "PF", 78, 12, 7, 2, 0.5, 0.6), p("Mike Brown", "C", 76, 8, 7, 1, 0.4, 0.8), p("Johnny Moore", "PG", 79, 10, 4, 7, 1.2, 0.3), p("Alvin Robertson", "SG", 84, 14, 5, 5, 2.5, 0.5), p("Mike Dunleavy", "SG", 78, 12, 4, 4, 0.8, 0.3), p("Walter Berry", "PF", 79, 12, 6, 2, 0.6, 0.4)],
    "1990s": [p("Chuck Person", "SF", 82, 16, 6, 3, 0.8, 0.4), p("Will Perdue", "C", 78, 8, 7, 1, 0.4, 0.8), p("Vinny Del Negro", "SG", 79, 12, 3, 4, 0.6, 0.2), p("Avery Johnson", "PG", 80, 10, 3, 7, 1, 0.2), p("J.R. Reid", "PF", 78, 10, 7, 2, 0.5, 0.5), p("Willie Anderson", "SG", 79, 12, 4, 4, 0.8, 0.4), p("Carl Herrera", "PF", 77, 10, 7, 1, 0.5, 0.6), p("Dennis Rodman", "PF", 82, 8, 12, 2, 0.8, 0.5)],
    "2000s": [p("Bruce Bowen", "SF", 80, 8, 4, 2, 0.8, 0.5), p("Brent Barry", "SG", 79, 10, 3, 3, 0.6, 0.2), p("Malik Rose", "PF", 79, 10, 7, 2, 0.5, 0.4), p("Steve Smith", "SG", 81, 14, 4, 3, 0.8, 0.3), p("Robert Horry", "PF", 80, 8, 6, 3, 0.8, 1), p("Nazr Mohammed", "C", 77, 8, 7, 1, 0.4, 0.6), p("Michael Finley", "SG", 80, 12, 4, 3, 0.6, 0.2), p("Fabricio Oberto", "C", 76, 6, 6, 1, 0.3, 0.5)],
    "2010s": [p("Danny Green", "SG", 82, 10, 4, 2, 0.8, 0.5), p("Boris Diaw", "PF", 80, 10, 5, 4, 0.6, 0.4), p("Tiago Splitter", "C", 79, 10, 6, 2, 0.5, 0.6), p("Marco Belinelli", "SG", 79, 10, 3, 2, 0.5, 0.2), p("Davis Bertans", "PF", 80, 12, 5, 2, 0.5, 0.3), p("Rudy Gay", "SF", 82, 16, 6, 3, 0.7, 0.5), p("Derrick White", "SG", 81, 12, 4, 4, 0.9, 0.6), p("Jakob Poeltl", "C", 80, 10, 8, 2, 0.5, 1)],
    "2020s": [p("Devin Vassell", "SG", 81, 14, 4, 3, 0.8, 0.4), p("Jeremy Sochan", "PF", 79, 10, 6, 3, 0.8, 0.5), p("Tre Jones", "PG", 78, 10, 4, 5, 0.8, 0.2), p("Zach Collins", "C", 78, 10, 7, 2, 0.5, 0.8), p("Malaki Branham", "SG", 76, 10, 3, 2, 0.6, 0.2), p("Blake Wesley", "PG", 75, 7, 3, 3, 0.7, 0.2), p("Dominick Barlow", "PF", 75, 6, 5, 1, 0.4, 0.5), p("Julian Champagnie", "SF", 76, 8, 4, 1, 0.5, 0.3)],
  },
  Suns: {
    "1960s": [p("Jim Barnett", "SG", 79, 14, 4, 3, 0.8, 0.2), p("Jim Washington", "PF", 79, 12, 8, 2, 0.6, 0.5), p("George Wilson", "C", 77, 10, 8, 1, 0.4, 0.8), p("Gary Gregor", "SF", 76, 10, 5, 2, 0.6, 0.3), p("Art Becker", "SF", 75, 8, 5, 2, 0.5, 0.3), p("John Wetzel", "SG", 76, 8, 4, 3, 0.6, 0.3), p("Don Ohl", "SG", 78, 12, 3, 3, 0.8, 0.2), p("Hank Finkel", "C", 76, 8, 7, 2, 0.3, 0.6)],
    "1970s": [p("Charlie Scott", "SG", 83, 18, 4, 4, 1, 0.3), p("Curtis Perry", "C", 78, 12, 9, 2, 0.5, 0.8), p("Neal Walk", "C", 77, 10, 8, 2, 0.4, 0.8), p("Keith Erickson", "SF", 79, 12, 5, 3, 0.8, 0.4), p("Gar Heard", "PF", 77, 10, 7, 2, 0.5, 0.5), p("Ricky Sobers", "SG", 78, 12, 4, 4, 0.8, 0.3), p("Alvan Adams", "C", 82, 16, 10, 4, 1, 1.2), p("Paul Westphal", "SG", 84, 18, 4, 5, 1, 0.3)],
    "1980s": [p("Larry Nance", "PF", 84, 16, 8, 3, 1, 1.5), p("Walter Davis", "SG", 85, 20, 4, 4, 1, 0.3), p("Ed Nealy", "PF", 76, 6, 6, 2, 0.5, 0.3), p("Jay Humphries", "PG", 78, 10, 3, 5, 1, 0.3), p("Tim Kempton", "PF", 76, 8, 6, 2, 0.4, 0.4), p("Armon Gilliam", "PF", 80, 14, 7, 2, 0.6, 0.5), p("Kevin Johnson", "PG", 84, 18, 3, 9, 1.5, 0.2), p("Tom Chambers", "PF", 84, 20, 7, 3, 0.6, 0.5)],
    "1990s": [p("Tom Chambers", "PF", 83, 18, 7, 3, 0.6, 0.5), p("Dan Majerle", "SG", 83, 14, 5, 3, 1, 0.6), p("A.C. Green", "PF", 80, 10, 8, 1, 0.6, 0.4), p("Danny Ainge", "SG", 80, 12, 4, 4, 0.8, 0.3), p("Richard Dumas", "SF", 78, 12, 5, 2, 0.8, 0.6), p("Wayman Tisdale", "PF", 80, 14, 7, 2, 0.6, 0.5), p("Rod Strickland", "PG", 81, 14, 4, 8, 1.2, 0.2), p("Cliff Robinson", "PF", 82, 16, 6, 2, 0.8, 1.2)],
    "2000s": [p("Joe Johnson", "SG", 84, 18, 4, 4, 0.8, 0.3), p("Quentin Richardson", "SG", 80, 14, 5, 3, 0.8, 0.3), p("Boris Diaw", "PF", 81, 12, 6, 4, 0.6, 0.4), p("Grant Hill", "SF", 83, 14, 6, 4, 0.8, 0.5), p("Leandro Barbosa", "SG", 80, 14, 3, 3, 0.7, 0.2), p("Marcin Gortat", "C", 79, 10, 8, 1, 0.4, 1), p("Channing Frye", "PF", 79, 12, 6, 2, 0.5, 0.5), p("Jared Dudley", "SF", 78, 10, 4, 2, 0.6, 0.3)],
    "2010s": [p("Mikal Bridges", "SF", 82, 14, 4, 3, 1, 0.6), p("Kelly Oubre Jr.", "SF", 80, 14, 5, 2, 0.8, 0.4), p("T.J. Warren", "SF", 81, 16, 5, 2, 0.7, 0.4), p("Aron Baynes", "C", 78, 8, 7, 1, 0.4, 0.6), p("Cameron Payne", "PG", 78, 10, 3, 4, 0.7, 0.2), p("Dario Saric", "PF", 80, 12, 6, 3, 0.6, 0.4), p("Frank Kaminsky", "C", 78, 10, 5, 2, 0.5, 0.6), p("Torrey Craig", "SF", 77, 8, 5, 2, 0.6, 0.4)],
    "2020s": [p("Grayson Allen", "SG", 80, 12, 4, 3, 0.7, 0.3), p("Royce O'Neale", "SF", 79, 8, 5, 3, 0.7, 0.4), p("Cameron Payne", "PG", 79, 11, 3, 4, 0.7, 0.2), p("Landry Shamet", "SG", 77, 10, 2, 2, 0.5, 0.2), p("Nassir Little", "SF", 76, 8, 4, 2, 0.6, 0.4), p("Bol Bol", "C", 76, 8, 5, 1, 0.4, 1), p("Josh Okogie", "SG", 76, 7, 4, 2, 0.8, 0.4), p("Drew Eubanks", "C", 76, 7, 6, 1, 0.3, 0.8)],
  },
  Thunder: {
    "1960s": [p("Lenny Wilkens", "PG", 86, 16, 5, 7, 1.5, 0.2), p("Bob Rule", "C", 80, 16, 9, 2, 0.5, 1), p("Al Tucker", "SF", 79, 14, 6, 2, 0.8, 0.4), p("Don Ohl", "SG", 78, 12, 3, 3, 0.8, 0.2), p("Fred Brown", "SG", 78, 12, 3, 3, 0.8, 0.2), p("Tom Meschery", "PF", 78, 12, 7, 2, 0.5, 0.4), p("Dick Snyder", "SG", 79, 14, 5, 3, 0.8, 0.3), p("Jim Fox", "C", 76, 10, 8, 2, 0.4, 0.8)],
    "1970s": [p("Fred Brown", "SG", 82, 16, 4, 3, 0.8, 0.2), p("Dennis Johnson", "PG", 84, 16, 5, 5, 1.5, 0.8), p("Gus Williams", "PG", 83, 18, 3, 6, 1.5, 0.3), p("Jack Sikma", "C", 84, 16, 10, 3, 0.8, 1.2), p("Paul Silas", "PF", 80, 10, 10, 2, 0.6, 0.4), p("Lonnie Shelton", "PF", 79, 12, 8, 2, 0.5, 0.5), p("Tom Burleson", "C", 78, 10, 8, 2, 0.4, 1), p("Dick Snyder", "SG", 79, 14, 5, 3, 0.8, 0.3)],
    "1980s": [p("Dale Ellis", "SG", 84, 18, 4, 3, 0.8, 0.3), p("Xavier McDaniel", "PF", 84, 18, 7, 3, 0.8, 0.8), p("Tom Chambers", "PF", 83, 18, 7, 3, 0.6, 0.5), p("Nate McMillan", "PG", 78, 8, 4, 6, 1, 0.3), p("Olden Polynice", "C", 78, 10, 8, 1, 0.4, 0.8), p("Derrick McKey", "SF", 80, 12, 6, 3, 0.8, 0.6), p("Sedale Threatt", "PG", 79, 12, 3, 6, 1, 0.2), p("Michael Cage", "PF", 79, 10, 10, 2, 0.6, 1.2)],
    "1990s": [p("Shawn Kemp", "PF", 88, 18, 10, 2, 0.8, 1.2), p("Gary Payton", "PG", 90, 18, 4, 8, 2, 0.3), p("Detlef Schrempf", "SF", 84, 16, 6, 4, 0.8, 0.4), p("Sam Perkins", "PF", 80, 12, 7, 2, 0.6, 0.6), p("Vin Baker", "PF", 84, 16, 9, 3, 0.8, 1), p("Hersey Hawkins", "SG", 82, 14, 4, 3, 1, 0.3), p("Ervin Johnson", "C", 76, 6, 8, 1, 0.4, 1), p("Brent Barry", "SG", 79, 12, 4, 4, 0.8, 0.3)],
    "2000s": [p("Rashard Lewis", "PF", 84, 16, 6, 3, 0.8, 0.5), p("Ray Allen", "SG", 88, 20, 5, 4, 1, 0.2), p("Luke Ridnour", "PG", 78, 10, 3, 5, 0.8, 0.2), p("Nick Collison", "PF", 78, 8, 6, 2, 0.5, 0.4), p("Desmond Mason", "SF", 80, 12, 6, 2, 0.8, 0.8), p("Chris Wilcox", "PF", 79, 12, 7, 1, 0.6, 0.8), p("Damien Wilkins", "SG", 77, 10, 4, 2, 0.6, 0.3), p("Earl Watson", "PG", 77, 8, 3, 5, 0.6, 0.2)],
    "2010s": [p("Russell Westbrook", "PG", 90, 22, 7, 9, 1.5, 0.3), p("Serge Ibaka", "PF", 84, 12, 8, 1, 0.8, 2.5), p("Enes Kanter", "C", 80, 12, 9, 1, 0.4, 0.5), p("Andre Roberson", "SF", 78, 6, 6, 2, 0.8, 0.6), p("Dennis Schroder", "PG", 81, 14, 3, 6, 0.8, 0.2), p("Jerami Grant", "PF", 81, 12, 5, 2, 0.7, 0.8), p("Shai Gilgeous-Alexander", "PG", 84, 18, 5, 6, 1, 0.5), p("Chris Paul", "PG", 84, 14, 5, 8, 1.5, 0.2)],
    "2020s": [p("Jalen Williams", "SF", 84, 16, 5, 4, 0.9, 0.5), p("Josh Giddey", "PG", 80, 14, 7, 6, 0.8, 0.4), p("Aaron Wiggins", "SG", 77, 10, 4, 2, 0.6, 0.3), p("Isaiah Joe", "SG", 77, 10, 3, 2, 0.5, 0.2), p("Kenrich Williams", "SF", 78, 8, 5, 3, 0.6, 0.3), p("Jaylin Williams", "PF", 77, 8, 6, 3, 0.5, 0.6), p("Cason Wallace", "PG", 76, 8, 3, 3, 0.8, 0.3), p("Ousmane Dieng", "SF", 75, 7, 4, 2, 0.5, 0.4)],
  },
  Timberwolves: {
    "1990s": [p("Christian Laettner", "PF", 82, 14, 7, 3, 0.6, 0.6), p("Doug West", "SG", 79, 12, 4, 3, 0.8, 0.3), p("Spud Webb", "PG", 77, 10, 2, 5, 0.8, 0.1), p("Terry Porter", "PG", 82, 14, 4, 7, 1, 0.2), p("Anthony Peeler", "SG", 78, 12, 3, 3, 0.8, 0.2), p("Sam Mitchell", "SF", 78, 10, 5, 2, 0.6, 0.3), p("Felton Spencer", "C", 76, 8, 7, 1, 0.3, 0.8), p("Isaiah Rider", "SG", 80, 16, 4, 3, 0.8, 0.3)],
    "2000s": [p("Wally Szczerbiak", "SF", 83, 16, 5, 3, 0.8, 0.3), p("Troy Hudson", "PG", 79, 12, 3, 5, 0.8, 0.2), p("Marko Jaric", "SG", 77, 10, 4, 4, 0.8, 0.3), p("Rasho Nesterovic", "C", 78, 8, 7, 2, 0.4, 0.8), p("Trenton Hassell", "SG", 76, 8, 4, 3, 0.8, 0.3), p("Mark Madsen", "PF", 75, 6, 6, 1, 0.3, 0.4), p("Latrell Sprewell", "SG", 82, 16, 4, 4, 0.8, 0.4), p("Sam Cassell", "PG", 82, 14, 3, 6, 0.8, 0.2)],
    "2010s": [p("Ricky Rubio", "PG", 82, 10, 4, 8, 1.5, 0.2), p("Andrew Wiggins", "SF", 83, 18, 5, 3, 0.8, 0.5), p("Gorgui Dieng", "C", 79, 10, 8, 2, 0.5, 1), p("Tyus Jones", "PG", 78, 8, 3, 5, 0.8, 0.2), p("Robert Covington", "SF", 80, 12, 6, 2, 1, 0.8), p("Derrick Rose", "PG", 80, 14, 3, 5, 0.8, 0.3), p("Josh Okogie", "SG", 77, 8, 4, 2, 0.8, 0.4), p("Taj Gibson", "PF", 79, 10, 7, 1, 0.5, 0.8)],
    "2020s": [p("Jaden McDaniels", "SF", 80, 12, 5, 2, 0.8, 0.6), p("Naz Reid", "C", 80, 12, 7, 2, 0.6, 0.8), p("Mike Conley", "PG", 81, 12, 3, 6, 0.9, 0.2), p("Nickeil Alexander-Walker", "SG", 77, 10, 3, 3, 0.6, 0.3), p("Kyle Anderson", "SF", 79, 8, 6, 4, 0.7, 0.5), p("Taurean Prince", "SF", 78, 9, 4, 2, 0.6, 0.3), p("Jordan McLaughlin", "PG", 75, 6, 2, 4, 0.6, 0.2), p("Leonard Miller", "SF", 75, 6, 4, 1, 0.4, 0.3)],
  },
  "Trail Blazers": {
    "1990s": [p("Cliff Robinson", "PF", 83, 16, 6, 2, 0.8, 1.2), p("Rod Strickland", "PG", 82, 14, 4, 8, 1.2, 0.2), p("Chris Dudley", "C", 76, 6, 8, 1, 0.3, 1), p("Harvey Grant", "PF", 79, 12, 7, 2, 0.6, 0.6), p("Isaiah Rider", "SG", 81, 16, 4, 3, 0.8, 0.3), p("Brian Grant", "PF", 78, 10, 8, 1, 0.5, 0.6), p("Alvin Williams", "PG", 77, 10, 3, 5, 0.8, 0.2), p("Jermaine O'Neal", "PF", 80, 12, 8, 1, 0.5, 1.5)],
    "2000s": [p("Greg Oden", "C", 80, 12, 9, 1, 0.5, 2), p("Andre Miller", "PG", 83, 14, 4, 7, 0.8, 0.2), p("Travis Outlaw", "PF", 78, 12, 6, 1, 0.5, 0.8), p("Joel Przybilla", "C", 77, 6, 8, 1, 0.3, 1.5), p("Steve Blake", "PG", 77, 8, 3, 5, 0.6, 0.2), p("Rudy Fernandez", "SG", 80, 12, 3, 3, 0.8, 0.3), p("Martell Webster", "SG", 77, 10, 3, 2, 0.6, 0.2), p("Channing Frye", "PF", 78, 10, 5, 1, 0.4, 0.5)],
    "2010s": [p("Evan Turner", "SF", 79, 10, 5, 4, 0.8, 0.4), p("Meyers Leonard", "C", 77, 8, 5, 1, 0.4, 0.5), p("Al-Farouq Aminu", "PF", 78, 10, 7, 2, 0.6, 0.5), p("Maurice Harkless", "SF", 78, 10, 5, 2, 0.8, 0.5), p("Enes Kanter", "C", 80, 12, 9, 1, 0.4, 0.5), p("Rodney Hood", "SG", 79, 12, 4, 2, 0.6, 0.3), p("Gary Trent Jr.", "SG", 78, 10, 3, 2, 0.6, 0.2), p("Robert Covington", "SF", 80, 10, 6, 2, 0.9, 0.6)],
    "2020s": [p("Anfernee Simons", "SG", 82, 18, 3, 4, 0.7, 0.2), p("Jerami Grant", "PF", 82, 14, 5, 2, 0.7, 0.8), p("Matisse Thybulle", "SF", 79, 8, 4, 2, 1.2, 0.6), p("Robert Williams III", "C", 81, 10, 9, 2, 0.8, 2), p("Malcolm Brogdon", "PG", 81, 14, 4, 5, 0.7, 0.3), p("Toumani Camara", "SF", 77, 9, 5, 2, 0.7, 0.4), p("Scoot Henderson", "PG", 78, 12, 4, 5, 0.8, 0.3), p("Duop Reath", "C", 75, 7, 5, 1, 0.3, 0.6)],
  },
  Warriors: {
    "1960s": [p("Guy Rodgers", "PG", 82, 12, 5, 8, 0.8, 0.2), p("Wayne Hightower", "PF", 79, 12, 8, 3, 0.6, 0.5), p("Tom Meschery", "PF", 78, 12, 7, 2, 0.5, 0.4), p("Jeff Mullins", "SG", 80, 16, 4, 3, 0.8, 0.3), p("Clyde Lee", "C", 77, 10, 9, 2, 0.4, 0.8), p("Al Attles", "SG", 78, 10, 4, 3, 0.8, 0.3), p("Fred Hetzel", "SF", 77, 12, 5, 2, 0.6, 0.3), p("Bud Ogden", "SF", 75, 8, 5, 2, 0.5, 0.3)],
    "1970s": [p("Phil Smith", "SG", 82, 16, 4, 4, 0.8, 0.3), p("Butch Beard", "PG", 79, 12, 4, 5, 0.8, 0.2), p("Jamaal Wilkes", "SF", 84, 18, 6, 3, 1, 0.4), p("Robert Parish", "C", 82, 14, 10, 2, 0.5, 1.2), p("Purvis Short", "SF", 80, 16, 5, 3, 0.8, 0.4), p("John Lucas", "PG", 80, 12, 3, 7, 1, 0.2), p("Lloyd Free", "SG", 81, 18, 4, 4, 0.8, 0.3), p("Clifford Ray", "C", 79, 10, 9, 2, 0.5, 1.2)],
    "1980s": [p("Sleepy Floyd", "PG", 82, 16, 3, 6, 1, 0.2), p("Larry Smith", "PF", 78, 8, 9, 2, 0.6, 0.5), p("Purvis Short", "SF", 80, 16, 5, 3, 0.8, 0.4), p("Manute Bol", "C", 78, 4, 5, 1, 0.3, 3), p("Chris Mullin", "SF", 86, 20, 5, 4, 1, 0.4), p("Mitch Richmond", "SG", 84, 18, 4, 3, 1, 0.3), p("Rod Higgins", "SF", 77, 10, 5, 2, 0.6, 0.4), p("Eric Floyd", "PG", 80, 14, 3, 5, 0.8, 0.2)],
    "1990s": [p("Bimbo Coles", "PG", 78, 12, 3, 5, 0.8, 0.2), p("Chris Gatling", "PF", 80, 14, 7, 1, 0.5, 0.5), p("Latrell Sprewell", "SG", 84, 18, 4, 4, 1.2, 0.5), p("Tim Hardaway", "PG", 86, 18, 3, 9, 1.5, 0.2), p("Chris Webber", "PF", 86, 18, 9, 4, 1, 1), p("Billy Owens", "SF", 80, 14, 7, 4, 0.8, 0.6), p("Adonal Foyle", "C", 77, 6, 7, 1, 0.4, 2), p("Jason Richardson", "SG", 82, 16, 5, 3, 0.8, 0.4)],
    "2000s": [p("Jason Richardson", "SG", 84, 18, 5, 3, 0.8, 0.4), p("Stephen Jackson", "SF", 83, 16, 5, 4, 1, 0.5), p("Andris Biedrins", "C", 78, 8, 9, 1, 0.4, 1.5), p("Matt Barnes", "SF", 78, 8, 5, 2, 0.8, 0.4), p("Monta Ellis", "SG", 84, 20, 4, 4, 0.9, 0.3), p("Kelenna Azubuike", "SG", 78, 12, 4, 2, 0.6, 0.3), p("Ronny Turiaf", "C", 76, 6, 5, 2, 0.4, 0.6), p("C.J. Watson", "PG", 77, 8, 3, 4, 0.6, 0.2)],
    "2010s": [p("Andre Iguodala", "SF", 84, 12, 5, 4, 1, 0.6), p("Shaun Livingston", "PG", 79, 8, 3, 4, 0.6, 0.4), p("Harrison Barnes", "SF", 80, 14, 5, 2, 0.6, 0.3), p("Festus Ezeli", "C", 77, 8, 7, 1, 0.4, 1.2), p("Ian Clark", "SG", 76, 8, 2, 2, 0.5, 0.2), p("Nick Young", "SG", 78, 12, 2, 1, 0.6, 0.2), p("Jordan Poole", "SG", 80, 14, 3, 3, 0.7, 0.3), p("Kevon Looney", "PF", 79, 8, 8, 2, 0.5, 0.5)],
    "2020s": [p("Kevon Looney", "PF", 80, 8, 8, 2, 0.5, 0.5), p("Gary Payton II", "SG", 78, 8, 4, 2, 0.9, 0.4), p("Dario Saric", "PF", 79, 10, 6, 3, 0.5, 0.4), p("Moses Moody", "SG", 77, 10, 3, 2, 0.6, 0.3), p("Brandin Podziemski", "SG", 78, 10, 5, 3, 0.7, 0.3), p("Trayce Jackson-Davis", "PF", 77, 8, 6, 2, 0.5, 0.6), p("Buddy Hield", "SG", 81, 12, 4, 2, 0.6, 0.2), p("Lester Quinones", "SG", 75, 7, 3, 2, 0.5, 0.2)],
  },
  Wizards: {
    "2000s": [p("Antawn Jamison", "PF", 84, 18, 8, 2, 0.6, 0.4), p("Caron Butler", "SF", 83, 16, 6, 3, 0.8, 0.4), p("Gilbert Arenas", "PG", 86, 22, 4, 6, 1.2, 0.2), p("Larry Hughes", "SG", 81, 14, 4, 4, 1, 0.4), p("Brendan Haywood", "C", 78, 8, 8, 1, 0.4, 1.2), p("DeShawn Stevenson", "SG", 78, 10, 4, 3, 0.8, 0.3), p("Nick Young", "SG", 79, 12, 3, 2, 0.6, 0.2), p("Andray Blatche", "PF", 79, 12, 7, 3, 0.6, 0.8)],
    "2010s": [p("Bradley Beal", "SG", 86, 22, 4, 5, 0.9, 0.4), p("Marcin Gortat", "C", 80, 12, 9, 1, 0.4, 1), p("Otto Porter Jr.", "SF", 81, 12, 6, 2, 0.7, 0.5), p("Markieff Morris", "PF", 80, 14, 6, 2, 0.6, 0.4), p("Kelly Oubre Jr.", "SF", 79, 12, 5, 2, 0.8, 0.4), p("Ian Mahinmi", "C", 76, 6, 6, 1, 0.3, 0.8), p("Tomas Satoransky", "PG", 78, 8, 4, 5, 0.6, 0.2), p("Moritz Wagner", "C", 77, 10, 5, 2, 0.4, 0.4)],
    "2020s": [p("Kyle Kuzma", "PF", 83, 16, 7, 3, 0.6, 0.5), p("Daniel Gafford", "C", 81, 12, 9, 1, 0.5, 1.8), p("Deni Avdija", "SF", 79, 10, 6, 3, 0.7, 0.5), p("Corey Kispert", "SF", 78, 12, 4, 2, 0.5, 0.3), p("Bilal Coulibaly", "SF", 77, 10, 5, 3, 0.8, 0.5), p("Jordan Poole", "SG", 81, 16, 3, 4, 0.7, 0.3), p("Marvin Bagley III", "PF", 78, 12, 7, 2, 0.5, 0.5), p("Tyus Jones", "PG", 79, 10, 3, 5, 0.8, 0.2)],
  },
};

const TEAM_ERAS = {
  "76ers": ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Bucks: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Bulls: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Cavaliers: ["1990s", "2000s", "2010s", "2020s"],
  Celtics: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Clippers: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Grizzlies: ["2000s", "2010s", "2020s"],
  Hawks: ["1990s", "2000s", "2010s", "2020s"],
  Heat: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Hornets: ["1990s", "2000s", "2010s", "2020s"],
  Jazz: ["1990s", "2000s", "2010s", "2020s"],
  Kings: ["1990s", "2000s", "2010s", "2020s"],
  Knicks: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Lakers: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Magic: ["1990s", "2000s", "2010s", "2020s"],
  Mavericks: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Nets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Nuggets: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Pacers: ["1990s", "2000s", "2010s", "2020s"],
  Pelicans: ["2000s", "2010s", "2020s"],
  Pistons: ["1980s", "1990s", "2000s", "2010s", "2020s"],
  Raptors: ["2000s", "2010s", "2020s"],
  Rockets: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Spurs: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Suns: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Thunder: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Timberwolves: ["1990s", "2000s", "2010s", "2020s"],
  "Trail Blazers": ["1990s", "2000s", "2010s", "2020s"],
  Warriors: ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
  Wizards: ["2000s", "2010s", "2020s"],
};

const exclude = JSON.parse(fs.readFileSync("scripts/_exclude.json", "utf8"));

const depth = {};
for (const [club, eras] of Object.entries(CLUBS)) {
  for (const [era, players] of Object.entries(eras)) {
    depth[`${club}|${era}`] = players;
  }
}

const KNICKS_1960S_REQUIRED = [
  "Phil Jackson", "Howard Komives", "Mike Riordan", "Johnny Egan",
  "Bill Bradley", "Emmette Bryant", "Art Heyman", "Dave Stallworth",
];

function parseSeedExclusions() {
  const files = [
    "scripts/seeds/nba.ts",
    "scripts/seeds/nba-extra.ts",
    "scripts/seeds/nba-core-boost.ts",
  ];
  const out = {};
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    let club = null;
    let era = null;
    for (const line of src.split("\n")) {
      const cm = line.match(/^  ("?[\w ]+"?|\d+ers): \{/);
      if (cm) {
        club = cm[1].replace(/"/g, "");
        era = null;
        continue;
      }
      const em = line.match(/^    "(\d{4}s)": \[/);
      if (em && club) {
        era = em[1];
        out[`${club}|${era}`] ??= new Set();
        continue;
      }
      const pm = line.match(/b\("([^"]+)"/);
      if (pm && club && era) out[`${club}|${era}`].add(pm[1].trim().toLowerCase());
    }
  }
  return out;
}

const seedExclude = parseSeedExclusions();

// Flat franchise pools for padding after seed dedup
const clubPool = {};
for (const [club, eras] of Object.entries(CLUBS)) {
  clubPool[club] = [];
  for (const players of Object.values(eras)) clubPool[club].push(...players);
}

const dupWarnings = [];
const errors = [];
let totalWritten = 0;

for (const [club, eras] of Object.entries(TEAM_ERAS)) {
  for (const era of eras) {
    const key = `${club}|${era}`;
    const taken = seedExclude[key] ?? new Set();
    const raw = depth[key] ?? [];
    const seen = new Set();
    const filtered = [];
    for (const pl of raw) {
      const n = pl[0].trim().toLowerCase();
      if (taken.has(n)) {
        dupWarnings.push(`${key} → ${pl[0]}`);
        continue;
      }
      if (seen.has(n)) continue;
      seen.add(n);
      filtered.push(pl);
    }
    // ponytail: pad from franchise pool if era list overlaps seeds heavily
    if (filtered.length < 8) {
      for (const pl of clubPool[club] ?? []) {
        const n = pl[0].trim().toLowerCase();
        if (taken.has(n) || seen.has(n)) continue;
        seen.add(n);
        filtered.push(pl);
        if (filtered.length >= 8) break;
      }
    }
    if (!depth[key]) errors.push(`${key}: missing depth data`);
    if (filtered.length < 8) errors.push(`${key}: only ${filtered.length} players (need 8-12)`);
    if (filtered.length > 12) errors.push(`${key}: ${filtered.length} players (max 12)`);
    depth[key] = filtered.slice(0, 12);
    if (depth[key].length >= 8 && depth[key].length <= 12) totalWritten++;
  }
}

const kn60 = new Set((depth["Knicks|1960s"] ?? []).map((x) => x[0]));
for (const req of KNICKS_1960S_REQUIRED) {
  if (!kn60.has(req)) errors.push(`Knicks|1960s missing required: ${req}`);
}

if (errors.length) {
  console.error("Validation errors:\n" + errors.join("\n"));
  process.exit(1);
}

console.log("duplicate warnings (filtered):", dupWarnings.length);

const depthJson = JSON.stringify(depth, null, 2);
const depthLines = depthJson.slice(1, -1).trim();

const build = `import fs from "fs";

/** [name, pos, rating, ppg, rpg, apg, spg?, bpg?] */
const depth = {
${depthLines}
};

const SEED_FILES = [
  "scripts/seeds/nba.ts",
  "scripts/seeds/nba-extra.ts",
  "scripts/seeds/nba-core-boost.ts",
];

function parseSeedExclusions() {
  const out = {};
  for (const f of SEED_FILES) {
    const src = fs.readFileSync(f, "utf8");
    let club = null;
    let era = null;
    for (const line of src.split("\\n")) {
      const cm = line.match(/^  ("?[\\\\w ]+"?|\\\\d+ers): \\\\{/);
      if (cm) {
        club = cm[1].replace(/"/g, "");
        era = null;
        continue;
      }
      const em = line.match(/^    "(\\\\d{4}s)": \\\\[/);
      if (em && club) {
        era = em[1];
        out[\`\${club}|\${era}\`] ??= new Set();
        continue;
      }
      const pm = line.match(/b\\\\("([^"]+)"\\\\)/);
      if (pm && club && era) out[\`\${club}|\${era}\`].add(pm[1].trim().toLowerCase());
    }
  }
  return out;
}

const seedExclude = parseSeedExclusions();
const errors = [];
const clubs = {};

for (const [key, raw] of Object.entries(depth)) {
  const [club, era] = key.split("|");
  const taken = seedExclude[key] ?? new Set();
  const seen = new Set();
  const filtered = [];
  for (const pl of raw) {
    const n = pl[0].trim().toLowerCase();
    if (taken.has(n)) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    filtered.push(pl);
  }
  if (filtered.length < 8) errors.push(\`\${key}: only \${filtered.length} players\`);
  if (filtered.length > 12) errors.push(\`\${key}: \${filtered.length} players (max 12)\`);
  clubs[club] ??= {};
  clubs[club][era] = filtered;
}

if (errors.length) {
  console.error(errors.join("\\n"));
  process.exit(1);
}

function line(pl) {
  const [name, pos, ...nums] = pl;
  return \`      b("\${name}", ["\${pos}"], \${nums.join(", ")})\`;
}

let out = \`import type { ClubEraPool, Seed } from "./types";

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

/** 8-12 rotation/role players per club×era (30 franchises). */
export const NBA_ROSTER_DEPTH: ClubEraPool = {
\`;

for (const [club, eras] of Object.entries(clubs).sort(([a], [b]) => a.localeCompare(b))) {
  const ck = club.includes(" ") || club.startsWith("7") ? JSON.stringify(club) : club;
  out += \`  \${ck}: {\\n\`;
  for (const [era, players] of Object.entries(eras).sort()) {
    out += \`    "\${era}": [\\n\${players.map(line).join(",\\n")},\\n    ],\\n\`;
  }
  out += \`  },\\n\`;
}
out += \`};\\n\`;

fs.writeFileSync("scripts/seeds/nba-roster-depth.ts", out);
console.log("wrote nba-roster-depth.ts:", Object.keys(depth).length, "club×era combos");
if (errors.length) console.log("validation warnings:", errors.length);
`;

fs.writeFileSync("scripts/build-nba-roster-depth.mjs", build);
console.log("generated build-nba-roster-depth.mjs");
console.log("validated combos:", totalWritten, "/", Object.values(TEAM_ERAS).flat().length);

