import { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntakeService } from "@/lib/intake-service-v2";
import { HeroSection } from "@/components/intake/HeroSection";
import { WhyChooseIntake } from "@/components/intake/WhyChooseIntake";
import { TopUniversities } from "@/components/intake/TopUniversities";
import { ApplicationTimeline } from "@/components/intake/ApplicationTimeline";
import { ApplyNowForm } from "@/components/ApplyNowForm";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import CallToActionBanner from "@/components/CallToActionBanner";
import { EventsSection } from "@/app/(public)/components";
import { buildMetadata } from "@/lib/metadata";
import { IntakeMonth } from "@/hooks/use-course-wizard";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    destination: string;
    intake: string;
  }>;
}

// Helper function to format intake name
function formatIntakeName(intake: string): string {
  return intake.charAt(0).toUpperCase() + intake.slice(1).toLowerCase();
}

// Clean destination slug (strip study-in- prefix if present)
function cleanDestinationSlug(slug: string | undefined): string {
  if (!slug) return "";
  return slug.startsWith("study-in-") ? slug.replace("study-in-", "") : slug;
}

// Helper function to validate intake month
function isValidIntake(intake: string): intake is IntakeMonth {
  const validIntakes: IntakeMonth[] = ["JANUARY", "MAY", "SEPTEMBER"];
  const upperIntake = intake.toUpperCase() as IntakeMonth;
  return validIntakes.includes(upperIntake);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { destination, intake } = await params;
  const cleanedSlug = cleanDestinationSlug(destination);

  if (!isValidIntake(intake)) {
    return buildMetadata({
      title: "Intake Not Found",
      description: "The requested intake page could not be found.",
    });
  }

  const intakeData = await IntakeService.getIntakePage({
    destinationSlug: cleanedSlug,
    intake: intake.toUpperCase() as IntakeMonth,
    // No country slug - global view
  });

  if (!intakeData) {
    return buildMetadata({
      title: "Intake Page Not Found",
      description: "The requested intake page could not be found.",
    });
  }

  const intakeName = formatIntakeName(intake);
  const destinationName = intakeData.destination.name;

  return buildMetadata({
    title:
      intakeData.metaTitle ||
      `${intakeName} Intake - Study in ${destinationName} | NWC Education`,
    description:
      intakeData.metaDescription ||
      `Apply for ${intakeName} intake to study in ${destinationName}. Get expert guidance on universities, courses, and visa process from NWC Education.`,
    keywords:
      intakeData.metaKeywords ||
      `${intakeName} intake, study in ${destinationName}, ${destinationName} universities, international students`,
    images: intakeData.destination.thumbnail,
    url: `/study-in-${destination}/${intake}`,
  });
}

function HowWeHelp({
  steps,
}: {
  steps?: Array<{ title?: string; description?: string }>;
}) {
  const displaySteps =
    steps && steps.length
      ? steps
      : [
          {
            title: "Free Consultation",
            description:
              "Get personalized guidance on course selection and university options",
          },
          {
            title: "Application Support",
            description:
              "Complete assistance with your university applications and documents",
          },
          {
            title: "Scholarship Guidance",
            description:
              "Help identify and apply for relevant scholarship programs",
          },
          {
            title: "Visa Assistance",
            description:
              "Expert support throughout the visa application process",
          },
        ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How We Help You
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our comprehensive support ensures a smooth journey from application
            to arrival
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySteps.map((step, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-6 h-full">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl font-bold">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function GlobalIntakePage({ params }: PageProps) {
  const { destination, intake } = await params;
  const cleanedSlug = cleanDestinationSlug(destination);

  // Validate intake
  if (!isValidIntake(intake)) {
    notFound();
  }

  // Get intake data WITHOUT country context (global view)
  const intakeData = await IntakeService.getIntakePage({
    destinationSlug: cleanedSlug,
    intake: intake.toUpperCase() as IntakeMonth,
    // No countrySlug - shows global data
  });

  if (!intakeData) {
    notFound();
  }

  const intakeName = formatIntakeName(intake);
  const destinationName = intakeData.destination.name;

  // Get ALL universities for this destination (no country filter)
  const { items: universities } = await IntakeService.getTopUniversities(
    cleanedSlug,
    // No country filter - shows all universities
  );

  // Get FAQs for this intake page
  const faqs = await IntakeService.getIntakeFAQs(intakeData.id, 8);

  // Get ALL upcoming events (no country filter)
  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
      status: "ACTIVE",
      // No country filter - global events
    },
    orderBy: {
      startDate: "asc",
    },
    take: 9,
  });

  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true },
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* Hero Section (global view) */}
      <HeroSection
        title={intakeData.heroTitle}
        subtitle={intakeData.heroSubtitle}
        media={intakeData.heroMedia}
        ctaLabel={intakeData.heroCTALabel}
        ctaUrl={intakeData.heroCTAUrl}
        destinationName={destinationName}
        intakeName={intakeName}
        // No countrySlug - global view
      />

      {/* Why Choose Intake Section */}
      <WhyChooseIntake
        title={intakeData.whyChooseTitle}
        description={intakeData.whyChooseDescription}
        benefits={intakeData.benefits}
        intakeName={intakeName}
        destinationName={destinationName}
      />

      {/* Eligibility Form (global view) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Check Your Eligibility
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find out if you are eligible for the upcoming intake by filling
              out this form. Our counselors will get back to you shortly.
            </p>
          </div>
          <ApplyNowForm
            destinations={destinations as any}
            destinationId={intakeData.destination.id}
            // No countryId - user can select their country in the form
          />
        </div>
      </section>

      {/* Top Universities (all universities, no country filter) */}
      <TopUniversities
        universities={universities}
        destinationSlug={destination}
        intakeName={intakeName}
        pageSize={6}
        // No countrySlug - shows all universities
      />

      {/* Application Timeline */}
      {intakeData.timelineEnabled !== false && (
        <ApplicationTimeline
          intakeName={intakeName}
          targetDate={intakeData.targetDate || undefined}
          steps={
            Array.isArray(intakeData.timelineJson)
              ? intakeData.timelineJson
              : []
          }
        />
      )}

      {/* How We Help */}
      {intakeData.howWeHelpEnabled !== false && (
        <HowWeHelp
          steps={
            Array.isArray(intakeData.howWeHelpJson)
              ? intakeData.howWeHelpJson
              : undefined
          }
        />
      )}

      {/* Student Review Video Slider (all reviews, no country filter) */}
      <ReviewSection />

      {/* Upcoming Events (all events, no country filter) */}
      <EventsSection events={events as any} />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Book free counselling CTA Section */}
      <CallToActionBanner />
    </>
  );
}

// Generate static params for all destination/intake combinations
export async function generateStaticParams() {
  const intakes = await prisma.intakePage.findMany({
    where: { status: "ACTIVE" },
    include: { destination: true },
  });

  const params = [];

  for (const intake of intakes) {
    // Remove "study-in-" prefix for the URL param
    const destination = intake.destination.slug.replace("study-in-", "");

    params.push({
      destination: destination,
      intake: intake.slug.toLowerCase(),
    });
  }

  return params;
}
