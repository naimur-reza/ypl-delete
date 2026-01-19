import { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntakeService, IntakePageData } from "@/lib/intake-service-v2";
import { HeroSection } from "@/components/intake/HeroSection";
import { WhyChooseIntake } from "@/components/intake/WhyChooseIntake";
import { TopUniversities } from "@/components/intake/TopUniversities";
import { ApplicationTimeline } from "@/components/intake/ApplicationTimeline";
import { ApplyNowForm } from "@/components/ApplyNowForm";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { EventsSection } from "@/app/(public)/components";
import { buildMetadata } from "@/lib/metadata";
import { IntakeMonth } from "@/hooks/use-course-wizard";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    country: string;
    destination: string;
    intake: string;
  }>;
}

// Helper function to format intake name
function formatIntakeName(intake: string): string {
  return intake.charAt(0).toUpperCase() + intake.slice(1).toLowerCase();
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
  const { country, destination, intake } = await params;

  if (!isValidIntake(intake)) {
    return buildMetadata({
      title: "Intake Not Found",
      description: "The requested intake page could not be found.",
    });
  }

  const intakeData = await IntakeService.getIntakePage({
    destinationSlug: destination,
    intake: intake.toUpperCase() as IntakeMonth,
    countrySlug: country, // Pass country for country-specific filtering
  });

  if (!intakeData) {
    return buildMetadata({
      title: "Intake Page Not Found",
      description: "The requested intake page could not be found.",
    });
  }

  const intakeName = formatIntakeName(intake);
  const destinationName = intakeData.destination.name;
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);

  return buildMetadata({
    title:
      intakeData.metaTitle ||
      `${intakeName} Intake - Study in ${destinationName} from ${countryName} | NWC Education`,
    description:
      intakeData.metaDescription ||
      `Apply for ${intakeName} intake to study in ${destinationName} from ${countryName}. Get expert guidance on universities, courses, and visa process from NWC Education.`,
    keywords:
      intakeData.metaKeywords ||
      `${intakeName} intake, study in ${destinationName} from ${countryName}, ${countryName} students, ${destinationName} universities`,
    images: intakeData.destination.thumbnail,
    url: `/${country}/study-in-${destination}/${intake}`,
  });
}

// Application Timeline Component (placeholder)
function ApplicationTimeline({ intakeName }: { intakeName: string }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Application Timeline
          </h2>
          <p className="text-lg text-gray-600">
            Important dates for the {intakeName} intake
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Application Deadlines Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            Stay tuned for updated application deadlines and important dates for
            the {intakeName} intake.
          </p>
          <div className="inline-flex items-center gap-2 text-blue-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Check back for updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowWeHelp({ steps }: { steps?: Array<{ title?: string; description?: string }> }) {
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
            description: "Help identify and apply for relevant scholarship programs",
          },
          {
            title: "Visa Assistance",
            description: "Expert support throughout the visa application process",
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

export default async function CountrySpecificIntakePage({ params }: PageProps) {
  const { country, destination, intake } = await params;

  // Validate intake
  if (!isValidIntake(intake)) {
    notFound();
  }

  const intakeData = await IntakeService.getIntakePage({
    destinationSlug: destination,
    intake: intake.toUpperCase() as IntakeMonth,
    countrySlug: country, // This will be used for future country-specific filtering
  });

  if (!intakeData) {
    notFound();
  }

  const intakeName = formatIntakeName(intake);
  const destinationName = intakeData.destination.name;

  // Get universities for this destination
  const { items: universities } = await IntakeService.getTopUniversities(destination, {
    countrySlug: country,
  });

  // FAQs for intake page
  const faqs = await IntakeService.getIntakeFAQs(intakeData.id, 8);

  // Upcoming events (scoped by country when possible)
  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
      countries: {
        some: {
          country: {
            slug: country,
          },
        },
      },
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
      {/* Hero Section */}
      <HeroSection
        title={intakeData.heroTitle}
        subtitle={intakeData.heroSubtitle}
        media={intakeData.heroMedia}
        ctaLabel={intakeData.heroCTALabel}
        ctaUrl={intakeData.heroCTAUrl}
        destinationName={destinationName}
        intakeName={intakeName}
        countrySlug={country}
      />

      {/* Why Choose Intake Section */}
      <WhyChooseIntake
        title={intakeData.whyChooseTitle}
        description={intakeData.whyChooseDescription}
        benefits={intakeData.benefits}
        intakeName={intakeName}
        destinationName={destinationName}
      />

      {/* Eligibility Form */}
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
            countryId={intakeData.country?.id || undefined}
          />
        </div>
      </section>

      {/* Top Universities */}
      <TopUniversities
        universities={universities}
        destinationSlug={destination}
        countrySlug={country}
        intakeName={intakeName}
        pageSize={6}
      />

      {/* Application Timeline */}
      {intakeData.timelineEnabled !== false && (
        <ApplicationTimeline
          intakeName={intakeName}
          targetDate={intakeData.targetDate || undefined}
          steps={Array.isArray(intakeData.timelineJson) ? intakeData.timelineJson : []}
        />
      )}

      {/* How We Help */}
      {intakeData.howWeHelpEnabled !== false && (
        <HowWeHelp
          steps={
            Array.isArray(intakeData.howWeHelpJson) ? intakeData.howWeHelpJson : undefined
          }
        />
      )}

      {/* Student Review Video Slider + Google My Business Review Slider */}
      <ReviewSection countrySlug={country} />

      {/* Upcoming Events */}
      <EventsSection events={events as any} />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Book free counselling CTA Section */}
      <CallToActionBanner />
    </>
  );
}
