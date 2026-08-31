import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AudioDock from "@/components/AudioDock";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import GoogleTranslate from "@/components/GoogleTranslate";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Reporter's",
  description: "The Reporter's - Live Feed",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${serif.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <SessionProviderWrapper>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <AudioDock />
          <GoogleTranslate />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
