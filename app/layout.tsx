import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BAND_NAME, BAND_SUBTITLE, SITE_URL } from "./data/band";
import { featuredPhoto } from "./data/photos";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BAND_NAME,
    template: `%s`,
  },
  description: BAND_SUBTITLE,
  openGraph: {
    siteName: BAND_NAME,
    title: BAND_NAME,
    description: BAND_SUBTITLE,
    type: "website",
    images: [{ url: featuredPhoto.thumbnail, width: 800, height: 800, alt: `${BAND_NAME} live` }],
  },
  twitter: {
    card: "summary_large_image",
    title: BAND_NAME,
    description: BAND_SUBTITLE,
    images: [featuredPhoto.thumbnail],
  },
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
