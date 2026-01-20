import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeoRedirect } from "@/components/GeoRedirect";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NWC Education | Study Abroad Made Easy",
  description: "Your Gateway to Global Learning Opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <GeoRedirect />
        {children}
      </body>
    </html>
  );
}
