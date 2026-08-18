import { ParsedRequest, ParsedRequestSchema, ProductStockRecord } from "./schema";

export type AIProvider =
  | "gemini"
  | "claude"
  | "openai"
  | "groq"
  | "xai"
  | "mistral"
  | "deepseek"
  | "custom";

export interface AIEngineConfig {
  provider?: AIProvider;
  model?: string;
  apiKey?: string;
  customBaseUrl?: string;
  customModel?: string;
  customPrompt?: string;
}

export interface AITestResult {
  success: boolean;
  provider: string;
  model: string;
  models: string[];
  message: string;
  isMockMode: boolean;
  error?: string;
}

export interface AIParseResult {
  success?: boolean;
  data: ParsedRequest | null;
  rawResponse?: string;
  isMockMode?: boolean;
  aiProvider?: string;
  provider?: string;
  error?: string;
}

export const PROVIDER_NAMES: Record<AIProvider, string> = {
  gemini: "Google Gemini",
  claude: "Anthropic (Claude)",
  openai: "OpenAI (GPT)",
  groq: "Groq (Llama / Mixtral)",
  xai: "xAI (Grok)",
  mistral: "Mistral AI",
  deepseek: "DeepSeek",
  custom: "Custom / Ollama",
};

/**
 * Détecte automatiquement le fournisseur à partir du préfixe standard de la clé API
 */
export function detectProviderFromKey(key: string): AIProvider | null {
  const k = key.trim();
  if (k.startsWith("gsk_")) return "groq";
  if (k.startsWith("xai-") || k.startsWith("xai_")) return "xai";
  if (k.startsWith("sk-ant-")) return "claude";
  if (k.startsWith("AIzaSy")) return "gemini";
  if (k.startsWith("sk-") && !k.startsWith("sk-ant-")) return "openai";
  if (k.startsWith("mis-") || k.startsWith("mistral-")) return "mistral";
  return null;
}

export const DEFAULT_SYSTEM_PROMPT_EN = `You are the commercial intelligence engine of Cockpit IA.
Your role:
1. Analyze incoming customer RFQ emails (quotes, orders, inquiries, complaints).
2. Extract the customer name, contact email, intent, and urgency level.
3. Intelligently match requested items with catalog stock (SKUs, designations, unit prices excl. VAT).
4. Accurately calculate line subtotals and total quote amount.
5. Compose a professional, courteous commercial response draft with quote breakdown and delivery estimates.
Strict format: Return ONLY a valid structured JSON object.`;

export const DEFAULT_SYSTEM_PROMPT_FR = `Tu es le moteur d'intelligence commerciale du Cockpit IA.
Ton rôle :
1. Analyser les emails entrants (demandes de devis, commandes, réclamations).
2. Identifier le client, son email, l'intention et le niveau d'urgence.
3. Faire une correspondance intelligente avec les articles du catalogue (SKU, désignations, prix HT).
4. Calculer précisément les sous-totaux et le montant total global HT.
5. Rédiger une réponse commerciale formelle et soignée en français avec le récapitulatif chiffré et les délais de livraison.
Format strict : Réponds UNIQUEMENT avec un JSON structuré valide.`;

export const DEFAULT_SYSTEM_PROMPT = DEFAULT_SYSTEM_PROMPT_EN;

/**
 * Construit le prompt système enrichi avec le catalogue produits actif et les instructions personnalisées
 */
function buildSystemPrompt(products?: ProductStockRecord[], userCustomPrompt?: string): string {
  const catalogContext =
    products && products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name} (SKU: ${p.sku}, Prix: ${(p.unit_price_cents / 100).toFixed(2)}€ HT, Stock: ${p.quantity_available})`
          )
          .join("\n")
      : "Aucun produit référencé pour le moment.";

  const basePrompt = userCustomPrompt && userCustomPrompt.trim().length > 10
    ? userCustomPrompt.trim()
    : DEFAULT_SYSTEM_PROMPT;

  return `${basePrompt}

CATALOGUE ACTUEL DES PRODUITS DISPONIBLES EN STOCK :
${catalogContext}

CONSIGNE TECHNIQUE OBLIGATOIRE :
Retourne UNIQUEMENT un objet JSON valide conforme à la structure :
{
  "client_name": string | null,
  "client_email": string | null,
  "intent": "quote_request" | "information" | "complaint" | "other",
  "urgency": "high" | "medium" | "low",
  "requested_items": [{ "sku": string, "product_name": string, "quantity": number, "unit_price": number, "total_price": number }],
  "total_amount": number,
  "summary": string,
  "email_draft": string
}`;
}

/**
 * Inspection 100% en direct des modèles via les API officielles
 */
export async function testAIConnection(config: AIEngineConfig): Promise<AITestResult> {
  const provider = config?.provider || "gemini";
  const apiKey = config?.apiKey?.trim() || "";
  const providerName = PROVIDER_NAMES[provider] || "Fournisseur IA";
  const currentModel = config?.model || config?.customModel || "";

  if (!apiKey && provider !== "custom") {
    return {
      success: false,
      provider: providerName,
      model: "",
      models: [],
      message: "Veuillez saisir votre clé API pour récupérer les modèles disponibles.",
      isMockMode: false,
      error: "Clé API manquante",
    };
  }

  const detected = detectProviderFromKey(apiKey);
  if (detected && detected !== provider && provider !== "custom") {
    const expectedName = PROVIDER_NAMES[detected];
    return {
      success: false,
      provider: providerName,
      model: "",
      models: [],
      message: `Cette clé API commence par le préfixe de ${expectedName} (non compatible avec ${providerName}).`,
      isMockMode: false,
      error: `Incompatibilité de clé : Clé ${expectedName} fournie`,
    };
  }

  try {
    let liveModels: string[] = [];

    // 1. Groq
    if (provider === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || [])
        .map((m: any) => m.id)
        .filter((id: string) => id && !id.includes("whisper") && !id.includes("guard"));
    }

    // 2. OpenAI
    else if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || [])
        .map((m: any) => m.id)
        .filter((id: string) => id && (id.startsWith("gpt-") || id.startsWith("o1") || id.startsWith("o3")))
        .sort();
    }

    // 3. Google Gemini
    else if (provider === "gemini") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.models || [])
        .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m: any) => m.name.replace("models/", ""))
        .filter((name: string) => name.includes("gemini"));
    }

    // 4. Anthropic Claude
    else if (provider === "claude") {
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || []).map((m: any) => m.id);
    }

    // 5. Mistral AI
    else if (provider === "mistral") {
      const res = await fetch("https://api.mistral.ai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || []).map((m: any) => m.id);
    }

    // 6. DeepSeek
    else if (provider === "deepseek") {
      const res = await fetch("https://api.deepseek.com/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || []).map((m: any) => m.id);
    }

    // 7. xAI (Grok)
    else if (provider === "xai") {
      const res = await fetch("https://api.x.ai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      liveModels = (data.data || []).map((m: any) => m.id);
    }

    // 8. Custom / Ollama
    else if (provider === "custom") {
      const baseUrl = (config?.customBaseUrl || "http://localhost:11434/v1").replace(/\/v1\/?$/, "");
      const res = await fetch(`${baseUrl}/v1/models`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });
      if (!res.ok) {
        throw new Error(`Impossible de joindre le serveur local sur ${baseUrl}`);
      }
      const data = await res.json();
      liveModels = (data.data || data.models || []).map((m: any) => m.id || m.name).filter(Boolean);
    }

    if (!liveModels || liveModels.length === 0) {
      return {
        success: false,
        provider: providerName,
        model: "",
        models: [],
        message: "Aucun modèle disponible pour cette clé.",
        isMockMode: false,
        error: "Aucun modèle retourné par l'API",
      };
    }

    const targetModel = liveModels.includes(currentModel) ? currentModel : liveModels[0];

    return {
      success: true,
      provider: providerName,
      model: targetModel,
      models: liveModels,
      message: `✓ Connecté avec succès (${liveModels.length} modèles détectés)`,
      isMockMode: false,
    };
  } catch (err: any) {
    return {
      success: false,
      provider: providerName,
      model: "",
      models: [],
      message: `Échec d'authentification : ${err.message || err}`,
      isMockMode: false,
      error: err.message || String(err),
    };
  }
}

/**
 * Universal Multi-LLM Parser avec injection dynamique du catalogue produits
 */
export async function parseInboundTextWithAI(
  rawContent: string,
  config?: AIEngineConfig,
  products?: ProductStockRecord[]
): Promise<AIParseResult> {
  const provider = config?.provider || "gemini";
  const apiKey =
    config?.apiKey ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY;
  const model = config?.model || config?.customModel || "";
  const systemPrompt = buildSystemPrompt(products, config?.customPrompt);

  if (apiKey && !apiKey.includes("your_") && apiKey.length > 5) {
    try {
      let extracted: ParsedRequest | null = null;
      let providerLabel = PROVIDER_NAMES[provider] || "AI Engine";

      // 1. Google Gemini
      if (provider === "gemini") {
        const targetModel = (model || "gemini-1.5-flash").replace(/^models\//, "");
        providerLabel = `Google Gemini (${targetModel})`;
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nMessage client reçu :\n"""\n${rawContent}\n"""` }],
                },
              ],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
        if (res.ok) {
          const json = await res.json();
          const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            extracted = sanitizeAndParseJSON(rawText);
          }
        }
      }

      // 2. Anthropic Claude
      else if (provider === "claude") {
        const targetModel = model || "claude-3-5-sonnet-20241022";
        providerLabel = `Anthropic (${targetModel})`;
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: targetModel,
            max_tokens: 1500,
            messages: [
              {
                role: "user",
                content: `${systemPrompt}\n\nMessage client reçu :\n"""\n${rawContent}\n"""`,
              },
            ],
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const rawText = json?.content?.[0]?.text;
          if (rawText) {
            extracted = sanitizeAndParseJSON(rawText);
          }
        }
      }

      // 3. OpenAI / Groq / xAI / Mistral / DeepSeek / Custom (Compatible OpenAI)
      else {
        let endpoint = "https://api.openai.com/v1/chat/completions";
        let targetModel = model || "gpt-4o-mini";
        providerLabel = `OpenAI (${targetModel})`;

        if (provider === "groq") {
          endpoint = "https://api.groq.com/openai/v1/chat/completions";
          targetModel = model || "llama-3.3-70b-versatile";
          providerLabel = `Groq (${targetModel})`;
        } else if (provider === "xai") {
          endpoint = "https://api.x.ai/v1/chat/completions";
          targetModel = model || "grok-2-1212";
          providerLabel = `xAI (${targetModel})`;
        } else if (provider === "mistral") {
          endpoint = "https://api.mistral.ai/v1/chat/completions";
          targetModel = model || "mistral-small-latest";
          providerLabel = `Mistral (${targetModel})`;
        } else if (provider === "deepseek") {
          endpoint = "https://api.deepseek.com/chat/completions";
          targetModel = model || "deepseek-chat";
          providerLabel = `DeepSeek (${targetModel})`;
        } else if (provider === "custom") {
          const baseUrl = (config?.customBaseUrl || "http://localhost:11434/v1").replace(/\/+$/, "");
          endpoint = `${baseUrl}/chat/completions`;
          targetModel = config?.customModel || model || "llama3";
          providerLabel = `Custom (${targetModel})`;
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Message client reçu :\n"""\n${rawContent}\n"""` },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const rawText = json?.choices?.[0]?.message?.content;
          if (rawText) {
            extracted = sanitizeAndParseJSON(rawText);
          }
        }
      }

      if (extracted) {
        return {
          success: true,
          data: extracted,
          isMockMode: false,
          provider: providerLabel,
        };
      }
    } catch (err: any) {
      console.warn(`[AI Engine] Provider ${provider} call failed, falling back to smart simulation:`, err);
    }
  }

  // Smart Mock Fallback avec matching produits
  const fallback = getScenarioMockResponse(rawContent, products);
  return {
    success: fallback.data !== null,
    data: fallback.data,
    isMockMode: true,
    provider: "Simulateur IA (Mode Démo)",
    error: fallback.error,
  };
}

/**
 * Nettoie et valide un texte JSON retourné par un LLM
 */
function sanitizeAndParseJSON(rawText: string): ParsedRequest | null {
  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleaned);
    const validated = ParsedRequestSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }
    return parsed as ParsedRequest;
  } catch (err) {
    console.error("[AI Engine] Failed to parse JSON:", err, rawText);
    return null;
  }
}

/**
 * Générateur de réponses déterministes réalistes (Mock Simulation)
 */
function getScenarioMockResponse(
  rawContent: string,
  products?: ProductStockRecord[]
): { data: ParsedRequest | null; error?: string } {
  const text = rawContent.toLowerCase();

  // Scénario A : Demande BatiPlus / Chantier
  if (text.includes("batiplus") || text.includes("perceuse") || text.includes("vis inox") || text.includes("urgent")) {
    const drillProd = products?.find((p) => p.name.toLowerCase().includes("perceuse"));
    const screwProd = products?.find((p) => p.name.toLowerCase().includes("vis"));

    const p1Price = drillProd ? drillProd.unit_price_cents / 100 : 189.0;
    const p2Price = screwProd ? screwProd.unit_price_cents / 100 : 29.5;
    const total = 3 * p1Price + 10 * p2Price;

    return {
      data: {
        client_name: "Société BatiPlus",
        client_email: "contact@batiplus.fr",
        intent: "quote_request",
        urgency: "high",
        requested_items: [
          {
            sku: drillProd?.sku || "PERC-PRO-18V",
            product_name: drillProd?.name || "Perceuse Visseuse Sans Fil Pro 18V",
            quantity: 3,
            unit_price: p1Price,
            total_price: 3 * p1Price,
          },
          {
            sku: screwProd?.sku || "VIS-INOX-550",
            product_name: screwProd?.name || "Boîte 500 Vis Inox 5x50mm",
            quantity: 10,
            unit_price: p2Price,
            total_price: 10 * p2Price,
          },
        ],
        total_amount: total,
        summary: "Demande urgente de devis pour 3 perceuses pro 18V et 10 boîtes de vis inox.",
        email_draft: `Bonjour Société BatiPlus,\n\nNous avons bien reçu votre demande urgente de devis et vous remercions pour votre intérêt.\n\nVoici le détail de notre proposition tarifaire :\n- 3x Perceuse Visseuse Sans Fil Pro 18V (Réf: ${drillProd?.sku || "PERC-PRO-18V"}) : ${p1Price.toFixed(2)} € HT/u — Sous-total: ${(3 * p1Price).toFixed(2)} € HT\n- 10x Boîte 500 Vis Inox 5x50mm (Réf: ${screwProd?.sku || "VIS-INOX-550"}) : ${p2Price.toFixed(2)} € HT/u — Sous-total: ${(10 * p2Price).toFixed(2)} € HT\n\nMontant total global : ${total.toFixed(2)} € HT.\n\nTous les articles sont actuellement en stock dans notre entrepôt et peuvent être expédiés sous 24h.\n\nRestant à votre entière disposition,\nCordialement,\nLe Service Commercial`,
      },
    };
  }

  // Scénario B : Message vague / Incomplet
  if (text.includes("salut") || (text.includes("prix") && text.length < 50) || (text.includes("catalogue") && !text.includes("@"))) {
    return {
      data: {
        client_name: null,
        client_email: null,
        intent: "information",
        urgency: "low",
        requested_items: [],
        total_amount: 0,
        summary: "Demande d'information générale sans détail d'articles ni coordonnées client.",
        email_draft: "Bonjour,\n\nNous vous remercions pour votre message. Pourriez-vous nous préciser les références ou produits qui vous intéressent afin que nous puissions vous établir un devis personnalisé ?\n\nBien cordialement,\nLe Service Commercial",
      },
    };
  }

  // Scénario C : Prompt Injection / Test de sécurité
  if (text.includes("ignore") || text.includes("system prompt") || text.includes("admin") || text.includes("0€")) {
    return {
      data: {
        client_name: "Sécurité Audit",
        client_email: null,
        intent: "other",
        urgency: "low",
        requested_items: [],
        total_amount: 0,
        summary: "Tentative d'injection détectée et neutralisée. Traité comme texte brut.",
        email_draft: "Bonjour,\n\nVotre message a bien été reçu par notre système.\n\nCordialement,\nLe Service Client",
      },
    };
  }

  // Extraction générique intelligente
  const emailMatch = rawContent.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const detectedEmail = emailMatch ? emailMatch[0] : null;

  return {
    data: {
      client_name: detectedEmail ? detectedEmail.split("@")[0].replace(/[._]/g, " ") : "Client Inbound",
      client_email: detectedEmail,
      intent: text.includes("devis") || text.includes("prix") ? "quote_request" : "information",
      urgency: text.includes("urgent") || text.includes("vite") || text.includes("aujourd'hui") ? "high" : "medium",
      requested_items: [
        {
          sku: products?.[0]?.sku || "GEN-001",
          product_name: products?.[0]?.name || "Article du catalogue",
          quantity: 1,
          unit_price: products?.[0] ? products[0].unit_price_cents / 100 : 49.9,
          total_price: products?.[0] ? products[0].unit_price_cents / 100 : 49.9,
        },
      ],
      total_amount: products?.[0] ? products[0].unit_price_cents / 100 : 49.9,
      summary: `Demande reçue : ${rawContent.slice(0, 70)}...`,
      email_draft: `Bonjour,\n\nNous avons bien reçu votre demande de devis.\n\nNotre équipe commerciale étudie vos besoins et revient vers vous sous 24h ouvrées.\n\nCordialement,\nLe Service Commercial`,
    },
  };
}
