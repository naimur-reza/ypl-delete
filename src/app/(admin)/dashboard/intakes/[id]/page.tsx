import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditIntakeClient } from "../_components/EditIntakeClient";

interface EditIntakePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Intake - Admin Dashboard",
  description: "Edit intake page for study abroad programs",
};

async function getIntakeData(id: string) {
  const intake = await prisma.intakePage.findUnique({
    where: { id },
    include: {
      destination: true,
      countries: { include: { country: true } },
      topUniversities: { include: { university: true } },
      intakePageBenefits: { orderBy: { sortOrder: "asc" } },
      howWeHelpItems: { orderBy: { sortOrder: "asc" } },
      intakeSeason: true,
      _count: {
        select: { faqs: true },
      },
    },
  });

  return intake;
}

export default async function EditIntakePage({ params }: EditIntakePageProps) {
  const { id } = await params;

  // Fetch intake data
  const intake = await getIntakeData(id);

  if (!intake) {
    notFound();
  }

  return <EditIntakeClient intake={intake} />;
}
