import { prisma } from "./prisma";
import { IntakeMonth } from "@/hooks/use-course-wizard";
import type { Prisma } from "@/prisma/src/generated/prisma";

export type CreateIntakePageInput = Omit<
  Prisma.IntakePageCreateInput,
  "destination" | "intakeSeason" | "countries" | "topUniversities" | "intakePageBenefits" | "howWeHelpItems"
> & {
  destinationId?: string;
  intake?: IntakeMonth;
  intakeSeasonId?: string;
  countryIds?: string[];
  universityIds?: string[];
  intakePageBenefits?: Array<{
    title: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }>;
  howWeHelpItems?: Array<{
    title: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }>;
  targetDate?: string;
};

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
    isGlobal,
    countryIds,
    status,
  } = data;

  // Handle intakeSeasonId: if provided and valid, use it; otherwise require destinationId and intake
  let season = null;
  let finalDestinationId: string | undefined = destinationId;
  let finalIntake: IntakeMonth | undefined = intake;
  let finalIsGlobal = isGlobal ?? false;
  let seasonCountryIds: string[] = countryIds || [];

  if (intakeSeasonId && intakeSeasonId !== "__none__") {
    // Fetch season data to sync isGlobal and countries
    season = await prisma.intakeSeason.findUnique({
      where: { id: intakeSeasonId },
      include: { countries: true },
    });

    if (!season) {
      throw new Error("Intake Season not found");
    }

    finalDestinationId = destinationId || season.destinationId || undefined;
    finalIntake = intake || (season.intake as IntakeMonth);
    finalIsGlobal = season.isGlobal;
    seasonCountryIds = season.countries.map(c => c.countryId);
  } else {
    // No season selected - require destinationId and intake
    if (!finalDestinationId) {
      throw new Error("Destination is required when no intake season is selected");
    }
    if (!finalIntake) {
      throw new Error("Intake month is required when no intake season is selected");
    }
  }

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
      intakeSeasonId: intakeSeasonId && intakeSeasonId !== "__none__" ? intakeSeasonId : null,
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
