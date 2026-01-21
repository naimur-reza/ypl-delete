import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Share2, Clock, DollarSign, MapPin } from "lucide-react";
import Image from "next/image";

// SSG with ISR - revalidate every hour
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-generate first 50 courses at build time for instant loading
export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return courses.map((course) => ({
    slug: course.slug,
  }));
}

// Reusable Components
import { IntakeFeature } from "@/app/(public)/components";
import { ReviewSection } from "@/components/sections/review-section";
import { FaqSection } from "@/components/sections/faq-section";
import { BlogSlider } from "../../blogs/components/blog-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { fetchFaqsByContext } from "@/lib/faqs";

// Course Components
import { CourseSidebar } from "./components/course-sidebar";
import { CourseOverview } from "./components/course-overview";
import { CourseUniversity } from "./components/course-university";
import { CourseEntryRequirements } from "./components/course-entry-requirements";
import { CourseCostOfStudy } from "./components/course-cost-of-study";
import { CourseScholarships } from "./components/course-scholarships";
import { CourseCareers } from "./components/course-careers";
import { CourseAdmission } from "./components/course-admission";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import { ShareCourseButton } from "@/components/share-course-button";
import { MarkdownContent } from "@/components/ui/markdown-content";
 

interface PageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

// Define course sections type
interface CourseSections {
  overview?: string;
  entryRequirements?: string;
  costOfStudy?: string;
  scholarships?: string;
  careers?: string;
  admission?: string;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.metaTitle || `${course.title} - Study in ${country}`,
    description:
      course.metaDescription ||
      `Learn about ${course.title}, requirements, fees, and how to apply.`,
    keywords:
      course.metaKeywords || `Course, ${course.title}, Study in ${country}`,
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { country, slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      university: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          thumbnail: true,
          description: true,
          address: true,
          website: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      scholarships: {
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          amount: true,
          description: true,
        },
      },
      intakes: true,
    },
  });

  if (!course) {
    notFound();
  }

  // Parse sections from JSON
  const sections = (course.sections as CourseSections) || {};

  // Build sidebar steps - show all 6 form sections plus University
  const sidebarSteps = [
    { id: "overview", label: "Overview" },
    { id: "university", label: "University" },
    { id: "entry-requirements", label: "Requirements" },
    { id: "cost-of-study", label: "Cost & Aid" },
    { id: "scholarships", label: "Scholarships" },
    { id: "careers", label: "Careers" },
    { id: "admission", label: "Admission" },
  ];

  // Fetch FAQs for this course
  const faqs = await fetchFaqsByContext(
    {
      courseId: course.id,
      universityId: course.university?.id,
      destinationId: course.destinationId,
    },
    6,
  );

  // Fetch related blogs
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      OR: [
        { destinationId: course.destinationId },
        { universities: { some: { universityId: course.universityId } } },
      ],
    },
    take: 6,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      publishedAt: true,
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={
            course.university?.thumbnail ||
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=100&w=1400&auto=format&fit=crop"
          }
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
            <Link
              href={`/${country}`}
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/${country}/courses`}
              className="hover:text-white transition-colors"
            >
              Courses
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
              {course.title}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight mb-4">
            {course.title}
          </h1>

          {course.university && (
            <p className="text-lg text-white/90 mb-6">
              at {course.university.name}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <Link href="#admission">
              <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-blue-600/20">
                Apply Now
              </button>
            </Link>
            <ShareCourseButton title={course.title} />
          </div>
        </div>
      </div>

      {/* Top Bar with Key Info */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Duration
                    </span>
                    <span className="font-bold text-slate-900">
                      {course.duration}
                    </span>
                  </div>
                </div>
              )}
              {(course.tuitionMin || course.tuitionMax) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Tuition Fee
                    </span>
                    <span className="font-bold text-blue-600">
                      {course.tuitionMin && course.tuitionMax
                        ? `${formatCurrency(
                            course.tuitionMin,
                          )} - ${formatCurrency(course.tuitionMax)}`
                        : course.tuitionMin
                          ? `From ${formatCurrency(course.tuitionMin)}`
                          : course.tuitionMax
                            ? `Up to ${formatCurrency(course.tuitionMax)}`
                            : "Contact for details"}
                    </span>
                  </div>
                </div>
              )}
              {course.destination && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Destination
                    </span>
                    <span className="font-bold text-slate-900">
                      {course.destination.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-32">
              <CourseSidebar steps={sidebarSteps} />

              {/* Sidebar CTA */}
              <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Need Guidance?</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Our advisors can help you with {course.title}.
                  </p>
                  <CountryAwareLink href={`/apply-now`}>
                    <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                      Book Free Consultation
                    </button>
                  </CountryAwareLink>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
              </div>
            </div>
          </aside>

          {/* Main Content Areas */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {/* Course Overview */}
              <section id="overview" className="scroll-mt-32">
                <CourseOverview
                  content={sections.overview || course.description || "Contact us for course overview."}
                />
              </section>

              {/* About University */}
              <section id="university" className="scroll-mt-32">
                {course.university ? (
                  <CourseUniversity
                    university={course.university}
                    countrySlug={country}
                  />
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">About University</h2>
                    <p className="text-slate-500">University information coming soon.</p>
                  </div>
                )}
              </section>

              {/* Entry Requirements */}
              <section id="entry-requirements" className="scroll-mt-32">
                <CourseEntryRequirements
                  content={sections.entryRequirements || "Contact us for entry requirements."}
                />
              </section>

              {/* Cost of Study */}
              <section id="cost-of-study" className="scroll-mt-32">
                <CourseCostOfStudy
                  tuitionMin={course.tuitionMin}
                  tuitionMax={course.tuitionMax}
                  duration={course.duration}
                  content={sections.costOfStudy}
                />
              </section>

              {/* Scholarships - Show markdown content from sections */}
              <section id="scholarships" className="scroll-mt-32">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">🎓</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                      Scholarships
                    </h2>
                  </div>
                  {sections.scholarships ? (
                    <MarkdownContent content={sections.scholarships} />
                  ) : (
                    <p className="text-slate-500">Contact us for scholarship information.</p>
                  )}
                </div>
              </section>

              {/* Careers */}
              <section id="careers" className="scroll-mt-32">
                <CourseCareers content={sections.careers || "Contact us for career information."} />
              </section>

              {/* Admission */}
              <section id="admission" className="scroll-mt-32">
                <CourseAdmission
                  content={sections.admission}
                  intakes={course.intakes}
                />
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Global Sections */}
      <div className="space-y-0">
        {/* Intake admission Section CTR */}
        <div className="bg-white">
          <IntakeFeature countrySlug={country} />
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-50">
          <FaqSection faqs={faqs} />
        </div>

        {/* Reviews Section */}
        <ReviewSection
          universityId={course.universityId || undefined}
          countrySlug={country}
        />

        {/* Book free counselling CTR Section */}
        <CallToActionBanner />

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="bg-slate-50 py-16 px-6">
            <div className="container mx-auto">
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Related Resources & Guides
                </h2>
                <p className="text-slate-600">
                  Read our latest articles to help you prepare for this course.
                </p>
              </div>
              <BlogSlider posts={relatedBlogs} countrySlug={country} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
