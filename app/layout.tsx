import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: "EthioExam Prep",
  description: "Prepare for Ethiopian national exams with focused practice.",
  applicationName: "EthioExam Prep",
  openGraph: {
    title: "EthioExam Prep",
    description: "Prepare for Ethiopian national exams with focused practice.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
