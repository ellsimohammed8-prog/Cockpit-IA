import { InboundRequestRecord, ProductStockRecord, ParsedRequest } from "./schema";
import { INITIAL_PRODUCTS, INITIAL_REQUESTS } from "./seed-data";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Détection de Supabase si configuré
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project")) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn("[DB] Supabase init failed, falling back to in-memory store:", err);
  }
}

// Global In-Memory Store pour la persistance locale du POC
declare global {
  // eslint-disable-next-line no-var
  var __POC_REQUESTS_STORE__: InboundRequestRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __POC_PRODUCTS_STORE__: ProductStockRecord[] | undefined;
}

if (!global.__POC_REQUESTS_STORE__) {
  global.__POC_REQUESTS_STORE__ = [...INITIAL_REQUESTS];
}

if (!global.__POC_PRODUCTS_STORE__) {
  global.__POC_PRODUCTS_STORE__ = [...INITIAL_PRODUCTS];
}

export const db = {
  /**
   * Récupère la liste de toutes les demandes triées par date décroissante
   */
  async getRequests(): Promise<InboundRequestRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data as InboundRequestRecord[];
        }
      } catch (err) {
        console.warn("[DB] Supabase getRequests error, using memory fallback", err);
      }
    }

    return [...(global.__POC_REQUESTS_STORE__ || [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  /**
   * Récupère une demande par son identifiant
   */
  async getRequestById(id: string): Promise<InboundRequestRecord | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return data as InboundRequestRecord;
        }
      } catch (err) {
        console.warn("[DB] Supabase getRequestById error", err);
      }
    }

    const item = global.__POC_REQUESTS_STORE__?.find((r) => r.id === id);
    return item || null;
  },

  /**
   * Crée une nouvelle demande entrante
   */
  async createRequest(payload: {
    client_name?: string | null;
    client_email?: string | null;
    raw_content: string;
    parsed_data?: ParsedRequest | null;
    status?: "pending_review" | "needs_manual_handling" | "processed" | "rejected";
    ai_provider?: string;
  }): Promise<InboundRequestRecord> {
    const newRecord: InboundRequestRecord = {
      id: "req-" + Math.random().toString(36).substring(2, 9),
      client_name: payload.client_name ?? payload.parsed_data?.client_name ?? null,
      client_email: payload.client_email ?? payload.parsed_data?.client_email ?? null,
      raw_content: payload.raw_content,
      parsed_data: payload.parsed_data || null,
      status: payload.status || (payload.parsed_data ? "pending_review" : "needs_manual_handling"),
      created_at: new Date().toISOString(),
      source_channel: "Live Inbound",
      ai_provider: payload.ai_provider || "AI Engine",
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("requests")
          .insert([newRecord])
          .select()
          .single();

        if (!error && data) {
          return data as InboundRequestRecord;
        }
      } catch (err) {
        console.warn("[DB] Supabase createRequest error, using memory fallback", err);
      }
    }

    global.__POC_REQUESTS_STORE__ = [newRecord, ...(global.__POC_REQUESTS_STORE__ || [])];
    return newRecord;
  },

  /**
   * Supprime une demande par son identifiant
   */
  async deleteRequest(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from("requests").delete().eq("id", id);
      } catch (err) {
        console.warn("[DB] Supabase deleteRequest error", err);
      }
    }

    const list = global.__POC_REQUESTS_STORE__ || [];
    global.__POC_REQUESTS_STORE__ = list.filter((r) => r.id !== id);
    return true;
  },

  /**
   * Vide toutes les demandes enregistrées
   */
  async clearRequests(): Promise<void> {
    if (supabase) {
      try {
        await supabase.from("requests").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      } catch (err) {
        console.warn("[DB] Supabase clearRequests error", err);
      }
    }
    global.__POC_REQUESTS_STORE__ = [];
  },

  /**
   * Met à jour le statut et/ou les données d'une demande (Human-in-the-loop)
   * et déduit automatiquement le stock si validé
   */
  async updateRequest(
    id: string,
    updates: {
      status?: "pending_review" | "needs_manual_handling" | "processed" | "rejected";
      parsed_data?: ParsedRequest | null;
      client_name?: string | null;
      client_email?: string | null;
      deductStockOnApprove?: boolean;
    }
  ): Promise<InboundRequestRecord | null> {
    const list = global.__POC_REQUESTS_STORE__ || [];
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const previousStatus = existing.status;

    const updated: InboundRequestRecord = {
      ...existing,
      ...updates,
      parsed_data: updates.parsed_data !== undefined ? updates.parsed_data : existing.parsed_data,
      client_name: updates.client_name !== undefined ? updates.client_name : (updates.parsed_data?.client_name ?? existing.client_name),
      client_email: updates.client_email !== undefined ? updates.client_email : (updates.parsed_data?.client_email ?? existing.client_email),
    };

    list[index] = updated;
    global.__POC_REQUESTS_STORE__ = list;

    // Déduction automatique du stock lors du passage à 'processed'
    if (
      updates.status === "processed" &&
      previousStatus !== "processed" &&
      updates.deductStockOnApprove !== false
    ) {
      const itemsToDeduct = updated.parsed_data?.requested_items || [];
      if (itemsToDeduct.length > 0) {
        await this.deductStock(itemsToDeduct);
      }
    }

    if (supabase) {
      try {
        await supabase
          .from("requests")
          .update({
            status: updated.status,
            parsed_data: updated.parsed_data,
            client_name: updated.client_name,
            client_email: updated.client_email,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("[DB] Supabase updateRequest error", err);
      }
    }

    return updated;
  },

  /**
   * Déduit les quantités d'articles du stock des produits
   */
  async deductStock(items: Array<{ product_name: string; quantity: number }>): Promise<void> {
    const products = global.__POC_PRODUCTS_STORE__ || [];

    for (const item of items) {
      const targetName = item.product_name.toLowerCase();
      // Trouver le produit correspondant par SKU ou nom
      const product = products.find(
        (p) =>
          p.name.toLowerCase().includes(targetName) ||
          targetName.includes(p.name.toLowerCase()) ||
          p.sku.toLowerCase() === targetName
      );

      if (product) {
        product.quantity_available = Math.max(0, product.quantity_available - item.quantity);
      }
    }

    global.__POC_PRODUCTS_STORE__ = products;
  },

  /**
   * Récupère le stock des produits
   */
  async getProducts(): Promise<ProductStockRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from("products_stock").select("*");
        if (!error && data && data.length > 0) {
          return data as ProductStockRecord[];
        }
      } catch (err) {
        console.warn("[DB] Supabase getProducts error", err);
      }
    }

    return global.__POC_PRODUCTS_STORE__ || [];
  },

  /**
   * Ajoute un produit au catalogue
   */
  async addProduct(product: Omit<ProductStockRecord, "id"> & { id?: string }): Promise<ProductStockRecord> {
    const newProduct: ProductStockRecord = {
      id: product.id || "prod-" + Math.random().toString(36).substring(2, 9),
      sku: product.sku.trim().toUpperCase(),
      name: product.name.trim(),
      quantity_available: Number(product.quantity_available) || 0,
      unit_price_cents: Number(product.unit_price_cents) || 0,
      category: product.category || "Général",
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from("products_stock").insert([newProduct]).select().single();
        if (!error && data) return data as ProductStockRecord;
      } catch (err) {
        console.warn("[DB] Supabase addProduct error", err);
      }
    }

    const current = global.__POC_PRODUCTS_STORE__ || [];
    const existingIdx = current.findIndex((p) => p.sku === newProduct.sku);
    if (existingIdx !== -1) {
      current[existingIdx] = newProduct;
    } else {
      current.unshift(newProduct);
    }
    global.__POC_PRODUCTS_STORE__ = current;
    return newProduct;
  },

  /**
   * Supprime un produit par ID
   */
  async deleteProduct(id: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from("products_stock").delete().eq("id", id);
      } catch (err) {
        console.warn("[DB] Supabase deleteProduct error", err);
      }
    }

    const current = global.__POC_PRODUCTS_STORE__ || [];
    global.__POC_PRODUCTS_STORE__ = current.filter((p) => p.id !== id);
    return true;
  },

  /**
   * Vide complètement le catalogue produit
   */
  async clearProducts(): Promise<void> {
    if (supabase) {
      try {
        await supabase.from("products_stock").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      } catch (err) {
        console.warn("[DB] Supabase clearProducts error", err);
      }
    }
    global.__POC_PRODUCTS_STORE__ = [];
  },

  /**
   * Remplace ou met à jour le catalogue de produits
   */
  async setProducts(newProducts: ProductStockRecord[]): Promise<ProductStockRecord[]> {
    global.__POC_PRODUCTS_STORE__ = newProducts;
    return newProducts;
  },

  /**
   * Réinitialise les données du Cockpit
   */
  async resetDatabase(): Promise<void> {
    global.__POC_REQUESTS_STORE__ = [...INITIAL_REQUESTS];
    global.__POC_PRODUCTS_STORE__ = [...INITIAL_PRODUCTS];
  },
};
