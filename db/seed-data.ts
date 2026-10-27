import type { ExamFixture, QuestionFixture } from "../lib/fixtures";

const q = (
  prompt: string,
  options: [string, string, string, string],
  correctOptionIndex: number,
  explanation: string,
): QuestionFixture => ({ prompt, options, correctOptionIndex, explanation });

const exam = (subject: string, year: string, questions: QuestionFixture[]): ExamFixture => ({ subject, year, questions });

export const examSeedData: ExamFixture[] = [
  exam("Mathematics", "2013 E.C.", [
    q("Solve the system x + y = 9 and x - y = 3.", ["x = 3, y = 6", "x = 6, y = 3", "x = 5, y = 4", "x = 9, y = 3"], 1, "Adding the equations gives 2x = 12, so x = 6. Substitution gives y = 3."),
    q("A triangle has a base of 12 cm and a perpendicular height of 7 cm. What is its area?", ["19 cm^2", "42 cm^2", "84 cm^2", "168 cm^2"], 1, "The area is one half times base times height: (12 x 7) / 2 = 42 cm^2."),
    q("A fair coin is tossed once. What is the probability of getting heads?", ["0", "1/4", "1/2", "1"], 2, "There are two equally likely outcomes and one is heads, so the probability is 1/2."),
  ]),
  exam("Mathematics", "2014 E.C.", [
    q("What are the solutions of x^2 - 5x + 6 = 0?", ["x = 1 or 6", "x = 2 or 3", "x = -2 or -3", "x = 0 or 5"], 1, "Factor the expression as (x - 2)(x - 3) = 0, giving x = 2 or x = 3."),
    q("An arithmetic sequence begins 4, 7, 10, ... What is its 10th term?", ["27", "30", "31", "34"], 2, "The common difference is 3. The 10th term is 4 + 9 x 3 = 31."),
    q("A right triangle has legs of lengths 5 cm and 12 cm. What is the hypotenuse?", ["10 cm", "13 cm", "15 cm", "17 cm"], 1, "By the Pythagorean theorem, c^2 = 5^2 + 12^2 = 169, so c = 13 cm."),
  ]),
  exam("Mathematics", "2015 E.C.", [
    q("What is the gradient of y = 3x - 4?", ["-4", "-3", "3", "4"], 2, "In slope-intercept form y = mx + b, the gradient is the coefficient m, which is 3."),
    q("What is the value of sin(30 degrees)?", ["0", "1/2", "sqrt(3)/2", "1"], 1, "The standard trigonometric value of sin(30 degrees) is 1/2."),
    q("A circle has radius 4 cm. What is its area?", ["8 pi cm^2", "12 pi cm^2", "16 pi cm^2", "32 pi cm^2"], 2, "The area is pi r^2, so pi x 4^2 = 16 pi cm^2."),
  ]),

  exam("Physics", "2013 E.C.", [
    q("A 4 kg object accelerates at 3 m/s^2. What net force acts on it?", ["7 N", "12 N", "24 N", "48 N"], 1, "Newton's second law gives F = ma = 4 x 3 = 12 N."),
    q("A force of 20 N moves a box 5 m in the direction of the force. How much work is done?", ["4 J", "25 J", "100 J", "200 J"], 2, "Work is force multiplied by displacement in the force direction: 20 x 5 = 100 J."),
    q("Which instrument measures electric current in a circuit?", ["Voltmeter", "Ammeter", "Thermometer", "Barometer"], 1, "An ammeter is connected in series to measure current in amperes."),
  ]),
  exam("Physics", "2014 E.C.", [
    q("A 12 V battery is connected across a 4 ohm resistor. What current flows?", ["0.33 A", "3 A", "8 A", "48 A"], 1, "Ohm's law gives I = V/R = 12/4 = 3 A."),
    q("A wave has frequency 5 Hz and wavelength 2 m. What is its speed?", ["2.5 m/s", "7 m/s", "10 m/s", "20 m/s"], 2, "Wave speed equals frequency times wavelength: 5 x 2 = 10 m/s."),
    q("A car's velocity changes from 4 m/s to 16 m/s in 6 s. What is its average acceleration?", ["2 m/s^2", "3 m/s^2", "6 m/s^2", "12 m/s^2"], 0, "Acceleration is change in velocity divided by time: (16 - 4)/6 = 2 m/s^2."),
  ]),
  exam("Physics", "2015 E.C.", [
    q("What is the SI unit of electric current?", ["Volt", "Ampere", "Ohm", "Watt"], 1, "Ampere is the standard international unit for electric current."),
    q("Which of the following is a vector quantity?", ["Speed", "Distance", "Velocity", "Mass"], 2, "Velocity has both magnitude and direction, making it a vector quantity."),
    q("What is the acceleration due to gravity on Earth approximately?", ["9.8 m/s^2", "3.0 x 10^8 m/s", "6.67 x 10^-11", "1.6 m/s^2"], 0, "Near Earth's surface, free-fall acceleration is approximately 9.8 m/s^2."),
  ]),

  exam("Biology", "2013 E.C.", [
    q("Which organelle is the main site of aerobic respiration in a eukaryotic cell?", ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"], 1, "Mitochondria produce most ATP during aerobic respiration in eukaryotic cells."),
    q("Which gas is released during photosynthesis?", ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], 2, "During the light reactions, water is split and oxygen is released."),
    q("Which molecule carries hereditary information in most living organisms?", ["ATP", "DNA", "Glucose", "Cellulose"], 1, "DNA stores genetic instructions that can be copied and passed to offspring."),
  ]),
  exam("Biology", "2014 E.C.", [
    q("Which plant tissue transports water from roots toward the leaves?", ["Phloem", "Epidermis", "Xylem", "Cortex"], 2, "Xylem transports water and dissolved minerals upward through the plant."),
    q("What is the movement of water through a selectively permeable membrane called?", ["Diffusion", "Osmosis", "Active transport", "Transpiration"], 1, "Osmosis is the net movement of water across a selectively permeable membrane."),
    q("In a cross between Aa and Aa, what fraction of offspring is expected to be aa?", ["0", "1/4", "1/2", "3/4"], 1, "The possible genotypes are AA, Aa, Aa, and aa, so one out of four is aa."),
  ]),
  exam("Biology", "2015 E.C.", [
    q("Which blood cells primarily help defend the body against pathogens?", ["Red blood cells", "White blood cells", "Platelets", "Plasma"], 1, "White blood cells recognize and help destroy pathogens and infected cells."),
    q("Which organisms make organic food from inorganic substances in an ecosystem?", ["Primary consumers", "Decomposers", "Producers", "Secondary consumers"], 2, "Producers such as green plants create organic molecules, usually by photosynthesis."),
    q("Which process releases usable energy from glucose in cells?", ["Respiration", "Pollination", "Transpiration", "Fertilization"], 0, "Cellular respiration breaks down glucose and transfers energy into ATP."),
  ]),

  exam("Chemistry", "2013 E.C.", [
    q("What does the atomic number of an element represent?", ["Number of neutrons", "Number of protons", "Number of shells", "Mass of one atom"], 1, "The atomic number is the number of protons in the nucleus."),
    q("What type of bond forms when atoms share pairs of electrons?", ["Ionic", "Covalent", "Metallic", "Hydrogen"], 1, "Covalent bonds form when atoms share electron pairs."),
    q("What are the products when hydrogen burns completely in oxygen?", ["Hydrogen peroxide", "Water", "Carbon dioxide", "Ozone"], 1, "Hydrogen reacts with oxygen to form water: 2H2 + O2 -> 2H2O."),
  ]),
  exam("Chemistry", "2014 E.C.", [
    q("What is the pH of a neutral aqueous solution at 25 degrees C?", ["0", "5", "7", "14"], 2, "At 25 degrees C, a neutral solution has equal hydrogen and hydroxide ion concentrations and pH 7."),
    q("How many moles are in 36 g of water? (Molar mass H2O = 18 g/mol)", ["0.5 mol", "1 mol", "2 mol", "18 mol"], 2, "Amount in moles is mass divided by molar mass: 36/18 = 2 mol."),
    q("Across a period from left to right, how does atomic radius generally change?", ["Increases", "Decreases", "Stays exactly constant", "First becomes zero"], 1, "Effective nuclear charge increases across a period and pulls electrons closer to the nucleus."),
  ]),
  exam("Chemistry", "2015 E.C.", [
    q("How many moles are present in 18 g of water? (Molar mass H2O = 18 g/mol)", ["0.5 mol", "1 mol", "2 mol", "18 mol"], 1, "Moles = mass/molar mass = 18/18 = 1 mol."),
    q("Which gas is produced when an acid reacts with a carbonate?", ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"], 2, "Acid-carbonate reactions produce a salt, water, and carbon dioxide gas."),
    q("Atoms of the same element with different numbers of neutrons are called what?", ["Ions", "Isotopes", "Compounds", "Isomers"], 1, "Isotopes have the same number of protons but different numbers of neutrons."),
  ]),

  exam("English", "2013 E.C.", [
    q("Choose the grammatically correct sentence.", ["They goes to school every day.", "They go to school every day.", "They going to school every day.", "They is go to school every day."], 1, "The plural subject 'they' takes the base present-tense verb 'go'."),
    q("Choose the closest meaning of 'assist'.", ["Help", "Delay", "Hide", "Refuse"], 0, "To assist someone means to help them."),
    q("Complete the sentence: She bought ___ umbrella because it was raining.", ["a", "an", "the a", "no article"], 1, "'Umbrella' begins with a vowel sound, so the correct article is 'an'."),
  ]),
  exam("English", "2014 E.C.", [
    q("Choose the correct passive form: 'The teacher marked the papers.'", ["The papers marked the teacher.", "The papers were marked by the teacher.", "The papers are marking by the teacher.", "The teacher was marked by the papers."], 1, "Past simple passive uses 'were' plus the past participle: 'were marked'."),
    q("Complete the conditional: If I ___ more time, I would read the book.", ["have", "had", "will have", "am having"], 1, "The second conditional uses past simple in the if-clause and 'would' in the result clause."),
    q("Which word is the adverb in: 'The careful driver moved slowly.'?", ["careful", "driver", "moved", "slowly"], 3, "'Slowly' describes how the driver moved, so it is an adverb."),
  ]),
  exam("English", "2015 E.C.", [
    q("Choose the grammatically correct sentence.", ["She have lived here for two years.", "She has lived here for two years.", "She is live here for two years.", "She living here since two years."], 1, "The present perfect uses 'has' with a singular subject and the past participle 'lived'."),
    q("Choose the closest meaning of 'rapid'.", ["Slow", "Quick", "Careful", "Quiet"], 1, "'Rapid' means happening or moving quickly."),
    q("Complete the sentence: Neither the students nor the teacher ___ late.", ["were", "are", "was", "be"], 2, "With 'neither...nor', the verb agrees with the nearer subject, 'teacher', which is singular."),
  ]),

  exam("SAT", "2013 E.C.", [
    q("If 3x + 5 = 20, what is the value of x?", ["3", "5", "8", "15"], 1, "Subtract 5 to get 3x = 15, then divide by 3 to get x = 5."),
    q("A book costs 120 birr and is discounted by 25%. What is its sale price?", ["30 birr", "80 birr", "90 birr", "95 birr"], 2, "A 25% discount is 30 birr, so the sale price is 120 - 30 = 90 birr."),
    q("Choose the word closest in meaning to 'reluctant'.", ["Unwilling", "Excited", "Certain", "Careless"], 0, "Someone who is reluctant is hesitant or unwilling to do something."),
  ]),
  exam("SAT", "2014 E.C.", [
    q("A line passes through (2, 3) and (6, 11). What is its slope?", ["1/2", "2", "4", "8"], 1, "Slope is change in y divided by change in x: (11 - 3)/(6 - 2) = 2."),
    q("A class has 12 boys and 18 girls. What fraction of the class are girls?", ["2/5", "3/5", "3/2", "5/3"], 1, "There are 30 students total. The fraction who are girls is 18/30 = 3/5."),
    q("In a passage, a 'scarce' resource is best described as what?", ["Abundant", "Rare", "Unnecessary", "Renewable"], 1, "'Scarce' means limited in quantity or difficult to find."),
  ]),
  exam("SAT", "2015 E.C.", [
    q("If 5 notebooks cost 150 birr, how much do 8 notebooks cost at the same rate?", ["180 birr", "210 birr", "240 birr", "300 birr"], 2, "Each notebook costs 150/5 = 30 birr. Eight cost 8 x 30 = 240 birr."),
    q("A rectangle has a perimeter of 30 cm and a length of 9 cm. What is its width?", ["3 cm", "6 cm", "12 cm", "21 cm"], 1, "Perimeter is 2(length + width), so length + width = 15 and width = 6 cm."),
    q("Choose the word closest in meaning to 'precise'.", ["Accurate", "Vague", "Ordinary", "Lengthy"], 0, "'Precise' means exact or accurate."),
  ]),
];
