// backend/prisma/seed.ts
import { prisma } from "../src/prisma";
import { AlertStatus, Severity, Prisma } from "@prisma/client";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)];
}
function ip() {
  return `${randInt(10, 250)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

async function main() {
  // Clean (dev only)
  await prisma.auditLog.deleteMany();
  await prisma.logEntry.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.user.deleteMany();

  // Users (string enum values; must match schema enums)
  await prisma.user.createMany({
    data: [
      { name: "Aung Thar", email: "aung@soc.local", passwordHash: "devhash", role: "Admin" },
      { name: "L1 Analyst", email: "l1@soc.local", passwordHash: "devhash", role: "L1" },
      { name: "L2 Analyst", email: "l2@soc.local", passwordHash: "devhash", role: "L2" },
    ],
  });

  const users = await prisma.user.findMany();
  const l1 = users.find((u) => u.role === "L1") ?? users[0];

  const alertTypes = ["Brute Force", "Malware", "Phishing", "Port Scan", "Suspicious Login"];
  const sources = ["WAF", "EDR", "Firewall"];
  const hostnames = ["web-01", "api-01", "db-01", "mail-01", "vpn-01"];
  const tagsPool = ["ssh", "rdp", "geofence", "ioc", "botnet", "tor", "suspicious", "auth"];

  const now = Date.now();

  // Alerts
  const alerts: Prisma.AlertCreateManyInput[] = Array.from({ length: 60 }).map(() => {
    const sev = pick([Severity.Critical, Severity.Medium, Severity.Low]);
    const status = pick([AlertStatus.Open, AlertStatus.Investigating, AlertStatus.Closed]);
    const ts = new Date(now - randInt(0, 24 * 60) * 60_000);

    const tags = Array.from({ length: randInt(1, 3) }).map(() => pick(tagsPool));

    return {
      timestamp: ts,
      sourceIp: ip(),
      destinationIp: ip(),
      alertType: pick(alertTypes),
      severity: sev,
      status,
      title: `${sev} - ${pick(alertTypes)}`,
      description: "Auto-generated SOC alert for development seed data.",
      ruleName: `RULE-${randInt(1000, 9999)}`,
      source: pick(sources),
      hostname: pick(hostnames),
      user: pick(["root", "admin", "john", "svc-api", "unknown"]),
      tags: tags as any, // SQLite Json
      assignedToId: Math.random() > 0.3 ? l1.id : null,
      createdAt: ts,
      updatedAt: ts,
      eventCount: randInt(1, 250),
      correlationId: `corr-${randInt(100000, 999999)}`,
    };
  });

  await prisma.alert.createMany({ data: alerts });

  // Logs (string enums: INFO/WARN/ERROR must match your schema)
  const logSources = ["waf", "edr", "fw", "auth", "nginx"];
  const levels = ["INFO", "WARN", "ERROR"] as const;
  const messages = [
    "Login attempt",
    "Blocked request",
    "Malware signature matched",
    "Rate limit triggered",
    "Port scan detected",
    "Suspicious user agent",
  ];

  const logs: Prisma.LogEntryCreateManyInput[] = Array.from({ length: 400 }).map(() => {
    const ts = new Date(now - randInt(0, 6 * 60) * 60_000);
    return {
      timestamp: ts,
      level: pick([...levels]) as any,
      message: `${pick(messages)} from ${ip()}`,
      source: pick(logSources),
      host: pick(hostnames),
      raw: {
        ip: ip(),
        path: pick(["/login", "/wp-admin", "/api/auth", "/admin", "/health"]),
        ua: pick(["curl/7.68", "Mozilla/5.0", "python-requests/2.31", "Go-http-client/1.1"]),
        status: pick([200, 401, 403, 404, 500]),
      } as any,
    };
  });

  await prisma.logEntry.createMany({ data: logs });

  // One audit example
  const anyAlert = await prisma.alert.findFirst();
  if (anyAlert) {
    await prisma.auditLog.create({
      data: {
        actorUserId: l1.id,
        action: "SEED_INIT",
        entityType: "Alert",
        entityId: anyAlert.id,
        before: Prisma.JsonNull,
        after: anyAlert as any,
      },
    });
  }

  console.log("✅ Seed completed.");
  console.log("👤 Users:", users.map((u) => `${u.role}=${u.id}`).join(" | "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
