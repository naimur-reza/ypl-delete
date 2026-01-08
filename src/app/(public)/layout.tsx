import { CountryProvider } from "@/lib/country-context";
import Navbar from "@/components/common/navbar/Navbar";
import Footer from "@/components/common/Footer";
import { resolveCountryContext } from "@/lib/country-resolver";
import { Toaster } from "sonner";

// Enable ISR with 1 hour revalidation for better performance
export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resolvedCountry = await resolveCountryContext();

  return (
    <CountryProvider
      country={resolvedCountry.slug}
      countryName={resolvedCountry.name}
      isoCode={resolvedCountry.isoCode}
      source={resolvedCountry.source}
    >
      <Navbar countrySlug={resolvedCountry.slug} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster position="top-right" richColors />
    </CountryProvider>
  );
}
