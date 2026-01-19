export interface SearchParams {
  [key: string]: string | string[] | undefined;
  destination?: string;
  intake?: string;
  country?: string;
  status?: string;
  page?: string;
  limit?: string;
  search?: string;
}

export interface IntakePageWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  destinationId: string;
  intake: string;
  countryId: string | null;
  isGlobal: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroMedia: string | null;
  heroMediaType: "IMAGE" | "VIDEO" | "TEXT_ONLY" | null;
  heroCTALabel: string | null;
  heroCTAUrl: string | null;
  whyChooseTitle: string | null;
  whyChooseDescription: string | null;
  timelineJson: unknown;
  targetDate: Date | null;
  timelineEnabled: boolean;
  howWeHelpJson: unknown;
  howWeHelpEnabled: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  destination: {
    id: string;
    name: string;
    slug: string;
  };
  country: {
    id: string;
    name: string;
    slug: string;
  } | null;
  intakePageBenefits: Array<{
    id: string;
    title: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    isActive?: boolean;
  }>;
  _count: {
    faqs: number;
  };
}
