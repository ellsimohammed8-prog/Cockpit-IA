import { z } from "zod";

/**
 * Schéma Zod pour un article détecté et rapproché du catalogue
 */
export const RequestedItemSchema = z.object({
  sku: z.string().optional().describe("SKU ou référence catalogue"),
  product_name: z.string().describe("Nom ou désignation du produit / service demandé"),
  quantity: z.number().int().positive().default(1).describe("Quantité demandée"),
  unit_price: z.number().optional().describe("Prix unitaire en € HT"),
  total_price: z.number().optional().describe("Prix total en € HT"),
});

/**
 * Schéma Zod de la demande analysée par l'IA
 */
export const ParsedRequestSchema = z.object({
  client_name: z.string().nullable().describe("Nom du client ou de l'entreprise si présent, sinon null"),
  client_email: z.string().nullable().describe("Adresse email du client si présente, sinon null"),
  intent: z.string().default("quote_request").describe("Intention principale : quote_request, information, complaint, other"),
  urgency: z.string().default("medium").describe("Niveau d'urgence détecté : low, medium, high"),
  requested_items: z.array(RequestedItemSchema).default([]).describe("Liste des articles demandés"),
  summary: z.string().describe("Résumé court et précis en 1 phrase de la demande"),
  total_amount: z.number().optional().describe("Montant total global en € HT"),
  email_draft: z.string().optional().describe("Brouillon d'email de réponse formel et poli en français"),
});

export type RequestedItem = z.infer<typeof RequestedItemSchema>;
export type ParsedRequest = z.infer<typeof ParsedRequestSchema>;

/**
 * Type complet d'un enregistrement 'request' en base de données.
 */
export interface InboundRequestRecord {
  id: string;
  client_name: string | null;
  client_email: string | null;
  raw_content: string;
  parsed_data: ParsedRequest | null;
  status: "pending_review" | "needs_manual_handling" | "processed" | "rejected";
  created_at: string;
  source_channel?: string;
  ai_provider?: string;
}

/**
 * Type pour le stock de produits
 */
export interface ProductStockRecord {
  id: string;
  sku: string;
  name: string;
  quantity_available: number;
  unit_price_cents: number;
  category?: string;
}
