"use client";

import React from "react";
import { ProductStockRecord } from "@/lib/schema";
import { Package, Layers } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface StockOverviewProps {
  products: ProductStockRecord[];
}

export function StockOverview({ products }: StockOverviewProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#111827]/80 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            {t.catalog.title}
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {products.length} {t.catalog.countSuffix}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((prod) => {
          const priceEur = (prod.unit_price_cents / 100).toFixed(2);
          const isLowStock = prod.quantity_available < 15;

          return (
            <div
              key={prod.id}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-mono">{prod.sku}</span>
                  <span className="text-slate-500">{prod.category}</span>
                </div>
                <h4 className="text-xs font-medium text-slate-200 line-clamp-2">
                  {prod.name}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/60 text-xs">
                <span className="font-bold text-slate-100">{priceEur} € HT</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                    isLowStock
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  <Package className="w-3 h-3" />
                  {prod.quantity_available} {t.common.stock}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
