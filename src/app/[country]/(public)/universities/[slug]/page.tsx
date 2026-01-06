import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Components
import { UniversityHero } from "@/components/university/UniversityHero";
import { UniversityOverview } from "@/components/university/UniversityOverview";
import { UniversityServices } from "@/components/university/UniversityServices";
import { UniversityRankings } from "@/components/university/UniversityRankings";
import { UniversityEntryRequirements } from "@/components/university/UniversityEntryRequirements";
import { UniversityCostAndAccommodation } from "@/components/university/UniversityCostAndAccommodation";
import { UniversityCourses } from "@/components/university/UniversityCourses";
import { UniversityScholarships } from "@/components/university/UniversityScholarships";
import { IntakeFeature } from "../../(home)/components/intake-feature";
import { ReviewSlider } from "@/components/sections/review-slider";
import { BlogSlider } from "../../blogs/components/blog-slider";
import { FaqSection } from "@/components/sections/faq-section";
import { RepresentativeVideoSlider } from "@/components/sections/representative-video-slider";
import CallToActionBanner from "@/components/CallToActionBanner";
import { UniversityGlobalBranches } from "@/components/university/UniversityGlobalBranches";
import { fetchFaqsByContext } from "@/lib/faqs";

interface PageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, slug } = await params;

  const university = await prisma.university.findUnique({
    where: { slug: slug },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
    },
  });

  if (!university) {
    return {
      title: "University Not Found",
    };
  }

  return {
    title: university.metaTitle || `${university.name} - Study in ${country}`,
    description:
      university.metaDescription ||
      `Learn about ${university.name}, its programs, rankings, and admission requirements.`,
    keywords:
      university.metaKeywords ||
      `Study in ${country}, ${university.name}, best universities in ${country}`,
  };
}

export default async function UniversityDetailsPage({ params }: PageProps) {
  const { country, slug } = await params;

  const university = await prisma.university.findUnique({
    where: { slug },
    include: {
      detail: true,
      // country: true, // Removed as it is not a direct relation
      courses: {
        where: { isActive: true },
        take: 6,
        include: {
          university: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      },
      scholarships: true,
      destination: true,
      reviewLinks: {
        include: {
          review: true,
        },
      },
      representativeVideoUniversities: {
        include: {
          representativeVideo: true,
        },
      },
      // Add other relations as needed
    },
  });

  if (!university) {
    notFound();
  }

  // Map review links to ReviewItem shape
  const reviews = university.reviewLinks.map((link) => ({
    id: link.review.id,
    name: link.review.name, // Assuming name is on review model
    message: link.review.message,
    // Add other fields mapping if necessary or use defaults if schema differs
    rating: link.review.rating,
    publishedAt: link.review.createdAt,
    image: link.review.image,
  }));

  // Fetch FAQs for this university
  const faqs = await fetchFaqsByContext(
    {
      universityId: university.id,
    },
    6
  );

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. University Info / Hero Section */}
      {/* 1. University Info / Hero Section */}
      <UniversityHero
        university={{
          name: university.name,
          thumbnail: university.thumbnail,
          logo: university.thumbnail,
          address: university.address,
          website: university.website,
          // New fields mapping
          fees: university.detail?.tuitionFees || "Contact for info",
          ranking: university.detail?.ranking || "N/A",
          established: "1900", // Placeholder as field missing in schema
          famousFor: university.detail?.famousFor || "Excellence in Education",
        }}
      />

      {/* 2. Overview Section */}
      {university.detail?.overview && (
        <UniversityOverview overview={university.detail.overview} />
      )}

      {/* 3. Services Section */}
      <UniversityServices
        heading={university.detail?.servicesHeading}
        description={university.detail?.servicesDescription}
        image={
          "https://thumbs.dreamstime.com/b/conceptual-hand-writing-showing-our-services-concept-meaning-occupation-function-serving-intangible-products-male-wear-160644151.jpg"
        }
      />

      {/* 4. Rankings Details */}
      {university.detail?.ranking && (
        <UniversityRankings ranking={university.detail.ranking} />
      )}

      {/* 5. Entry Requirements */}
      {university.detail?.entryRequirements && (
        <UniversityEntryRequirements
          requirements={university.detail.entryRequirements}
        />
      )}

      {/* 6. Cost of Studying & Accommodation */}
      <UniversityCostAndAccommodation
        tuitionFees={university.detail?.tuitionFees}
      />

      {/* 7. Courses List - Filter (Limited to 6 initial, client component handles search) */}
      <UniversityCourses
        courses={university.courses}
        universitySlug={university.slug}
        countrySlug={country}
      />

      {/* 8. Scholarships List */}
      <UniversityScholarships
        scholarships={university.scholarships}
        countrySlug={country}
      />

      {/* 9. Intake Admission Section CTR */}
      <IntakeFeature />

      {/* 10. Student Review Video Slider */}
      {reviews.length > 0 && (
        <ReviewSlider title="Student Reviews" items={reviews} type="text" />
      )}
      {/* If you have video reviews, you might want to fetch them or if they are mixed in reviews, filter them */}

      {/* 11. Article Related this University Section */}
      {/* Using BlogSlider as requested for 'Article Related' section */}
      <BlogSlider />

      {/* 12. FAQ */}
      <FaqSection faqs={faqs} />

      {/* 12.5. Global Branches */}
      <UniversityGlobalBranches />

      {/* 13. Representative Video Slider */}
      <RepresentativeVideoSlider universityId={university.id} />

      {/* 14. Book free counselling CTR Section */}
      <CallToActionBanner />
    </main>
  );
}
