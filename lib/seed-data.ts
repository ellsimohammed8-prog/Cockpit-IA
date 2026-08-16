import { ProductStockRecord, InboundRequestRecord } from "./schema";

/**
 * 7 Produits pré-chargés pour la réconciliation des stocks et devis de démonstration
 */
export const INITIAL_PRODUCTS: ProductStockRecord[] = [
  {
    id: "prod-001",
    sku: "PERC-18V-PRO",
    name: "Perceuse Visseuse Sans Fil Pro 18V",
    quantity_available: 42,
    unit_price_cents: 14900, // 149.00 €
    category: "Outillage Électroportatif",
  },
  {
    id: "prod-002",
    sku: "BOITE-VIS-INOX",
    name: "Boîte 500 Vis Inox A2 5x50mm",
    quantity_available: 120,
    unit_price_cents: 1850, // 18.50 €
    category: "Quincaillerie & Fixations",
  },
  {
    id: "prod-003",
    sku: "MEUL-125MM",
    name: "Meuleuse d'Angle 125mm 1400W",
    quantity_available: 15,
    unit_price_cents: 8900, // 89.00 €
    category: "Outillage Électroportatif",
  },
  {
    id: "prod-004",
    sku: "DISQ-DIAM-125",
    name: "Lot de 5 Disques Diamant Béton 125mm",
    quantity_available: 65,
    unit_price_cents: 3400, // 34.00 €
    category: "Consommables",
  },
  {
    id: "prod-005",
    sku: "CASQ-SECURITE-PRO",
    name: "Casque de Chantier Réglable avec Visière",
    quantity_available: 80,
    unit_price_cents: 2200, // 22.00 €
    category: "Équipement EPI",
  },
  {
    id: "prod-006",
    sku: "ROUL-ADH-CHANT",
    name: "Rouleau Adhésif Chantier Ultra Résistant (50m)",
    quantity_available: 210,
    unit_price_cents: 890, // 8.90 €
    category: "Consommables",
  },
  {
    id: "prod-007",
    sku: "NIV-LASER-360",
    name: "Niveau Laser Lignes Vertes 360° Autonivelant",
    quantity_available: 8,
    unit_price_cents: 19900, // 199.00 €
    category: "Mesure & Précision",
  },
];

/**
 * Exemples pré-enregistrés dans le Cockpit pour la démo
 */
export const INITIAL_REQUESTS: InboundRequestRecord[] = [
  {
    id: "req-demo-01",
    client_name: "Thomas Martin",
    client_email: "thomas.martin@batiplus-renov.fr",
    raw_content: "Bonjour, Thomas Martin de BatiPlus Rénov. Nous commençons un nouveau chantier et aurions besoin d'un devis pour 4 Perceuse Visseuse Sans Fil Pro 18V et 15 Boîtes 500 Vis Inox. Merci de nous transmettre ça au plus vite.",
    parsed_data: {
      client_name: "Thomas Martin",
      client_email: "thomas.martin@batiplus-renov.fr",
      intent: "quote_request",
      urgency: "high",
      requested_items: [
        { product_name: "Perceuse Visseuse Sans Fil Pro 18V", quantity: 4 },
        { product_name: "Boîte 500 Vis Inox", quantity: 15 },
      ],
      summary: "Demande urgente de devis pour 4 perceuses 18V et 15 boîtes de vis pour BatiPlus Rénov.",
    },
    status: "pending_review",
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    source_channel: "Email (Contact)",
    ai_provider: "Google Gemini",
  },
  {
    id: "req-demo-02",
    client_name: "Karim Benali",
    client_email: "karim@benali-maconnerie.com",
    raw_content: "Bonjour, avez-vous en stock le Niveau Laser Lignes Vertes 360° ? Pouvez-vous nous indiquer le délai de livraison sur Casablanca ou Rabat ? Cordialement.",
    parsed_data: {
      client_name: "Karim Benali",
      client_email: "karim@benali-maconnerie.com",
      intent: "information",
      urgency: "medium",
      requested_items: [
        { product_name: "Niveau Laser Lignes Vertes 360°", quantity: 1 },
      ],
      summary: "Demande d'information sur la disponibilité et délais de livraison du Niveau Laser 360°.",
    },
    status: "pending_review",
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    source_channel: "Formulaire Web",
    ai_provider: "Claude",
  },
  {
    id: "req-demo-03",
    client_name: null,
    client_email: null,
    raw_content: "yo c'est moi rapel moi stp urgent",
    parsed_data: null,
    status: "needs_manual_handling",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source_channel: "SMS Inbound",
    ai_provider: "AI Engine",
  },
];

/**
 * Scénarios de test pour le simulateur de demandes entrantes
 */
export const DEMO_TEST_SCENARIOS = [
  {
    id: "clean",
    title: "Demande Claire",
    description: "BatiPlus Rénov (Thomas Martin) - 4 perceuses & 15 vis",
    text: "Bonjour, Thomas Martin de BatiPlus Rénov (thomas.martin@batiplus-renov.fr). Nous aurions besoin rapidement d'un devis pour 4 Perceuse Visseuse Sans Fil Pro 18V et 15 Boîtes 500 Vis Inox. Merci de nous confirmer le tarif et la disponibilité.",
  },
  {
    id: "urgent",
    title: "Commande Urgente",
    description: "Élec Pro Solutions (Sarah) - Chantier bloqué",
    text: "URGENT : Chantier bloqué ce matin ! Sarah d'Élec Pro (contact@elecpro-solutions.fr). Pouvez-vous nous livrer en express 2 Meuleuse d'Angle 125mm et 5 Lots de Disques Diamant Béton ? Réponse par retour de mail svp.",
  },
  {
    id: "incomplete",
    title: "Demande Floue",
    description: "Inconnu (SMS) - Demande incomplète nécessitant révision",
    text: "salut il me faudrait les casques et des bandes pour le chantier rappelle-moi au plus vite merci",
  },
];
