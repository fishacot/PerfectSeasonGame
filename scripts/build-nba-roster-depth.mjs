import fs from "fs";

/** [name, pos, rating, ppg, rpg, apg, spg?, bpg?] */
const depth = {
"76ers|1980s": [
    [
      "Caldwell Jones",
      "C",
      80,
      10,
      9,
      1,
      0.5,
      1.5
    ],
    [
      "Clint Richardson",
      "SG",
      76,
      8,
      3,
      3,
      1,
      0.2
    ],
    [
      "Franklin Edwards",
      "PG",
      78,
      10,
      2,
      4,
      1,
      0.2
    ],
    [
      "Clemon Johnson",
      "C",
      77,
      8,
      7,
      2,
      0.4,
      0.6
    ],
    [
      "Marc Iavaroni",
      "SF",
      75,
      7,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Ed Sherod",
      "PG",
      74,
      6,
      2,
      4,
      0.8,
      0.1
    ],
    [
      "Sam Williams",
      "PF",
      76,
      9,
      6,
      1,
      0.5,
      0.8
    ],
    [
      "Steve Mix",
      "SF",
      79,
      12,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Joe Bryant",
      "SF",
      78,
      11,
      5,
      2,
      0.6,
      0.4
    ]
  ],
  "76ers|1990s": [
    [
      "Hersey Hawkins",
      "SG",
      84,
      16,
      4,
      3,
      1.2,
      0.3
    ],
    [
      "Dana Barros",
      "PG",
      82,
      14,
      2,
      5,
      0.9,
      0.1
    ],
    [
      "Manute Bol",
      "C",
      78,
      4,
      5,
      1,
      0.3,
      3.2
    ],
    [
      "Rick Mahorn",
      "PF",
      79,
      8,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Mike Gminski",
      "C",
      80,
      12,
      7,
      2,
      0.5,
      0.8
    ],
    [
      "Jeff Malone",
      "SG",
      81,
      16,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Ron Anderson",
      "SF",
      76,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Willie Burton",
      "SG",
      77,
      12,
      3,
      2,
      0.8,
      0.3
    ]
  ],
  "76ers|2000s": [
    [
      "Thaddeus Young",
      "SF",
      82,
      14,
      6,
      2,
      1,
      0.5
    ],
    [
      "Willie Green",
      "SG",
      78,
      10,
      3,
      2,
      0.7,
      0.2
    ],
    [
      "Rodney Carney",
      "SF",
      75,
      8,
      3,
      1,
      0.8,
      0.3
    ],
    [
      "Marreese Speights",
      "PF",
      77,
      10,
      5,
      0.5,
      0.4,
      0.6
    ],
    [
      "Elton Brand",
      "PF",
      84,
      16,
      9,
      2,
      0.6,
      1
    ],
    [
      "Jrue Holiday",
      "PG",
      80,
      12,
      4,
      5,
      1.2,
      0.4
    ],
    [
      "Caldwell Jones",
      "C",
      80,
      10,
      9,
      1,
      0.5,
      1.5
    ],
    [
      "Clint Richardson",
      "SG",
      76,
      8,
      3,
      3,
      1,
      0.2
    ]
  ],
  "76ers|2010s": [
    [
      "T.J. McConnell",
      "PG",
      78,
      8,
      3,
      5,
      1,
      0.2
    ],
    [
      "Richaun Holmes",
      "C",
      80,
      10,
      7,
      1,
      0.6,
      1.2
    ],
    [
      "Dario Saric",
      "PF",
      80,
      12,
      6,
      3,
      0.6,
      0.4
    ],
    [
      "Ersan Ilyasova",
      "PF",
      79,
      12,
      6,
      1,
      0.5,
      0.4
    ],
    [
      "Wilson Chandler",
      "SF",
      80,
      12,
      5,
      2,
      0.7,
      0.5
    ],
    [
      "Mike Muscala",
      "C",
      76,
      8,
      5,
      1,
      0.4,
      0.6
    ],
    [
      "Nik Stauskas",
      "SG",
      76,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Markelle Fultz",
      "PG",
      78,
      12,
      4,
      5,
      1,
      0.4
    ],
    [
      "Jahlil Okafor",
      "C",
      79,
      14,
      7,
      2,
      0.4,
      0.6
    ]
  ],
  "76ers|2020s": [
    [
      "De'Anthony Melton",
      "SG",
      80,
      10,
      3,
      3,
      1.2,
      0.5
    ],
    [
      "Nicolas Batum",
      "SF",
      78,
      8,
      5,
      3,
      0.7,
      0.5
    ],
    [
      "Paul Reed",
      "PF",
      77,
      8,
      6,
      1,
      0.8,
      0.8
    ],
    [
      "Furkan Korkmaz",
      "SG",
      76,
      10,
      3,
      1,
      0.5,
      0.2
    ],
    [
      "Montrezl Harrell",
      "C",
      79,
      12,
      6,
      1,
      0.5,
      0.6
    ],
    [
      "Caleb Martin",
      "SF",
      77,
      10,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Buddy Hield",
      "SG",
      81,
      14,
      4,
      2,
      0.7,
      0.2
    ],
    [
      "KJ Martin",
      "SF",
      75,
      8,
      4,
      1,
      0.6,
      0.5
    ]
  ],
  "Bucks|1960s": [
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Fred Crawford",
      "SG",
      77,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Len Chappell",
      "PF",
      78,
      12,
      8,
      2,
      0.5,
      0.4
    ],
    [
      "Wali Jones",
      "PG",
      77,
      10,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Dick Cunningham",
      "C",
      76,
      8,
      9,
      1,
      0.4,
      0.8
    ],
    [
      "Guy Rodgers",
      "PG",
      79,
      10,
      4,
      7,
      0.8,
      0.2
    ]
  ],
  "Bucks|1970s": [
    [
      "Swen Nater",
      "C",
      80,
      12,
      10,
      2,
      0.5,
      0.8
    ],
    [
      "Harvey Catchings",
      "PF",
      77,
      8,
      7,
      2,
      0.6,
      0.8
    ],
    [
      "Don Smith",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Gary Brokaw",
      "SF",
      77,
      11,
      4,
      3,
      0.8,
      0.4
    ],
    [
      "Alex English",
      "SF",
      82,
      16,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Quinn Buckner",
      "PG",
      78,
      8,
      4,
      5,
      1.2,
      0.3
    ],
    [
      "Lloyd Walton",
      "PG",
      76,
      7,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ]
  ],
  "Bucks|1980s": [
    [
      "Jack Sikma",
      "C",
      86,
      16,
      10,
      3,
      0.8,
      1.2
    ],
    [
      "Paul Pressey",
      "SF",
      82,
      14,
      6,
      5,
      1.2,
      0.8
    ],
    [
      "Craig Hodges",
      "SG",
      79,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Alton Lister",
      "C",
      77,
      8,
      8,
      1,
      0.4,
      1.2
    ],
    [
      "Kenny Green",
      "PF",
      76,
      9,
      6,
      1,
      0.5,
      0.5
    ],
    [
      "Jay Humphries",
      "PG",
      78,
      10,
      3,
      5,
      1,
      0.3
    ],
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Bucks|1990s": [
    [
      "Jon Barry",
      "SG",
      79,
      10,
      3,
      4,
      0.8,
      0.3
    ],
    [
      "Ervin Johnson",
      "C",
      77,
      6,
      8,
      1,
      0.4,
      1
    ],
    [
      "Shawn Respert",
      "SG",
      76,
      10,
      2,
      2,
      0.6,
      0.2
    ],
    [
      "Sherell Ford",
      "SF",
      75,
      8,
      4,
      1,
      0.6,
      0.4
    ],
    [
      "Vinny Del Negro",
      "SG",
      78,
      11,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "Robert Reid",
      "SF",
      77,
      10,
      4,
      3,
      0.8,
      0.5
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ]
  ],
  "Bucks|2000s": [
    [
      "Toni Kukoc",
      "SF",
      82,
      12,
      5,
      4,
      0.8,
      0.5
    ],
    [
      "Desmond Mason",
      "SF",
      80,
      12,
      6,
      2,
      0.8,
      0.8
    ],
    [
      "Zaza Pachulia",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.5
    ],
    [
      "Bobby Simmons",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.3
    ],
    [
      "Dan Gadzuric",
      "C",
      76,
      6,
      7,
      1,
      0.3,
      0.8
    ],
    [
      "Keith Van Horn",
      "PF",
      80,
      14,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Bucks|2010s": [
    [
      "John Henson",
      "C",
      80,
      10,
      8,
      2,
      0.6,
      1.5
    ],
    [
      "Ersan Ilyasova",
      "PF",
      81,
      12,
      6,
      1,
      0.5,
      0.4
    ],
    [
      "Mirza Teletovic",
      "PF",
      78,
      10,
      5,
      1,
      0.4,
      0.3
    ],
    [
      "Tony Snell",
      "SF",
      77,
      8,
      3,
      2,
      0.6,
      0.4
    ],
    [
      "Matthew Dellavedova",
      "PG",
      78,
      8,
      3,
      5,
      0.6,
      0.2
    ],
    [
      "Thon Maker",
      "C",
      76,
      6,
      5,
      1,
      0.4,
      1
    ],
    [
      "George Hill",
      "PG",
      82,
      12,
      3,
      4,
      0.8,
      0.3
    ],
    [
      "Wayne Embry",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      0.6
    ]
  ],
  "Bucks|2020s": [
    [
      "Bobby Portis",
      "PF",
      82,
      14,
      9,
      2,
      0.6,
      0.4
    ],
    [
      "Pat Connaughton",
      "SG",
      78,
      8,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Grayson Allen",
      "SG",
      79,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Jae Crowder",
      "PF",
      78,
      8,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Malik Beasley",
      "SG",
      79,
      12,
      3,
      2,
      0.7,
      0.2
    ],
    [
      "Andre Jackson Jr.",
      "SF",
      76,
      7,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "MarJon Beauchamp",
      "SF",
      76,
      8,
      4,
      1,
      0.6,
      0.3
    ],
    [
      "Taurean Prince",
      "SF",
      79,
      9,
      4,
      2,
      0.6,
      0.3
    ]
  ],
  "Bulls|1960s": [
    [
      "Clem Haskins",
      "PG",
      79,
      12,
      4,
      5,
      1,
      0.2
    ],
    [
      "Jim Washington",
      "PF",
      78,
      12,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "Don Kojis",
      "SF",
      77,
      14,
      5,
      2,
      0.8,
      0.3
    ],
    [
      "Tom Boerwinkle",
      "C",
      77,
      8,
      10,
      3,
      0.4,
      1
    ],
    [
      "Matt Guokas",
      "SG",
      75,
      8,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Mickey Johnson",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Fred Brown",
      "SG",
      76,
      10,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Keith Erickson",
      "SF",
      78,
      10,
      5,
      3,
      0.8,
      0.4
    ]
  ],
  "Bulls|1970s": [
    [
      "Tom Boerwinkle",
      "C",
      80,
      8,
      11,
      4,
      0.4,
      1.2
    ],
    [
      "Wilbur Holland",
      "PG",
      77,
      12,
      3,
      5,
      1.2,
      0.2
    ],
    [
      "Clifford Ray",
      "C",
      79,
      10,
      9,
      2,
      0.5,
      1.2
    ],
    [
      "Mickey Johnson",
      "SF",
      78,
      12,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Keith Magnuson",
      "SG",
      76,
      10,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "John Mengelt",
      "SG",
      77,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Tom Henderson",
      "PG",
      76,
      8,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Andrés Guibert",
      "PF",
      77,
      10,
      7,
      2,
      0.5,
      0.5
    ]
  ],
  "Bulls|1980s": [
    [
      "Dave Greenwood",
      "PF",
      81,
      12,
      9,
      3,
      0.8,
      1
    ],
    [
      "Brad Sellers",
      "C",
      77,
      10,
      5,
      2,
      0.5,
      0.8
    ],
    [
      "Charles Oakley",
      "PF",
      82,
      10,
      10,
      2,
      0.8,
      0.4
    ],
    [
      "Sam Vincent",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Will Perdue",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "B.J. Armstrong",
      "PG",
      80,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Stacey King",
      "PF",
      76,
      8,
      5,
      1,
      0.4,
      0.4
    ],
    [
      "Craig Hodges",
      "SG",
      79,
      10,
      3,
      2,
      0.6,
      0.2
    ]
  ],
  "Bulls|1990s": [
    [
      "Steve Kerr",
      "PG",
      80,
      8,
      2,
      3,
      0.6,
      0.1
    ],
    [
      "Bill Cartwright",
      "C",
      79,
      8,
      6,
      2,
      0.4,
      0.8
    ],
    [
      "Will Perdue",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "Jud Buechler",
      "SF",
      76,
      6,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Ron Harper",
      "SG",
      82,
      12,
      5,
      4,
      1.2,
      0.6
    ],
    [
      "Steve Smith",
      "SG",
      80,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Dickey Simpkins",
      "PF",
      75,
      6,
      5,
      1,
      0.4,
      0.4
    ],
    [
      "Bill Wennington",
      "C",
      76,
      6,
      5,
      1,
      0.3,
      0.5
    ]
  ],
  "Bulls|2000s": [
    [
      "Tyrus Thomas",
      "PF",
      78,
      10,
      7,
      1,
      0.8,
      1.2
    ],
    [
      "Andres Nocioni",
      "SF",
      80,
      12,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Chris Duhon",
      "PG",
      77,
      8,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Thabo Sefolosha",
      "SF",
      78,
      8,
      4,
      2,
      0.8,
      0.5
    ],
    [
      "Aaron Gray",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      0.6
    ],
    [
      "Larry Hughes",
      "SG",
      80,
      14,
      4,
      4,
      1,
      0.4
    ],
    [
      "Brad Miller",
      "C",
      82,
      12,
      9,
      3,
      0.5,
      0.6
    ],
    [
      "Clem Haskins",
      "PG",
      79,
      12,
      4,
      5,
      1,
      0.2
    ]
  ],
  "Bulls|2010s": [
    [
      "Taj Gibson",
      "PF",
      81,
      10,
      7,
      1,
      0.5,
      1
    ],
    [
      "Kirk Hinrich",
      "PG",
      79,
      8,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Mike Dunleavy",
      "SF",
      78,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Tony Snell",
      "SF",
      77,
      8,
      3,
      2,
      0.6,
      0.4
    ],
    [
      "Doug McDermott",
      "SF",
      78,
      10,
      3,
      2,
      0.4,
      0.2
    ],
    [
      "Robin Lopez",
      "C",
      79,
      10,
      6,
      1,
      0.4,
      0.8
    ],
    [
      "Rajon Rondo",
      "PG",
      82,
      8,
      5,
      7,
      1,
      0.3
    ],
    [
      "Bobby Portis",
      "PF",
      80,
      12,
      8,
      2,
      0.6,
      0.4
    ]
  ],
  "Bulls|2020s": [
    [
      "Alex Caruso",
      "SG",
      82,
      8,
      4,
      4,
      1.2,
      0.5
    ],
    [
      "Coby White",
      "PG",
      80,
      14,
      4,
      4,
      0.7,
      0.3
    ],
    [
      "Patrick Williams",
      "PF",
      79,
      10,
      5,
      2,
      0.6,
      0.5
    ],
    [
      "Ayo Dosunmu",
      "SG",
      79,
      11,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Jevon Carter",
      "PG",
      77,
      8,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Andre Drummond",
      "C",
      81,
      10,
      11,
      1,
      0.8,
      1
    ],
    [
      "Torrey Craig",
      "SF",
      76,
      7,
      5,
      1,
      0.6,
      0.4
    ],
    [
      "Dalton Knecht",
      "SG",
      76,
      10,
      4,
      1,
      0.5,
      0.2
    ]
  ],
  "Cavaliers|1990s": [
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Steve Kerr",
      "PG",
      78,
      8,
      2,
      3,
      0.6,
      0.1
    ],
    [
      "John Battle",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Craig Ehlo",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.4
    ],
    [
      "Donyell Marshall",
      "PF",
      79,
      10,
      6,
      2,
      0.6,
      0.5
    ],
    [
      "Daniel Gibson",
      "PG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Anderson Varejao",
      "PF",
      80,
      8,
      9,
      2,
      0.8,
      0.5
    ],
    [
      "Mo Williams",
      "PG",
      81,
      14,
      3,
      5,
      0.8,
      0.2
    ]
  ],
  "Cavaliers|2000s": [
    [
      "Donyell Marshall",
      "PF",
      79,
      10,
      6,
      2,
      0.6,
      0.5
    ],
    [
      "Delonte West",
      "PG",
      79,
      12,
      4,
      5,
      0.8,
      0.3
    ],
    [
      "Wally Szczerbiak",
      "SF",
      80,
      14,
      4,
      3,
      0.6,
      0.3
    ],
    [
      "Ben Wallace",
      "C",
      82,
      6,
      10,
      2,
      1,
      2
    ],
    [
      "Terrell Brandon",
      "PG",
      84,
      16,
      3,
      7,
      1.2,
      0.2
    ],
    [
      "Chris Mills",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Steve Kerr",
      "PG",
      78,
      8,
      2,
      3,
      0.6,
      0.1
    ]
  ],
  "Cavaliers|2010s": [
    [
      "J.R. Smith",
      "SG",
      80,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Matthew Dellavedova",
      "PG",
      78,
      8,
      3,
      5,
      0.6,
      0.2
    ],
    [
      "Iman Shumpert",
      "SG",
      78,
      8,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Kyle Korver",
      "SG",
      82,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Channing Frye",
      "PF",
      78,
      10,
      5,
      1,
      0.4,
      0.5
    ],
    [
      "Jordan Clarkson",
      "SG",
      80,
      14,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Terrell Brandon",
      "PG",
      84,
      16,
      3,
      7,
      1.2,
      0.2
    ],
    [
      "Chris Mills",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.5
    ]
  ],
  "Cavaliers|2020s": [
    [
      "Dean Wade",
      "PF",
      76,
      7,
      5,
      1,
      0.6,
      0.5
    ],
    [
      "Isaac Okoro",
      "SF",
      77,
      9,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Georges Niang",
      "PF",
      78,
      10,
      4,
      2,
      0.4,
      0.3
    ],
    [
      "Sam Merrill",
      "SG",
      76,
      8,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Terrell Brandon",
      "PG",
      84,
      16,
      3,
      7,
      1.2,
      0.2
    ],
    [
      "Chris Mills",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Steve Kerr",
      "PG",
      78,
      8,
      2,
      3,
      0.6,
      0.1
    ]
  ],
  "Celtics|1960s": [
    [
      "Tom Sanders",
      "SF",
      80,
      10,
      6,
      2,
      0.8,
      0.5
    ],
    [
      "K.C. Jones",
      "PG",
      79,
      8,
      4,
      5,
      1,
      0.3
    ],
    [
      "Willie Naulls",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Don Nelson",
      "PF",
      80,
      12,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Larry Siegfried",
      "SG",
      78,
      10,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Loscutoff",
      "SF",
      76,
      7,
      5,
      1,
      0.5,
      0.3
    ],
    [
      "Frank Ramsey",
      "SG",
      79,
      12,
      5,
      2,
      0.8,
      0.3
    ],
    [
      "Mel Counts",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      0.8
    ]
  ],
  "Celtics|1970s": [
    [
      "Don Nelson",
      "PF",
      81,
      13,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Charlie Scott",
      "SG",
      82,
      16,
      4,
      4,
      1,
      0.3
    ],
    [
      "Don Chaney",
      "SG",
      79,
      11,
      4,
      3,
      1,
      0.4
    ],
    [
      "Cedric Maxwell",
      "SF",
      80,
      12,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Rick Robey",
      "C",
      77,
      10,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "Nate Archibald",
      "PG",
      84,
      18,
      3,
      8,
      1.2,
      0.2
    ],
    [
      "M.L. Carr",
      "SF",
      78,
      12,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Tom Sanders",
      "SF",
      80,
      10,
      6,
      2,
      0.8,
      0.5
    ]
  ],
  "Celtics|1980s": [
    [
      "Danny Ainge",
      "SG",
      82,
      14,
      4,
      5,
      1,
      0.3
    ],
    [
      "Bill Walton",
      "C",
      80,
      8,
      9,
      3,
      0.5,
      1.2
    ],
    [
      "Jerry Sichting",
      "PG",
      76,
      8,
      2,
      4,
      0.6,
      0.1
    ],
    [
      "Scott Wedman",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Rick Carlisle",
      "SG",
      76,
      8,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "M.L. Carr",
      "SF",
      78,
      12,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Greg Kite",
      "C",
      75,
      5,
      6,
      1,
      0.3,
      0.8
    ],
    [
      "Brian Shaw",
      "PG",
      77,
      8,
      3,
      5,
      0.8,
      0.2
    ]
  ],
  "Celtics|1990s": [
    [
      "Rick Fox",
      "SF",
      80,
      12,
      5,
      3,
      0.8,
      0.5
    ],
    [
      "Robert Parish",
      "C",
      82,
      12,
      8,
      1,
      0.5,
      1
    ],
    [
      "Brian Shaw",
      "PG",
      78,
      10,
      4,
      6,
      0.8,
      0.3
    ],
    [
      "David Wesley",
      "SG",
      79,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Dana Barros",
      "PG",
      80,
      14,
      2,
      5,
      0.9,
      0.1
    ],
    [
      "Dominique Wilkins",
      "SF",
      86,
      20,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Pervis Ellison",
      "C",
      77,
      10,
      7,
      2,
      0.5,
      1
    ],
    [
      "Eric Montross",
      "C",
      76,
      8,
      7,
      1,
      0.3,
      0.8
    ]
  ],
  "Celtics|2000s": [
    [
      "Tony Allen",
      "SG",
      80,
      8,
      4,
      2,
      1.2,
      0.5
    ],
    [
      "Delonte West",
      "PG",
      79,
      12,
      4,
      5,
      0.8,
      0.3
    ],
    [
      "Rasheed Wallace",
      "PF",
      83,
      12,
      7,
      2,
      0.8,
      1.2
    ],
    [
      "Eddie House",
      "PG",
      77,
      10,
      2,
      3,
      0.6,
      0.1
    ],
    [
      "Leon Powe",
      "PF",
      76,
      8,
      5,
      0.5,
      0.4,
      0.4
    ],
    [
      "James Posey",
      "SF",
      78,
      8,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Brian Scalabrine",
      "PF",
      75,
      6,
      4,
      1,
      0.4,
      0.3
    ],
    [
      "Tom Sanders",
      "SF",
      80,
      10,
      6,
      2,
      0.8,
      0.5
    ]
  ],
  "Celtics|2010s": [
    [
      "Marcus Smart",
      "PG",
      84,
      12,
      4,
      6,
      1.3,
      0.5
    ],
    [
      "Terry Rozier",
      "PG",
      80,
      12,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Daniel Theis",
      "C",
      79,
      10,
      7,
      2,
      0.5,
      1
    ],
    [
      "Semi Ojeleye",
      "PF",
      76,
      6,
      5,
      1,
      0.5,
      0.3
    ],
    [
      "Grant Williams",
      "PF",
      78,
      8,
      5,
      2,
      0.5,
      0.5
    ],
    [
      "Robert Williams III",
      "C",
      81,
      10,
      9,
      2,
      0.8,
      2
    ],
    [
      "Gordon Hayward",
      "SF",
      83,
      14,
      5,
      4,
      0.8,
      0.4
    ],
    [
      "Enes Kanter",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.3
    ]
  ],
  "Celtics|2020s": [
    [
      "Sam Hauser",
      "SF",
      78,
      9,
      4,
      1,
      0.4,
      0.3
    ],
    [
      "Payton Pritchard",
      "PG",
      80,
      10,
      4,
      3,
      0.6,
      0.2
    ],
    [
      "Al Horford",
      "C",
      82,
      10,
      7,
      3,
      0.6,
      1
    ],
    [
      "Xavier Tillman",
      "PF",
      76,
      6,
      5,
      1,
      0.6,
      0.6
    ],
    [
      "Luke Kornet",
      "C",
      76,
      6,
      5,
      1,
      0.3,
      1
    ],
    [
      "Neemias Queta",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      0.8
    ],
    [
      "Jordan Walsh",
      "SF",
      75,
      6,
      4,
      1,
      0.6,
      0.4
    ],
    [
      "Oshae Brissett",
      "SF",
      77,
      8,
      5,
      1,
      0.5,
      0.3
    ]
  ],
  "Clippers|1960s": [
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Krebs",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Rod Thorn",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Fred Crawford",
      "SG",
      77,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Darrall Imhoff",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      1
    ],
    [
      "Keith Erickson",
      "SF",
      79,
      10,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "John Barnhill",
      "PG",
      76,
      9,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Don Ohl",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Clippers|1970s": [
    [
      "Swen Nater",
      "C",
      80,
      12,
      10,
      2,
      0.5,
      0.8
    ],
    [
      "Harvey Catchings",
      "PF",
      77,
      8,
      7,
      2,
      0.6,
      0.8
    ],
    [
      "Kevin Porter",
      "PG",
      80,
      14,
      4,
      8,
      1,
      0.2
    ],
    [
      "Sidney Wicks",
      "PF",
      82,
      16,
      8,
      3,
      0.8,
      0.5
    ],
    [
      "Freeman Williams",
      "SG",
      79,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Michael Brooks",
      "SF",
      78,
      12,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Krebs",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ]
  ],
  "Clippers|1980s": [
    [
      "Benoit Benjamin",
      "C",
      80,
      14,
      9,
      2,
      0.5,
      2
    ],
    [
      "Charles Smith",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      1.5
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Doc Rivers",
      "PG",
      79,
      10,
      3,
      6,
      1.2,
      0.2
    ],
    [
      "Kenny Smith",
      "PG",
      78,
      10,
      2,
      5,
      0.8,
      0.2
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Krebs",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Rod Thorn",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ]
  ],
  "Clippers|1990s": [
    [
      "Kenny Anderson",
      "PG",
      83,
      16,
      4,
      8,
      1.2,
      0.2
    ],
    [
      "Derek Anderson",
      "SG",
      80,
      14,
      4,
      4,
      1,
      0.3
    ],
    [
      "Corey Maggette",
      "SF",
      82,
      16,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Eric Piatkowski",
      "SG",
      78,
      10,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Quentin Richardson",
      "SG",
      79,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Michael Olowokandi",
      "C",
      78,
      10,
      8,
      1,
      0.5,
      1.5
    ],
    [
      "Tyrone Nesby",
      "SF",
      77,
      12,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Clippers|2000s": [
    [
      "Sam Cassell",
      "PG",
      82,
      14,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Quinton Ross",
      "SG",
      76,
      6,
      3,
      2,
      0.8,
      0.4
    ],
    [
      "Daniel Ewing",
      "SG",
      75,
      8,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Tim Thomas",
      "PF",
      79,
      12,
      5,
      1,
      0.4,
      0.4
    ],
    [
      "Bobby Brown",
      "PG",
      76,
      10,
      2,
      4,
      0.6,
      0.2
    ],
    [
      "James Singleton",
      "PF",
      75,
      7,
      5,
      1,
      0.4,
      0.3
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Krebs",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ]
  ],
  "Clippers|2010s": [
    [
      "Patrick Beverley",
      "PG",
      81,
      9,
      4,
      4,
      1.2,
      0.3
    ],
    [
      "Avery Bradley",
      "SG",
      80,
      12,
      3,
      2,
      1,
      0.3
    ],
    [
      "Jamal Crawford",
      "SG",
      83,
      16,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "J.J. Redick",
      "SG",
      82,
      14,
      2,
      2,
      0.6,
      0.1
    ],
    [
      "Austin Rivers",
      "PG",
      78,
      10,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Milos Teodosic",
      "PG",
      77,
      8,
      3,
      6,
      0.6,
      0.1
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Krebs",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ]
  ],
  "Clippers|2020s": [
    [
      "Terance Mann",
      "SF",
      79,
      10,
      5,
      3,
      0.7,
      0.4
    ],
    [
      "Amir Coffey",
      "SG",
      77,
      9,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Mason Plumlee",
      "C",
      78,
      8,
      7,
      3,
      0.5,
      0.5
    ],
    [
      "Nicolas Batum",
      "SF",
      79,
      8,
      5,
      3,
      0.7,
      0.5
    ],
    [
      "Daniel Theis",
      "C",
      78,
      8,
      6,
      1,
      0.4,
      0.8
    ],
    [
      "Bones Hyland",
      "PG",
      77,
      10,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "P.J. Tucker",
      "PF",
      78,
      7,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Flynn Robinson",
      "SG",
      80,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Grizzlies|2000s": [
    [
      "James Posey",
      "SF",
      79,
      10,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Bonzi Wells",
      "SG",
      80,
      14,
      5,
      3,
      1,
      0.4
    ],
    [
      "Eddie Gill",
      "PG",
      75,
      7,
      2,
      4,
      0.6,
      0.2
    ],
    [
      "Dahntay Jones",
      "SF",
      76,
      7,
      4,
      2,
      0.6,
      0.4
    ],
    [
      "Mike Conley",
      "PG",
      84,
      16,
      3,
      6,
      1,
      0.2
    ],
    [
      "Zach Randolph",
      "PF",
      84,
      16,
      10,
      2,
      0.6,
      0.3
    ],
    [
      "Tony Allen",
      "SG",
      81,
      10,
      4,
      3,
      1.4,
      0.4
    ],
    [
      "Courtney Lee",
      "SG",
      79,
      12,
      3,
      2,
      0.8,
      0.2
    ]
  ],
  "Grizzlies|2010s": [
    [
      "Courtney Lee",
      "SG",
      79,
      12,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Jeff Green",
      "SF",
      80,
      14,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Jaren Jackson Jr.",
      "PF",
      83,
      16,
      6,
      2,
      0.8,
      2
    ],
    [
      "Dillon Brooks",
      "SF",
      79,
      14,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Kyle Anderson",
      "SF",
      79,
      10,
      6,
      4,
      0.8,
      0.6
    ],
    [
      "Pau Gasol",
      "PF",
      86,
      18,
      9,
      3,
      0.6,
      2
    ],
    [
      "Jason Williams",
      "PG",
      80,
      12,
      3,
      7,
      1,
      0.2
    ],
    [
      "Stromile Swift",
      "PF",
      78,
      10,
      6,
      1,
      0.6,
      1
    ]
  ],
  "Grizzlies|2020s": [
    [
      "Santi Aldama",
      "PF",
      78,
      10,
      6,
      2,
      0.6,
      0.6
    ],
    [
      "Vince Williams Jr.",
      "SG",
      76,
      8,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Xavier Tillman",
      "PF",
      76,
      6,
      5,
      2,
      0.6,
      0.5
    ],
    [
      "Scotty Pippen Jr.",
      "PG",
      75,
      7,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Pau Gasol",
      "PF",
      86,
      18,
      9,
      3,
      0.6,
      2
    ],
    [
      "Jason Williams",
      "PG",
      80,
      12,
      3,
      7,
      1,
      0.2
    ],
    [
      "Stromile Swift",
      "PF",
      78,
      10,
      6,
      1,
      0.6,
      1
    ],
    [
      "James Posey",
      "SF",
      79,
      10,
      5,
      2,
      0.8,
      0.4
    ]
  ],
  "Hawks|1990s": [
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Lionel Simmons",
      "SF",
      77,
      12,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Matt Geiger",
      "C",
      76,
      8,
      7,
      1,
      0.3,
      1
    ],
    [
      "Josh Smith",
      "PF",
      83,
      14,
      8,
      3,
      1,
      1.5
    ],
    [
      "Al Horford",
      "PF",
      84,
      14,
      9,
      3,
      0.8,
      1
    ],
    [
      "Marvin Williams",
      "PF",
      79,
      12,
      6,
      2,
      0.6,
      0.5
    ],
    [
      "Zaza Pachulia",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.5
    ],
    [
      "Boris Diaw",
      "PF",
      80,
      12,
      6,
      4,
      0.6,
      0.4
    ]
  ],
  "Hawks|2000s": [
    [
      "Boris Diaw",
      "PF",
      80,
      12,
      6,
      4,
      0.6,
      0.4
    ],
    [
      "Mookie Blaylock",
      "PG",
      80,
      10,
      4,
      6,
      1.8,
      0.3
    ],
    [
      "Steve Smith",
      "SG",
      84,
      18,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Dikembe Mutombo",
      "C",
      86,
      12,
      12,
      1,
      0.5,
      3
    ],
    [
      "Christian Laettner",
      "PF",
      80,
      12,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "Alan Henderson",
      "PF",
      78,
      10,
      6,
      1,
      0.5,
      0.5
    ],
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Lionel Simmons",
      "SF",
      77,
      12,
      5,
      3,
      0.8,
      0.4
    ]
  ],
  "Hawks|2010s": [
    [
      "Kent Bazemore",
      "SF",
      79,
      12,
      5,
      3,
      1,
      0.6
    ],
    [
      "Dennis Schroder",
      "PG",
      81,
      14,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Taurean Prince",
      "SF",
      79,
      12,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "De'Andre Hunter",
      "SF",
      80,
      14,
      5,
      2,
      0.7,
      0.4
    ],
    [
      "Cam Reddish",
      "SF",
      77,
      10,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Evan Turner",
      "SF",
      78,
      10,
      5,
      4,
      0.8,
      0.4
    ],
    [
      "Dewayne Dedmon",
      "C",
      78,
      8,
      8,
      1,
      0.4,
      1
    ],
    [
      "Mookie Blaylock",
      "PG",
      83,
      12,
      4,
      7,
      2,
      0.3
    ]
  ],
  "Hawks|2020s": [
    [
      "Saddiq Bey",
      "SF",
      79,
      12,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Wesley Matthews",
      "SG",
      76,
      7,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Garrison Mathews",
      "SG",
      75,
      7,
      2,
      1,
      0.4,
      0.2
    ],
    [
      "Mookie Blaylock",
      "PG",
      83,
      12,
      4,
      7,
      2,
      0.3
    ],
    [
      "Steve Smith",
      "SG",
      84,
      18,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Dikembe Mutombo",
      "C",
      86,
      12,
      12,
      1,
      0.5,
      3
    ],
    [
      "Christian Laettner",
      "PF",
      80,
      12,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "Alan Henderson",
      "PF",
      78,
      10,
      6,
      1,
      0.5,
      0.5
    ]
  ],
  "Heat|1980s": [
    [
      "Ron Rothstein",
      "PG",
      75,
      8,
      2,
      5,
      0.6,
      0.1
    ],
    [
      "Jon Sundvold",
      "SG",
      77,
      12,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Billy Thompson",
      "SF",
      76,
      8,
      5,
      2,
      0.6,
      0.6
    ],
    [
      "Mark West",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      1
    ],
    [
      "Sylvester Gray",
      "PF",
      76,
      10,
      7,
      1,
      0.4,
      0.5
    ],
    [
      "Pat Cummings",
      "PF",
      78,
      12,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Steve Smith",
      "SG",
      83,
      16,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Keith Askins",
      "SF",
      76,
      8,
      4,
      2,
      0.8,
      0.4
    ]
  ],
  "Heat|1990s": [
    [
      "Steve Smith",
      "SG",
      83,
      16,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Keith Askins",
      "SF",
      76,
      8,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Brian Shaw",
      "PG",
      78,
      10,
      4,
      6,
      0.8,
      0.3
    ],
    [
      "Harold Miner",
      "SG",
      78,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Rony Seikaly",
      "C",
      82,
      16,
      10,
      2,
      0.6,
      1.5
    ],
    [
      "Grant Long",
      "PF",
      79,
      12,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Bimbo Coles",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Tony Smith",
      "PG",
      76,
      8,
      3,
      4,
      0.8,
      0.2
    ]
  ],
  "Heat|2000s": [
    [
      "Antoine Walker",
      "PF",
      81,
      14,
      8,
      3,
      0.8,
      0.5
    ],
    [
      "Jason Williams",
      "PG",
      79,
      10,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "James Posey",
      "SF",
      79,
      8,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Alonzo Mourning",
      "C",
      84,
      14,
      9,
      1,
      0.5,
      2.5
    ],
    [
      "Wayne Simien",
      "PF",
      75,
      8,
      5,
      1,
      0.4,
      0.3
    ],
    [
      "Kevin Edwards",
      "SG",
      80,
      14,
      4,
      4,
      1,
      0.3
    ],
    [
      "Grant Long",
      "PF",
      79,
      12,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Ron Rothstein",
      "PG",
      75,
      8,
      2,
      5,
      0.6,
      0.1
    ]
  ],
  "Heat|2010s": [
    [
      "Hassan Whiteside",
      "C",
      83,
      14,
      12,
      1,
      0.6,
      2.5
    ],
    [
      "Dion Waiters",
      "SG",
      80,
      14,
      3,
      4,
      0.8,
      0.3
    ],
    [
      "Justise Winslow",
      "SF",
      79,
      10,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Kelly Olynyk",
      "C",
      79,
      10,
      6,
      2,
      0.5,
      0.5
    ],
    [
      "Wayne Ellington",
      "SG",
      77,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "James Johnson",
      "PF",
      78,
      10,
      5,
      3,
      0.6,
      0.5
    ],
    [
      "Kevin Edwards",
      "SG",
      80,
      14,
      4,
      4,
      1,
      0.3
    ],
    [
      "Grant Long",
      "PF",
      79,
      12,
      7,
      2,
      0.6,
      0.4
    ]
  ],
  "Heat|2020s": [
    [
      "Duncan Robinson",
      "SG",
      80,
      12,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Caleb Martin",
      "SF",
      79,
      10,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Max Strus",
      "SG",
      79,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Gabe Vincent",
      "PG",
      79,
      10,
      3,
      3,
      0.7,
      0.2
    ],
    [
      "Kevin Love",
      "PF",
      81,
      12,
      8,
      3,
      0.5,
      0.3
    ],
    [
      "Haywood Highsmith",
      "SF",
      76,
      7,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Jaime Jaquez Jr.",
      "SF",
      78,
      10,
      5,
      3,
      0.7,
      0.4
    ],
    [
      "Nikola Jovic",
      "PF",
      76,
      8,
      4,
      2,
      0.5,
      0.3
    ]
  ],
  "Hornets|1990s": [
    [
      "Kendall Gill",
      "SG",
      81,
      14,
      5,
      4,
      1.2,
      0.5
    ],
    [
      "David Wingate",
      "SG",
      77,
      10,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Herb Williams",
      "C",
      78,
      8,
      6,
      2,
      0.5,
      1.2
    ],
    [
      "Tony Smith",
      "PG",
      76,
      8,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Rex Chapman",
      "SG",
      79,
      14,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Baron Davis",
      "PG",
      84,
      18,
      4,
      8,
      1.5,
      0.3
    ],
    [
      "Gerald Wallace",
      "SF",
      82,
      14,
      8,
      3,
      1.2,
      0.8
    ],
    [
      "Emeka Okafor",
      "C",
      81,
      12,
      10,
      1,
      0.6,
      1.5
    ]
  ],
  "Hornets|2000s": [
    [
      "Tyson Chandler",
      "C",
      82,
      10,
      10,
      1,
      0.5,
      1.5
    ],
    [
      "Matt Carroll",
      "SG",
      76,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Primoz Brezec",
      "C",
      75,
      8,
      5,
      1,
      0.3,
      0.6
    ],
    [
      "Larry Johnson",
      "PF",
      84,
      18,
      8,
      4,
      0.8,
      0.4
    ],
    [
      "Kendall Gill",
      "SG",
      81,
      14,
      5,
      4,
      1.2,
      0.5
    ],
    [
      "David Wingate",
      "SG",
      77,
      10,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Alonzo Mourning",
      "C",
      85,
      18,
      10,
      2,
      0.6,
      2.8
    ],
    [
      "Herb Williams",
      "C",
      78,
      8,
      6,
      2,
      0.5,
      1.2
    ]
  ],
  "Hornets|2010s": [
    [
      "Marvin Williams",
      "PF",
      79,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Michael Kidd-Gilchrist",
      "SF",
      78,
      10,
      6,
      2,
      0.8,
      0.6
    ],
    [
      "Jeremy Lamb",
      "SG",
      79,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Frank Kaminsky",
      "C",
      78,
      10,
      5,
      2,
      0.5,
      0.6
    ],
    [
      "Cody Zeller",
      "C",
      78,
      10,
      7,
      2,
      0.5,
      0.8
    ],
    [
      "Marco Belinelli",
      "SG",
      77,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Larry Johnson",
      "PF",
      84,
      18,
      8,
      4,
      0.8,
      0.4
    ],
    [
      "Kendall Gill",
      "SG",
      81,
      14,
      5,
      4,
      1.2,
      0.5
    ]
  ],
  "Hornets|2020s": [
    [
      "Grant Williams",
      "PF",
      78,
      8,
      5,
      2,
      0.5,
      0.5
    ],
    [
      "Nick Richards",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      1
    ],
    [
      "Larry Johnson",
      "PF",
      84,
      18,
      8,
      4,
      0.8,
      0.4
    ],
    [
      "Kendall Gill",
      "SG",
      81,
      14,
      5,
      4,
      1.2,
      0.5
    ],
    [
      "David Wingate",
      "SG",
      77,
      10,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Alonzo Mourning",
      "C",
      85,
      18,
      10,
      2,
      0.6,
      2.8
    ],
    [
      "Herb Williams",
      "C",
      78,
      8,
      6,
      2,
      0.5,
      1.2
    ],
    [
      "Tony Smith",
      "PG",
      76,
      8,
      3,
      4,
      0.8,
      0.2
    ]
  ],
  "Jazz|1990s": [
    [
      "Greg Foster",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      1
    ],
    [
      "Howard Eisley",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "David Benoit",
      "PF",
      77,
      10,
      6,
      1,
      0.5,
      0.4
    ],
    [
      "Adam Keefe",
      "PF",
      76,
      8,
      6,
      1,
      0.4,
      0.4
    ],
    [
      "Blue Edwards",
      "SF",
      77,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Mehmet Okur",
      "C",
      81,
      12,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Matt Harpring",
      "SF",
      78,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Raja Bell",
      "SG",
      80,
      12,
      4,
      2,
      0.8,
      0.3
    ]
  ],
  "Jazz|2000s": [
    [
      "Matt Harpring",
      "SF",
      78,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Raja Bell",
      "SG",
      80,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Gordan Giricek",
      "SG",
      78,
      12,
      4,
      3,
      0.6,
      0.2
    ],
    [
      "Kyle Korver",
      "SG",
      81,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "C.J. Miles",
      "SG",
      78,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Wesley Matthews",
      "SG",
      79,
      10,
      3,
      2,
      0.8,
      0.3
    ],
    [
      "Jeff Hornacek",
      "SG",
      84,
      14,
      4,
      4,
      0.8,
      0.2
    ],
    [
      "Mark Eaton",
      "C",
      80,
      6,
      9,
      1,
      0.3,
      3.5
    ]
  ],
  "Jazz|2010s": [
    [
      "Ricky Rubio",
      "PG",
      81,
      10,
      4,
      8,
      1.5,
      0.2
    ],
    [
      "Jae Crowder",
      "PF",
      79,
      10,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Royce O'Neale",
      "SF",
      78,
      8,
      5,
      3,
      0.7,
      0.4
    ],
    [
      "Dante Exum",
      "PG",
      77,
      8,
      3,
      4,
      0.6,
      0.3
    ],
    [
      "Alec Burks",
      "SG",
      78,
      12,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Ed Davis",
      "C",
      77,
      8,
      8,
      1,
      0.4,
      0.6
    ],
    [
      "Jeff Hornacek",
      "SG",
      84,
      14,
      4,
      4,
      0.8,
      0.2
    ],
    [
      "Mark Eaton",
      "C",
      80,
      6,
      9,
      1,
      0.3,
      3.5
    ]
  ],
  "Jazz|2020s": [
    [
      "Talen Horton-Tucker",
      "SG",
      77,
      10,
      3,
      3,
      0.6,
      0.3
    ],
    [
      "Malik Beasley",
      "SG",
      79,
      12,
      3,
      2,
      0.7,
      0.2
    ],
    [
      "Simone Fontecchio",
      "SF",
      76,
      9,
      4,
      2,
      0.5,
      0.3
    ],
    [
      "Jeff Hornacek",
      "SG",
      84,
      14,
      4,
      4,
      0.8,
      0.2
    ],
    [
      "Mark Eaton",
      "C",
      80,
      6,
      9,
      1,
      0.3,
      3.5
    ],
    [
      "Bryon Russell",
      "SF",
      79,
      10,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Greg Foster",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      1
    ],
    [
      "Howard Eisley",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ]
  ],
  "Kings|1990s": [
    [
      "Wayman Tisdale",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Spud Webb",
      "PG",
      77,
      10,
      2,
      5,
      0.8,
      0.1
    ],
    [
      "Mahmoud Abdul-Rauf",
      "PG",
      80,
      16,
      2,
      4,
      0.8,
      0.1
    ],
    [
      "Brian Grant",
      "PF",
      78,
      10,
      8,
      1,
      0.5,
      0.6
    ],
    [
      "Tyrone Corbin",
      "SF",
      77,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Walt Williams",
      "SF",
      78,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Brad Miller",
      "C",
      82,
      12,
      9,
      3,
      0.5,
      0.6
    ]
  ],
  "Kings|2000s": [
    [
      "Bobby Jackson",
      "PG",
      80,
      14,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Doug Christie",
      "SG",
      81,
      12,
      5,
      4,
      1.5,
      0.6
    ],
    [
      "Kenny Thomas",
      "PF",
      78,
      10,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Gerald Wallace",
      "SF",
      80,
      12,
      7,
      2,
      1,
      0.8
    ],
    [
      "Bonzi Wells",
      "SG",
      79,
      12,
      5,
      3,
      1,
      0.4
    ],
    [
      "John Salmons",
      "SF",
      78,
      12,
      4,
      3,
      0.6,
      0.3
    ],
    [
      "Mitch Richmond",
      "SG",
      88,
      22,
      4,
      4,
      1.2,
      0.3
    ],
    [
      "Wayman Tisdale",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.5
    ]
  ],
  "Kings|2010s": [
    [
      "Jason Thompson",
      "PF",
      77,
      10,
      7,
      1,
      0.4,
      0.5
    ],
    [
      "Carl Landry",
      "PF",
      79,
      12,
      6,
      1,
      0.4,
      0.3
    ],
    [
      "Ben McLemore",
      "SG",
      78,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Garrett Temple",
      "SG",
      76,
      8,
      3,
      3,
      0.6,
      0.3
    ],
    [
      "Nemanja Bjelica",
      "PF",
      78,
      10,
      6,
      3,
      0.5,
      0.4
    ],
    [
      "Mitch Richmond",
      "SG",
      88,
      22,
      4,
      4,
      1.2,
      0.3
    ],
    [
      "Wayman Tisdale",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ]
  ],
  "Kings|2020s": [
    [
      "Davion Mitchell",
      "PG",
      78,
      9,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Trey Lyles",
      "PF",
      77,
      9,
      5,
      2,
      0.4,
      0.3
    ],
    [
      "Alex Len",
      "C",
      76,
      7,
      6,
      1,
      0.3,
      0.8
    ],
    [
      "Chris Duarte",
      "SG",
      77,
      10,
      4,
      2,
      0.7,
      0.3
    ],
    [
      "Mitch Richmond",
      "SG",
      88,
      22,
      4,
      4,
      1.2,
      0.3
    ],
    [
      "Wayman Tisdale",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Spud Webb",
      "PG",
      77,
      10,
      2,
      5,
      0.8,
      0.1
    ]
  ],
  "Knicks|1960s": [
    [
      "Phil Jackson",
      "SF",
      78,
      7,
      4,
      2,
      0.6,
      0.4
    ],
    [
      "Howard Komives",
      "PG",
      79,
      12,
      3,
      5,
      1,
      0.2
    ],
    [
      "Mike Riordan",
      "SF",
      77,
      10,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Johnny Egan",
      "PG",
      76,
      8,
      2,
      4,
      0.8,
      0.1
    ],
    [
      "Bill Bradley",
      "SF",
      82,
      14,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Emmette Bryant",
      "SG",
      75,
      7,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Art Heyman",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Dave Stallworth",
      "PF",
      77,
      10,
      5,
      2,
      0.6,
      0.3
    ]
  ],
  "Knicks|1970s": [
    [
      "Phil Jackson",
      "SF",
      78,
      8,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Howard Komives",
      "PG",
      77,
      10,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Dave Stallworth",
      "PF",
      78,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Mike Riordan",
      "SF",
      77,
      10,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Emmette Bryant",
      "SG",
      76,
      8,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Dean Meminger",
      "PG",
      77,
      8,
      3,
      4,
      1,
      0.2
    ],
    [
      "Henry Bibby",
      "PG",
      76,
      9,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Jim Barnett",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Knicks|1980s": [
    [
      "Kenny Walker",
      "SF",
      80,
      12,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Trent Tucker",
      "SG",
      79,
      10,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Bill Cartwright",
      "C",
      82,
      14,
      8,
      2,
      0.5,
      1
    ],
    [
      "Louis Orr",
      "SF",
      77,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Charles Smith",
      "PF",
      80,
      12,
      6,
      2,
      0.6,
      1.2
    ],
    [
      "Rod Strickland",
      "PG",
      81,
      10,
      3,
      7,
      1,
      0.2
    ],
    [
      "Maurice Cheeks",
      "PG",
      82,
      10,
      3,
      6,
      1.2,
      0.3
    ],
    [
      "Johnny Newman",
      "SG",
      78,
      12,
      3,
      2,
      0.8,
      0.2
    ]
  ],
  "Knicks|1990s": [
    [
      "Doc Rivers",
      "PG",
      80,
      10,
      3,
      6,
      1.2,
      0.2
    ],
    [
      "Anthony Mason",
      "PF",
      83,
      10,
      8,
      4,
      0.8,
      0.3
    ],
    [
      "Hubert Davis",
      "SG",
      79,
      10,
      2,
      2,
      0.6,
      0.1
    ],
    [
      "Derek Harper",
      "PG",
      82,
      12,
      3,
      6,
      1.2,
      0.3
    ],
    [
      "Herb Williams",
      "C",
      78,
      8,
      6,
      2,
      0.5,
      1.2
    ],
    [
      "Greg Anthony",
      "PG",
      79,
      8,
      3,
      5,
      1,
      0.3
    ],
    [
      "Walter Berry",
      "PF",
      77,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Charlie Ward",
      "PG",
      78,
      8,
      3,
      5,
      1,
      0.2
    ]
  ],
  "Knicks|2000s": [
    [
      "David Lee",
      "PF",
      82,
      14,
      10,
      2,
      0.6,
      0.3
    ],
    [
      "Nate Robinson",
      "PG",
      80,
      12,
      2,
      4,
      0.8,
      0.2
    ],
    [
      "Wilson Chandler",
      "SF",
      80,
      12,
      6,
      2,
      0.8,
      0.6
    ],
    [
      "Quentin Richardson",
      "SG",
      79,
      12,
      4,
      2,
      0.8,
      0.3
    ],
    [
      "Eddy Curry",
      "C",
      78,
      14,
      6,
      1,
      0.3,
      0.5
    ],
    [
      "Jared Jeffries",
      "SF",
      76,
      6,
      5,
      2,
      0.6,
      0.8
    ],
    [
      "Renaldo Balkman",
      "SF",
      75,
      6,
      5,
      1,
      0.8,
      0.6
    ],
    [
      "Channing Frye",
      "PF",
      78,
      10,
      5,
      1,
      0.4,
      0.5
    ]
  ],
  "Knicks|2010s": [
    [
      "Immanuel Quickley",
      "PG",
      80,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Josh Hart",
      "SG",
      81,
      10,
      7,
      4,
      0.8,
      0.3
    ],
    [
      "Tim Hardaway Jr.",
      "SG",
      80,
      14,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Courtney Lee",
      "SG",
      78,
      10,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Taj Gibson",
      "PF",
      80,
      10,
      7,
      1,
      0.5,
      0.8
    ],
    [
      "Enes Kanter",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.3
    ],
    [
      "Mario Hezonja",
      "SF",
      76,
      8,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Reggie Bullock",
      "SF",
      77,
      9,
      4,
      2,
      0.5,
      0.2
    ]
  ],
  "Knicks|2020s": [
    [
      "Donte DiVincenzo",
      "SG",
      81,
      12,
      4,
      3,
      1,
      0.3
    ],
    [
      "Josh Hart",
      "SG",
      83,
      10,
      8,
      4,
      0.8,
      0.3
    ],
    [
      "Isaiah Hartenstein",
      "C",
      82,
      8,
      9,
      3,
      0.6,
      1
    ],
    [
      "Precious Achiuwa",
      "PF",
      79,
      10,
      7,
      1,
      0.6,
      0.6
    ],
    [
      "Miles McBride",
      "PG",
      78,
      9,
      2,
      3,
      0.8,
      0.2
    ],
    [
      "Bojan Bogdanovic",
      "SF",
      80,
      14,
      4,
      2,
      0.5,
      0.2
    ],
    [
      "Alec Burks",
      "SG",
      78,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Phil Jackson",
      "SF",
      78,
      7,
      4,
      2,
      0.6,
      0.4
    ]
  ],
  "Lakers|1960s": [
    [
      "Darrall Imhoff",
      "C",
      79,
      10,
      8,
      1,
      0.4,
      1
    ],
    [
      "Leroy Ellis",
      "PF",
      78,
      9,
      7,
      1,
      0.4,
      0.5
    ],
    [
      "Mel Counts",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "Flynn Robinson",
      "SG",
      78,
      12,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Tom Hawkins",
      "SF",
      75,
      8,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Dick Garrett",
      "PG",
      78,
      10,
      3,
      4,
      1,
      0.2
    ],
    [
      "Keith Erickson",
      "SF",
      79,
      10,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Walt Hazzard",
      "PG",
      80,
      12,
      3,
      5,
      0.8,
      0.2
    ]
  ],
  "Lakers|1970s": [
    [
      "Cazzie Russell",
      "SG",
      82,
      14,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Don Ford",
      "PF",
      78,
      10,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Kermit Washington",
      "PF",
      79,
      10,
      9,
      2,
      0.6,
      0.8
    ],
    [
      "Brian Taylor",
      "PG",
      77,
      10,
      3,
      4,
      1,
      0.2
    ],
    [
      "Mitch Kupchak",
      "PF",
      78,
      10,
      6,
      2,
      0.5,
      0.5
    ],
    [
      "Don Chaney",
      "SG",
      79,
      11,
      4,
      3,
      1,
      0.4
    ],
    [
      "Truck Robinson",
      "PF",
      81,
      14,
      10,
      3,
      0.6,
      0.5
    ],
    [
      "Darrall Imhoff",
      "C",
      79,
      10,
      8,
      1,
      0.4,
      1
    ]
  ],
  "Lakers|1980s": [
    [
      "Kurt Rambis",
      "PF",
      78,
      6,
      7,
      1,
      0.6,
      0.4
    ],
    [
      "Mychal Thompson",
      "C",
      82,
      14,
      8,
      2,
      0.5,
      1
    ],
    [
      "Orlando Woolridge",
      "SF",
      83,
      16,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Maurice Lucas",
      "PF",
      81,
      12,
      8,
      2,
      0.6,
      0.6
    ],
    [
      "Wes Matthews",
      "PG",
      77,
      8,
      2,
      5,
      0.8,
      0.2
    ],
    [
      "Mike McGee",
      "SG",
      79,
      12,
      3,
      2,
      0.8,
      0.3
    ],
    [
      "Billy Thompson",
      "SF",
      76,
      8,
      5,
      2,
      0.6,
      0.6
    ],
    [
      "Mark McNamara",
      "C",
      75,
      6,
      6,
      1,
      0.3,
      0.6
    ]
  ],
  "Lakers|1990s": [
    [
      "Derek Fisher",
      "PG",
      80,
      8,
      2,
      3,
      0.8,
      0.1
    ],
    [
      "Rick Fox",
      "SF",
      81,
      10,
      5,
      3,
      0.8,
      0.5
    ],
    [
      "Elden Campbell",
      "C",
      82,
      12,
      8,
      1,
      0.6,
      1.5
    ],
    [
      "Anthony Peeler",
      "SG",
      79,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Sedale Threatt",
      "PG",
      80,
      10,
      2,
      5,
      1,
      0.2
    ],
    [
      "Travis Knight",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      1
    ],
    [
      "Lindsey Hunter",
      "PG",
      78,
      9,
      2,
      4,
      1,
      0.2
    ],
    [
      "Darrall Imhoff",
      "C",
      79,
      10,
      8,
      1,
      0.4,
      1
    ]
  ],
  "Lakers|2000s": [
    [
      "Ron Artest",
      "SF",
      84,
      12,
      5,
      3,
      1.2,
      0.6
    ],
    [
      "Luke Walton",
      "SF",
      78,
      8,
      5,
      4,
      0.6,
      0.3
    ],
    [
      "Sasha Vujacic",
      "SG",
      77,
      8,
      2,
      2,
      0.6,
      0.2
    ],
    [
      "Smush Parker",
      "PG",
      78,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Kwame Brown",
      "C",
      76,
      8,
      6,
      1,
      0.4,
      0.8
    ],
    [
      "Brian Cook",
      "PF",
      75,
      8,
      4,
      1,
      0.4,
      0.3
    ],
    [
      "Devean George",
      "SF",
      77,
      7,
      4,
      2,
      0.6,
      0.5
    ],
    [
      "Trevor Ariza",
      "SF",
      79,
      10,
      5,
      2,
      1,
      0.6
    ]
  ],
  "Lakers|2010s": [
    [
      "Kentavious Caldwell-Pope",
      "SG",
      82,
      12,
      3,
      2,
      1,
      0.3
    ],
    [
      "Rajon Rondo",
      "PG",
      83,
      8,
      5,
      8,
      1.2,
      0.3
    ],
    [
      "Danny Green",
      "SG",
      81,
      9,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Alex Caruso",
      "SG",
      80,
      7,
      4,
      3,
      1,
      0.4
    ],
    [
      "Jordan Clarkson",
      "SG",
      81,
      14,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Nick Young",
      "SG",
      78,
      12,
      2,
      1,
      0.6,
      0.2
    ],
    [
      "Wesley Matthews",
      "SG",
      79,
      8,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "JaVale McGee",
      "C",
      78,
      8,
      6,
      1,
      0.4,
      1.5
    ]
  ],
  "Lakers|2020s": [
    [
      "Jarred Vanderbilt",
      "PF",
      79,
      6,
      7,
      1,
      0.8,
      0.4
    ],
    [
      "Gabe Vincent",
      "PG",
      78,
      8,
      2,
      3,
      0.6,
      0.2
    ],
    [
      "Christian Wood",
      "PF",
      82,
      14,
      7,
      2,
      0.5,
      0.8
    ],
    [
      "Taurean Prince",
      "SF",
      79,
      9,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Cam Reddish",
      "SF",
      77,
      8,
      3,
      1,
      0.8,
      0.3
    ],
    [
      "Jaxson Hayes",
      "C",
      76,
      6,
      5,
      1,
      0.4,
      0.8
    ],
    [
      "Max Christie",
      "SG",
      76,
      7,
      3,
      1,
      0.5,
      0.2
    ],
    [
      "Dorian Finney-Smith",
      "PF",
      78,
      8,
      5,
      2,
      0.6,
      0.4
    ]
  ],
  "Magic|1990s": [
    [
      "Donald Royal",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Sam Vincent",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Jeff Turner",
      "PF",
      76,
      8,
      5,
      2,
      0.4,
      0.4
    ],
    [
      "Anthony Bowie",
      "SG",
      75,
      8,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Hedo Turkoglu",
      "SF",
      83,
      14,
      5,
      4,
      0.8,
      0.5
    ],
    [
      "Grant Hill",
      "SF",
      84,
      16,
      6,
      4,
      0.8,
      0.5
    ],
    [
      "Jameer Nelson",
      "PG",
      81,
      12,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Rashard Lewis",
      "PF",
      84,
      16,
      5,
      2,
      0.8,
      0.4
    ]
  ],
  "Magic|2000s": [
    [
      "Courtney Lee",
      "SG",
      78,
      10,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Marcin Gortat",
      "C",
      79,
      10,
      8,
      1,
      0.4,
      1
    ],
    [
      "Matt Barnes",
      "SF",
      78,
      8,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Keyon Dooling",
      "PG",
      77,
      10,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "Nick Anderson",
      "SG",
      82,
      16,
      5,
      3,
      1,
      0.5
    ],
    [
      "Dennis Scott",
      "SF",
      80,
      14,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Brian Shaw",
      "PG",
      78,
      10,
      4,
      6,
      0.8,
      0.3
    ],
    [
      "Horace Grant",
      "PF",
      83,
      12,
      9,
      2,
      0.8,
      1
    ]
  ],
  "Magic|2010s": [
    [
      "Terrence Ross",
      "SG",
      80,
      14,
      4,
      2,
      0.7,
      0.3
    ],
    [
      "D.J. Augustin",
      "PG",
      79,
      12,
      3,
      5,
      0.6,
      0.2
    ],
    [
      "Jonathan Isaac",
      "PF",
      80,
      12,
      7,
      2,
      0.8,
      1.2
    ],
    [
      "Mo Bamba",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      1.5
    ],
    [
      "Markelle Fultz",
      "PG",
      79,
      12,
      4,
      5,
      1,
      0.4
    ],
    [
      "Nick Anderson",
      "SG",
      82,
      16,
      5,
      3,
      1,
      0.5
    ],
    [
      "Dennis Scott",
      "SF",
      80,
      14,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Brian Shaw",
      "PG",
      78,
      10,
      4,
      6,
      0.8,
      0.3
    ]
  ],
  "Magic|2020s": [
    [
      "Gary Harris",
      "SG",
      78,
      10,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Moritz Wagner",
      "C",
      77,
      10,
      5,
      2,
      0.4,
      0.4
    ],
    [
      "Jonathan Isaac",
      "PF",
      79,
      10,
      7,
      2,
      0.8,
      1
    ],
    [
      "Nick Anderson",
      "SG",
      82,
      16,
      5,
      3,
      1,
      0.5
    ],
    [
      "Dennis Scott",
      "SF",
      80,
      14,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Brian Shaw",
      "PG",
      78,
      10,
      4,
      6,
      0.8,
      0.3
    ],
    [
      "Horace Grant",
      "PF",
      83,
      12,
      9,
      2,
      0.8,
      1
    ],
    [
      "Donald Royal",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ]
  ],
  "Mavericks|1980s": [
    [
      "Brad Davis",
      "PG",
      79,
      10,
      3,
      7,
      0.8,
      0.2
    ],
    [
      "Detlef Schrempf",
      "SF",
      82,
      14,
      6,
      4,
      0.8,
      0.4
    ],
    [
      "Roy Tarpley",
      "PF",
      80,
      14,
      8,
      2,
      0.8,
      1
    ],
    [
      "Uwe Blab",
      "C",
      75,
      6,
      5,
      1,
      0.3,
      0.8
    ],
    [
      "James Donaldson",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      1.2
    ],
    [
      "Bill Wennington",
      "C",
      76,
      6,
      5,
      1,
      0.3,
      0.5
    ],
    [
      "Jim Jackson",
      "SG",
      83,
      18,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "George McCloud",
      "SG",
      78,
      12,
      4,
      2,
      0.6,
      0.3
    ]
  ],
  "Mavericks|1990s": [
    [
      "Derek Harper",
      "PG",
      82,
      14,
      4,
      7,
      1.2,
      0.3
    ],
    [
      "Sam Perkins",
      "PF",
      80,
      12,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "George McCloud",
      "SG",
      78,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Robert Traylor",
      "PF",
      77,
      10,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Hubert Davis",
      "SG",
      79,
      12,
      3,
      2,
      0.6,
      0.1
    ],
    [
      "Shawn Bradley",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      2.5
    ],
    [
      "Ed O'Bannon",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Brad Davis",
      "PG",
      79,
      10,
      3,
      7,
      0.8,
      0.2
    ]
  ],
  "Mavericks|2000s": [
    [
      "Jerry Stackhouse",
      "SG",
      82,
      16,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Antoine Walker",
      "PF",
      81,
      14,
      8,
      3,
      0.8,
      0.5
    ],
    [
      "Erick Dampier",
      "C",
      79,
      8,
      9,
      1,
      0.4,
      1.5
    ],
    [
      "DeSagana Diop",
      "C",
      76,
      4,
      7,
      1,
      0.3,
      1.2
    ],
    [
      "Brad Davis",
      "PG",
      79,
      10,
      3,
      7,
      0.8,
      0.2
    ],
    [
      "Derek Harper",
      "PG",
      82,
      14,
      4,
      7,
      1.2,
      0.3
    ],
    [
      "Sam Perkins",
      "PF",
      81,
      14,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "Detlef Schrempf",
      "SF",
      82,
      14,
      6,
      4,
      0.8,
      0.4
    ]
  ],
  "Mavericks|2010s": [
    [
      "Seth Curry",
      "SG",
      80,
      12,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Dorian Finney-Smith",
      "SF",
      79,
      10,
      6,
      2,
      0.7,
      0.5
    ],
    [
      "Tim Hardaway Jr.",
      "SG",
      81,
      14,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Dwight Powell",
      "C",
      79,
      10,
      7,
      2,
      0.5,
      0.6
    ],
    [
      "Harrison Barnes",
      "SF",
      81,
      14,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Delon Wright",
      "PG",
      79,
      10,
      4,
      4,
      0.9,
      0.4
    ],
    [
      "Reggie Bullock",
      "SF",
      78,
      10,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Maxi Kleber",
      "PF",
      78,
      8,
      6,
      2,
      0.5,
      0.8
    ]
  ],
  "Mavericks|2020s": [
    [
      "Dorian Finney-Smith",
      "SF",
      80,
      10,
      6,
      2,
      0.7,
      0.5
    ],
    [
      "Reggie Bullock",
      "SF",
      78,
      10,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Maxi Kleber",
      "PF",
      79,
      8,
      6,
      2,
      0.5,
      0.8
    ],
    [
      "Grant Williams",
      "PF",
      78,
      8,
      5,
      2,
      0.5,
      0.5
    ],
    [
      "Derrick Jones Jr.",
      "SF",
      78,
      10,
      4,
      1,
      0.7,
      0.6
    ],
    [
      "Dante Exum",
      "PG",
      77,
      8,
      3,
      4,
      0.6,
      0.3
    ],
    [
      "Olivier-Maxence Prosper",
      "SF",
      75,
      7,
      4,
      1,
      0.5,
      0.3
    ],
    [
      "Brad Davis",
      "PG",
      79,
      10,
      3,
      7,
      0.8,
      0.2
    ]
  ],
  "Nets|1970s": [
    [
      "Tim Bassett",
      "PF",
      76,
      10,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Bubbles Hawkins",
      "SG",
      77,
      12,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Kim Hughes",
      "C",
      75,
      8,
      7,
      1,
      0.3,
      0.8
    ],
    [
      "Al Skinner",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "John Q. Trapp",
      "SF",
      77,
      12,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Bill Melchionni",
      "PG",
      78,
      10,
      3,
      6,
      0.8,
      0.1
    ],
    [
      "Mike Gminski",
      "C",
      81,
      14,
      8,
      2,
      0.5,
      0.8
    ],
    [
      "Otis Birdsong",
      "SG",
      80,
      14,
      4,
      4,
      0.8,
      0.3
    ]
  ],
  "Nets|1980s": [
    [
      "Mike O'Koren",
      "SF",
      78,
      12,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "Orlando Woolridge",
      "SF",
      82,
      16,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Sam Bowie",
      "C",
      77,
      10,
      8,
      2,
      0.4,
      1.2
    ],
    [
      "Micheal Ray Richardson",
      "PG",
      82,
      14,
      5,
      7,
      1.5,
      0.3
    ],
    [
      "Kelvin Ransey",
      "PG",
      77,
      12,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Billy Paultz",
      "C",
      80,
      14,
      10,
      2,
      0.5,
      1.2
    ],
    [
      "John Williamson",
      "SG",
      81,
      16,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Tim Bassett",
      "PF",
      76,
      10,
      7,
      2,
      0.5,
      0.5
    ]
  ],
  "Nets|1990s": [
    [
      "Chris Morris",
      "SF",
      78,
      12,
      5,
      3,
      0.8,
      0.5
    ],
    [
      "Rafael Addison",
      "SG",
      77,
      12,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Terry Mills",
      "PF",
      79,
      12,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Ed O'Bannon",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Sam Cassell",
      "PG",
      80,
      12,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Shawn Bradley",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      2.5
    ],
    [
      "Billy Paultz",
      "C",
      80,
      14,
      10,
      2,
      0.5,
      1.2
    ],
    [
      "John Williamson",
      "SG",
      81,
      16,
      4,
      3,
      0.8,
      0.3
    ]
  ],
  "Nets|2000s": [
    [
      "Kerry Kittles",
      "SG",
      80,
      14,
      4,
      3,
      1,
      0.3
    ],
    [
      "Keith Van Horn",
      "PF",
      81,
      14,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Devin Harris",
      "PG",
      81,
      14,
      3,
      6,
      1,
      0.3
    ],
    [
      "Jarrett Jack",
      "PG",
      79,
      12,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "Josh Boone",
      "PF",
      75,
      6,
      6,
      1,
      0.4,
      0.6
    ],
    [
      "Bostjan Nachbar",
      "SF",
      77,
      10,
      4,
      2,
      0.5,
      0.3
    ],
    [
      "Billy Paultz",
      "C",
      80,
      14,
      10,
      2,
      0.5,
      1.2
    ],
    [
      "John Williamson",
      "SG",
      81,
      16,
      4,
      3,
      0.8,
      0.3
    ]
  ],
  "Nets|2010s": [
    [
      "Spencer Dinwiddie",
      "PG",
      83,
      16,
      4,
      7,
      0.8,
      0.3
    ],
    [
      "Caris LeVert",
      "SG",
      83,
      16,
      4,
      4,
      0.9,
      0.5
    ],
    [
      "Allen Crabbe",
      "SG",
      79,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "D'Angelo Russell",
      "PG",
      84,
      18,
      4,
      6,
      1,
      0.3
    ],
    [
      "Jarrett Allen",
      "C",
      83,
      12,
      10,
      2,
      0.6,
      1.5
    ],
    [
      "Joe Harris",
      "SG",
      81,
      14,
      4,
      2,
      0.5,
      0.2
    ],
    [
      "DeMarre Carroll",
      "SF",
      78,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Rodions Kurucs",
      "SF",
      75,
      8,
      4,
      2,
      0.6,
      0.3
    ]
  ],
  "Nets|2020s": [
    [
      "Nic Claxton",
      "C",
      83,
      12,
      9,
      2,
      0.8,
      2
    ],
    [
      "Dennis Schroder",
      "PG",
      81,
      14,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Dorian Finney-Smith",
      "PF",
      79,
      9,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Day'Ron Sharpe",
      "C",
      77,
      8,
      7,
      2,
      0.5,
      0.8
    ],
    [
      "Cameron Johnson",
      "SF",
      80,
      12,
      5,
      2,
      0.5,
      0.3
    ],
    [
      "Royce O'Neale",
      "SF",
      78,
      8,
      5,
      3,
      0.7,
      0.4
    ],
    [
      "Lonnie Walker IV",
      "SG",
      77,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Billy Paultz",
      "C",
      80,
      14,
      10,
      2,
      0.5,
      1.2
    ]
  ],
  "Nuggets|1970s": [
    [
      "Ralph Simpson",
      "SG",
      81,
      14,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Claude Terry",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Gus Gerard",
      "SF",
      78,
      12,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Tom Burleson",
      "C",
      77,
      10,
      8,
      2,
      0.4,
      1
    ],
    [
      "Monte Towe",
      "PG",
      76,
      8,
      2,
      4,
      0.8,
      0.1
    ],
    [
      "John Q. Trapp",
      "SF",
      77,
      12,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Billy Knight",
      "SF",
      82,
      18,
      6,
      3,
      0.8,
      0.4
    ],
    [
      "TR Dunn",
      "SG",
      78,
      10,
      4,
      3,
      1.2,
      0.3
    ]
  ],
  "Nuggets|1980s": [
    [
      "TR Dunn",
      "SG",
      78,
      10,
      4,
      3,
      1.2,
      0.3
    ],
    [
      "Wayne Cooper",
      "C",
      79,
      10,
      8,
      2,
      0.5,
      1.2
    ],
    [
      "Calvin Natt",
      "SF",
      81,
      14,
      6,
      2,
      0.8,
      0.4
    ],
    [
      "Mike Evans",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Lafayette Lever",
      "PG",
      83,
      14,
      6,
      7,
      1.8,
      0.3
    ],
    [
      "Bill Hanzlik",
      "SF",
      77,
      10,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Orlando Woolridge",
      "SF",
      82,
      16,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Bobby Jones",
      "SF",
      84,
      12,
      6,
      3,
      1.2,
      1.5
    ]
  ],
  "Nuggets|1990s": [
    [
      "Chris Jackson",
      "PG",
      80,
      14,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Ervin Johnson",
      "C",
      77,
      6,
      8,
      1,
      0.4,
      1
    ],
    [
      "Tony Battie",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      1
    ],
    [
      "Greg Anthony",
      "PG",
      79,
      10,
      4,
      6,
      1,
      0.3
    ],
    [
      "Dale Ellis",
      "SG",
      82,
      16,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Voshon Lenard",
      "SG",
      78,
      12,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Bobby Jones",
      "SF",
      84,
      12,
      6,
      3,
      1.2,
      1.5
    ],
    [
      "Ralph Simpson",
      "SG",
      81,
      14,
      4,
      4,
      0.8,
      0.3
    ]
  ],
  "Nuggets|2000s": [
    [
      "Nene",
      "PF",
      83,
      14,
      8,
      2,
      0.8,
      0.8
    ],
    [
      "Kenyon Martin",
      "PF",
      83,
      14,
      8,
      2,
      0.8,
      1
    ],
    [
      "Chris Andersen",
      "C",
      78,
      8,
      7,
      1,
      0.5,
      1.5
    ],
    [
      "Earl Boykins",
      "PG",
      77,
      12,
      2,
      4,
      0.6,
      0.1
    ],
    [
      "Eduardo Najera",
      "PF",
      76,
      8,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "George Karl",
      "PG",
      75,
      8,
      3,
      5,
      0.6,
      0.2
    ],
    [
      "Yakhouba Diawara",
      "SG",
      75,
      7,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Bobby Jones",
      "SF",
      84,
      12,
      6,
      3,
      1.2,
      1.5
    ]
  ],
  "Nuggets|2010s": [
    [
      "Wilson Chandler",
      "SF",
      81,
      14,
      6,
      2,
      0.8,
      0.5
    ],
    [
      "Will Barton",
      "SG",
      80,
      14,
      5,
      4,
      0.8,
      0.4
    ],
    [
      "Mason Plumlee",
      "C",
      79,
      10,
      8,
      3,
      0.5,
      0.6
    ],
    [
      "Trey Lyles",
      "PF",
      77,
      10,
      5,
      2,
      0.5,
      0.4
    ],
    [
      "Monte Morris",
      "PG",
      80,
      12,
      3,
      5,
      0.7,
      0.2
    ],
    [
      "Jerami Grant",
      "PF",
      81,
      12,
      5,
      2,
      0.7,
      0.8
    ],
    [
      "Torrey Craig",
      "SF",
      77,
      8,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Bobby Jones",
      "SF",
      84,
      12,
      6,
      3,
      1.2,
      1.5
    ]
  ],
  "Nuggets|2020s": [
    [
      "Kentavious Caldwell-Pope",
      "SG",
      81,
      11,
      3,
      2,
      0.9,
      0.3
    ],
    [
      "Christian Braun",
      "SG",
      79,
      10,
      4,
      2,
      0.7,
      0.3
    ],
    [
      "Peyton Watson",
      "SF",
      76,
      8,
      5,
      2,
      0.6,
      0.6
    ],
    [
      "Reggie Jackson",
      "PG",
      79,
      12,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "Bruce Brown",
      "SG",
      80,
      10,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Zeke Nnaji",
      "PF",
      76,
      8,
      5,
      1,
      0.4,
      0.5
    ],
    [
      "Justin Holiday",
      "SF",
      76,
      7,
      3,
      2,
      0.6,
      0.3
    ],
    [
      "Bobby Jones",
      "SF",
      84,
      12,
      6,
      3,
      1.2,
      1.5
    ]
  ],
  "Pacers|1990s": [
    [
      "Derrick McKey",
      "SF",
      81,
      12,
      6,
      3,
      0.8,
      0.6
    ],
    [
      "Sam Perkins",
      "PF",
      80,
      12,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "Derrick Phelps",
      "PG",
      76,
      8,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Haywood Workman",
      "PG",
      77,
      8,
      4,
      6,
      0.8,
      0.2
    ],
    [
      "Jermaine O'Neal",
      "PF",
      86,
      18,
      10,
      2,
      0.6,
      2.5
    ],
    [
      "Stephen Jackson",
      "SF",
      83,
      16,
      5,
      4,
      1,
      0.5
    ],
    [
      "Jamaal Tinsley",
      "PG",
      79,
      10,
      4,
      7,
      1.2,
      0.4
    ],
    [
      "Danny Granger",
      "SF",
      84,
      18,
      5,
      3,
      0.8,
      0.5
    ]
  ],
  "Pacers|2000s": [
    [
      "Mike Dunleavy",
      "SF",
      80,
      12,
      5,
      3,
      0.6,
      0.3
    ],
    [
      "Troy Murphy",
      "PF",
      81,
      14,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Jeff Foster",
      "C",
      77,
      6,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Marquis Daniels",
      "SG",
      78,
      12,
      4,
      4,
      0.8,
      0.4
    ],
    [
      "Detlef Schrempf",
      "SF",
      84,
      16,
      6,
      4,
      0.8,
      0.4
    ],
    [
      "Derrick McKey",
      "SF",
      81,
      12,
      6,
      3,
      0.8,
      0.6
    ],
    [
      "Antonio Davis",
      "PF",
      80,
      12,
      8,
      2,
      0.6,
      1
    ],
    [
      "Mark Jackson",
      "PG",
      82,
      12,
      4,
      8,
      1,
      0.2
    ]
  ],
  "Pacers|2010s": [
    [
      "C.J. Miles",
      "SG",
      79,
      12,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Thaddeus Young",
      "PF",
      82,
      14,
      6,
      2,
      1,
      0.5
    ],
    [
      "Bojan Bogdanovic",
      "SF",
      81,
      16,
      4,
      2,
      0.5,
      0.2
    ],
    [
      "Domantas Sabonis",
      "PF",
      84,
      14,
      10,
      4,
      0.6,
      0.4
    ],
    [
      "Tyreke Evans",
      "SG",
      80,
      14,
      5,
      4,
      0.8,
      0.3
    ],
    [
      "Detlef Schrempf",
      "SF",
      84,
      16,
      6,
      4,
      0.8,
      0.4
    ],
    [
      "Derrick McKey",
      "SF",
      81,
      12,
      6,
      3,
      0.8,
      0.6
    ],
    [
      "Antonio Davis",
      "PF",
      80,
      12,
      8,
      2,
      0.6,
      1
    ]
  ],
  "Pacers|2020s": [
    [
      "Buddy Hield",
      "SG",
      81,
      14,
      4,
      2,
      0.7,
      0.2
    ],
    [
      "T.J. McConnell",
      "PG",
      80,
      10,
      4,
      6,
      1,
      0.2
    ],
    [
      "Andrew Nembhard",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Isaiah Jackson",
      "C",
      77,
      8,
      7,
      1,
      0.5,
      1.2
    ],
    [
      "Detlef Schrempf",
      "SF",
      84,
      16,
      6,
      4,
      0.8,
      0.4
    ],
    [
      "Derrick McKey",
      "SF",
      81,
      12,
      6,
      3,
      0.8,
      0.6
    ],
    [
      "Antonio Davis",
      "PF",
      80,
      12,
      8,
      2,
      0.6,
      1
    ],
    [
      "Mark Jackson",
      "PG",
      82,
      12,
      4,
      8,
      1,
      0.2
    ]
  ],
  "Pelicans|2000s": [
    [
      "Rasheed Wright",
      "PG",
      75,
      8,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "Desmond Mason",
      "SF",
      79,
      12,
      6,
      2,
      0.8,
      0.8
    ],
    [
      "Marcus Thornton",
      "SG",
      80,
      14,
      3,
      2,
      0.7,
      0.2
    ],
    [
      "James Posey",
      "SF",
      78,
      8,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Jrue Holiday",
      "PG",
      86,
      16,
      4,
      7,
      1.5,
      0.5
    ],
    [
      "Eric Gordon",
      "SG",
      82,
      16,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Ryan Anderson",
      "PF",
      81,
      14,
      6,
      1,
      0.4,
      0.3
    ],
    [
      "E'Twaun Moore",
      "SG",
      77,
      10,
      3,
      2,
      0.6,
      0.2
    ]
  ],
  "Pelicans|2010s": [
    [
      "Eric Gordon",
      "SG",
      82,
      16,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Ryan Anderson",
      "PF",
      81,
      14,
      6,
      1,
      0.4,
      0.3
    ],
    [
      "E'Twaun Moore",
      "SG",
      77,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Darius Miller",
      "SF",
      76,
      8,
      4,
      2,
      0.5,
      0.3
    ],
    [
      "Solomon Hill",
      "SF",
      76,
      7,
      4,
      2,
      0.5,
      0.3
    ],
    [
      "Nikola Mirotic",
      "PF",
      80,
      12,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Jahlil Okafor",
      "C",
      78,
      12,
      7,
      2,
      0.4,
      0.6
    ],
    [
      "David West",
      "PF",
      84,
      16,
      8,
      3,
      0.6,
      0.8
    ]
  ],
  "Pelicans|2020s": [
    [
      "Larry Nance Jr.",
      "PF",
      79,
      10,
      6,
      2,
      0.6,
      0.5
    ],
    [
      "Jose Alvarado",
      "PG",
      77,
      9,
      3,
      4,
      1,
      0.3
    ],
    [
      "Jordan Hawkins",
      "SG",
      76,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "David West",
      "PF",
      84,
      16,
      8,
      3,
      0.6,
      0.8
    ],
    [
      "Chris Paul",
      "PG",
      90,
      18,
      5,
      10,
      2,
      0.2
    ],
    [
      "Tyson Chandler",
      "C",
      83,
      10,
      10,
      1,
      0.5,
      1.5
    ],
    [
      "Peja Stojakovic",
      "SF",
      84,
      16,
      5,
      2,
      0.6,
      0.2
    ],
    [
      "Rasheed Wright",
      "PG",
      75,
      8,
      3,
      4,
      0.6,
      0.2
    ]
  ],
  "Pistons|1980s": [
    [
      "Kelly Tripucka",
      "SG",
      82,
      18,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "John Long",
      "SG",
      79,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "James Edwards",
      "C",
      78,
      10,
      6,
      1,
      0.4,
      0.8
    ],
    [
      "Rick Mahorn",
      "PF",
      80,
      10,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Otis Smith",
      "SG",
      77,
      12,
      4,
      3,
      0.8,
      0.4
    ],
    [
      "Fennis Dembo",
      "SG",
      75,
      8,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Allan Houston",
      "SG",
      83,
      16,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Lindsey Hunter",
      "PG",
      79,
      12,
      3,
      5,
      1,
      0.3
    ]
  ],
  "Pistons|1990s": [
    [
      "Allan Houston",
      "SG",
      83,
      16,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Lindsey Hunter",
      "PG",
      79,
      12,
      3,
      5,
      1,
      0.3
    ],
    [
      "Terry Mills",
      "PF",
      80,
      12,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Don Reid",
      "PF",
      76,
      8,
      5,
      1,
      0.4,
      0.6
    ],
    [
      "Jerome Williams",
      "PF",
      78,
      8,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "Bison Dele",
      "C",
      77,
      10,
      7,
      1,
      0.4,
      1
    ],
    [
      "Atis Roundtree",
      "PF",
      75,
      8,
      6,
      1,
      0.4,
      0.4
    ],
    [
      "Mark Macon",
      "SG",
      76,
      10,
      3,
      2,
      0.8,
      0.3
    ]
  ],
  "Pistons|2000s": [
    [
      "Rip Hamilton",
      "SG",
      84,
      16,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Corliss Williamson",
      "PF",
      79,
      12,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Lindsey Hunter",
      "PG",
      77,
      8,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Aaron McKie",
      "SG",
      78,
      10,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Darko Milicic",
      "C",
      76,
      8,
      5,
      1,
      0.3,
      1.2
    ],
    [
      "Kelly Tripucka",
      "SG",
      82,
      18,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "John Long",
      "SG",
      79,
      14,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Bill Laimbeer",
      "C",
      82,
      14,
      9,
      2,
      0.5,
      0.5
    ]
  ],
  "Pistons|2010s": [
    [
      "Ish Smith",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Ersan Ilyasova",
      "PF",
      79,
      12,
      6,
      1,
      0.5,
      0.4
    ],
    [
      "Langston Galloway",
      "PG",
      77,
      10,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Jon Leuer",
      "PF",
      76,
      8,
      5,
      1,
      0.4,
      0.3
    ],
    [
      "Bruce Brown",
      "SG",
      79,
      10,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Luke Kennard",
      "SG",
      78,
      10,
      3,
      3,
      0.5,
      0.2
    ],
    [
      "Kelly Tripucka",
      "SG",
      82,
      18,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "John Long",
      "SG",
      79,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Pistons|2020s": [
    [
      "Saddiq Bey",
      "SF",
      80,
      14,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Killian Hayes",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Marvin Bagley III",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Monte Morris",
      "PG",
      79,
      11,
      3,
      5,
      0.7,
      0.2
    ],
    [
      "James Wiseman",
      "C",
      77,
      10,
      7,
      1,
      0.4,
      1
    ],
    [
      "Evan Fournier",
      "SG",
      78,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Kelly Tripucka",
      "SG",
      82,
      18,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "John Long",
      "SG",
      79,
      14,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Raptors|2000s": [
    [
      "Alvin Williams",
      "PG",
      79,
      12,
      4,
      6,
      0.8,
      0.2
    ],
    [
      "Jerome Williams",
      "PF",
      78,
      8,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "Rafer Alston",
      "PG",
      78,
      10,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Matt Bonner",
      "PF",
      76,
      8,
      5,
      1,
      0.4,
      0.3
    ],
    [
      "Pape Sow",
      "C",
      75,
      6,
      6,
      1,
      0.3,
      0.6
    ],
    [
      "Jonas Valanciunas",
      "C",
      83,
      14,
      10,
      2,
      0.5,
      0.8
    ],
    [
      "DeMar DeRozan",
      "SG",
      86,
      22,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Terrence Ross",
      "SG",
      80,
      14,
      4,
      2,
      0.7,
      0.3
    ]
  ],
  "Raptors|2010s": [
    [
      "Terrence Ross",
      "SG",
      80,
      14,
      4,
      2,
      0.7,
      0.3
    ],
    [
      "Patrick Patterson",
      "PF",
      78,
      10,
      5,
      1,
      0.5,
      0.4
    ],
    [
      "Lou Williams",
      "SG",
      82,
      16,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Serge Ibaka",
      "PF",
      83,
      12,
      7,
      1,
      0.6,
      1.5
    ],
    [
      "Morris Peterson",
      "SF",
      80,
      14,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Alvin Williams",
      "PG",
      79,
      12,
      4,
      6,
      0.8,
      0.2
    ],
    [
      "Jerome Williams",
      "PF",
      78,
      8,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "Antonio Davis",
      "PF",
      81,
      12,
      8,
      2,
      0.6,
      1
    ]
  ],
  "Raptors|2020s": [
    [
      "Chris Boucher",
      "PF",
      79,
      10,
      7,
      1,
      0.5,
      1.2
    ],
    [
      "Precious Achiuwa",
      "PF",
      78,
      10,
      7,
      1,
      0.6,
      0.6
    ],
    [
      "Immanuel Quickley",
      "PG",
      81,
      14,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "RJ Barrett",
      "SF",
      81,
      16,
      5,
      3,
      0.7,
      0.3
    ],
    [
      "Gradey Dick",
      "SG",
      76,
      9,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Morris Peterson",
      "SF",
      80,
      14,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Alvin Williams",
      "PG",
      79,
      12,
      4,
      6,
      0.8,
      0.2
    ],
    [
      "Jerome Williams",
      "PF",
      78,
      8,
      8,
      2,
      0.6,
      0.5
    ]
  ],
  "Rockets|1960s": [
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Jim Barnett",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jon McGlocklin",
      "SG",
      79,
      14,
      4,
      4,
      0.8,
      0.2
    ],
    [
      "Dick Cunningham",
      "C",
      76,
      8,
      9,
      1,
      0.4,
      0.8
    ],
    [
      "Jimmy Walker",
      "PG",
      78,
      12,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "John Block",
      "C",
      78,
      12,
      8,
      2,
      0.4,
      0.8
    ],
    [
      "Mike Newlin",
      "SG",
      81,
      16,
      4,
      4,
      0.8,
      0.3
    ]
  ],
  "Rockets|1970s": [
    [
      "Mike Newlin",
      "SG",
      81,
      16,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Kevin Porter",
      "PG",
      80,
      14,
      4,
      8,
      1,
      0.2
    ],
    [
      "John Lucas",
      "PG",
      80,
      12,
      3,
      7,
      1,
      0.2
    ],
    [
      "Robert Reid",
      "SF",
      79,
      12,
      5,
      4,
      0.8,
      0.5
    ],
    [
      "Allen Leavell",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Bill Willoughby",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ]
  ],
  "Rockets|1980s": [
    [
      "Akeem Olajuwon",
      "C",
      90,
      22,
      12,
      2,
      1,
      3
    ],
    [
      "Vernon Maxwell",
      "SG",
      80,
      14,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Kenny Smith",
      "PG",
      81,
      12,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Matt Bullard",
      "PF",
      76,
      8,
      4,
      2,
      0.4,
      0.3
    ],
    [
      "Mario Elie",
      "SG",
      78,
      10,
      3,
      2,
      0.8,
      0.2
    ],
    [
      "Carl Herrera",
      "PF",
      77,
      10,
      7,
      1,
      0.5,
      0.6
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ]
  ],
  "Rockets|1990s": [
    [
      "Matt Bullard",
      "PF",
      76,
      8,
      4,
      2,
      0.4,
      0.3
    ],
    [
      "Carl Herrera",
      "PF",
      77,
      10,
      7,
      1,
      0.5,
      0.6
    ],
    [
      "Charles Barkley",
      "PF",
      86,
      18,
      10,
      4,
      0.8,
      0.5
    ],
    [
      "Scottie Pippen",
      "SF",
      85,
      14,
      6,
      5,
      1.2,
      0.6
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Jim Barnett",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jon McGlocklin",
      "SG",
      79,
      14,
      4,
      4,
      0.8,
      0.2
    ]
  ],
  "Rockets|2000s": [
    [
      "Chuck Hayes",
      "PF",
      77,
      6,
      7,
      2,
      0.6,
      0.4
    ],
    [
      "Rafer Alston",
      "PG",
      79,
      12,
      4,
      6,
      0.8,
      0.2
    ],
    [
      "Carl Landry",
      "PF",
      78,
      12,
      6,
      1,
      0.4,
      0.3
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Jim Barnett",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jon McGlocklin",
      "SG",
      79,
      14,
      4,
      4,
      0.8,
      0.2
    ],
    [
      "Dick Cunningham",
      "C",
      76,
      8,
      9,
      1,
      0.4,
      0.8
    ]
  ],
  "Rockets|2010s": [
    [
      "Patrick Beverley",
      "PG",
      81,
      9,
      4,
      4,
      1.2,
      0.3
    ],
    [
      "Trevor Ariza",
      "SF",
      81,
      12,
      5,
      2,
      1,
      0.6
    ],
    [
      "P.J. Tucker",
      "PF",
      79,
      8,
      6,
      2,
      0.6,
      0.3
    ],
    [
      "Ryan Anderson",
      "PF",
      80,
      14,
      6,
      1,
      0.4,
      0.3
    ],
    [
      "Lou Williams",
      "SG",
      82,
      16,
      3,
      4,
      0.8,
      0.2
    ],
    [
      "Kenneth Faried",
      "PF",
      78,
      10,
      8,
      1,
      0.5,
      0.5
    ],
    [
      "Danuel House Jr.",
      "SF",
      77,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ]
  ],
  "Rockets|2020s": [
    [
      "Tari Eason",
      "SF",
      78,
      10,
      6,
      2,
      0.9,
      0.6
    ],
    [
      "Amen Thompson",
      "SG",
      79,
      12,
      6,
      4,
      0.9,
      0.5
    ],
    [
      "Cam Whitmore",
      "SF",
      76,
      10,
      4,
      1,
      0.6,
      0.3
    ],
    [
      "Jeff Green",
      "PF",
      78,
      10,
      5,
      2,
      0.5,
      0.4
    ],
    [
      "Aaron Holiday",
      "PG",
      76,
      8,
      2,
      3,
      0.6,
      0.2
    ],
    [
      "Don Kojis",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.3
    ],
    [
      "Gary Keller",
      "PF",
      76,
      10,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Jim Barnett",
      "SG",
      78,
      12,
      4,
      3,
      0.8,
      0.2
    ]
  ],
  "Spurs|1960s": [
    [
      "Mike Gale",
      "PG",
      78,
      12,
      4,
      5,
      1,
      0.2
    ],
    [
      "Glen Combs",
      "SG",
      77,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "John Beasley",
      "PG",
      78,
      12,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "Coby Dietrick",
      "C",
      76,
      8,
      7,
      2,
      0.4,
      0.8
    ],
    [
      "Red Robbins",
      "PF",
      77,
      10,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Mike Mitchell",
      "SF",
      82,
      18,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Steve Johnson",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.6
    ],
    [
      "Mike Brown",
      "C",
      76,
      8,
      7,
      1,
      0.4,
      0.8
    ]
  ],
  "Spurs|1970s": [
    [
      "Mike Mitchell",
      "SF",
      82,
      18,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Mike Gale",
      "PG",
      78,
      12,
      4,
      5,
      1,
      0.2
    ],
    [
      "John Beasley",
      "PG",
      78,
      12,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "Swen Nater",
      "C",
      79,
      10,
      9,
      2,
      0.5,
      0.8
    ],
    [
      "Glen Combs",
      "SG",
      77,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Coby Dietrick",
      "C",
      76,
      8,
      7,
      2,
      0.4,
      0.8
    ],
    [
      "Red Robbins",
      "PF",
      77,
      10,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Steve Johnson",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.6
    ]
  ],
  "Spurs|1980s": [
    [
      "Steve Johnson",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.6
    ],
    [
      "Mike Brown",
      "C",
      76,
      8,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "Alvin Robertson",
      "SG",
      84,
      14,
      5,
      5,
      2.5,
      0.5
    ],
    [
      "Mike Dunleavy",
      "SG",
      78,
      12,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Walter Berry",
      "PF",
      79,
      12,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "James Silas",
      "SG",
      82,
      16,
      3,
      4,
      1,
      0.2
    ],
    [
      "Swen Nater",
      "C",
      80,
      12,
      10,
      2,
      0.5,
      0.8
    ],
    [
      "Mike Gale",
      "PG",
      78,
      12,
      4,
      5,
      1,
      0.2
    ]
  ],
  "Spurs|1990s": [
    [
      "Chuck Person",
      "SF",
      82,
      16,
      6,
      3,
      0.8,
      0.4
    ],
    [
      "Will Perdue",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.8
    ],
    [
      "Vinny Del Negro",
      "SG",
      79,
      12,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "J.R. Reid",
      "PF",
      78,
      10,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Willie Anderson",
      "SG",
      79,
      12,
      4,
      4,
      0.8,
      0.4
    ],
    [
      "Carl Herrera",
      "PF",
      77,
      10,
      7,
      1,
      0.5,
      0.6
    ],
    [
      "James Silas",
      "SG",
      82,
      16,
      3,
      4,
      1,
      0.2
    ],
    [
      "Swen Nater",
      "C",
      80,
      12,
      10,
      2,
      0.5,
      0.8
    ]
  ],
  "Spurs|2000s": [
    [
      "Bruce Bowen",
      "SF",
      80,
      8,
      4,
      2,
      0.8,
      0.5
    ],
    [
      "Brent Barry",
      "SG",
      79,
      10,
      3,
      3,
      0.6,
      0.2
    ],
    [
      "Malik Rose",
      "PF",
      79,
      10,
      7,
      2,
      0.5,
      0.4
    ],
    [
      "Steve Smith",
      "SG",
      81,
      14,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Robert Horry",
      "PF",
      80,
      8,
      6,
      3,
      0.8,
      1
    ],
    [
      "Nazr Mohammed",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      0.6
    ],
    [
      "Michael Finley",
      "SG",
      80,
      12,
      4,
      3,
      0.6,
      0.2
    ],
    [
      "Fabricio Oberto",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      0.5
    ]
  ],
  "Spurs|2010s": [
    [
      "Danny Green",
      "SG",
      82,
      10,
      4,
      2,
      0.8,
      0.5
    ],
    [
      "Boris Diaw",
      "PF",
      80,
      10,
      5,
      4,
      0.6,
      0.4
    ],
    [
      "Tiago Splitter",
      "C",
      79,
      10,
      6,
      2,
      0.5,
      0.6
    ],
    [
      "Marco Belinelli",
      "SG",
      79,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Davis Bertans",
      "PF",
      80,
      12,
      5,
      2,
      0.5,
      0.3
    ],
    [
      "Rudy Gay",
      "SF",
      82,
      16,
      6,
      3,
      0.7,
      0.5
    ],
    [
      "Derrick White",
      "SG",
      81,
      12,
      4,
      4,
      0.9,
      0.6
    ],
    [
      "Jakob Poeltl",
      "C",
      80,
      10,
      8,
      2,
      0.5,
      1
    ]
  ],
  "Spurs|2020s": [
    [
      "Jeremy Sochan",
      "PF",
      79,
      10,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Tre Jones",
      "PG",
      78,
      10,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "Zach Collins",
      "C",
      78,
      10,
      7,
      2,
      0.5,
      0.8
    ],
    [
      "Malaki Branham",
      "SG",
      76,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Blake Wesley",
      "PG",
      75,
      7,
      3,
      3,
      0.7,
      0.2
    ],
    [
      "Dominick Barlow",
      "PF",
      75,
      6,
      5,
      1,
      0.4,
      0.5
    ],
    [
      "Julian Champagnie",
      "SF",
      76,
      8,
      4,
      1,
      0.5,
      0.3
    ],
    [
      "James Silas",
      "SG",
      82,
      16,
      3,
      4,
      1,
      0.2
    ]
  ],
  "Suns|1960s": [
    [
      "Jim Barnett",
      "SG",
      79,
      14,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Washington",
      "PF",
      79,
      12,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "George Wilson",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Gary Gregor",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Art Becker",
      "SF",
      75,
      8,
      5,
      2,
      0.5,
      0.3
    ],
    [
      "John Wetzel",
      "SG",
      76,
      8,
      4,
      3,
      0.6,
      0.3
    ],
    [
      "Don Ohl",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Hank Finkel",
      "C",
      76,
      8,
      7,
      2,
      0.3,
      0.6
    ]
  ],
  "Suns|1970s": [
    [
      "Charlie Scott",
      "SG",
      83,
      18,
      4,
      4,
      1,
      0.3
    ],
    [
      "Curtis Perry",
      "C",
      78,
      12,
      9,
      2,
      0.5,
      0.8
    ],
    [
      "Neal Walk",
      "C",
      77,
      10,
      8,
      2,
      0.4,
      0.8
    ],
    [
      "Keith Erickson",
      "SF",
      79,
      12,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Gar Heard",
      "PF",
      77,
      10,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Ricky Sobers",
      "SG",
      78,
      12,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Jim Barnett",
      "SG",
      79,
      14,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Washington",
      "PF",
      79,
      12,
      8,
      2,
      0.6,
      0.5
    ]
  ],
  "Suns|1980s": [
    [
      "Ed Nealy",
      "PF",
      76,
      6,
      6,
      2,
      0.5,
      0.3
    ],
    [
      "Jay Humphries",
      "PG",
      78,
      10,
      3,
      5,
      1,
      0.3
    ],
    [
      "Tim Kempton",
      "PF",
      76,
      8,
      6,
      2,
      0.4,
      0.4
    ],
    [
      "Armon Gilliam",
      "PF",
      80,
      14,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Jim Barnett",
      "SG",
      79,
      14,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Washington",
      "PF",
      79,
      12,
      8,
      2,
      0.6,
      0.5
    ],
    [
      "George Wilson",
      "C",
      77,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Gary Gregor",
      "SF",
      76,
      10,
      5,
      2,
      0.6,
      0.3
    ]
  ],
  "Suns|1990s": [
    [
      "A.C. Green",
      "PF",
      80,
      10,
      8,
      1,
      0.6,
      0.4
    ],
    [
      "Danny Ainge",
      "SG",
      80,
      12,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Richard Dumas",
      "SF",
      78,
      12,
      5,
      2,
      0.8,
      0.6
    ],
    [
      "Wayman Tisdale",
      "PF",
      80,
      14,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Rod Strickland",
      "PG",
      81,
      14,
      4,
      8,
      1.2,
      0.2
    ],
    [
      "Cliff Robinson",
      "PF",
      82,
      16,
      6,
      2,
      0.8,
      1.2
    ],
    [
      "Jim Barnett",
      "SG",
      79,
      14,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Jim Washington",
      "PF",
      79,
      12,
      8,
      2,
      0.6,
      0.5
    ]
  ],
  "Suns|2000s": [
    [
      "Quentin Richardson",
      "SG",
      80,
      14,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "Boris Diaw",
      "PF",
      81,
      12,
      6,
      4,
      0.6,
      0.4
    ],
    [
      "Grant Hill",
      "SF",
      83,
      14,
      6,
      4,
      0.8,
      0.5
    ],
    [
      "Leandro Barbosa",
      "SG",
      80,
      14,
      3,
      3,
      0.7,
      0.2
    ],
    [
      "Marcin Gortat",
      "C",
      79,
      10,
      8,
      1,
      0.4,
      1
    ],
    [
      "Channing Frye",
      "PF",
      79,
      12,
      6,
      2,
      0.5,
      0.5
    ],
    [
      "Jared Dudley",
      "SF",
      78,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Jim Barnett",
      "SG",
      79,
      14,
      4,
      3,
      0.8,
      0.2
    ]
  ],
  "Suns|2010s": [
    [
      "Mikal Bridges",
      "SF",
      82,
      14,
      4,
      3,
      1,
      0.6
    ],
    [
      "Kelly Oubre Jr.",
      "SF",
      80,
      14,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "T.J. Warren",
      "SF",
      81,
      16,
      5,
      2,
      0.7,
      0.4
    ],
    [
      "Aron Baynes",
      "C",
      78,
      8,
      7,
      1,
      0.4,
      0.6
    ],
    [
      "Cameron Payne",
      "PG",
      78,
      10,
      3,
      4,
      0.7,
      0.2
    ],
    [
      "Dario Saric",
      "PF",
      80,
      12,
      6,
      3,
      0.6,
      0.4
    ],
    [
      "Frank Kaminsky",
      "C",
      78,
      10,
      5,
      2,
      0.5,
      0.6
    ],
    [
      "Torrey Craig",
      "SF",
      77,
      8,
      5,
      2,
      0.6,
      0.4
    ]
  ],
  "Suns|2020s": [
    [
      "Grayson Allen",
      "SG",
      80,
      12,
      4,
      3,
      0.7,
      0.3
    ],
    [
      "Royce O'Neale",
      "SF",
      79,
      8,
      5,
      3,
      0.7,
      0.4
    ],
    [
      "Cameron Payne",
      "PG",
      79,
      11,
      3,
      4,
      0.7,
      0.2
    ],
    [
      "Landry Shamet",
      "SG",
      77,
      10,
      2,
      2,
      0.5,
      0.2
    ],
    [
      "Nassir Little",
      "SF",
      76,
      8,
      4,
      2,
      0.6,
      0.4
    ],
    [
      "Bol Bol",
      "C",
      76,
      8,
      5,
      1,
      0.4,
      1
    ],
    [
      "Josh Okogie",
      "SG",
      76,
      7,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Drew Eubanks",
      "C",
      76,
      7,
      6,
      1,
      0.3,
      0.8
    ]
  ],
  "Thunder|1960s": [
    [
      "Al Tucker",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.4
    ],
    [
      "Don Ohl",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ],
    [
      "Dick Snyder",
      "SG",
      79,
      14,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "Jim Fox",
      "C",
      76,
      10,
      8,
      2,
      0.4,
      0.8
    ],
    [
      "Dennis Johnson",
      "PG",
      84,
      16,
      5,
      5,
      1.5,
      0.8
    ],
    [
      "Gus Williams",
      "PG",
      83,
      18,
      3,
      6,
      1.5,
      0.3
    ],
    [
      "Jack Sikma",
      "C",
      84,
      16,
      10,
      3,
      0.8,
      1.2
    ]
  ],
  "Thunder|1970s": [
    [
      "Fred Brown",
      "SG",
      82,
      16,
      4,
      3,
      0.8,
      0.2
    ],
    [
      "Paul Silas",
      "PF",
      80,
      10,
      10,
      2,
      0.6,
      0.4
    ],
    [
      "Lonnie Shelton",
      "PF",
      79,
      12,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Tom Burleson",
      "C",
      78,
      10,
      8,
      2,
      0.4,
      1
    ],
    [
      "Dick Snyder",
      "SG",
      79,
      14,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "Lenny Wilkens",
      "PG",
      86,
      16,
      5,
      7,
      1.5,
      0.2
    ],
    [
      "Bob Rule",
      "C",
      80,
      16,
      9,
      2,
      0.5,
      1
    ],
    [
      "Al Tucker",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.4
    ]
  ],
  "Thunder|1980s": [
    [
      "Nate McMillan",
      "PG",
      78,
      8,
      4,
      6,
      1,
      0.3
    ],
    [
      "Olden Polynice",
      "C",
      78,
      10,
      8,
      1,
      0.4,
      0.8
    ],
    [
      "Derrick McKey",
      "SF",
      80,
      12,
      6,
      3,
      0.8,
      0.6
    ],
    [
      "Sedale Threatt",
      "PG",
      79,
      12,
      3,
      6,
      1,
      0.2
    ],
    [
      "Michael Cage",
      "PF",
      79,
      10,
      10,
      2,
      0.6,
      1.2
    ],
    [
      "Lenny Wilkens",
      "PG",
      86,
      16,
      5,
      7,
      1.5,
      0.2
    ],
    [
      "Bob Rule",
      "C",
      80,
      16,
      9,
      2,
      0.5,
      1
    ],
    [
      "Al Tucker",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.4
    ]
  ],
  "Thunder|1990s": [
    [
      "Vin Baker",
      "PF",
      84,
      16,
      9,
      3,
      0.8,
      1
    ],
    [
      "Hersey Hawkins",
      "SG",
      82,
      14,
      4,
      3,
      1,
      0.3
    ],
    [
      "Ervin Johnson",
      "C",
      76,
      6,
      8,
      1,
      0.4,
      1
    ],
    [
      "Brent Barry",
      "SG",
      79,
      12,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Lenny Wilkens",
      "PG",
      86,
      16,
      5,
      7,
      1.5,
      0.2
    ],
    [
      "Bob Rule",
      "C",
      80,
      16,
      9,
      2,
      0.5,
      1
    ],
    [
      "Al Tucker",
      "SF",
      79,
      14,
      6,
      2,
      0.8,
      0.4
    ],
    [
      "Don Ohl",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Thunder|2000s": [
    [
      "Rashard Lewis",
      "PF",
      84,
      16,
      6,
      3,
      0.8,
      0.5
    ],
    [
      "Ray Allen",
      "SG",
      88,
      20,
      5,
      4,
      1,
      0.2
    ],
    [
      "Luke Ridnour",
      "PG",
      78,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Nick Collison",
      "PF",
      78,
      8,
      6,
      2,
      0.5,
      0.4
    ],
    [
      "Desmond Mason",
      "SF",
      80,
      12,
      6,
      2,
      0.8,
      0.8
    ],
    [
      "Chris Wilcox",
      "PF",
      79,
      12,
      7,
      1,
      0.6,
      0.8
    ],
    [
      "Damien Wilkins",
      "SG",
      77,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Earl Watson",
      "PG",
      77,
      8,
      3,
      5,
      0.6,
      0.2
    ]
  ],
  "Thunder|2010s": [
    [
      "Serge Ibaka",
      "PF",
      84,
      12,
      8,
      1,
      0.8,
      2.5
    ],
    [
      "Enes Kanter",
      "C",
      80,
      12,
      9,
      1,
      0.4,
      0.5
    ],
    [
      "Andre Roberson",
      "SF",
      78,
      6,
      6,
      2,
      0.8,
      0.6
    ],
    [
      "Dennis Schroder",
      "PG",
      81,
      14,
      3,
      6,
      0.8,
      0.2
    ],
    [
      "Jerami Grant",
      "PF",
      81,
      12,
      5,
      2,
      0.7,
      0.8
    ],
    [
      "Shai Gilgeous-Alexander",
      "PG",
      84,
      18,
      5,
      6,
      1,
      0.5
    ],
    [
      "Chris Paul",
      "PG",
      84,
      14,
      5,
      8,
      1.5,
      0.2
    ],
    [
      "Lenny Wilkens",
      "PG",
      86,
      16,
      5,
      7,
      1.5,
      0.2
    ]
  ],
  "Thunder|2020s": [
    [
      "Josh Giddey",
      "PG",
      80,
      14,
      7,
      6,
      0.8,
      0.4
    ],
    [
      "Aaron Wiggins",
      "SG",
      77,
      10,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Isaiah Joe",
      "SG",
      77,
      10,
      3,
      2,
      0.5,
      0.2
    ],
    [
      "Kenrich Williams",
      "SF",
      78,
      8,
      5,
      3,
      0.6,
      0.3
    ],
    [
      "Jaylin Williams",
      "PF",
      77,
      8,
      6,
      3,
      0.5,
      0.6
    ],
    [
      "Cason Wallace",
      "PG",
      76,
      8,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Ousmane Dieng",
      "SF",
      75,
      7,
      4,
      2,
      0.5,
      0.4
    ],
    [
      "Lenny Wilkens",
      "PG",
      86,
      16,
      5,
      7,
      1.5,
      0.2
    ]
  ],
  "Timberwolves|1990s": [
    [
      "Christian Laettner",
      "PF",
      82,
      14,
      7,
      3,
      0.6,
      0.6
    ],
    [
      "Doug West",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Spud Webb",
      "PG",
      77,
      10,
      2,
      5,
      0.8,
      0.1
    ],
    [
      "Terry Porter",
      "PG",
      82,
      14,
      4,
      7,
      1,
      0.2
    ],
    [
      "Felton Spencer",
      "C",
      76,
      8,
      7,
      1,
      0.3,
      0.8
    ],
    [
      "Isaiah Rider",
      "SG",
      80,
      16,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Wally Szczerbiak",
      "SF",
      83,
      16,
      5,
      3,
      0.8,
      0.3
    ],
    [
      "Troy Hudson",
      "PG",
      79,
      12,
      3,
      5,
      0.8,
      0.2
    ]
  ],
  "Timberwolves|2000s": [
    [
      "Marko Jaric",
      "SG",
      77,
      10,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Trenton Hassell",
      "SG",
      76,
      8,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Mark Madsen",
      "PF",
      75,
      6,
      6,
      1,
      0.3,
      0.4
    ],
    [
      "Christian Laettner",
      "PF",
      82,
      14,
      7,
      3,
      0.6,
      0.6
    ],
    [
      "Doug West",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Spud Webb",
      "PG",
      77,
      10,
      2,
      5,
      0.8,
      0.1
    ],
    [
      "Terry Porter",
      "PG",
      82,
      14,
      4,
      7,
      1,
      0.2
    ],
    [
      "Anthony Peeler",
      "SG",
      78,
      12,
      3,
      3,
      0.8,
      0.2
    ]
  ],
  "Timberwolves|2010s": [
    [
      "Gorgui Dieng",
      "C",
      79,
      10,
      8,
      2,
      0.5,
      1
    ],
    [
      "Tyus Jones",
      "PG",
      78,
      8,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Robert Covington",
      "SF",
      80,
      12,
      6,
      2,
      1,
      0.8
    ],
    [
      "Derrick Rose",
      "PG",
      80,
      14,
      3,
      5,
      0.8,
      0.3
    ],
    [
      "Josh Okogie",
      "SG",
      77,
      8,
      4,
      2,
      0.8,
      0.4
    ],
    [
      "Taj Gibson",
      "PF",
      79,
      10,
      7,
      1,
      0.5,
      0.8
    ],
    [
      "Christian Laettner",
      "PF",
      82,
      14,
      7,
      3,
      0.6,
      0.6
    ],
    [
      "Doug West",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ]
  ],
  "Timberwolves|2020s": [
    [
      "Nickeil Alexander-Walker",
      "SG",
      77,
      10,
      3,
      3,
      0.6,
      0.3
    ],
    [
      "Kyle Anderson",
      "SF",
      79,
      8,
      6,
      4,
      0.7,
      0.5
    ],
    [
      "Taurean Prince",
      "SF",
      78,
      9,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Jordan McLaughlin",
      "PG",
      75,
      6,
      2,
      4,
      0.6,
      0.2
    ],
    [
      "Leonard Miller",
      "SF",
      75,
      6,
      4,
      1,
      0.4,
      0.3
    ],
    [
      "Christian Laettner",
      "PF",
      82,
      14,
      7,
      3,
      0.6,
      0.6
    ],
    [
      "Doug West",
      "SG",
      79,
      12,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Spud Webb",
      "PG",
      77,
      10,
      2,
      5,
      0.8,
      0.1
    ]
  ],
  "Trail Blazers|1990s": [
    [
      "Chris Dudley",
      "C",
      76,
      6,
      8,
      1,
      0.3,
      1
    ],
    [
      "Harvey Grant",
      "PF",
      79,
      12,
      7,
      2,
      0.6,
      0.6
    ],
    [
      "Isaiah Rider",
      "SG",
      81,
      16,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Brian Grant",
      "PF",
      78,
      10,
      8,
      1,
      0.5,
      0.6
    ],
    [
      "Alvin Williams",
      "PG",
      77,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Jermaine O'Neal",
      "PF",
      80,
      12,
      8,
      1,
      0.5,
      1.5
    ],
    [
      "Greg Oden",
      "C",
      80,
      12,
      9,
      1,
      0.5,
      2
    ],
    [
      "Andre Miller",
      "PG",
      83,
      14,
      4,
      7,
      0.8,
      0.2
    ]
  ],
  "Trail Blazers|2000s": [
    [
      "Travis Outlaw",
      "PF",
      78,
      12,
      6,
      1,
      0.5,
      0.8
    ],
    [
      "Joel Przybilla",
      "C",
      77,
      6,
      8,
      1,
      0.3,
      1.5
    ],
    [
      "Steve Blake",
      "PG",
      77,
      8,
      3,
      5,
      0.6,
      0.2
    ],
    [
      "Rudy Fernandez",
      "SG",
      80,
      12,
      3,
      3,
      0.8,
      0.3
    ],
    [
      "Martell Webster",
      "SG",
      77,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Channing Frye",
      "PF",
      78,
      10,
      5,
      1,
      0.4,
      0.5
    ],
    [
      "Cliff Robinson",
      "PF",
      83,
      16,
      6,
      2,
      0.8,
      1.2
    ],
    [
      "Rod Strickland",
      "PG",
      82,
      14,
      4,
      8,
      1.2,
      0.2
    ]
  ],
  "Trail Blazers|2010s": [
    [
      "Meyers Leonard",
      "C",
      77,
      8,
      5,
      1,
      0.4,
      0.5
    ],
    [
      "Al-Farouq Aminu",
      "PF",
      78,
      10,
      7,
      2,
      0.6,
      0.5
    ],
    [
      "Maurice Harkless",
      "SF",
      78,
      10,
      5,
      2,
      0.8,
      0.5
    ],
    [
      "Enes Kanter",
      "C",
      80,
      12,
      9,
      1,
      0.4,
      0.5
    ],
    [
      "Rodney Hood",
      "SG",
      79,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Gary Trent Jr.",
      "SG",
      78,
      10,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Robert Covington",
      "SF",
      80,
      10,
      6,
      2,
      0.9,
      0.6
    ],
    [
      "Cliff Robinson",
      "PF",
      83,
      16,
      6,
      2,
      0.8,
      1.2
    ]
  ],
  "Trail Blazers|2020s": [
    [
      "Matisse Thybulle",
      "SF",
      79,
      8,
      4,
      2,
      1.2,
      0.6
    ],
    [
      "Robert Williams III",
      "C",
      81,
      10,
      9,
      2,
      0.8,
      2
    ],
    [
      "Malcolm Brogdon",
      "PG",
      81,
      14,
      4,
      5,
      0.7,
      0.3
    ],
    [
      "Toumani Camara",
      "SF",
      77,
      9,
      5,
      2,
      0.7,
      0.4
    ],
    [
      "Duop Reath",
      "C",
      75,
      7,
      5,
      1,
      0.3,
      0.6
    ],
    [
      "Cliff Robinson",
      "PF",
      83,
      16,
      6,
      2,
      0.8,
      1.2
    ],
    [
      "Rod Strickland",
      "PG",
      82,
      14,
      4,
      8,
      1.2,
      0.2
    ],
    [
      "Chris Dudley",
      "C",
      76,
      6,
      8,
      1,
      0.3,
      1
    ]
  ],
  "Warriors|1960s": [
    [
      "Guy Rodgers",
      "PG",
      82,
      12,
      5,
      8,
      0.8,
      0.2
    ],
    [
      "Wayne Hightower",
      "PF",
      79,
      12,
      8,
      3,
      0.6,
      0.5
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ],
    [
      "Jeff Mullins",
      "SG",
      80,
      16,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Clyde Lee",
      "C",
      77,
      10,
      9,
      2,
      0.4,
      0.8
    ],
    [
      "Fred Hetzel",
      "SF",
      77,
      12,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Bud Ogden",
      "SF",
      75,
      8,
      5,
      2,
      0.5,
      0.3
    ],
    [
      "Phil Smith",
      "SG",
      82,
      16,
      4,
      4,
      0.8,
      0.3
    ]
  ],
  "Warriors|1970s": [
    [
      "Butch Beard",
      "PG",
      79,
      12,
      4,
      5,
      0.8,
      0.2
    ],
    [
      "Robert Parish",
      "C",
      82,
      14,
      10,
      2,
      0.5,
      1.2
    ],
    [
      "Purvis Short",
      "SF",
      80,
      16,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "John Lucas",
      "PG",
      80,
      12,
      3,
      7,
      1,
      0.2
    ],
    [
      "Lloyd Free",
      "SG",
      81,
      18,
      4,
      4,
      0.8,
      0.3
    ],
    [
      "Guy Rodgers",
      "PG",
      82,
      12,
      5,
      8,
      0.8,
      0.2
    ],
    [
      "Wayne Hightower",
      "PF",
      79,
      12,
      8,
      3,
      0.6,
      0.5
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ]
  ],
  "Warriors|1980s": [
    [
      "Sleepy Floyd",
      "PG",
      82,
      16,
      3,
      6,
      1,
      0.2
    ],
    [
      "Larry Smith",
      "PF",
      78,
      8,
      9,
      2,
      0.6,
      0.5
    ],
    [
      "Purvis Short",
      "SF",
      80,
      16,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Rod Higgins",
      "SF",
      77,
      10,
      5,
      2,
      0.6,
      0.4
    ],
    [
      "Eric Floyd",
      "PG",
      80,
      14,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Guy Rodgers",
      "PG",
      82,
      12,
      5,
      8,
      0.8,
      0.2
    ],
    [
      "Wayne Hightower",
      "PF",
      79,
      12,
      8,
      3,
      0.6,
      0.5
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ]
  ],
  "Warriors|1990s": [
    [
      "Chris Gatling",
      "PF",
      80,
      14,
      7,
      1,
      0.5,
      0.5
    ],
    [
      "Billy Owens",
      "SF",
      80,
      14,
      7,
      4,
      0.8,
      0.6
    ],
    [
      "Adonal Foyle",
      "C",
      77,
      6,
      7,
      1,
      0.4,
      2
    ],
    [
      "Jason Richardson",
      "SG",
      82,
      16,
      5,
      3,
      0.8,
      0.4
    ],
    [
      "Guy Rodgers",
      "PG",
      82,
      12,
      5,
      8,
      0.8,
      0.2
    ],
    [
      "Wayne Hightower",
      "PF",
      79,
      12,
      8,
      3,
      0.6,
      0.5
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ],
    [
      "Jeff Mullins",
      "SG",
      80,
      16,
      4,
      3,
      0.8,
      0.3
    ]
  ],
  "Warriors|2000s": [
    [
      "Matt Barnes",
      "SF",
      78,
      8,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Monta Ellis",
      "SG",
      84,
      20,
      4,
      4,
      0.9,
      0.3
    ],
    [
      "Kelenna Azubuike",
      "SG",
      78,
      12,
      4,
      2,
      0.6,
      0.3
    ],
    [
      "Ronny Turiaf",
      "C",
      76,
      6,
      5,
      2,
      0.4,
      0.6
    ],
    [
      "C.J. Watson",
      "PG",
      77,
      8,
      3,
      4,
      0.6,
      0.2
    ],
    [
      "Guy Rodgers",
      "PG",
      82,
      12,
      5,
      8,
      0.8,
      0.2
    ],
    [
      "Wayne Hightower",
      "PF",
      79,
      12,
      8,
      3,
      0.6,
      0.5
    ],
    [
      "Tom Meschery",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.4
    ]
  ],
  "Warriors|2010s": [
    [
      "Andre Iguodala",
      "SF",
      84,
      12,
      5,
      4,
      1,
      0.6
    ],
    [
      "Shaun Livingston",
      "PG",
      79,
      8,
      3,
      4,
      0.6,
      0.4
    ],
    [
      "Harrison Barnes",
      "SF",
      80,
      14,
      5,
      2,
      0.6,
      0.3
    ],
    [
      "Festus Ezeli",
      "C",
      77,
      8,
      7,
      1,
      0.4,
      1.2
    ],
    [
      "Ian Clark",
      "SG",
      76,
      8,
      2,
      2,
      0.5,
      0.2
    ],
    [
      "Nick Young",
      "SG",
      78,
      12,
      2,
      1,
      0.6,
      0.2
    ],
    [
      "Jordan Poole",
      "SG",
      80,
      14,
      3,
      3,
      0.7,
      0.3
    ],
    [
      "Kevon Looney",
      "PF",
      79,
      8,
      8,
      2,
      0.5,
      0.5
    ]
  ],
  "Warriors|2020s": [
    [
      "Kevon Looney",
      "PF",
      80,
      8,
      8,
      2,
      0.5,
      0.5
    ],
    [
      "Gary Payton II",
      "SG",
      78,
      8,
      4,
      2,
      0.9,
      0.4
    ],
    [
      "Dario Saric",
      "PF",
      79,
      10,
      6,
      3,
      0.5,
      0.4
    ],
    [
      "Moses Moody",
      "SG",
      77,
      10,
      3,
      2,
      0.6,
      0.3
    ],
    [
      "Brandin Podziemski",
      "SG",
      78,
      10,
      5,
      3,
      0.7,
      0.3
    ],
    [
      "Trayce Jackson-Davis",
      "PF",
      77,
      8,
      6,
      2,
      0.5,
      0.6
    ],
    [
      "Buddy Hield",
      "SG",
      81,
      12,
      4,
      2,
      0.6,
      0.2
    ],
    [
      "Lester Quinones",
      "SG",
      75,
      7,
      3,
      2,
      0.5,
      0.2
    ]
  ],
  "Wizards|2000s": [
    [
      "DeShawn Stevenson",
      "SG",
      78,
      10,
      4,
      3,
      0.8,
      0.3
    ],
    [
      "Nick Young",
      "SG",
      79,
      12,
      3,
      2,
      0.6,
      0.2
    ],
    [
      "Andray Blatche",
      "PF",
      79,
      12,
      7,
      3,
      0.6,
      0.8
    ],
    [
      "Bradley Beal",
      "SG",
      86,
      22,
      4,
      5,
      0.9,
      0.4
    ],
    [
      "Marcin Gortat",
      "C",
      80,
      12,
      9,
      1,
      0.4,
      1
    ],
    [
      "Otto Porter Jr.",
      "SF",
      81,
      12,
      6,
      2,
      0.7,
      0.5
    ],
    [
      "Markieff Morris",
      "PF",
      80,
      14,
      6,
      2,
      0.6,
      0.4
    ],
    [
      "Kelly Oubre Jr.",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.4
    ]
  ],
  "Wizards|2010s": [
    [
      "Kelly Oubre Jr.",
      "SF",
      79,
      12,
      5,
      2,
      0.8,
      0.4
    ],
    [
      "Ian Mahinmi",
      "C",
      76,
      6,
      6,
      1,
      0.3,
      0.8
    ],
    [
      "Tomas Satoransky",
      "PG",
      78,
      8,
      4,
      5,
      0.6,
      0.2
    ],
    [
      "Moritz Wagner",
      "C",
      77,
      10,
      5,
      2,
      0.4,
      0.4
    ],
    [
      "Antawn Jamison",
      "PF",
      84,
      18,
      8,
      2,
      0.6,
      0.4
    ],
    [
      "Caron Butler",
      "SF",
      83,
      16,
      6,
      3,
      0.8,
      0.4
    ],
    [
      "Gilbert Arenas",
      "PG",
      86,
      22,
      4,
      6,
      1.2,
      0.2
    ],
    [
      "Larry Hughes",
      "SG",
      81,
      14,
      4,
      4,
      1,
      0.4
    ]
  ],
  "Wizards|2020s": [
    [
      "Corey Kispert",
      "SF",
      78,
      12,
      4,
      2,
      0.5,
      0.3
    ],
    [
      "Bilal Coulibaly",
      "SF",
      77,
      10,
      5,
      3,
      0.8,
      0.5
    ],
    [
      "Marvin Bagley III",
      "PF",
      78,
      12,
      7,
      2,
      0.5,
      0.5
    ],
    [
      "Tyus Jones",
      "PG",
      79,
      10,
      3,
      5,
      0.8,
      0.2
    ],
    [
      "Antawn Jamison",
      "PF",
      84,
      18,
      8,
      2,
      0.6,
      0.4
    ],
    [
      "Caron Butler",
      "SF",
      83,
      16,
      6,
      3,
      0.8,
      0.4
    ],
    [
      "Gilbert Arenas",
      "PG",
      86,
      22,
      4,
      6,
      1.2,
      0.2
    ],
    [
      "Larry Hughes",
      "SG",
      81,
      14,
      4,
      4,
      1,
      0.4
    ]
  ]
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
const errors = [];
const dupWarnings = [];
const clubs = {};

for (const [key, raw] of Object.entries(depth)) {
  const [club, era] = key.split("|");
  const taken = seedExclude[key] ?? new Set();
  const seen = new Set();
  const filtered = [];
  for (const pl of raw) {
    const n = pl[0].trim().toLowerCase();
    if (taken.has(n)) {
      dupWarnings.push(`${key}: skipped "${pl[0]}" (already in seeds)`);
      continue;
    }
    if (seen.has(n)) continue;
    seen.add(n);
    filtered.push(pl);
  }
  if (filtered.length < 8) errors.push(`${key}: only ${filtered.length} players after dedup`);
  if (filtered.length > 12) errors.push(`${key}: ${filtered.length} players (max 12)`);
  clubs[club] ??= {};
  clubs[club][era] = filtered;
}

if (errors.length) {
  console.error("VALIDATION ERRORS:\n" + errors.join("\n"));
  process.exit(1);
}

function line(pl) {
  const [name, pos, ...nums] = pl;
  return `      b("${name}", ["${pos}"], ${nums.join(", ")})`;
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

/** 8-12 rotation/role players per club×era (30 franchises). */
export const NBA_ROSTER_DEPTH: ClubEraPool = {
`;

for (const [club, eras] of Object.entries(clubs).sort(([a], [b]) => a.localeCompare(b))) {
  const ck = club.includes(" ") || club.startsWith("7") ? JSON.stringify(club) : club;
  out += `  ${ck}: {\n`;
  for (const [era, players] of Object.entries(eras).sort()) {
    out += `    "${era}": [\n${players.map(line).join(",\n")},\n    ],\n`;
  }
  out += `  },\n`;
}
out += `};\n`;

fs.writeFileSync("scripts/seeds/nba-roster-depth.ts", out);
const comboCount = Object.keys(depth).length;
console.log("wrote scripts/seeds/nba-roster-depth.ts");
console.log("total club×era combos:", comboCount);
console.log("duplicate skips vs existing seeds:", dupWarnings.length);
if (dupWarnings.length) {
  console.log("sample duplicate skips:", dupWarnings.slice(0, 5).join("; "));
}
