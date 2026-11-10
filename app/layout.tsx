import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Brian Jeong",
    template: "%s — Brian Jeong",
  },
  description:
    "Brian Jeong builds AI systems for real-world problems and explores how they work. Computer Science & Biosciences at Rice University.",
};

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${plexMono.variable}`}>
      <body className="bg-canvas text-ink">{children}</body>
    </html>
  );
}
