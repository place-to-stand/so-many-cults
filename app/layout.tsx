import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BAND_NAME, BAND_SUBTITLE } from "./data/band";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://somanycults.com"),
  title: BAND_NAME,
  description: BAND_SUBTITLE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
