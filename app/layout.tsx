import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EthioExam Prep",
  description: "Prepare for Ethiopian national exams with focused practice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
