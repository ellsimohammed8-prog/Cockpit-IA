import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    await db.resetDatabase();
    const requests = await db.getRequests();
    const products = await db.getProducts();

    return NextResponse.json({
      success: true,
      requests,
      products,
      message: "Base de données réinitialisée aux valeurs d'origine.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation." },
      { status: 500 }
    );
  }
}
