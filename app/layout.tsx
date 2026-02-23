import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PublicShell } from "@/components/public-shell";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "YPL | Recruitment & Talent Consultancy",
  description:
    "Supporting the full talent lifecycle with specialist recruitment, executive search, and career management services.",
  icons: {
    icon: "/images/ypl-logo.png",
    apple: "/images/ypl-logo.png",
  },
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PublicShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  );
}
