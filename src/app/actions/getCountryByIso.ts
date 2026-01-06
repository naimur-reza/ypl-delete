 'use server'
import { prisma } from "@/lib/prisma";
export async function getCountryByIso(geoCode: string) {
  if (!geoCode) return null;
  const country = await prisma.country.findUnique({
    where: { 
      isoCode: geoCode.toUpperCase() 
    },
    select: { 
      name: true, 
      slug: true,  
      flag: true 
    }
  });
  return country;
}