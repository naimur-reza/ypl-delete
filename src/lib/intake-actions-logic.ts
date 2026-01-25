import { prisma } from "./prisma";
import { IntakeMonth } from "@/hooks/use-course-wizard";

export interface CreateIntakePageInput {
  destinationId?: string;
  intake?: IntakeMonth;
  whyChooseTitle?: string;
  whyChooseDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTALabel?: string;
  heroCTAUrl?: string;
  heroMedia?: string;
  targetDate?: string;
  timelineEnabled?: boolean;
  howWeHelpEnabled?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  intakePageBenefits?: any[];
  howWeHelpItems?: any[];
  countryIds?: string[];
  universityIds?: string[];
  isGlobal?: boolean;
  intakeSeasonId?: string;
  status?: "DRAFT" | "ACTIVE";
}

export async function createIntakePage(data: CreateIntakePageInput) {
  const {
    destinationId,
    intake,
    whyChooseTitle,
    whyChooseDescription,
    heroTitle,
    heroSubtitle,
    heroCTALabel,
    heroCTAUrl,
    heroMedia,
    targetDate,
    timelineEnabled,
    howWeHelpEnabled,
    metaTitle,
    metaDescription,
    metaKeywords,
    intakePageBenefits,
    howWeHelpItems,
    universityIds,
    intakeSeasonId,
    status,
  } = data;

  if (!intakeSeasonId || intakeSeasonId === "__none__") {
    throw new Error("Intake Season is required");
  }

  // Fetch season data to sync isGlobal and countries
  const season = await prisma.intakeSeason.findUnique({
    where: { id: intakeSeasonId },
    include: { countries: true },
  });

  if (!season) {
    throw new Error("Intake Season not found");
  }

  const finalDestinationId = destinationId || season.destinationId || undefined;
  const finalIntake = intake || (season.intake as IntakeMonth);
  const finalIsGlobal = season.isGlobal;
  const seasonCountryIds = season.countries.map(c => c.countryId);

  return await prisma.intakePage.create({
    data: {
      destinationId: finalDestinationId,
      intake: finalIntake,
      whyChooseTitle,
      whyChooseDescription,
      heroTitle,
      heroSubtitle,
      heroCTALabel,
      heroCTAUrl,
      heroMedia,
      targetDate: targetDate ? new Date(targetDate) : null,
      timelineEnabled: timelineEnabled ?? true,
      howWeHelpEnabled: howWeHelpEnabled ?? true,
      metaTitle,
      metaDescription,
      metaKeywords,
      isGlobal: finalIsGlobal,
      intakeSeasonId,
      status: status || "DRAFT",
      countries: seasonCountryIds.length && !finalIsGlobal
        ? {
            create: seasonCountryIds.map((countryId: string) => ({
              countryId,
            })),
          }
        : undefined,
      topUniversities: universityIds?.length
        ? {
            create: universityIds.map((universityId: string) => ({
              universityId,
            })),
          }
        : undefined,
      intakePageBenefits: intakePageBenefits?.length
        ? {
            create: intakePageBenefits.map((b: any, index: number) => ({
              title: b.title,
              description: b.description,
              icon: b.icon,
              sortOrder: b.sortOrder ?? index,
              isActive: b.isActive ?? true,
            })),
          }
        : undefined,
      howWeHelpItems: howWeHelpItems?.length
        ? {
            create: howWeHelpItems.map((i: any, index: number) => ({
              title: i.title,
              description: i.description,
              icon: i.icon,
              sortOrder: i.sortOrder ?? index,
              isActive: i.isActive ?? true,
            })),
          }
        : undefined,
    },
    include: {
      intakePageBenefits: true,
      howWeHelpItems: true,
      countries: true,
      destination: true,
      intakeSeason: true,
    },
  });
}

export async function updateIntakePage(id: string, data: any) {
  const {
    intakePageBenefits,
    howWeHelpItems,
    universityIds,
    targetDate,
    intakeSeasonId,
    ...rest
  } = data;

  if (!id) {
    throw new Error("ID is required");
  }

  // Fetch season data to sync isGlobal and countries if season changed or for update
  let seasonData = null;
  if (intakeSeasonId && intakeSeasonId !== "__none__") {
    seasonData = await prisma.intakeSeason.findUnique({
      where: { id: intakeSeasonId },
      include: { countries: true },
    });
  }

  return await prisma.intakePage.update({
    where: { id },
    data: {
      ...rest,
      intakeSeasonId: intakeSeasonId === "__none__" ? null : intakeSeasonId,
      destinationId: seasonData?.destinationId || undefined,
      intake: seasonData?.intake || undefined,
      isGlobal: seasonData ? seasonData.isGlobal : undefined,
      targetDate: targetDate ? new Date(targetDate) : null,
      countries: seasonData
        ? {
            deleteMany: {},
            create: seasonData.isGlobal ? [] : seasonData.countries.map((c: any) => ({
              countryId: c.countryId,
            })),
          }
        : undefined,
      topUniversities: universityIds !== undefined
        ? {
            deleteMany: {},
            create: universityIds.map((universityId: string) => ({
              universityId,
            })),
          }
        : undefined,
      intakePageBenefits:
        intakePageBenefits !== undefined
          ? {
              deleteMany: {},
              create: intakePageBenefits.map((b: any, index: number) => ({
                title: b.title,
                description: b.description,
                icon: b.icon,
                sortOrder: b.sortOrder ?? index,
                isActive: b.isActive ?? true,
              })),
            }
          : undefined,
      howWeHelpItems:
        howWeHelpItems !== undefined
          ? {
              deleteMany: {},
              create: howWeHelpItems.map((i: any, index: number) => ({
                title: i.title,
                description: i.description,
                icon: i.icon,
                sortOrder: i.sortOrder ?? index,
                isActive: i.isActive ?? true,
              })),
            }
          : undefined,
    },
    include: {
      intakePageBenefits: true,
      howWeHelpItems: true,
      countries: true,
      topUniversities: true,
      destination: true,
      intakeSeason: true,
    },
  });
}

export async function deleteIntakePage(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }

  await prisma.intakePage.delete({ where: { id } });
}
