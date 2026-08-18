import { NextRequest, NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { db } from "@/lib/db";
import { parseInboundTextWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const host = body?.inboundConfig?.host || body?.host || "imap.gmail.com";
    const port = Number(body?.inboundConfig?.port || body?.port) || 993;
    const user = (body?.inboundConfig?.user || body?.email || "").trim();
    const rawPass = (body?.inboundConfig?.pass || body?.appPassword || "").trim();
    const pass = rawPass.replace(/\s+/g, ""); // Remove spaces from Google App Password
    const isTestOnly = body?.testOnly ?? body?.isTestOnly ?? false;

    // 1. If no user or password provided, run demonstration simulation
    if (!user || !pass) {
      if (isTestOnly) {
        return NextResponse.json({
          success: true,
          message: "✓ Mode Démo : Renseignez votre mot de passe d'application Google (16 lettres) pour activer la relève réelle.",
          isMock: true,
        });
      }

      const products = await db.getProducts();
      const demoEmail = {
        fromName: "Société ApexTech Innovations",
        fromEmail: "commandes@apextech-innovations.com",
        subject: "Demande urgente de cotation matériels de chantier",
        content: `Bonjour,\n\nPourriez-vous nous établir en urgence un devis pour notre nouveau chantier :\n- 5x ${products[0]?.name || "Perceuse visseuse sans fil 18V"}\n- 12x ${products[1]?.name || "Disque diamant 125mm"}\n\nMerci de nous confirmer la disponibilité en stock.\n\nCordialement,\nMarc Dubois — Directeur des Achats`,
      };

      const aiResult = await parseInboundTextWithAI(demoEmail.content, undefined, products);
      const newRequest = await db.createRequest({
        client_name: aiResult.data?.client_name || demoEmail.fromName,
        client_email: aiResult.data?.client_email || demoEmail.fromEmail,
        raw_content: `De: ${demoEmail.fromName} <${demoEmail.fromEmail}>\nObjet: ${demoEmail.subject}\n\n${demoEmail.content}`,
        parsed_data: aiResult.data || null,
        status: "pending_review",
        ai_provider: aiResult.provider || "Simulation Inbound",
      });

      return NextResponse.json({
        success: true,
        insertedCount: 1,
        request: newRequest,
        message: "✓ [Mode Démonstration] 1 nouvelle demande simulée a été analysée avec succès !",
      });
    }

    // 2. Real IMAP Connection
    const client = new ImapFlow({
      host,
      port,
      secure: port === 993,
      auth: { user, pass },
      logger: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await client.connect();
    } catch (connErr: any) {
      console.error("[IMAP Connect Error]", connErr);
      return NextResponse.json(
        {
          success: false,
          message: `Échec de connexion IMAP (${host}:${port}) : ${connErr.message || "Vérifiez votre adresse email et votre mot de passe d'application Google"}.`,
          error: connErr.message || String(connErr),
        },
        { status: 400 }
      );
    }

    // Mode Test de Connexion (IMAP Test)
    if (isTestOnly) {
      try {
        const mailbox = await client.status("INBOX", { messages: true, unseen: true });
        await client.logout();
        return NextResponse.json({
          success: true,
          message: `✓ Connexion IMAP Réussie ! Boîte email accessible (${mailbox.messages || 0} messages au total, ${mailbox.unseen || 0} non lus).`,
          mailbox,
        });
      } catch (err: any) {
        await client.logout();
        return NextResponse.json({
          success: true,
          message: `✓ Connexion IMAP Réussie avec succès sur ${user} !`,
        });
      }
    }

    // 3. Real Fetch & Ingestion
    const lock = await client.getMailboxLock("INBOX");
    const insertedRequests: any[] = [];

    try {
      // Find unread messages first, or fallback to all
      let uids: number[] = [];
      const unseenResult = await client.search({ seen: false }, { uid: true });
      if (Array.isArray(unseenResult) && unseenResult.length > 0) {
        uids = unseenResult as number[];
      } else {
        const allResult = await client.search({ all: true }, { uid: true });
        if (Array.isArray(allResult) && allResult.length > 0) {
          uids = allResult as number[];
        }
      }

      // Take the most recent 10 messages
      const targetUids = uids.slice(-10).reverse();
      const existingRequests = await db.getRequests();
      const products = await db.getProducts();

      for (const uid of targetUids) {
        try {
          const downloadStream = await client.download(String(uid), undefined, { uid: true });
          if (!downloadStream || !downloadStream.content) continue;

          const parsedEmail = await simpleParser(downloadStream.content);
          const fromAddress = parsedEmail.from?.value?.[0]?.address || parsedEmail.from?.text || user;
          const fromName = parsedEmail.from?.value?.[0]?.name || fromAddress.split("@")[0] || "Client";
          const subject = parsedEmail.subject || "Demande reçue";
          const textContent = parsedEmail.text || (parsedEmail.html ? parsedEmail.html.replace(/<[^>]+>/g, " ") : "");

          // Ignore self-generated confirmation/test emails from Cockpit
          if (subject.includes("⚡ Test Email - Cockpit IA") || subject.includes("Proposition commerciale & Devis")) {
            continue;
          }

          // Check for duplicates
          const alreadyImported = existingRequests.some((r) => {
            const raw = r.raw_content || "";
            return (
              (raw.includes(fromAddress) && raw.includes(subject)) ||
              (subject && raw.includes(subject) && raw.length > 50 && textContent && raw.includes(textContent.slice(0, 40)))
            );
          });

          if (alreadyImported) {
            continue;
          }

          // Parse content with AI
          const promptInput = `De: ${fromName} <${fromAddress}>\nObjet: ${subject}\n\nContenu:\n${textContent}`;
          const aiResult = await parseInboundTextWithAI(promptInput, undefined, products);

          const newReq = await db.createRequest({
            client_name: aiResult.data?.client_name || fromName,
            client_email: aiResult.data?.client_email || fromAddress,
            raw_content: `De: ${fromName} <${fromAddress}>\nObjet: ${subject}\n\n${textContent}`,
            parsed_data: aiResult.data || {
              client_name: fromName,
              client_email: fromAddress,
              intent: "quote_request",
              urgency: "medium",
              requested_items: [],
              summary: subject,
              total_amount: 0,
              email_draft: `Bonjour ${fromName},\n\nNous avons bien reçu votre message et préparons votre proposition.\n\nCordialement,\nService Commercial`,
            },
            status: "pending_review",
            ai_provider: aiResult.provider || "IMAP Live Sync",
          });

          insertedRequests.push(newReq);

          // Mark as seen in Gmail if needed
          try {
            await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
          } catch {
            // ignore flag errors
          }
        } catch (msgErr) {
          console.warn(`[IMAP Message parse error for UID ${uid}]`, msgErr);
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }

    const count = insertedRequests.length;
    return NextResponse.json({
      success: true,
      insertedCount: count,
      requests: insertedRequests,
      message:
        count > 0
          ? `✓ Relève terminée : ${count} nouvel(les) email(s) de demande client récupéré(s) et analysé(s) par l'IA !`
          : `✓ Boîte ${user} synchronisée : Aucun nouvel email non traité trouvé.`,
    });
  } catch (error: any) {
    console.error("[Check Emails Error]", error);
    return NextResponse.json(
      {
        success: false,
        message: `Erreur lors de la relève : ${error.message || error}`,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
