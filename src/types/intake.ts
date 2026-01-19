import { IntakeMonth } from "@/hooks/use-course-wizard";

export interface IntakePageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;

  // Hero Section
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroMedia: string | null;
  heroCTALabel: string | null;
  heroCTAUrl: string | null;

  // Why Choose Section
  whyChooseTitle: string | null;
  whyChooseDescription: string | null;

  // Timeline & Countdown
  timelineJson: any;
  targetDate: Date | null;
  timelineEnabled: boolean;

  // How We Help
  howWeHelpJson: any;
  howWeHelpEnabled: boolean;

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;

  // Relations
  destination: {
    id: string;
    name: string;
    slug: string;
    thumbnail?: string;
  };
  country: {
    id: string;
    name: string;
    slug: string;
  } | null;
  isGlobal: boolean;
  intake: IntakeMonth;
  status: string;
}

export interface IntakePageBenefit {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
}

export interface IntakePageQuery {
  destinationSlug: string;
  intake: IntakeMonth;
  countrySlug?: string; // undefined = global
}

export interface IntakePageWithRelations {
  id: string;
  title: string;
  description: string | null;
  destinationId: string;
  intake: IntakeMonth;
  countryId: string | null;
  isGlobal: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  // Hero Section
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroMedia: string | null;
  heroCTALabel: string | null;
  heroCTAUrl: string | null;

  // Why Choose Section
  whyChooseTitle: string | null;
  whyChooseDescription: string | null;

  // Timeline
  timelineJson: any;
  targetDate: Date | null;
  timelineEnabled: boolean;

  // How We Help
  howWeHelpJson: any;
  howWeHelpEnabled: boolean;

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;

  // Relations
  destination: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
  };
  country: {
    id: string;
    name: string;
    slug: string;
  } | null;
  intakePageBenefits: IntakePageBenefit[];
  _count: {
    faqs: number;
  };
}
