export const ANALYST = { name: "Aung Thar", role: "L1 Analyst" };

export const ALERTS_OVER_TIME = [
  { time: "00:00", alerts: 4 },
  { time: "03:00", alerts: 8 },
  { time: "06:00", alerts: 6 },
  { time: "09:00", alerts: 14 },
  { time: "12:00", alerts: 18 },
  { time: "15:00", alerts: 12 },
  { time: "18:00", alerts: 20 },
  { time: "21:00", alerts: 15 },
];

export const SEVERITY_DISTRIBUTION = [
  { severity: "Critical", count: 9 },
  { severity: "Medium", count: 17 },
  { severity: "Low", count: 26 },
];

export const ATTACK_TYPES = [
  { type: "Brute Force", value: 28 },
  { type: "Malware", value: 18 },
  { type: "Phishing", value: 32 },
  { type: "Port Scan", value: 22 },
];

export const ALERTS = [
  {
    id: "AL-10001",
    timestamp: "2026-01-12 00:12:09",
    sourceIp: "185.71.65.20",
    alertType: "Brute Force Attempt",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "AL-10002",
    timestamp: "2026-01-12 00:10:44",
    sourceIp: "203.0.113.77",
    alertType: "Suspicious PowerShell",
    severity: "Critical",
    status: "Investigating",
  },
  {
    id: "AL-10003",
    timestamp: "2026-01-12 00:09:12",
    sourceIp: "91.198.174.192",
    alertType: "Port Scan",
    severity: "Medium",
    status: "Open",
  },
  {
    id: "AL-10004",
    timestamp: "2026-01-12 00:07:52",
    sourceIp: "198.51.100.12",
    alertType: "Phishing URL Detected",
    severity: "Medium",
    status: "Closed",
  },
  {
    id: "AL-10005",
    timestamp: "2026-01-12 00:05:03",
    sourceIp: "192.0.2.55",
    alertType: "Malware Signature Hit",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "AL-10006",
    timestamp: "2026-01-12 00:03:40",
    sourceIp: "146.70.120.9",
    alertType: "Failed Login Spike",
    severity: "Low",
    status: "Investigating",
  },
  {
    id: "AL-10007",
    timestamp: "2026-01-12 00:02:18",
    sourceIp: "45.33.32.156",
    alertType: "Anomalous DNS Query",
    severity: "Low",
    status: "Open",
  },
  {
    id: "AL-10008",
    timestamp: "2026-01-12 00:01:11",
    sourceIp: "104.26.10.78",
    alertType: "WAF Rule Triggered",
    severity: "Medium",
    status: "Open",
  },
];

export const LOG_LINES = [
  { ts: "00:12:10", level: "WARN", msg: "Multiple failed logins detected for user=admin from 185.71.65.20" },
  { ts: "00:12:09", level: "ALERT", msg: "Brute force threshold exceeded: src=185.71.65.20 attempts=42/2m" },
  { ts: "00:10:45", level: "ALERT", msg: "Suspicious PowerShell: encodedCommand detected on host=WIN-7Q2A" },
  { ts: "00:10:12", level: "INFO", msg: "EDR heartbeat OK host=WIN-7Q2A policy=baseline-v3" },
  { ts: "00:09:12", level: "WARN", msg: "Port scan detected: src=91.198.174.192 ports=22,80,443,3389" },
  { ts: "00:07:53", level: "INFO", msg: "URL reputation check: phishing URL blocked by secure-web-gateway" },
  { ts: "00:05:03", level: "ALERT", msg: "Malware signature hit: Trojan.Generic on endpoint=MAC-19" },
  { ts: "00:03:40", level: "WARN", msg: "Auth failures rising: service=sshd failures=18/5m" },
  { ts: "00:02:18", level: "INFO", msg: "DNS query: suspicious domain=update-check[.]live blocked=true" },
  { ts: "00:01:11", level: "INFO", msg: "WAF triggered: rule=SQLi-942100 path=/login status=403" },
];
