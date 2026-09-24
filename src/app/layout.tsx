import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import { content } from "@/content";
import "./globals.css";

const plantin = localFont({
  src: [
    { path: "../fonts/PlantinMTPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/PlantinMTPro-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-plantin",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-figtree",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: content.name,
  description: content.personas[0].blurb,
  // No favicon supplied yet; an empty icon avoids a /favicon.ico 404. Add src/app/icon.png to replace it.
  icons: { icon: "data:," },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plantin.variable} ${figtree.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
