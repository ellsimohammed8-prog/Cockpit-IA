import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ParsedRequest } from "@/lib/schema";

export async function GET() {
  try {
    const requests = await db.getRequests();
    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Impossible de récupérer les demandes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, request, client_name, client_email, raw_content, parsed_data, status } = body;

    if (action === "clear_requests") {
      await db.clearRequests();
      return NextResponse.json({
        success: true,
        requests: [],
        message: "Toutes les demandes ont été supprimées.",
      });
    }

    // Création manuelle d'une demande
    const payload = request || {
      client_name: client_name || null,
      client_email: client_email || null,
      raw_content: raw_content || "Demande créée manuellement",
      parsed_data: parsed_data || null,
      status: status || "pending_review",
      ai_provider: "Saisie Manuelle",
    };

    const created = await db.createRequest(payload);
    return NextResponse.json({
      success: true,
      request: created,
      message: "Demande créée avec succès.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await db.clearRequests();
    return NextResponse.json({
      success: true,
      requests: [],
      message: "Toutes les demandes ont été vidées.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression des demandes." },
      { status: 500 }
    );
  }
}
