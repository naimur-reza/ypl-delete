import ServicesHero from "./components/services-hero";
import { FaqSection } from "../components/faq-section";
import { ReviewSection } from "@/components/sections/review-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import ServicesList from "./components/services-list";

const ServicesPage = () => {
  return (
    <section className="">
      <ServicesHero />
      <ServicesList />
      <ReviewSection />
      <FaqSection />
      <CallToActionBanner />
    </section>
  );
};

export default ServicesPage;
