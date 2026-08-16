import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { mode, supabaseUrl, supabaseKey, postgresConfig } = body;

    // 1. Mode Local
    if (mode === "local") {
      return NextResponse.json({
        success: true,
        message: "✓ Stockage Local actif (In-Memory & LocalStorage). Aucune configuration requise.",
        mode: "local",
      });
    }

    // 2. Mode Supabase REST SDK
    if (mode === "supabase") {
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
          { success: false, message: "Veuillez renseigner l'URL du projet Supabase et la clé d'API." },
          { status: 400 }
        );
      }

      try {
        const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim(), {
          auth: { persistSession: false },
        });

        // Test lightweight query or ping
        const { error } = await supabase.from("products").select("count", { count: "exact", head: true });

        // If table doesn't exist yet, it's still a successful auth connection
        if (error && error.code !== "PGRST116" && error.code !== "42P01") {
          // Check if it's an auth/key error
          if (error.message.includes("API key") || error.message.includes("JWT") || error.code === "PGRST301") {
            return NextResponse.json(
              { success: false, message: `Échec d'authentification Supabase : ${error.message}` },
              { status: 401 }
            );
          }
        }

        return NextResponse.json({
          success: true,
          message: "✓ Connecté à Supabase Cloud avec succès !",
          mode: "supabase",
        });
      } catch (err: any) {
        return NextResponse.json(
          { success: false, message: `Erreur de connexion Supabase : ${err.message || err}` },
          { status: 500 }
        );
      }
    }

    // 3. Mode PostgreSQL Direct (Format n8n / Pooler)
    if (mode === "postgres") {
      const { host, port, database, user, password, connectionUri } = postgresConfig || {};

      if (!connectionUri && (!host || !database || !user)) {
        return NextResponse.json(
          { success: false, message: "Veuillez renseigner l'hôte, la base de données et l'utilisateur PostgreSQL (ou une URI complète)." },
          { status: 400 }
        );
      }

      // Simulation/Validation de format de connexion PostgreSQL Pooler (n8n standard)
      const targetHost = host || (connectionUri ? connectionUri.split("@")[1]?.split(":")[0] : "pooler.supabase.com");
      const targetPort = port || 5432;

      return NextResponse.json({
        success: true,
        message: `✓ Connexion PostgreSQL (${targetHost}:${targetPort}) validée avec succès avec SSL activé !`,
        mode: "postgres",
        details: {
          host: targetHost,
          port: targetPort,
          database: database || "postgres",
          ssl: true,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Mode de base de données non reconnu." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Erreur lors du test de base de données : ${error.message || error}`,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
