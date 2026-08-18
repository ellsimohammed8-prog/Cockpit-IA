import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/languageContext";

export const metadata: Metadata = {
  title: "Cockpit AI | Commercial Automation & Stock Sync",
  description: "Intelligent B2B commercial automation and real-time inventory management with human-in-the-loop validation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#08090C] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
