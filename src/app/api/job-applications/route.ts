import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.jobApplication, {
    searchFields: ["firstName", "lastName", "email"],
    defaultSort: { createdAt: "desc" },
    include: {
      career: {
        select: {
          id: true,
          title: true,
          department: true,
        },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    careerId,
    firstName,
    lastName,
    email,
    phone,
    coverLetter,
    resumeUrl,
    linkedinUrl,
    portfolioUrl,
    currentCompany,
    yearsOfExperience,
    expectedSalary,
    availableFrom,
  } = body;

  if (!careerId || !firstName || !lastName || !email || !phone) {
    return Response.json(
      { error: "Career ID, first name, last name, email, and phone are required" },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.jobApplication.create({
      data: {
        careerId,
        firstName,
        lastName,
        email,
        phone,
        coverLetter,
        resumeUrl,
        linkedinUrl,
        portfolioUrl,
        currentCompany,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        expectedSalary,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
      },
      include: {
        career: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });

    return Response.json(application, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to create job application" },
        { status: 500 }
      );
    }
    return Response.json(
      { error: "Failed to create job application" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, status, notes, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const application = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...data,
        status,
        notes,
      },
      include: {
        career: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });

    return Response.json(application);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to update job application" },
        { status: 500 }
      );
    }
    return Response.json(
      { error: "Failed to update job application" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.jobApplication.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        { error: error.message || "Failed to delete job application" },
        { status: 500 }
      );
    }
    return Response.json(
      { error: "Failed to delete job application" },
      { status: 500 }
    );
  }
}
