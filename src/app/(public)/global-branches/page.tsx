import GlobalOfficesClient from "@/app/(public)/global-branches/global-offices-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{
    country: string;
  }>;
};

export const metadata: Metadata = {
  title: "Global Offices | NWC Education",
  description:
    "Find NWC Education offices worldwide. Expert study abroad consultation services.",
};

export default async function GlobalBranchesPage({ params }: PageProps) {
  const { country } = await params;

  // Static data for now as per request

  const globalOffices = await prisma.globalOffice.findMany({
    where: {
      status: "ACTIVE",
      countries: {
        some: {
          country: {
            slug: country,
          },
        },
      },
    },
    include: {
      countries: {
        include: {
          country: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Our Global Offices
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Visit our offices worldwide for expert study abroad consultation
              and support.
            </p>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-12 md:py-16 -mt-8">
        <div className="container mx-auto px-4">
          <GlobalOfficesClient offices={globalOffices} countryCode={country} />
        </div>
      </section>
    </div>
  );
}
