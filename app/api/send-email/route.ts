import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    const { to, subject, text, body: legacyBody, smtpConfig } = data;

    const host = smtpConfig?.host || smtpConfig?.smtpServer || process.env.SMTP_HOST || "pro.eu.turbo-smtp.com";
    const port = Number(smtpConfig?.port || smtpConfig?.smtpPort) || Number(process.env.SMTP_PORT) || 465;
    const user = smtpConfig?.user || process.env.SMTP_USER || "";
    const pass = smtpConfig?.pass || process.env.SMTP_PASS || "";

    const candidateRecipient = to && String(to).includes("@") ? String(to).trim() : (smtpConfig?.recipient && String(smtpConfig.recipient).includes("@") ? String(smtpConfig.recipient).trim() : "");
    const recipient = candidateRecipient || (user && user.includes("@") ? user.trim() : "commercial@votre-entreprise.fr");

    const emailText = text || legacyBody || "Bonjour, veuillez trouver ci-joint votre devis commercial.";
    const emailSubject = subject || "Votre devis commercial - Cockpit IA";
    
    // Ensure fromEmail has a valid format with @
    let fromEmail = "commercial@votre-entreprise.fr";
    if (smtpConfig?.fromEmail && String(smtpConfig.fromEmail).includes("@")) {
      fromEmail = String(smtpConfig.fromEmail).trim();
    } else if (user && user.includes("@")) {
      fromEmail = user.trim();
    } else if (candidateRecipient) {
      fromEmail = candidateRecipient;
    }

    if (!user || !pass) {
      return NextResponse.json({
        success: true,
        isSimulation: true,
        message: `✓ [Mode Démonstration] Devis expédié (simulation). Pour un envoi réel à vos clients, configurez vos identifiants dans l'onglet Messagerie Pro.`,
      });
    }

    const cleanPass = pass.replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: cleanPass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Cockpit IA Commercial" <${fromEmail}>`,
      to: recipient,
      subject: emailSubject,
      text: emailText,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `✓ Email expédié avec succès à ${recipient} via SMTP (${host}:${port})`,
    });
  } catch (error: any) {
    console.error("[SMTP Send Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
        message: `Erreur d'envoi SMTP : ${error.message || error}`,
      },
      { status: 500 }
    );
  }
}
