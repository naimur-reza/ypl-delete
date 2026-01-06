import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CourseWizardData } from "@/hooks/use-course-wizard";

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, wizardData } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create lead with wizard data stored in interestJson
    const lead = await prisma.lead.create({
      data: {
        email,
        name: name || email.split("@")[0], // Use email prefix as name if not provided
        phone: phone || null,
        countryId: wizardData?.nationalityId || null,
        destinationId: wizardData?.destinationId || null,
        interestJson: wizardData || null,
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        email: lead.email,
      },
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create lead",
      },
      { status: 500 }
    );
  }
}
