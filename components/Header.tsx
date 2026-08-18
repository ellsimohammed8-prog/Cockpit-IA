"use client";

import React from "react";
import { RefreshCw, Settings, Globe } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export function Header({ isLoading, onRefresh, onOpenSettings }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-[#08090C]/90 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Bespoke Futuristic 3D Animated AI Cockpit Emblem */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0c0e14] border border-white/[0.08] shadow-lg overflow-hidden group">
            {/* Ambient 3D Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-transparent blur-sm" />

            {/* Rotating 3D Gyroscope Rings */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[1.5px] border-blue-400/60 border-t-transparent border-b-cyan-400 animate-[spin_10s_linear_infinite]" />
              <div className="absolute w-4 h-4 rounded-full border-[1.5px] border-indigo-400/80 border-r-transparent border-l-blue-300 animate-[spin_6s_linear_infinite_reverse]" />

              {/* Glowing 3D Quantum Core */}
              <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-300 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white tracking-tight">
                {t.header.appName}
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {t.header.appBeta}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.header.tagline}
            </p>
          </div>
        </div>

        {/* Live Status Indicator & Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animated Green Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-300 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.header.systemStatus}</span>
          </div>

          {/* Top-Right Language Switcher (English / Français) */}
          <div
            className="flex items-center p-0.5 rounded-lg bg-[#111318] border border-white/[0.08] shadow-inner"
            title={t.header.langTitle}
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                language === "fr"
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              Français
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title={t.header.refreshTooltip}
            className="p-1.5 rounded-lg bg-[#111318] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title={t.header.settingsTooltip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.header.settingsBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
