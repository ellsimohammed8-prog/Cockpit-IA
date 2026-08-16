import React from "react";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending_review":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          À Valider
        </span>
      );
    case "needs_manual_handling":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Revue Manuelle
        </span>
      );
    case "processed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Validé & Traité
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50 whitespace-nowrap">
          Rejeté
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
          {status}
        </span>
      );
  }
}

export function UrgencyBadge({ urgency }: { urgency?: string | null }) {
  switch (urgency) {
    case "high":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Haute
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Moyenne
        </span>
      );
    case "low":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Basse
        </span>
      );
    default:
      return <span className="text-slate-500 text-xs">-</span>;
  }
}

export function IntentBadge({ intent }: { intent?: string | null }) {
  switch (intent) {
    case "quote_request":
      return <span className="text-xs text-slate-200 font-medium whitespace-nowrap">Demande de devis</span>;
    case "information":
      return <span className="text-xs text-slate-300 whitespace-nowrap">Information</span>;
    case "complaint":
      return <span className="text-xs text-amber-300 font-medium whitespace-nowrap">Réclamation</span>;
    case "other":
      return <span className="text-xs text-slate-400 whitespace-nowrap">Autre</span>;
    default:
      return <span className="text-slate-500 text-xs">-</span>;
  }
}
