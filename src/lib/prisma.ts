// lib/prisma.ts

import bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/src/generated/prisma/client";

// Allow self-signed certificates (required for Supabase in some environments)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrator";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase pooler with self-signed certs
    },
    // Limit connections to avoid issues with PgBouncer
    max: 1,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
}

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Ensure a default ADMIN user exists using env credentials
let ensureAdminPromise: Promise<void> | null = null;
async function ensureAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    // Skip if not configured; avoids noisy logs in environments without admin
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL, role: "SUPERADMIN" },
  });
  if (existing) {
    // Optionally update role to ADMIN if it drifted
    if (existing.role !== "SUPERADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPERADMIN" },
      });
    }
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashed,
      name: ADMIN_NAME,
      role: "SUPERADMIN",
    },
  });
}

if (!ensureAdminPromise) {
  ensureAdminPromise = ensureAdmin().catch(() => {
    // Intentionally swallow to avoid crashing the app on boot if DB not ready; can log if needed
  });
}
