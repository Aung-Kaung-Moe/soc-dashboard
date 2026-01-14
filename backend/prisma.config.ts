import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  // ✅ Needed for migrate dev
  datasource: {
    url: process.env.DATABASE_URL,
  },

  // ✅ Prisma v7 seed command
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
