import { redirect } from "next/navigation";
import { resolveCountryContext } from "@/lib/country-resolver";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Intakes | NWC Education",
    description:
      "Explore available intakes for study abroad. Find January, May, and September intake deadlines.",
    url: "/intakes",
  });
}

export default async function PublicIntakesPage() {
  const resolved = await resolveCountryContext();
  if (resolved.slug) {
    redirect(`/${resolved.slug}/intakes`);
  }
 
}
