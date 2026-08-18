"use client";

import React, { useState } from "react";
import { DEMO_TEST_SCENARIOS } from "@/lib/seed-data";
import { Send, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface InboundSimulatorProps {
  onRequestProcessed: () => void;
}

export function InboundSimulator({ onRequestProcessed }: InboundSimulatorProps) {
  const { t, language } = useLanguage();
  const [selectedText, setSelectedText] = useState(DEMO_TEST_SCENARIOS[0].text);
  const [activeScenarioId, setActiveScenarioId] = useState<string>("clean");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    provider: string;
    isMock: boolean;
    status: string;
  } | null>(null);

  const handleSelectScenario = (scenario: typeof DEMO_TEST_SCENARIOS[0]) => {
    setActiveScenarioId(scenario.id);
    setSelectedText(scenario.text);
    setLastResult(null);
  };

  const handleSendRequest = async () => {
    if (!selectedText.trim()) return;
    setIsLoading(true);
    setLastResult(null);

    try {
      const res = await fetch("/api/parse-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_content: selectedText }),
      });

      const data = await res.json();
      if (res.ok && data.request) {
        setLastResult({
          success: data.success,
          provider: data.aiProvider || "AI Engine",
          isMock: data.isMockMode,
          status: data.request.status,
        });
        onRequestProcessed();
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            {t.simulator.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.simulator.subtitle}
          </p>
        </div>

        {lastResult && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700/60 text-slate-300">
            {lastResult.status === "pending_review" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>
              Engine: <strong className="text-white">{lastResult.provider}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Preset Scenario Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {DEMO_TEST_SCENARIOS.map((scenario) => {
          const isActive = activeScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario)}
              className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-950/40 border-blue-500/50 shadow-sm shadow-blue-500/10"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold ${isActive ? "text-blue-300" : "text-slate-200"}`}>
                  {scenario.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Message Textarea */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-slate-300">
          {t.drawer.sectionOriginalEmail} :
        </label>
        <textarea
          value={selectedText}
          onChange={(e) => {
            setSelectedText(e.target.value);
            setActiveScenarioId("custom");
          }}
          rows={4}
          placeholder="Paste customer RFQ email text here..."
          className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono transition-colors"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zod Schema validation & Prompt-injection shielded.</span>
          </div>

          <button
            onClick={handleSendRequest}
            disabled={isLoading || !selectedText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t.simulator.simulating}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.simulator.simulateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
