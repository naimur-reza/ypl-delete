import { prisma } from "@/lib/prisma";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";

import { StudyAbroadHero } from "@/app/(public)/study-abroad/components/hero-section";

import { ReviewSection } from "@/components/sections/review-section";
import EligibilityForm from "@/components/sections/eligibility-form";
import { fetchFaqsByIntakePage } from "@/lib/faqs";
import { IntakeMonth } from "@/hooks/use-course-wizard";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Clock,
  DollarSign,
  MapPin,
  Star,
  ChevronRight,
  CheckCircle,
  Users,
  FileText,
  Plane,
  Building,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    country: string;
    program: string; // destination slug
    intake: string; // intake month (JANUARY, MAY, SEPTEMBER)
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { program, intake } = await params;

  // Find destination and intake page data
  const destination = await prisma.destination.findUnique({
    where: { slug: program },
    select: {
      id: true,
      name: true,
      thumbnail: true,
    },
  });

  const intakeMonth = intake.toUpperCase() as IntakeMonth;

  // Fetch intake page for metadata
  const intakePage = destination
    ? await prisma.intakePage.findFirst({
        where: {
          destinationId: destination.id,
          intake: intakeMonth,
        },
        select: {
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
        },
      })
    : null;

  const destinationName =
    destination?.name || program.charAt(0).toUpperCase() + program.slice(1);
  const intakeFormatted =
    intake.charAt(0).toUpperCase() + intake.slice(1).toLowerCase();

  return buildMetadata({
    title:
      intakePage?.metaTitle ||
      `${intakeFormatted} Intake - Study in ${destinationName} | NWC Education`,
    description:
      intakePage?.metaDescription ||
      `Apply for ${intakeFormatted} intake to study in ${destinationName}. Get expert guidance on universities, courses, and visa process from NWC Education.`,
    keywords:
      intakePage?.metaKeywords ||
      `${intakeFormatted} intake, study in ${destinationName}, ${destinationName} universities, international students`,
    images: destination?.thumbnail,
    url: `/${program}/${intake}`,
  });
}

// Why Choose Intake Component
function WhyChooseIntake({
  intake,
  destination,
}: {
  intake: string;
  destination: string;
}) {
  const intakeFormatted =
    intake.charAt(0).toUpperCase() + intake.slice(1).toLowerCase();

  const benefits = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Wide Course Selection",
      description: `Access to hundreds of programs starting in ${intakeFormatted}`,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Early Application Advantage",
      description: "Apply early to secure your spot at top universities",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Scholarship Opportunities",
      description: "Many scholarships have deadlines aligned with this intake",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Guidance",
      description: "Get personalized support throughout your application",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose{" "}
            <span className="text-primary">{intakeFormatted} Intake</span>?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the advantages of applying for the {intakeFormatted} intake
            to study in {destination}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Top University List Component
function TopUniversityList({
  universities,
  countrySlug,
}: {
  universities: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    thumbnail: string | null;
    address: string | null;
  }>;
  countrySlug: string;
}) {
  if (universities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Top <span className="text-primary">Universities</span> for This
            Intake
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore universities accepting applications for this intake
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.slice(0, 6).map((university) => (
            <Link
              key={university.id}
              href={`/${countrySlug}/universities/${university.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative h-40 bg-slate-100">
                {university.thumbnail ? (
                  <Image
                    src={university.thumbnail}
                    alt={university.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {university.logo && (
                    <Image
                      src={university.logo}
                      alt={`${university.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  )}
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {university.name}
                  </h3>
                </div>
                {university.address && (
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{university.address}</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {universities.length > 6 && (
          <div className="text-center mt-8">
            <Link
              href={`/${countrySlug}/universities`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Universities
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// How We Help Component
function HowWeHelp() {
  const steps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Free Consultation",
      description:
        "Get personalized guidance on course selection and university options",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Application Support",
      description:
        "Complete assistance with your university applications and documents",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Scholarship Guidance",
      description: "Help identify and apply for relevant scholarship programs",
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Visa Assistance",
      description: "Expert support throughout the visa application process",
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-primary">We Help</span> You
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Our comprehensive support ensures a smooth journey from application
            to arrival
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-slate-800 rounded-2xl p-6 h-full">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ChevronRight className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function IntakePage({ params }: PageProps) {
  const { country, program, intake } = await params;

  // Find destination by slug
  const destination = await prisma.destination.findUnique({
    where: { slug: program },
    select: { id: true, name: true },
  });

  // Map intake string to IntakeMonth enum
  const intakeMonth = intake.toUpperCase() as IntakeMonth;

  // Fetch FAQs for this intake page
  const faqs = destination
    ? await fetchFaqsByIntakePage(destination.id, intakeMonth, 6)
    : [];

  // Fetch universities for this destination
  const universities = destination
    ? await prisma.university.findMany({
        where: {
          destinationId: destination.id,
          isActive: true,
        },
        take: 9,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          thumbnail: true,
          address: true,
        },
      })
    : [];

  const destinationName =
    destination?.name || program.charAt(0).toUpperCase() + program.slice(1);

  return (
    <>
      {/* Hero Section */}
      <StudyAbroadHero countrySlug={country} />

      {/* Why Choose Intake Section */}
      <WhyChooseIntake intake={intake} destination={destinationName} />

      {/* Eligibility Form */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Check Your <span className="text-red-600">Eligibility</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find out if you are eligible for the upcoming intake by filling
              out this form. Our counselors will get back to you shortly.
            </p>
          </div>
          <EligibilityForm
            className="shadow-2xl border-slate-200"
            hideHeader={true}
          />
        </div>
      </section>

      {/* Top Universities List */}
      <TopUniversityList universities={universities} countrySlug={country} />

      {/* Application Timeline - placeholder */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Application Timeline</h2>
          <p className="text-xl text-slate-600">Countdown timer coming soon</p>
        </div>
      </section>

      {/* How We Help */}
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
