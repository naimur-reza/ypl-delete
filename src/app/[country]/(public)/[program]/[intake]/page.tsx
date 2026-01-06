import { prisma } from "@/lib/prisma";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";

import { StudyAbroadHero } from "../../study-abroad/components/hero-section";

import WhyChooseIntake from "./components/why-choose-intake";
import { ReviewSection } from "@/components/sections/review-section";
import EligibilityForm from "@/components/sections/eligibility-form";
import TopUniversityList from "./components/top-university-list";
import HowWeHelp from "./components/how-we-help";
import { fetchFaqsByIntakePage } from "@/lib/faqs";
import { IntakeMonth } from "../../../../../../prisma/src/generated/prisma/enums";

interface PageProps {
  params: Promise<{
    country: string;
    program: string; // destination slug
    intake: string; // intake month (JANUARY, MAY, SEPTEMBER)
  }>;
}

export default async function IntakePage({ params }: PageProps) {
  const { program, intake } = await params;

  // Find destination by slug
  const destination = await prisma.destination.findUnique({
    where: { slug: program },
    select: { id: true },
  });

  // Map intake string to IntakeMonth enum
  const intakeMonth = intake.toUpperCase() as IntakeMonth;

  // Fetch FAQs for this intake page
  const faqs = destination
    ? await fetchFaqsByIntakePage(destination.id, intakeMonth, 6)
    : [];

  // Placeholder data fetching could be added here
  const universities: any[] = [];
  return (
    <>
      {/* Hero Section */}
      <StudyAbroadHero />

      {/* Why Choose Intake Section */}
      <WhyChooseIntake />

      {/* Eligibility Form - Using the new reusable EligibilityForm */}
      <section className="py-12 bg-slate-50">
        <div className=" max-w-7xl  mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Check Your <span className="text-red-600">Eligibility</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find out if you are eligible for the upcoming intake by filling
              out this form. Our counselors will get back to you shortly.
            </p>
          </div>
          {/* We pass hideHeader={true} to only show the form part since we have our own section header */}
          <EligibilityForm
            className="shadow-2xl border-slate-200"
            hideHeader={true}
          />
        </div>
      </section>

      {/* Top Universities List */}
      <section className="py-12">
        <TopUniversityList />
      </section>

      {/* Application Timeline with Countdown - placeholder */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Application Timeline</h2>
          <p className="text-xl">Countdown timer coming soon</p>
        </div>
      </section>

      <HowWeHelp />

      {/* Student Review Video Slider */}
      <ReviewSection />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Representative Video Slider */}
      <RepresentativeVideoSlider />

      {/* Book free counselling CTA */}
      <CallToActionBanner />
    </>
  );
}
