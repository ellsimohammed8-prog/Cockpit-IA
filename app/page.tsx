"use client";

import React, { useState, useEffect } from "react";
import { InboundRequestRecord, ProductStockRecord } from "@/lib/schema";
import { Header } from "@/components/Header";
import { RequestsTable } from "@/components/RequestsTable";
import { RequestDetailDrawer } from "@/components/RequestDetailDrawer";
import { ProductCatalog } from "@/components/ProductCatalog";
import { SettingsModal } from "@/components/SettingsModal";

export default function CockpitDashboard() {
  const [requests, setRequests] = useState<InboundRequestRecord[]>([]);
  const [products, setProducts] = useState<ProductStockRecord[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<InboundRequestRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [reqRes, prodRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/products"),
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data.requests || []);
      }

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [reqRes, prodRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/products"),
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data.requests || []);
      }

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 400);
    }
  };

  const handleResetDatabase = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setProducts(data.products || []);
        setIsSettingsOpen(false);
      }
    } catch (err) {
      console.error("Erreur lors de la réinitialisation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenDrawer = (request: InboundRequestRecord) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#08090C] text-slate-100 pb-16 antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sleek Modern Linear/Stripe Header */}
      <Header
        isLoading={isRefreshing || isLoading}
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Requests Table (with integrated single filter bar) */}
        <RequestsTable
          requests={requests}
          onSelectRequest={handleOpenDrawer}
          onRequestsUpdated={fetchDashboardData}
        />

        {/* Product Catalog Stock Management */}
        <ProductCatalog
          products={products}
          onProductsUpdated={setProducts}
        />
      </div>

      {/* Human-in-the-Loop Review Drawer */}
      <RequestDetailDrawer
        request={selectedRequest}
        products={products}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdate={fetchDashboardData}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        products={products}
        onProductsUpdated={setProducts}
        onResetDatabase={handleResetDatabase}
        onRequestAdded={fetchDashboardData}
      />
    </main>
  );
}
