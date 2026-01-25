import { IntakeMonth } from "@/hooks/use-course-wizard";

export interface IntakePageData {
  id: string;

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

  // Relations
  destination: {
    slug: string;
    thumbnail?: string;
  } | null;
  isGlobal: boolean;
  intake: IntakeMonth | null;
  status: string;
}

export interface IntakePageBenefit {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface IntakePageHowWeHelpItem {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface IntakePageCountry {
  id: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface IntakePageUniversity {
  id: string;
  universityId: string;
  university: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
  };
}
export interface IntakePageQuery {
  destinationSlug: string;
  intake: IntakeMonth;
  countrySlug?: string; // undefined = global
}

export interface IntakePageWithRelations {
  id: string;
  destinationId: string | null;
  intake: IntakeMonth | null;
  isGlobal: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  intakeSeasonId: string | null;
  intakeSeason?: {
    id: string;
    title: string;
    intake: string;
    year: number;
  } | null;

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
  howWeHelpEnabled: boolean;

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;

  // Relations
  destination: {
    name: string;
    slug: string;
    thumbnail: string | null;
  } | null;
  countries: IntakePageCountry[];
  topUniversities: IntakePageUniversity[];
  intakePageBenefits: IntakePageBenefit[];
  howWeHelpItems: IntakePageHowWeHelpItem[];
  _count: {
    faqs: number;
  };
}
