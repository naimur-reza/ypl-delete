import { prisma } from "@/lib/prisma";
import { UniversitiesHero } from "./components/universities-hero";
import { UniversityListing } from "./components/university-listing";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { fetchFaqsForUniversitiesPage } from "@/lib/faqs";

export const metadata = {
  title: "Universities - NWC Education",
  description:
    "Find your dream university. Browse top-ranked institutions worldwide.",
};

const UniversitiesPage = async () => {
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // Fetch FAQs for universities listing page
  const faqs = await fetchFaqsForUniversitiesPage(null, 6);

  return (
    <main className="bg-white">
      {/* 1. Small Hero Section */}
      <UniversitiesHero />

      {/* 2. Filter Card & List of All University */}
      <UniversityListing universities={universities} />

      {/* 3. Student Review Video Slider + Google My Business Review Slider */}
      <ReviewSection />

      {/* 4. FAQs */}
      <FaqSection faqs={faqs} />

      {/* 5. Representative Video Slider */}
      <RepresentativeVideoSlider />

      {/* 6. Book free counselling CTR Section */}
      <CallToActionBanner />
    </main>
  );
};

export default UniversitiesPage;
