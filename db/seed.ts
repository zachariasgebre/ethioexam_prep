import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { exams, questions } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed the database");

const fixtures = [
  { subject: "Physics", year: "2015 E.C.", questions: [
    { prompt: "A car increases its velocity from 10 m/s to 20 m/s in 5 s. What is its acceleration?", options: ["2 m/s²", "5 m/s²", "10 m/s²", "30 m/s²"], correctOptionIndex: 0, explanation: "Acceleration is change in velocity divided by time: (20 − 10) / 5 = 2 m/s²." },
    { prompt: "What is the SI unit of electric current?", options: ["Volt", "Ampere", "Ohm", "Coulomb"], correctOptionIndex: 1, explanation: "The ampere (A) is the SI base unit of electric current." },
    { prompt: "A 2 kg object moves at 3 m/s. What is its kinetic energy?", options: ["3 J", "6 J", "9 J", "18 J"], correctOptionIndex: 2, explanation: "Kinetic energy is ½mv² = ½ × 2 × 3² = 9 J." },
    { prompt: "Which lens can produce a real image of a distant object?", options: ["Concave lens", "Convex lens", "Plane glass", "Any lens"], correctOptionIndex: 1, explanation: "A convex lens converges parallel rays and forms a real image at its focal plane." },
    { prompt: "A wave has frequency 4 Hz and wavelength 3 m. What is its speed?", options: ["0.75 m/s", "7 m/s", "12 m/s", "24 m/s"], correctOptionIndex: 2, explanation: "Wave speed is frequency × wavelength: 4 × 3 = 12 m/s." },
  ] },
  { subject: "Mathematics", year: "2016 E.C.", questions: [
    { prompt: "Solve 2x + 5 = 13.", options: ["x = 3", "x = 4", "x = 5", "x = 9"], correctOptionIndex: 1, explanation: "Subtract 5 from both sides and divide by 2: x = 4." },
    { prompt: "What is the gradient of the line through (1, 2) and (3, 8)?", options: ["2", "3", "4", "6"], correctOptionIndex: 1, explanation: "The gradient is (8 − 2) / (3 − 1) = 3." },
    { prompt: "What is the value of sin 30°?", options: ["0", "1/2", "√2/2", "1"], correctOptionIndex: 1, explanation: "For a standard special angle, sin 30° = 1/2." },
    { prompt: "What is the area of a circle with radius 3 units?", options: ["3π", "6π", "9π", "12π"], correctOptionIndex: 2, explanation: "The area is πr² = π × 3² = 9π square units." },
    { prompt: "If f(x) = x² − 1, what is f(3)?", options: ["2", "6", "8", "10"], correctOptionIndex: 2, explanation: "Substitute x = 3: f(3) = 3² − 1 = 8." },
  ] },
  { subject: "Biology", year: "2016 E.C.", questions: [
    { prompt: "Which organelle is the main site of aerobic respiration in a eukaryotic cell?", options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"], correctOptionIndex: 1, explanation: "Most aerobic respiration and ATP production in eukaryotic cells take place in mitochondria." },
    { prompt: "Which plant tissue transports water from roots toward the leaves?", options: ["Phloem", "Epidermis", "Xylem", "Cortex"], correctOptionIndex: 2, explanation: "Xylem conducts water and mineral ions from the roots through the plant." },
    { prompt: "What is the complementary DNA base for adenine?", options: ["Cytosine", "Guanine", "Thymine", "Uracil"], correctOptionIndex: 2, explanation: "In DNA, adenine pairs with thymine." },
    { prompt: "Which blood cells are primarily responsible for defending the body against pathogens?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells only"], correctOptionIndex: 1, explanation: "White blood cells are immune cells that help recognize and combat pathogens." },
    { prompt: "In a food chain, which organisms make organic food from inorganic substances?", options: ["Primary consumers", "Decomposers", "Producers", "Secondary consumers"], correctOptionIndex: 2, explanation: "Producers, such as green plants, make organic compounds, usually by photosynthesis." },
  ] },
  { subject: "Chemistry", year: "2016 E.C.", questions: [
    { prompt: "What is the atomic number of an element?", options: ["Number of neutrons", "Number of protons", "Number of protons and neutrons", "Number of electron shells"], correctOptionIndex: 1, explanation: "The atomic number is the number of protons in the nucleus of an atom." },
    { prompt: "What is the pH of a neutral aqueous solution at 25 °C?", options: ["0", "5", "7", "14"], correctOptionIndex: 2, explanation: "At 25 °C, a neutral aqueous solution has pH 7." },
    { prompt: "Which type of bond forms when atoms share pairs of electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correctOptionIndex: 1, explanation: "A covalent bond is formed when atoms share electron pairs." },
    { prompt: "How many moles are present in 18 g of water (H₂O)? Use H = 1 and O = 16.", options: ["0.5 mol", "1 mol", "2 mol", "18 mol"], correctOptionIndex: 1, explanation: "Water's molar mass is 18 g/mol, so 18 g is 1 mole." },
    { prompt: "Which gas is produced when an acid reacts with a carbonate?", options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"], correctOptionIndex: 2, explanation: "An acid reacting with a carbonate produces a salt, water, and carbon dioxide." },
  ] },
  { subject: "English", year: "2016 E.C.", questions: [
    { prompt: "Choose the grammatically correct sentence.", options: ["She have lived here for two years.", "She has lived here for two years.", "She is live here for two years.", "She living here since two years."], correctOptionIndex: 1, explanation: "The present perfect form 'has lived' describes a situation that began in the past and continues now." },
    { prompt: "Choose the closest meaning of 'rapid'.", options: ["Slow", "Quick", "Careful", "Quiet"], correctOptionIndex: 1, explanation: "'Rapid' means happening or moving quickly." },
    { prompt: "Complete the sentence: If I ___ enough time, I would learn another language.", options: ["have", "had", "will have", "am having"], correctOptionIndex: 1, explanation: "The second conditional uses past simple in the if-clause: 'If I had… I would…'." },
    { prompt: "Choose the correct passive form: 'The students completed the assignment.'", options: ["The assignment completed the students.", "The assignment was completed by the students.", "The assignment is completing by the students.", "The students were completed by the assignment."], correctOptionIndex: 1, explanation: "The past simple passive uses 'was/were + past participle': 'was completed'." },
    { prompt: "Which word is the adverb in this sentence: 'The careful driver moved slowly.'?", options: ["careful", "driver", "moved", "slowly"], correctOptionIndex: 3, explanation: "'Slowly' is an adverb describing how the driver moved." },
  ] },
];

async function seed() {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  try {
    for (const fixture of fixtures) {
      const [existing] = await db.select({ id: exams.id }).from(exams)
        .where(and(eq(exams.subject, fixture.subject), eq(exams.year, fixture.year))).limit(1);
      const [exam] = existing
        ? await db.update(exams).set({ totalQuestions: fixture.questions.length }).where(eq(exams.id, existing.id)).returning({ id: exams.id })
        : await db.insert(exams).values({ subject: fixture.subject, year: fixture.year, totalQuestions: fixture.questions.length, isPremium: false }).returning({ id: exams.id });
      await db.delete(questions).where(eq(questions.examId, exam.id));
      await db.insert(questions).values(fixture.questions.map((question) => ({ ...question, examId: exam.id })));
    }
    console.log("Seeded the sample Physics and Mathematics exams.");
  } finally { await pool.end(); }
}

seed().catch((error: unknown) => { console.error("Database seed failed", error); process.exitCode = 1; });
