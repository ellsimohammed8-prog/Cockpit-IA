import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProductStockRecord } from "@/lib/schema";

export async function GET() {
  try {
    const products = await db.getProducts();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Impossible de récupérer le catalogue de produits." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, product, products } = body;

    // 1. Ajouter un seul produit manuellement
    if (action === "add_product" && product) {
      if (!product.name || !product.sku) {
        return NextResponse.json(
          { error: "Le nom et le SKU du produit sont obligatoires." },
          { status: 400 }
        );
      }
      const added = await db.addProduct(product);
      return NextResponse.json({
        success: true,
        product: added,
        message: `Produit "${added.name}" ajouté avec succès.`,
      });
    }

    // 2. Vider le catalogue
    if (action === "clear_catalog") {
      await db.clearProducts();
      return NextResponse.json({
        success: true,
        products: [],
        message: "Le catalogue produit a été vidé.",
      });
    }

    // 3. Importer ou synchroniser un lot de produits (Sheets / Excel / CSV)
    if (action === "sync_sheets" || action === "import_catalog") {
      if (Array.isArray(products)) {
        const updated = await db.setProducts(products);
        return NextResponse.json({
          success: true,
          products: updated,
          message: `${updated.length} produit(s) synchronisé(s) avec succès.`,
        });
      }
    }

    return NextResponse.json(
      { error: "Action ou données invalides." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête produit." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await db.clearProducts();
    return NextResponse.json({
      success: true,
      products: [],
      message: "Catalogue vidé avec succès.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors du vidage du catalogue." },
      { status: 500 }
    );
  }
}
