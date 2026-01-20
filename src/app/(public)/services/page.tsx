import ServicesHero from "./components/services-hero";
import { FaqSection } from "../components/faq-section";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import ServicesList from "./components/services-list";

export const revalidate = 3600;

const ServicesPage = async ({
  params,
}: {
  params: Promise<{ country: string }>;
}) => {
  const country = (await params).country;
  return (
    <section className="">
      <ServicesHero />
      <ServicesList />
      <ReviewSection countrySlug={country} />
      <FaqSection countryId={country} />
      <CallToActionBanner />
    </section>
  );
};

export default ServicesPage;
