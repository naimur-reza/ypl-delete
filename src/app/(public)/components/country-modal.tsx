import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import CountryModalClient from "./country-modal-client";

const CountryModal = async () => {
  // Fetch countries server-side
  const countries = await prisma.country.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      flag: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Get current country from cookie server-side
  const cookieStore = await cookies();
  const currentCountrySlug = cookieStore.get("user-country")?.value || null;

  return (
    <CountryModalClient
      countries={countries}
      currentCountrySlug={currentCountrySlug}
    />
  );
};

export default CountryModal;
