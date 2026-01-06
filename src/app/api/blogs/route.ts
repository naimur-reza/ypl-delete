/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleGetMany, handleDelete } from "@/lib/api-helpers";
import { getSession, canManageContent, unauthorizedResponse, forbiddenResponse } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  return handleGetMany(req, prisma.blog, {
    searchFields: ["title", "slug"],
    defaultSort: { createdAt: "desc" },
    include: {
      destination: { select: { id: true, name: true } },
      countries: { include: { country: true } },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const {
    title,
    slug,
    excerpt,
    content,
    image,
    author,
    publishedAt,
    isFeatured,
    destinationId,
    countryIds,
    universityIds,
    courseIds,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = body;

  if (!title || !slug || !destinationId) {
    return Response.json(
      { error: "Title, slug, and destinationId are required" },
      { status: 400 }
    );
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        isFeatured: isFeatured || false,
        destinationId,
        metaTitle,
        metaDescription,
        metaKeywords,
        countries: countryIds?.length
          ? {
              create: (countryIds || []).map((countryId: string) => ({
                countryId,
              })),
            }
          : undefined,
        universities: universityIds?.length
          ? {
              create: (universityIds || []).map((universityId: string) => ({
                universityId,
              })),
            }
          : undefined,
        courses: courseIds?.length
          ? {
              create: (courseIds || []).map((courseId: string) => ({
                courseId,
              })),
            }
          : undefined,
      } as any,
      include: {
        destination: { select: { id: true, name: true } },
        countries: { include: { country: true } },
        universities: { include: { university: true } },
        courses: { include: { course: true } },
      } as any,
    });

    return Response.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    if (error.code === "P2002") {
      return Response.json({ error: "Slug already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id, countryIds, universityIds, courseIds, ...data } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // Handle date conversion
    if (data.publishedAt) {
      data.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    }

    // Update blog and regions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing country associations
      await tx.blogCountry.deleteMany({
        where: { blogId: id },
      });
      await tx.blogUniversity.deleteMany({ where: { blogId: id } });
      await tx.blogCourse.deleteMany({ where: { blogId: id } });

      // Update blog
      const blog = await tx.blog.update({
        where: { id },
        data: {
          ...data,
          countries: countryIds?.length
            ? {
                create: (countryIds || []).map((countryId: string) => ({
                  countryId,
                })),
              }
            : undefined,
          universities: universityIds?.length
            ? {
                create: (universityIds || []).map((universityId: string) => ({
                  universityId,
                })),
              }
            : undefined,
          courses: courseIds?.length
            ? {
                create: (courseIds || []).map((courseId: string) => ({
                  courseId,
                })),
              }
            : undefined,
        },
        include: {
          destination: { select: { id: true, name: true } },
          countries: { include: { country: true } },
          universities: { include: { university: true } },
          courses: { include: { course: true } },
        } as any,
      });

      return blog;
    });

    return Response.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return Response.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  if (!canManageContent(session)) return forbiddenResponse();

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  return handleDelete(id, prisma.blog, {
    revalidatePaths: ["/dashboard/blogs"],
  });
}
