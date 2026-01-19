/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Reusable API helper functions for route handlers
 */

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getPaginationParams(request: NextRequest): {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  search?: string;
} {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10)),
  );
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";
  const search = searchParams.get("search") || undefined;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sortBy,
    sortOrder,
    search,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function handleGetMany<T>(
  request: NextRequest,
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args?: any) => Promise<number>;
  },
  options?: {
    where?: any;
    include?: any;
    select?: any;
    defaultSort?: { [key: string]: "asc" | "desc" };
    searchFields?: string[];
    revalidatePaths?: string[];
    transform?: (item: T) => any;
  },
): Promise<Response> {
  try {
    const { page, limit, skip, sortBy, sortOrder, search } =
      getPaginationParams(request);

    // Build where clause - deep clone to avoid mutation issues
    const baseWhere: any = options?.where
      ? JSON.parse(JSON.stringify(options.where))
      : {};
    const where: any = {};

    // Collect all top-level conditions (excluding OR, AND, NOT)
    const topLevelConditions: any = {};
    for (const key in baseWhere) {
      if (!["OR", "AND", "NOT"].includes(key)) {
        topLevelConditions[key] = baseWhere[key];
      }
    }

    // Automatic status filtering
    const status = request.nextUrl.searchParams.get("status");
    if (status && status !== "all") {
      topLevelConditions.status = status;
    } else if (!status) {
      // Heuristic: If no status specified, check if it's likely a public request
      // Admin requests from useDataTable usually pass status=all or a specific status
      // We check for auth cookies to see if we should allow DRAFT content
      const hasAuth =
        request.cookies.has("auth-token") || request.cookies.has("session");
      if (!hasAuth) {
        // Only add status filter for public requests if no status is specified
        topLevelConditions.status = "ACTIVE";
      }
    }

    // Add search filter if provided
    let searchOR: any[] = [];
    if (search && options?.searchFields && options.searchFields.length > 0) {
      searchOR = options.searchFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive" as const,
        },
      }));
    }

    // Build final where clause - properly combine conditions
    // If we have top-level conditions AND search OR, we need to use AND
    const hasTopLevelConditions = Object.keys(topLevelConditions).length > 0;
    const hasSearchOR = searchOR.length > 0;
    const hasBaseOR = Array.isArray(baseWhere.OR) && baseWhere.OR.length > 0;

    if (hasTopLevelConditions && (hasSearchOR || hasBaseOR)) {
      // Combine all OR clauses
      const allOR: any[] = [];
      if (hasBaseOR) {
        allOR.push(...baseWhere.OR);
      }
      if (hasSearchOR) {
        allOR.push(...searchOR);
      }

      // Use AND to combine top-level conditions with OR clauses
      where.AND = [
        topLevelConditions,
        ...(allOR.length > 0 ? [{ OR: allOR }] : []),
      ];
    } else if (hasTopLevelConditions) {
      // Only top-level conditions, no OR
      Object.assign(where, topLevelConditions);
      // Preserve existing AND/NOT if present
      if (baseWhere.AND) where.AND = baseWhere.AND;
      if (baseWhere.NOT) where.NOT = baseWhere.NOT;
    } else if (hasSearchOR || hasBaseOR) {
      // Only OR clauses, no top-level conditions
      const allOR: any[] = [];
      if (hasBaseOR) {
        allOR.push(...baseWhere.OR);
      }
      if (hasSearchOR) {
        allOR.push(...searchOR);
      }
      if (allOR.length > 0) {
        where.OR = allOR;
      }
      // Preserve existing AND/NOT if present
      if (baseWhere.AND) where.AND = baseWhere.AND;
      if (baseWhere.NOT) where.NOT = baseWhere.NOT;
    } else {
      // No conditions
      Object.assign(where, baseWhere);
    }

    // Build orderBy
    const orderBy = sortBy
      ? { [sortBy]: sortOrder }
      : options?.defaultSort || { createdAt: "desc" };

    // Get data and count
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        ...(options?.include && { include: options.include }),
        ...(options?.select && { select: options.select }),
        orderBy,
        skip,
        take: limit,
      }),
      model.count({ where }),
    ]);

    const finalData = options?.transform ? data.map(options.transform) : data;

    const response = createPaginatedResponse(finalData, total, page, limit);

    return Response.json(response);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    // Provide better error messages for debugging
    const errorMessage =
      error?.message || String(error) || "Failed to fetch data";
    const errorDetails =
      process.env.NODE_ENV === "development"
        ? {
            message: errorMessage,
            stack: error?.stack,
          }
        : { message: errorMessage };
    return Response.json({ error: errorDetails }, { status: 500 });
  }
}

export async function handleCreate<T>(
  data: any,
  model: {
    findUnique: (args: any) => Promise<T | null>;
    create: (args: any) => Promise<T>;
  },
  options?: {
    uniqueField?: string;
    revalidatePaths?: string[];
  },
): Promise<Response> {
  try {
    // Check for unique constraint if specified
    if (options?.uniqueField && data[options.uniqueField]) {
      const existing = await model.findUnique({
        where: { [options.uniqueField]: data[options.uniqueField] },
      });
      if (existing) {
        return Response.json(
          { error: `${options.uniqueField} already exists` },
          { status: 400 },
        );
      }
    }

    const result = await model.create({ data });

    // Revalidate paths
    if (options?.revalidatePaths) {
      options.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return Response.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating:", error);
    if (error.code === "P2002") {
      return Response.json(
        { error: "Record with this value already exists" },
        { status: 400 },
      );
    }
    return Response.json(
      { error: error.message || "Failed to create" },
      { status: 500 },
    );
  }
}

export async function handleUpdate<T>(
  id: string,
  data: Partial<T>,
  model: {
    update: (args: any) => Promise<T>;
  },
  options?: {
    revalidatePaths?: string[];
  },
): Promise<Response> {
  try {
    const result = await model.update({
      where: { id },
      data,
    });

    // Revalidate paths
    if (options?.revalidatePaths) {
      options.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return Response.json(result);
  } catch (error: any) {
    console.error("Error updating:", error);
    if (error.code === "P2025") {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }
    return Response.json(
      { error: error.message || "Failed to update" },
      { status: 500 },
    );
  }
}

/**
 * Get user-friendly error message for foreign key constraints
 */
function getForeignKeyErrorMessage(constraintName: string): string {
  const constraintMap: Record<string, string> = {
    // Country constraints
    Destination_countryId_fkey:
      "Cannot delete country because it is used by one or more destinations",
    University_countryId_fkey:
      "Cannot delete country because it is used by one or more universities",
    _RegionCountries_A_fkey:
      "Cannot delete country because it is associated with one or more regions",

    // Region constraints
    UniversityRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more universities",
    CourseRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more courses",
    ScholarshipRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more scholarships",
    EventRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more events",
    BlogRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more blogs",
    FAQRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more FAQs",
    TestimonialRegion_regionId_fkey:
      "Cannot delete region because it is used by one or more testimonials",

    // Destination constraints
    University_destinationId_fkey:
      "Cannot delete destination because it is used by one or more universities",
    Course_destinationId_fkey:
      "Cannot delete destination because it is used by one or more courses",
    Scholarship_destinationId_fkey:
      "Cannot delete destination because it is used by one or more scholarships",
    Event_destinationId_fkey:
      "Cannot delete destination because it is used by one or more events",
    Blog_destinationId_fkey:
      "Cannot delete destination because it is used by one or more blogs",

    // University constraints
    Course_universityId_fkey:
      "Cannot delete university because it is used by one or more courses",
    Scholarship_universityId_fkey:
      "Cannot delete university because it is used by one or more scholarships",
    Event_universityId_fkey:
      "Cannot delete university because it is used by one or more events",
    UniversityRegion_universityId_fkey:
      "Cannot delete university because it is associated with one or more regions",

    // Course constraints
    CourseIntake_courseId_fkey:
      "Cannot delete course because it has associated intakes",
    CourseRegion_courseId_fkey:
      "Cannot delete course because it is associated with one or more regions",
    _CourseToScholarship_A_fkey:
      "Cannot delete course because it is linked to one or more scholarships",

    // Scholarship constraints
    ScholarshipRegion_scholarshipId_fkey:
      "Cannot delete scholarship because it is associated with one or more regions",

    // Event constraints
    EventRegion_eventId_fkey:
      "Cannot delete event because it is associated with one or more regions",

    // Blog constraints
    BlogRegion_blogId_fkey:
      "Cannot delete blog because it is associated with one or more regions",

    // FAQ constraints
    FAQRegion_faqId_fkey:
      "Cannot delete FAQ because it is associated with one or more regions",

    // Testimonial constraints
    TestimonialRegion_testimonialId_fkey:
      "Cannot delete testimonial because it is associated with one or more regions",
  };

  // Try exact match first
  if (constraintMap[constraintName]) {
    return constraintMap[constraintName];
  }

  // Fallback to generic message if constraint not found
  return "Cannot delete this record because it is referenced by other records. Please remove all related records first.";
}

export async function handleDelete(
  id: string,
  model: {
    delete: (args: any) => Promise<any>;
    modelName?: string;
  },
  options?: {
    revalidatePaths?: string[];
    modelName?: string;
  },
): Promise<Response> {
  try {
    await model.delete({ where: { id } });

    // Revalidate paths
    if (options?.revalidatePaths) {
      options.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting:", error);

    // Record not found
    if (error.code === "P2025") {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    // Foreign key constraint violation
    if (error.code === "P2003") {
      // Extract constraint name from error message or meta
      let constraintName = "";

      // Try to get constraint name from multiple possible locations
      if (error.meta?.target && Array.isArray(error.meta.target)) {
        // Sometimes the constraint info is in target array
        constraintName = error.meta.target.join("_");
      } else if (error.meta?.field_name) {
        constraintName = error.meta.field_name;
      } else if (error.message) {
        const patterns = [
          /constraint[:\s]+`?([A-Za-z_][A-Za-z0-9_]*)`?/i,
          /constraint\s+([A-Za-z_][A-Za-z0-9_]*)/i,
          /`([A-Za-z_][A-Za-z0-9_]*)`/,
        ];

        for (const pattern of patterns) {
          const match = error.message.match(pattern);
          if (match && match[1]) {
            constraintName = match[1];
            break;
          }
        }
      }

      const friendlyMessage = getForeignKeyErrorMessage(constraintName);

      return Response.json(
        {
          error: friendlyMessage,
          code: "FOREIGN_KEY_VIOLATION",
          constraint: constraintName || "unknown",
        },
        { status: 409 }, // Conflict status code
      );
    }

    // Generic error
    return Response.json(
      { error: error.message || "Failed to delete record" },
      { status: 500 },
    );
  }
}
