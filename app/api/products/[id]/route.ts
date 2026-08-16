import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID de produit manquant." }, { status: 400 });
    }

    const success = await db.deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Produit non trouvé." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Produit supprimé avec succès.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit." },
      { status: 500 }
    );
  }
}
