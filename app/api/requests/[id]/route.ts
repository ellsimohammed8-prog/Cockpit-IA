import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const request = await db.getRequestById(params.id);
    if (!request) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
    }
    return NextResponse.json({ request });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, parsed_data, client_name, client_email, deductStockOnApprove } = body;

    const updated = await db.updateRequest(params.id, {
      status,
      parsed_data,
      client_name,
      client_email,
      deductStockOnApprove: deductStockOnApprove !== undefined ? deductStockOnApprove : true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      request: updated,
      message: `Demande mise à jour (Statut : ${status || updated.status})`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID de demande manquant." }, { status: 400 });
    }

    const success = await db.deleteRequest(id);
    if (!success) {
      return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Demande supprimée avec succès.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la demande." },
      { status: 500 }
    );
  }
}
