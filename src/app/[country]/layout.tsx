import { notFound } from "next/navigation";
import { getCountryBySlug, getCountrySlugs } from "@/lib/countries";
import { CountryProvider } from "@/lib/country-context";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/navbar/Navbar";
import { ReactNode } from "react";
import { Toaster } from "sonner";

type Props = {
  params: Promise<{ country: string }>;
  children: ReactNode;
};

/**
 * Country-specific layout
 * Validates country exists in database before rendering
 */
export default async function CountryLayout({ params, children }: Props) {
  // Await params (Next.js 15+ requirement)
  const { country: countrySlug } = await params;

  // Fetch country from database
  const country = await getCountryBySlug(countrySlug);

  // If country doesn't exist or is inactive, return 404
  if (!country) {
    notFound();
  }

  return (
    <CountryProvider
      country={country.slug}
      countryName={country.name}
      isoCode={country.isoCode}
      source="param"
    >
      <Navbar countrySlug={country.slug} />
      <div className="min-h-[calc(100vh-120px)]">{children}</div>
      <Footer />
      <Toaster position="top-right" richColors />
    </CountryProvider>
  );
}

/**
 * Generate static params for all active countries
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const slugs = await getCountrySlugs();

  return slugs.map((slug) => ({
    country: slug,
  }));
}

/**
 * Revalidate every hour to catch new countries added by admin
 */
export const revalidate = 3600; // 1 hour
