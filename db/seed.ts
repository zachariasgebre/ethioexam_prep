import { db } from "./index";
import { exams, questions } from "./schema";

async function seed() {
  console.log("🌱 Seeding database with sample exams and questions...");

  // Insert sample exams
  const [exam1] = await db.insert(exams).values({
    subject: "Physics",
    year: "2015 E.C.",
    totalQuestions: 3,
    isPremium: false,
  }).returning();

  const [exam2] = await db.insert(exams).values({
    subject: "Mathematics",
    year: "2016 E.C.",
    totalQuestions: 3,
    isPremium: false,
  }).returning();

  // Insert questions for Physics
  if (exam1) {
    await db.insert(questions).values([
      {
        examId: exam1.id,
        prompt: "What is the SI unit of electric current?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correctOptionIndex: 1,
        explanation: "Ampere is the standard international unit for electric current.",
      },
      {
        examId: exam1.id,
        prompt: "Which of the following is a vector quantity?",
        options: ["Speed", "Distance", "Velocity", "Mass"],
        correctOptionIndex: 2,
        explanation: "Velocity has both magnitude and direction, making it a vector quantity.",
      },
      {
        examId: exam1.id,
        prompt: "What is the acceleration due to gravity on Earth approximately?",
        options: ["9.8 m/s²", "3.0 × 10⁸ m/s", "6.67 × 10⁻¹¹", "1.6 m/s²"],
        correctOptionIndex: 0,
        explanation: "Standard acceleration due to gravity is approximately 9.8 m/s².",
      },
    ]);
  }

  // Insert questions for Mathematics
  if (exam2) {
    await db.insert(questions).values([
      {
        examId: exam2.id,
        prompt: "What is the derivative of x² with respect to x?",
        options: ["x", "2x", "x²", "2"],
        correctOptionIndex: 1,
        explanation: "Using the power rule, d/dx(x²) = 2x.",
      },
      {
        examId: exam2.id,
        prompt: "What is the value of sin(90°)?",
        options: ["0", "0.5", "1", "-1"],
        correctOptionIndex: 2,
        explanation: "Sine of 90 degrees is 1.",
      },
      {
        examId: exam2.id,
        prompt: "Solve for x: 2x + 4 = 10",
        options: ["2", "3", "4", "5"],
        correctOptionIndex: 1,
        explanation: "2x = 6, so x = 3.",
      },
    ]);
  }

  console.log("✅ Database seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
