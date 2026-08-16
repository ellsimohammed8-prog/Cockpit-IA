import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { ProductStockRecord } from "@/lib/schema";
import { db } from "@/lib/db";

function cleanPriceToCents(val: any): number {
  if (typeof val === "number") {
    return Math.round(val * 100);
  }
  if (!val) return 1000;
  const str = String(val)
    .replace(/[^\d.,]/g, "")
    .replace(",", ".");
  const num = parseFloat(str);
  return isNaN(num) ? 1000 : Math.round(num * 100);
}

function cleanQuantity(val: any): number {
  if (typeof val === "number") return Math.max(0, Math.floor(val));
  if (!val) return 10;
  const str = String(val).replace(/[^\d]/g, "");
  const num = parseInt(str, 10);
  return isNaN(num) ? 10 : num;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { success: false, error: "Veuillez fournir une URL valide de Google Sheet ou fichier Excel/CSV." },
        { status: 400 }
      );
    }

    let fetchUrl = url.trim();

    // 1. Google Sheets auto-formatting to CSV export
    const googleSheetMatch = fetchUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (googleSheetMatch) {
      const sheetId = googleSheetMatch[1];
      const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : "0";
      fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }

    // 2. Fetch the remote file (CSV / Excel / Sheet)
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Impossible de récupérer le document (${response.status} ${response.statusText}). Assurez-vous que le lien est partagé publiquement ("Tous les utilisateurs disposant du lien peuvent voir").`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Parse with SheetJS / XLSX
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { success: false, error: "Le document ne contient aucune feuille de calcul valide." },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (!rawData || rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: "La feuille de calcul est vide." },
        { status: 400 }
      );
    }

    // 4. Identify header columns or positional fallback
    let headerRowIndex = -1;
    let skuCol = -1;
    let nameCol = -1;
    let qtyCol = -1;
    let priceCol = -1;
    let catCol = -1;

    for (let i = 0; i < Math.min(5, rawData.length); i++) {
      const row = rawData[i].map((c) => String(c).toLowerCase().trim());
      const hasSku = row.some((c) => c.includes("sku") || c.includes("code") || c.includes("ref") || c.includes("id"));
      const hasName = row.some((c) => c.includes("nom") || c.includes("name") || c.includes("designation") || c.includes("produit") || c.includes("article") || c.includes("description"));
      
      if (hasSku || hasName) {
        headerRowIndex = i;
        row.forEach((colName, colIdx) => {
          if (skuCol === -1 && (colName.includes("sku") || colName.includes("code") || colName === "ref" || colName === "reference")) {
            skuCol = colIdx;
          } else if (nameCol === -1 && (colName.includes("nom") || colName.includes("name") || colName.includes("designation") || colName.includes("produit") || colName.includes("article") || colName.includes("description") || colName.includes("titre"))) {
            nameCol = colIdx;
          } else if (qtyCol === -1 && (colName.includes("qte") || colName.includes("quant") || colName.includes("stock") || colName.includes("dispo") || colName.includes("count"))) {
            qtyCol = colIdx;
          } else if (priceCol === -1 && (colName.includes("prix") || colName.includes("price") || colName.includes("tarif") || colName.includes("ht") || colName.includes("pu"))) {
            priceCol = colIdx;
          } else if (catCol === -1 && (colName.includes("cat") || colName.includes("rayon") || colName.includes("type") || colName.includes("famille"))) {
            catCol = colIdx;
          }
        });
        break;
      }
    }

    // Fallbacks if columns not identified by name
    if (skuCol === -1) skuCol = 0;
    if (nameCol === -1) nameCol = 1;
    if (qtyCol === -1) qtyCol = 2;
    if (priceCol === -1) priceCol = 3;
    if (catCol === -1) catCol = 4;

    const startIndex = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;
    const parsedProducts: ProductStockRecord[] = [];

    for (let r = startIndex; r < rawData.length; r++) {
      const row = rawData[r];
      if (!row || row.length === 0) continue;

      const rawSku = row[skuCol] ? String(row[skuCol]).trim() : "";
      const rawName = row[nameCol] ? String(row[nameCol]).trim() : "";

      // Skip row if completely empty or just whitespace
      if (!rawSku && !rawName) continue;

      const finalSku = (rawSku || `PROD-${r + 1}`).toUpperCase();
      const finalName = rawName || `Article Référence ${finalSku}`;
      const finalQty = row[qtyCol] !== undefined ? cleanQuantity(row[qtyCol]) : 25;
      const finalPriceCents = row[priceCol] !== undefined ? cleanPriceToCents(row[priceCol]) : 2900;
      const finalCat = row[catCol] ? String(row[catCol]).trim() : "Catalogue Général";

      parsedProducts.push({
        id: `prod-sync-${r + 1}-${Math.random().toString(36).substring(2, 7)}`,
        sku: finalSku,
        name: finalName,
        quantity_available: finalQty,
        unit_price_cents: finalPriceCents,
        category: finalCat,
      });
    }

    if (parsedProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun produit n'a pu être extrait du document. Vérifiez le format des colonnes." },
        { status: 400 }
      );
    }

    // Save directly to the products repository
    const saved = await db.setProducts(parsedProducts);

    return NextResponse.json({
      success: true,
      count: saved.length,
      products: saved,
      message: `✓ Synchronisation réussie : ${saved.length} produit(s) importé(s) dans le catalogue.`,
    });
  } catch (error: any) {
    console.error("Sync catalog error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erreur lors de la synchronisation : ${error.message || "Vérifiez que le lien est public et accessible."}`,
      },
      { status: 500 }
    );
  }
}
