import ServicesHero from "./components/services-hero";

import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import ServicesList from "./components/services-list";
import { prisma } from "@/lib/prisma";
import { FaqSection } from "@/components/sections/faq-section";
import { fetchFaqsForHomePage } from "@/lib/faqs";

export const revalidate = 3600;
export const dynamic = "force-static";

const ServicesPage = async ({
  params,
}: {
  params: Promise<{ country: string }>;
}) => {
  const { country } = await params;

  const faqs = await fetchFaqsForHomePage(country, 6);

  const services = await prisma.service.findMany({
    where: {
      status: "ACTIVE",
      countries: {
        some: {
          country: { slug: country },
        },
      },
    },
    orderBy: { title: "asc" },
  });

  return (
    <section className="">
      <ServicesHero />
      <ServicesList services={services} />
      <ReviewSection countrySlug={country} />
      <FaqSection faqs={faqs} />
      <CallToActionBanner />
    </section>
  );
};

export default ServicesPage;
