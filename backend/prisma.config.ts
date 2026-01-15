import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma wants DATABASE_URL
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
  migrations: {
    // Your seed command
    seed: "npx tsx prisma/seed.ts",
  },
});
