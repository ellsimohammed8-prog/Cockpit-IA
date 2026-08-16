"use client";

import React, { useState } from "react";
import { ProductStockRecord } from "@/lib/schema";
import {
  Plus,
  Trash2,
  AlertTriangle,
  Search,
  Check,
  X,
  Boxes,
  Tag,
  Hash,
} from "lucide-react";

interface ProductCatalogProps {
  products: ProductStockRecord[];
  onProductsUpdated: (products: ProductStockRecord[]) => void;
}

export function ProductCatalog({ products, onProductsUpdated }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    unit_price: "",
    quantity: "25",
    category: "Outillage",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.unit_price) return;

    setIsSubmitting(true);
    const priceCents = Math.round(parseFloat(newProduct.unit_price.replace(",", ".")) * 100);
    const sku =
      newProduct.sku.trim() ||
      `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_product",
          product: {
            name: newProduct.name.trim(),
            sku,
            unit_price_cents: priceCents,
            quantity_available: parseInt(newProduct.quantity, 10) || 10,
            category: newProduct.category.trim() || "Général",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onProductsUpdated(data.products);
        showToast(`Produit "${newProduct.name}" ajouté avec succès.`);
        setIsAddModalOpen(false);
        setNewProduct({
          name: "",
          sku: "",
          unit_price: "",
          quantity: "25",
          category: "Outillage",
        });
      }
    } catch (err) {
      console.error("Erreur ajout produit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_product", id }),
      });

      if (res.ok) {
        const data = await res.json();
        onProductsUpdated(data.products);
        showToast("Article supprimé du catalogue.");
      }
    } catch (err) {
      console.error("Erreur suppression produit:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_catalog" }),
      });

      if (res.ok) {
        const data = await res.json();
        onProductsUpdated(data.products || []);
        setIsClearConfirmOpen(false);
        showToast("Le catalogue a été entièrement vidé.");
      }
    } catch (err) {
      console.error("Erreur vidage catalogue:", err);
    }
  };

  return (
    <div className="bg-[#111318] border border-white/[0.07] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.07] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Boxes className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Catalogue Produits & Stock
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                {products.length} réf.
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
              Gestion des stocks, prix unitaires et réconciliation automatique des devis
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Anti-Autofill Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              name="product_search_query"
              id="product_search_query"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="Rechercher un article, SKU, catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-white/[0.06] border border-white/[0.08] pointer-events-none">
              /
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un produit</span>
          </button>

          {products.length > 0 && (
            <button
              onClick={() => setIsClearConfirmOpen(true)}
              className="h-9 px-2.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-white/[0.07] transition-colors cursor-pointer"
              title="Vider le catalogue"
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

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-black/30 border-b border-white/[0.06] text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">SKU / Réf.</th>
              <th className="py-3 px-5">Désignation</th>
              <th className="py-3 px-5">Catégorie</th>
              <th className="py-3 px-5">Prix Unitaire</th>
              <th className="py-3 px-5">Stock Disponible</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  {products.length === 0
                    ? "Aucun produit dans le catalogue. Cliquez sur 'Ajouter un produit' ou importez un fichier Excel dans les Paramètres."
                    : "Aucun article ne correspond à votre recherche."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isLowStock = product.quantity_available <= 5;
                const isOutOfStock = product.quantity_available === 0;

                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-5 font-mono text-slate-300 text-xs font-medium">
                      {product.sku}
                    </td>

                    <td className="py-3.5 px-5 text-slate-200 font-medium group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {product.category || "Général"}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-200 tabular-nums font-semibold">
                      {(product.unit_price_cents / 100).toFixed(2)} € HT
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock
                              ? "bg-rose-500"
                              : isLowStock
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <span
                          className={`font-mono text-xs font-medium tabular-nums ${
                            isOutOfStock
                              ? "text-rose-400 font-bold"
                              : isLowStock
                              ? "text-amber-400"
                              : "text-slate-300"
                          }`}
                        >
                          {product.quantity_available} en stock
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded transition-colors"
                        title="Supprimer cet article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111318] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-black/30 border-b border-white/[0.07] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Ajouter un Nouvel Article</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Désignation du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ex: Meuleuse d'angle 125mm Pro"
                  className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    SKU / Référence
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Auto-généré si vide"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Ex: Outillage, EPI"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Prix Unitaire (€ HT) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.unit_price}
                    onChange={(e) => setNewProduct({ ...newProduct, unit_price: e.target.value })}
                    placeholder="Ex: 49.90"
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Quantité Initiale en Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full h-9 bg-black/40 border border-white/[0.08] rounded-lg px-3 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Enregistrement..." : "Ajouter au Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111318] border border-white/[0.08] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-white">Vider le catalogue</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer tous les articles du catalogue ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleClearAll}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Confirmer le Vidage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
