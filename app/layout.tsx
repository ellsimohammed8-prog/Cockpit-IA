import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cockpit PME | Micro-SaaS POC",
  description: "Plateforme d'automatisation intelligente des demandes entrantes avec validation humaine pour PME.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
