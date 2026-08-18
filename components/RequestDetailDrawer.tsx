"use client";

import React, { useState, useEffect } from "react";
import { InboundRequestRecord, ParsedRequest, ProductStockRecord } from "@/lib/schema";
import { StatusBadge } from "./Badges";
import { formatCockpitDate } from "@/lib/utils";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  PackageCheck,
  Save,
  Building2,
  Mail,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface RequestDetailDrawerProps {
  request: InboundRequestRecord | null;
  products: ProductStockRecord[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function RequestDetailDrawer({
  request,
  products,
  isOpen,
  onClose,
  onUpdate,
}: RequestDetailDrawerProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<ParsedRequest>({
    client_name: null,
    client_email: null,
    intent: "quote_request",
    urgency: "medium",
    requested_items: [],
    summary: "",
    email_draft: "",
  });

  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState<string>("pending_review");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    if (request) {
      setRawText(request.raw_content);
      setStatus(request.status);

      if (request.parsed_data) {
        setFormData({
          client_name: request.parsed_data.client_name || request.client_name,
          client_email: request.parsed_data.client_email || request.client_email,
          intent: request.parsed_data.intent || "quote_request",
          urgency: request.parsed_data.urgency || "medium",
          requested_items: request.parsed_data.requested_items || [],
          summary: request.parsed_data.summary || "",
          total_amount: request.parsed_data.total_amount,
          email_draft: request.parsed_data.email_draft || "",
        });
      } else {
        setFormData({
          client_name: request.client_name || "",
          client_email: request.client_email || "",
          intent: "other",
          urgency: "medium",
          requested_items: [],
          summary: "Unstructured customer message requiring manual input.",
          email_draft: "",
        });
      }
      setFeedbackMsg(null);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleItemChange = (index: number, field: "product_name" | "quantity", value: any) => {
    const updated = [...formData.requested_items];
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" ? Math.max(1, parseInt(value, 10) || 1) : value,
    };
    setFormData({ ...formData, requested_items: updated });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      requested_items: [
        ...formData.requested_items,
        { product_name: language === "en" ? "New item" : "Nouvel article", quantity: 1 },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updated = formData.requested_items.filter((_, i) => i !== index);
    setFormData({ ...formData, requested_items: updated });
  };

  // Calcul du devis chiffré basé sur le catalogue stock
  let calculatedTotalCents = 0;
  const itemsBreakdown = formData.requested_items.map((item) => {
    const matched = products.find(
      (p) =>
        p.name.toLowerCase().includes(item.product_name.toLowerCase()) ||
        item.product_name.toLowerCase().includes(p.name.toLowerCase()) ||
        p.sku.toLowerCase() === item.product_name.toLowerCase()
    );

    const unitPriceCents = matched ? matched.unit_price_cents : 2500;
    const lineTotalCents = unitPriceCents * item.quantity;
    calculatedTotalCents += lineTotalCents;

    return {
      name: item.product_name,
      quantity: item.quantity,
      unitPriceEur: (unitPriceCents / 100).toFixed(2),
      lineTotalEur: (lineTotalCents / 100).toFixed(2),
      matchedSku: matched?.sku,
    };
  });

  const totalEurFormatted = (calculatedTotalCents / 100).toFixed(2);

  // Compose dynamic email draft based on language
  const clientDisplayName = formData.client_name || (language === "en" ? "Dear Customer" : "Madame, Monsieur");
  const defaultGeneratedDraft = language === "en"
    ? `Hello ${clientDisplayName},

Thank you for your quotation request.

Here is the breakdown of our commercial proposal:
${itemsBreakdown.map((it) => `- ${it.quantity}x ${it.name} ${it.matchedSku ? `(SKU: ${it.matchedSku})` : ""} : ${it.unitPriceEur} € excl. VAT — Subtotal : ${it.lineTotalEur} € excl. VAT`).join("\n")}

Total Amount : ${totalEurFormatted} € excl. VAT
Lead Time : Dispatch within 24h to 48h.
Availability : In stock.

This quote is valid for 30 days. Feel free to contact us for any questions.

Best regards,
Sales Department`
    : `Bonjour ${clientDisplayName},

Nous faisons suite à votre demande et nous vous en remercions.

Voici le détail de notre proposition tarifaire :
${itemsBreakdown.map((it) => `- ${it.quantity}x ${it.name} ${it.matchedSku ? `(Réf: ${it.matchedSku})` : ""} : ${it.unitPriceEur} € HT — Sous-total : ${it.lineTotalEur} € HT`).join("\n")}

Montant Total : ${totalEurFormatted} € HT
Délai de préparation : Expédition sous 24h à 48h.
Disponibilité : Validée en stock.

Ce devis reste valable pendant une durée de 30 jours. Pour toute validation ou question complémentaire, nous restons à votre entière disposition.

Bien cordialement,
Le Service Commercial`;

  const activeEmailDraft = formData.email_draft || defaultGeneratedDraft;

  const handleCopyEmailDraft = () => {
    navigator.clipboard.writeText(activeEmailDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleSaveAction = async (newStatus?: "processed" | "needs_manual_handling" | "rejected") => {
    setIsSaving(true);
    setFeedbackMsg(null);

    const targetStatus = newStatus || status;

    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          client_name: formData.client_name,
          client_email: formData.client_email,
          parsed_data: {
            ...formData,
            email_draft: activeEmailDraft,
            total_amount: parseFloat(totalEurFormatted) || 0,
          },
          deductStockOnApprove: true,
        }),
      });

      if (res.ok) {
        if (targetStatus === "processed" && formData.client_email) {
          try {
            const outboundMode = typeof window !== "undefined" ? localStorage.getItem("cockpit_outbound_mode") || "turbosmtp" : "turbosmtp";
            const inboundEmail = typeof window !== "undefined" ? localStorage.getItem("cockpit_inbound_email") || "" : "";
            const inboundPass = typeof window !== "undefined" ? localStorage.getItem("cockpit_inbound_password") || "" : "";
            const inboundProvider = typeof window !== "undefined" ? localStorage.getItem("cockpit_inbound_provider") || "gmail" : "gmail";

            let smtpHost = typeof window !== "undefined" ? localStorage.getItem("cockpit_smtp_host") || "pro.eu.turbo-smtp.com" : "pro.eu.turbo-smtp.com";
            let smtpPort = typeof window !== "undefined" ? Number(localStorage.getItem("cockpit_smtp_port")) || 465 : 465;
            let smtpUser = typeof window !== "undefined" ? localStorage.getItem("cockpit_smtp_user") || "" : "";
            let smtpPass = typeof window !== "undefined" ? localStorage.getItem("cockpit_smtp_pass") || "" : "";
            let smtpFrom = typeof window !== "undefined" ? localStorage.getItem("cockpit_smtp_from") || inboundEmail || "commercial@votre-entreprise.fr" : "commercial@votre-entreprise.fr";

            if (outboundMode === "same_as_inbound") {
              smtpHost = inboundProvider === "gmail" ? "smtp.gmail.com" : "smtp.office365.com";
              smtpPort = inboundProvider === "gmail" ? 465 : 587;
              smtpUser = inboundEmail;
              smtpPass = inboundPass;
              smtpFrom = inboundEmail;
            }

            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: formData.client_email,
                subject: language === "en"
                  ? `Commercial Quote Proposal — ${formData.summary || "Your Order"}`
                  : `Proposition commerciale & Devis — ${formData.summary || "Votre commande"}`,
                text: activeEmailDraft,
                smtpConfig: {
                  host: smtpHost,
                  port: smtpPort,
                  user: smtpUser,
                  pass: smtpPass,
                  fromEmail: smtpFrom,
                },
              }),
            });
          } catch (emailErr) {
            console.warn("[Email Outbound Dispatch]:", emailErr);
          }
        }

        setStatus(targetStatus);
        setFeedbackMsg(
          targetStatus === "processed"
            ? t.drawer.validatedSuccess
            : targetStatus === "needs_manual_handling"
            ? t.drawer.manualSuccess
            : t.drawer.savedSuccess
        );
        onUpdate();
        if (targetStatus === "processed") {
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
      setFeedbackMsg(t.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-3xl bg-[#0e1628] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0e1628]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.drawer.title}
              </h2>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
              <span>ID: {request.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatCockpitDate(request.created_at)}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {feedbackMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Section 1: Message Brut Inbound */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.drawer.sectionOriginalEmail}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Cpu className="w-3 h-3 text-blue-400" />
                {request.ai_provider || "AI Engine"}
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {rawText}
            </div>
          </div>

          {/* Section 2: Formulaire Human-in-the-Loop */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {t.drawer.subtitle}
              </h3>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {t.requests.formClientName}
                </label>
                <input
                  type="text"
                  value={formData.client_name || ""}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Ex: Thomas Martin"
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {t.requests.formClientEmail}
                </label>
                <input
                  type="email"
                  value={formData.client_email || ""}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="Ex: contact@client.fr"
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Urgence et Intention */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.requests.formIntent}
                </label>
                <select
                  value={formData.intent}
                  onChange={(e) => setFormData({ ...formData, intent: e.target.value as any })}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="quote_request">{t.badges.intentQuote}</option>
                  <option value="information">{t.badges.intentInfo}</option>
                  <option value="complaint">{t.badges.intentComplaint}</option>
                  <option value="other">{t.badges.intentOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.requests.formUrgency}
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="low">{t.badges.urgencyLow}</option>
                  <option value="medium">{t.badges.urgencyMedium}</option>
                  <option value="high">{t.badges.urgencyHigh}</option>
                </select>
              </div>
            </div>

            {/* Résumé */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {t.common.description}
              </label>
              <input
                type="text"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Articles et Quantités demandées */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-slate-300 flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-blue-400" />
                  {t.drawer.sectionQuoteSummary}
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.drawer.addItemBtn}
                </button>
              </div>

              {formData.requested_items.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 text-center text-slate-400">
                  {t.drawer.addItemBtn}
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.requested_items.map((item, idx) => {
                    const matchedProduct = products.find((p) =>
                      p.name.toLowerCase().includes(item.product_name.toLowerCase()) ||
                      item.product_name.toLowerCase().includes(p.name.toLowerCase()) ||
                      p.sku.toLowerCase() === item.product_name.toLowerCase()
                    );

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/90"
                      >
                        <input
                          type="text"
                          value={item.product_name}
                          onChange={(e) => handleItemChange(idx, "product_name", e.target.value)}
                          placeholder={t.catalog.formName}
                          className="flex-1 bg-transparent border-0 text-slate-100 focus:outline-none focus:ring-0"
                        />

                        {matchedProduct ? (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            {matchedProduct.quantity_available} {t.common.stock} ({(matchedProduct.unit_price_cents / 100).toFixed(2)} €)
                          </span>
                        ) : (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                            {t.badges.intentOther}
                          </span>
                        )}

                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-2 py-1">
                          <span className="text-[10px] text-slate-400">{t.common.quantity}:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            className="w-12 bg-transparent text-center text-slate-100 focus:outline-none font-bold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: AI Email Response Draft */}
          <div className="bg-gradient-to-b from-blue-950/20 to-slate-950/60 border border-blue-500/30 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{t.drawer.sectionDraftEmail}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmailDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer shadow-sm shadow-blue-600/20"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{t.drawer.copiedText}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.drawer.copyDraftBtn}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={9}
              value={activeEmailDraft}
              onChange={(e) => setFormData({ ...formData, email_draft: e.target.value })}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 font-mono text-slate-200 leading-relaxed text-xs focus:outline-none focus:border-blue-500 transition-colors select-all"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{t.drawer.totalHT} : <strong className="text-white">{totalEurFormatted} €</strong></span>
              <span className="text-blue-300">{clientDisplayName}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#0e1628]/95 backdrop-blur-md border-t border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveAction()}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {t.drawer.saveChangesBtn}
            </button>

            {status !== "needs_manual_handling" && (
              <button
                onClick={() => handleSaveAction("needs_manual_handling")}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-700/40 transition-all cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {t.drawer.markNeedsManualBtn}
              </button>
            )}
          </div>

          <button
            onClick={() => handleSaveAction("processed")}
            disabled={isSaving || status === "processed"}
            className="inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {status === "processed" ? t.badges.processed : t.drawer.validateAndSendBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
