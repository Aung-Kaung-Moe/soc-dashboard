// backend/src/prisma.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Prisma 7 + adapters: this adapter expects input params with `url`,
// not a better-sqlite3 Database instance.
const url = process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaBetterSqlite3({ url });

export const prisma = new PrismaClient({ adapter });
