import { prisma } from "../src/prisma";
import { AlertStatus, Severity, Role, LogLevel } from "@prisma/client";

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)];
const ip = () => `${randInt(1, 223)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;

const ALERT_TYPES = ["Brute Force", "Malware", "Phishing", "Port Scan", "Suspicious Login"];
const SOURCES = ["Firewall", "EDR", "WAF", "Identity"];
const HOSTS = ["vpn01", "dc01", "web01", "api01", "mail01", "laptop-7", "db01"];
const USERS = ["jdoe", "alice", "svc_backup", "root", "admin", "bob"];

async function main() {
  // clean dev db
  await prisma.auditLog.deleteMany();
  await prisma.logEntry.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.user.deleteMany();

  // users
  const admin = await prisma.user.create({
    data: { name: "SOC Admin", email: "admin@soc.local", role: Role.ADMIN },
  });
  const l1 = await prisma.user.create({
    data: { name: "L1 Analyst", email: "l1@soc.local", role: Role.ANALYST_L1 },
  });
  const l2 = await prisma.user.create({
    data: { name: "L2 Analyst", email: "l2@soc.local", role: Role.ANALYST_L2 },
  });

  const now = Date.now();

  // alerts
  await prisma.alert.createMany({
    data: Array.from({ length: 40 }).map((_, i) => {
      const sev = pick([Severity.Critical, Severity.High, Severity.Medium, Severity.Low]);
      const status = pick([AlertStatus.Open, AlertStatus.Investigating, AlertStatus.Closed]);

      const tags =
        sev === Severity.Critical
          ? ["urgent", "triage"]
          : sev === Severity.High
          ? ["review"]
          : ["info"];

      return {
        timestamp: new Date(now - i * 8 * 60 * 1000),
        severity: sev,
        status,
        title: `${pick(ALERT_TYPES)} detected`,
        alertType: pick(ALERT_TYPES),
        sourceIp: ip(),
        destinationIp: ip(),
        source: pick(SOURCES),
        hostname: pick(HOSTS),
        user: pick(USERS),
        ruleName: `RULE-${randInt(100, 999)}`,
        correlationId: `CORR-${randInt(10000, 99999)}`,
        eventCount: randInt(1, 40),
        tags, // JSON column in SQLite
        assignedToId: pick([admin.id, l1.id, l2.id, null]),
        description: "Seeded alert for UI testing",
      };
    }),
  });

  // logs
  await prisma.logEntry.createMany({
    data: Array.from({ length: 60 }).map((_, i) => ({
      timestamp: new Date(now - i * 5 * 60 * 1000),
      level: pick([LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]),
      message: `Seed log message #${i + 1}`,
      source: pick(SOURCES),
      host: pick(HOSTS),
    })),
  });

  // some audit events (optional)
  await prisma.auditLog.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(now - i * 60 * 60 * 1000),
      actorUserId: pick([admin.id, l1.id, l2.id]),
      action: "SEED_EVENT",
      entityType: "System",
      entityId: `seed-${i + 1}`,
      before: null,
      after: { ok: true, index: i + 1 },
    })),
  });

  console.log("✅ Seed completed.");
  console.log(`👤 Users: Admin=${admin.id} | L1=${l1.id} | L2=${l2.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
