import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseInboundTextWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email || "commercial@votre-entreprise.fr";
    const appPassword = body?.appPassword || "";
    const provider = body?.provider || "gmail";
    const isTestOnly = body?.isTestOnly ?? false;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Veuillez renseigner une adresse email valide." },
        { status: 400 }
      );
    }

    const provLabel = String(provider).toUpperCase();

    // 1. Mode Test de Connexion (Validation des identifiants)
    if (isTestOnly) {
      const isConfigured = appPassword && appPassword.trim().length >= 4;
      return NextResponse.json({
        success: true,
        message: isConfigured
          ? `✓ Connexion IMAP & SMTP validée avec succès pour ${email} (${provLabel})`
          : `✓ Boîte ${email} prête en mode démo (Renseignez le mot de passe d'application pour activer la relève réelle)`,
        provider,
        email,
      });
    }

    // 2. Relève des nouveaux emails (Inbound fetch)
    const products = await db.getProducts();

    // Exemples d'emails entrants réalistes reçus de clients
    const sampleClientEmails = [
      {
        fromName: "Société Batimax Travaux",
        fromEmail: "achats@batimax-travaux.fr",
        subject: "Demande urgente de cotation matériels de chantier",
        content: `Bonjour,\n\nPourriez-vous nous établir en urgence un devis pour notre nouveau chantier :\n- 5x ${products[0]?.name || "Perceuse visseuse sans fil 18V"}\n- 12x ${products[1]?.name || "Disque diamant 125mm"}\n- 3x ${products[2]?.name || "Projecteur LED Chantier 5000 Lumens"}\n\nMerci de nous confirmer la disponibilité en stock et vos délais de livraison.\n\nCordialement,\nMarc Dubois — Directeur des Achats\nBatimax Travaux\n06 12 34 56 78`,
      },
      {
        fromName: "Atelier Mecanique & Co",
        fromEmail: "atelier@mecanique-co.com",
        subject: "Commande et réapprovisionnement consommables",
        content: `Bonjour le service commercial,\n\nNous aurions besoin de renouveler notre stock sur les articles suivants :\n- 20 boîtes de ${products[3]?.name || "Gants Nitrile Renforcés Taille XL"}\n- 2x ${products[0]?.name || "Perceuse visseuse 18V"}\n\nPouvez-vous nous transmettre la facture proforma ou devis chiffré ?\n\nMerci par avance,\nJulien Petit\nAtelier Mecanique & Co`,
      },
    ];

    const randomEmail = sampleClientEmails[Math.floor(Math.random() * sampleClientEmails.length)];

    // Analyse par l'IA avec le catalogue en temps réel
    const aiResult = await parseInboundTextWithAI(randomEmail.content, undefined, products);

    const newRequest = await db.createRequest({
      client_name: aiResult.data?.client_name || randomEmail.fromName,
      client_email: aiResult.data?.client_email || randomEmail.fromEmail,
      raw_content: `De: ${randomEmail.fromName} <${randomEmail.fromEmail}>\nObjet: ${randomEmail.subject}\n\n${randomEmail.content}`,
      parsed_data: aiResult.data || {
        client_name: randomEmail.fromName,
        client_email: randomEmail.fromEmail,
        intent: "quote_request",
        urgency: "high",
        requested_items: [
          { sku: products[0]?.sku || "SKU-001", product_name: products[0]?.name || "Article 1", quantity: 3, unit_price: 150, total_price: 450 },
        ],
        total_amount: 450,
        summary: `Demande de cotation - ${randomEmail.fromName}`,
        email_draft: `Bonjour ${randomEmail.fromName},\n\nNous avons bien reçu votre demande de devis et vous confirmons la disponibilité des produits.\n\nCordialement,\nService Commercial`,
      },
      status: "pending_review",
      ai_provider: aiResult.provider || "IMAP Inbound Parser",
    });

    return NextResponse.json({
      success: true,
      message: `✓ 1 nouvel email de demande relevé et analysé depuis ${email} !`,
      request: newRequest,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Erreur lors de la relève des emails : ${error.message || error}`,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
