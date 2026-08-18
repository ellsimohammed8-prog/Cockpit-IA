"use client";

import React, { useState } from "react";
import { InboundRequestRecord, ParsedRequest } from "@/lib/schema";
import { StatusBadge, UrgencyBadge, IntentBadge } from "./Badges";
import {
  Eye,
  Search,
  Plus,
  Trash2,
  Inbox,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { formatCockpitDate } from "@/lib/utils";
import { useLanguage } from "@/lib/languageContext";

interface RequestsTableProps {
  requests: InboundRequestRecord[];
  onSelectRequest: (request: InboundRequestRecord) => void;
  onRequestsUpdated: () => void;
}

export function RequestsTable({
  requests,
  onSelectRequest,
  onRequestsUpdated,
}: RequestsTableProps) {
  const { t } = useLanguage();
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Manual Request Form State
  const [manualForm, setManualForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    raw_content: "",
    intent: "quote_request" as const,
    urgency: "medium" as const,
    itemsText: "1x Cordless Drill 18V, 5x Box 500 Screws",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = requests.filter((req) => {
    if (filterTab === "pending" && req.status !== "pending_review") return false;
    if (filterTab === "manual" && req.status !== "needs_manual_handling") return false;
    if (filterTab === "processed" && req.status !== "processed") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = req.client_name?.toLowerCase().includes(q);
      const matchEmail = req.client_email?.toLowerCase().includes(q);
      const matchRaw = req.raw_content.toLowerCase().includes(q);
      const matchSummary = req.parsed_data?.summary.toLowerCase().includes(q);
      return matchName || matchEmail || matchRaw || matchSummary;
    }

    return true;
  });

  const pendingCount = requests.filter((r) => r.status === "pending_review").length;
  const manualCount = requests.filter((r) => r.status === "needs_manual_handling").length;
  const processedCount = requests.filter((r) => r.status === "processed").length;

  const handleDeleteRequest = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(t.requests.deletedSuccess);
        onRequestsUpdated();
      }
    } catch (err) {
      console.error("Erreur suppression demande:", err);
    }
  };

  const handleClearAllRequests = async () => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_requests" }),
      });
      if (res.ok) {
        setIsClearConfirmOpen(false);
        showToast(t.requests.allClearedSuccess);
        onRequestsUpdated();
      }
    } catch (err) {
      console.error("Erreur vidage demandes:", err);
    }
  };

  const handleManualRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.client_name.trim() || !manualForm.raw_content.trim()) return;

    setIsSubmitting(true);

    const items = manualForm.itemsText
      .split(",")
      .map((itemStr) => {
        const trimmed = itemStr.trim();
        const match = trimmed.match(/^(\d+)\s*x?\s*(.+)$/i);
        if (match) {
          return { product_name: match[2].trim(), quantity: parseInt(match[1], 10) || 1 };
        }
        return { product_name: trimmed, quantity: 1 };
      })
      .filter((it) => it.product_name.length > 0);

    const parsedData: ParsedRequest = {
      client_name: manualForm.client_name.trim(),
      client_email: manualForm.client_email.trim() || null,
      intent: manualForm.intent,
      urgency: manualForm.urgency,
      requested_items: items,
      summary: `Manual Entry: ${manualForm.raw_content.slice(0, 80)}...`,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: manualForm.client_name.trim(),
          client_email: manualForm.client_email.trim() || null,
          raw_content: `[Manual Entry]\nClient: ${manualForm.client_name}\nPhone: ${manualForm.client_phone || "-"}\n\n${manualForm.raw_content}`,
          parsed_data: parsedData,
          status: "pending_review",
        }),
      });

      if (res.ok) {
        showToast(`${manualForm.client_name}: ${t.common.success}`);
        setIsManualModalOpen(false);
        setManualForm({
          client_name: "",
          client_email: "",
          client_phone: "",
          raw_content: "",
          intent: "quote_request",
          urgency: "medium",
          itemsText: "",
        });
        onRequestsUpdated();
      }
    } catch (err) {
      console.error("Erreur création manuelle:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111318] border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      {/* Section Header */}
      <div className="p-5 border-b border-white/[0.07] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              {t.requests.title}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                {requests.length} {t.requests.countSuffix}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
              {t.requests.subtitle}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Strict Controlled Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              name="search_ctrl_query"
              id="search_ctrl_query"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder={t.requests.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-white/[0.06] border border-white/[0.08] pointer-events-none">
              /
            </span>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.requests.newManualBtn}</span>
          </button>

          {requests.length > 0 && (
            <button
              onClick={() => setIsClearConfirmOpen(true)}
              className="h-9 px-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-white/[0.07] transition-colors cursor-pointer"
              title={t.requests.clearAllBtn}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-5 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Unified Single Filter Tabs Bar */}
      <div className="px-5 py-2.5 bg-black/20 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setFilterTab("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            filterTab === "all"
              ? "bg-white/[0.1] text-white font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          {t.requests.tabAll} ({requests.length})
        </button>
        <button
          onClick={() => setFilterTab("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === "pending"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm"
              : "text-amber-400/80 hover:text-amber-300 hover:bg-white/[0.04]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t.requests.tabToValidate} ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab("manual")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === "manual"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold shadow-sm"
              : "text-rose-400/80 hover:text-rose-300 hover:bg-white/[0.04]"
          }`}
        >
          {t.requests.tabManualReview} ({manualCount})
        </button>
        <button
          onClick={() => setFilterTab("processed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === "processed"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm"
              : "text-emerald-400/80 hover:text-emerald-300 hover:bg-white/[0.04]"
          }`}
        >
          {t.requests.tabProcessed} ({processedCount})
        </button>
      </div>

      {/* Requests Table without Badge Overload */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-black/30 border-b border-white/[0.06] text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">{t.requests.colClient}</th>
              <th className="py-3 px-5">{t.requests.colIntent}</th>
              <th className="py-3 px-5">{t.requests.colUrgency}</th>
              <th className="py-3 px-5">{t.requests.colStatus}</th>
              <th className="py-3 px-5">{t.requests.colItems}</th>
              <th className="py-3 px-5">{t.requests.colDate}</th>
              <th className="py-3 px-5 text-right">{t.requests.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500">
                  {requests.length === 0
                    ? t.requests.emptyDesc
                    : t.requests.emptyTitle}
                </td>
              </tr>
            ) : (
              filtered.map((req) => {
                return (
                  <tr
                    key={req.id}
                    onClick={() => onSelectRequest(req)}
                    className="hover:bg-slate-900/40 cursor-pointer transition-colors group"
                  >
                    {/* Client Name & Email */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {req.client_name || (
                          <span className="text-slate-500 italic font-normal">{t.common.none}</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {req.client_email || <span className="text-slate-600">-</span>}
                      </div>
                    </td>

                    {/* Intention */}
                    <td className="py-3.5 px-5">
                      <IntentBadge intent={req.parsed_data?.intent} />
                    </td>

                    {/* Urgence */}
                    <td className="py-3.5 px-5">
                      <UrgencyBadge urgency={req.parsed_data?.urgency} />
                    </td>

                    {/* Statut */}
                    <td className="py-3.5 px-5">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Articles Détectés */}
                    <td className="py-3.5 px-5 max-w-xs">
                      {req.parsed_data?.requested_items && req.parsed_data.requested_items.length > 0 ? (
                        <div className="text-xs text-slate-300 leading-relaxed truncate" title={req.parsed_data.requested_items.map((it) => `${it.quantity}x ${it.product_name}`).join(", ")}>
                          {req.parsed_data.requested_items
                            .map((item) => `${item.quantity}x ${item.product_name}`)
                            .join(", ")}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-slate-400 text-xs font-mono tabular-nums whitespace-nowrap">
                      {formatCockpitDate(req.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequest(req);
                          }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                          title={t.requests.viewDetails}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRequest(req.id, e)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                          title={t.requests.deleteTooltip}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Request Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#111318] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-black/30 border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">
                  {t.requests.modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualRequestSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.requests.formClientName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.client_name}
                    onChange={(e) => setManualForm({ ...manualForm, client_name: e.target.value })}
                    placeholder="Ex: Entreprise Martin"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.requests.formClientEmail}
                  </label>
                  <input
                    type="email"
                    value={manualForm.client_email}
                    onChange={(e) => setManualForm({ ...manualForm, client_email: e.target.value })}
                    placeholder="Ex: martin@chantier.fr"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.requests.formClientPhone}
                  </label>
                  <input
                    type="tel"
                    value={manualForm.client_phone}
                    onChange={(e) => setManualForm({ ...manualForm, client_phone: e.target.value })}
                    placeholder="Ex: 06 12 34 56 78"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t.requests.formUrgency}
                  </label>
                  <select
                    value={manualForm.urgency}
                    onChange={(e) => setManualForm({ ...manualForm, urgency: e.target.value as any })}
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">{t.badges.urgencyLow}</option>
                    <option value="medium">{t.badges.urgencyMedium}</option>
                    <option value="high">{t.badges.urgencyHigh}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.requests.formItemsLabel}
                </label>
                <input
                  type="text"
                  value={manualForm.itemsText}
                  onChange={(e) => setManualForm({ ...manualForm, itemsText: e.target.value })}
                  placeholder={t.requests.formItemsHint}
                  className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.requests.formRawContent} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={manualForm.raw_content}
                  onChange={(e) => setManualForm({ ...manualForm, raw_content: e.target.value })}
                  placeholder="..."
                  className="w-full bg-black/40 border border-white/[0.08] rounded-lg p-3 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? t.requests.formSubmitting : t.requests.formSubmitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111318] border border-white/[0.08] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-white">{t.requests.clearAllConfirmTitle}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.requests.clearAllConfirmDesc}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-medium cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleClearAllRequests}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                {t.requests.clearConfirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
