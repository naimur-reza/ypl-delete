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
  const flattenedOffices = [
    {
      office: {
        id: "uk-london",
        name: "London Office",
        slug: "london",
        subtitle: "Headquarters",
        email: "london@nwcedu.com",
        phone: "+44 20 1234 5678",
        address: "123 Oxford Street, London, UK",
      },
      country: {
        id: "uk",
        name: "United Kingdom",
        slug: "uk",
      },
    },
    {
      office: {
        id: "uae-dubai",
        name: "Dubai Office",
        slug: "dubai",
        subtitle: "Middle East Hub",
        email: "dubai@nwcedu.com",
        phone: "+971 4 123 4567",
        address: "Dubai International Academic City",
      },
      country: {
        id: "uae",
        name: "United Arab Emirates",
        slug: "uae",
      },
    },
    {
      office: {
        id: "bd-dhaka",
        name: "Dhaka Office",
        slug: "dhaka",
        subtitle: "Bangladesh Regional Office",
        email: "dhaka@nwcedu.com",
        phone: "+880 2 1234 5678",
        address: "Gulshan 2, Dhaka, Bangladesh",
      },
      country: {
        id: "bd",
        name: "Bangladesh",
        slug: "bangladesh",
      },
    },
  ];

  const globalOffices = await prisma.globalOffice.findMany({
    where: {
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

  console.log("Global Offices:", globalOffices);

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
