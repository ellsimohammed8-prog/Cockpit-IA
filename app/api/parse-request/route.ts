import { NextRequest, NextResponse } from "next/server";
import { parseInboundTextWithAI, AIEngineConfig } from "@/lib/ai";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw_content = body?.raw_content;
    const aiConfig: AIEngineConfig = {
      provider: body?.provider,
      model: body?.model,
      apiKey: body?.apiKey,
      customBaseUrl: body?.customBaseUrl,
      customModel: body?.customModel,
      customPrompt: body?.customPrompt,
    };

    if (!raw_content || typeof raw_content !== "string" || raw_content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le contenu du message (raw_content) est obligatoire." },
        { status: 400 }
      );
    }

    // Récupération dynamique du catalogue de stock pour enrichir le contexte IA
    const products = await db.getProducts();

    // Appel du moteur IA universel avec le catalogue en contexte
    const aiResult = await parseInboundTextWithAI(raw_content, aiConfig, products);

    let savedRecord;

    if (aiResult.success && aiResult.data) {
      // Cas de succès : Insertion avec statut 'pending_review'
      savedRecord = await db.createRequest({
        client_name: aiResult.data.client_name,
        client_email: aiResult.data.client_email,
        raw_content,
        parsed_data: aiResult.data,
        status: "pending_review",
        ai_provider: aiResult.provider,
      });
    } else {
      // Cas d'échec / Message incomplet / Fallback : Insertion avec statut 'needs_manual_handling'
      savedRecord = await db.createRequest({
        client_name: null,
        client_email: null,
        raw_content,
        parsed_data: null,
        status: "needs_manual_handling",
        ai_provider: aiResult.provider || "Manual Fallback Handler",
      });
    }

    return NextResponse.json({
      success: true,
      request: savedRecord,
      isMockMode: aiResult.isMockMode,
      aiProvider: aiResult.provider,
      message: aiResult.success
        ? "Demande analysée et enregistrée avec succès."
        : "Message enregistré pour traitement manuel.",
    });
  } catch (error: any) {
    console.error("[API Parse Request Error]:", error);

    try {
      const fallbackRecord = await db.createRequest({
        raw_content: "Message non traité suite à une erreur système",
        status: "needs_manual_handling",
      });
      return NextResponse.json({
        success: false,
        request: fallbackRecord,
        error: "Erreur serveur. La demande a été basculée en revue manuelle.",
      });
    } catch {
      return NextResponse.json(
        { error: "Erreur critique de traitement." },
        { status: 500 }
      );
    }
  }
}
