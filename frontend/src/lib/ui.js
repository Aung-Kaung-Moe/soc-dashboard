export const cls = (...parts) => parts.filter(Boolean).join(" ");

// Modern Obsidian palette mapping
export const SEVERITY_META = {
  Critical: {
    badge:
      "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 shadow-[0_0_0_1px_rgba(244,63,94,0.15),0_0_18px_rgba(244,63,94,0.12)]",
    dot: "bg-rose-400",
    card: "ring-rose-500/25",
  },
  Medium: {
    badge: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    dot: "bg-amber-400",
    card: "ring-amber-500/25",
  },
  Low: {
    badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    dot: "bg-emerald-400",
    card: "ring-emerald-500/25",
  },
};

export const STATUS_META = {
  Open: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20",
  Investigating: "bg-slate-800/60 text-slate-200 ring-1 ring-slate-700/60",
  Closed: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20",
};

export const PIE_COLORS = ["#3B82F6", "#F59E0B", "#F43F5E", "#10B981"]; // blue/amber/rose/emerald
