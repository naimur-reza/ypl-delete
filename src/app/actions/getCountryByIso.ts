'use server'
import { prisma } from "@/lib/prisma";

export async function getCountryByIso(geoCode: string) {
  if (!geoCode) return null;

  const normalizedCode = geoCode.toUpperCase();

  const country = await prisma.country.findUnique({
    where: {
      isoCode: normalizedCode
    },
    select: {
      name: true,
      slug: true,
      flag: true
    }
  });

  return country;
}