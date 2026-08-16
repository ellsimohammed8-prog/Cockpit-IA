import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    const { to, subject, text, body: legacyBody, smtpConfig } = data;

    const recipient = to || "commercial@votre-entreprise.fr";
    const emailText = text || legacyBody || "Bonjour, veuillez trouver ci-joint votre devis commercial.";
    const emailSubject = subject || "Votre devis commercial - Cockpit IA";

    const host = smtpConfig?.host || smtpConfig?.smtpServer || "pro.eu.turbo-smtp.com";
    const port = Number(smtpConfig?.port || smtpConfig?.smtpPort) || 465;
    const user = smtpConfig?.user || smtpConfig?.fromEmail || "08049ca61a52869cd262";
    const pass = smtpConfig?.pass || smtpConfig?.apiKeyOrPassword || "NkR46nSfCdg39iVwFPOq";
    const fromEmail = smtpConfig?.fromEmail || (user.includes("@") ? user : "commercial@votre-entreprise.fr");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
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
