import "server-only";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      hasPaid: { type: "boolean", required: false, defaultValue: false, input: false },
    },
  },
  plugins: [admin()],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
