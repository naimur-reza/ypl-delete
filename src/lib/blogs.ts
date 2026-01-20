import { Prisma } from "../../prisma/src/generated/prisma/client";
import { prisma } from "./prisma";

export type BlogWithCountry = Prisma.BlogGetPayload<{
  include: {
    countries: {
      include: { country: true };
    };
    destination: true;
  };
}>;

type BuildWhereArgs = {
  countrySlug?: string | null;
  countryFilterName?: string | null;
  searchQuery?: string | null;
  category?: string | null;
};

const buildBlogWhere = ({
  countrySlug,
  countryFilterName,
  searchQuery,
  category,
}: BuildWhereArgs): Prisma.BlogWhereInput => {
  const filters: Prisma.BlogWhereInput[] = [];

  if (countrySlug) {
    filters.push({
      countries: {
        some: {
          country: { slug: countrySlug },
        },
      },
    });
  }

  if (countryFilterName && countryFilterName !== "All") {
    filters.push({
      countries: {
        some: {
          country: { name: countryFilterName },
        },
      },
    });
  }

  if (searchQuery) {
    filters.push({
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { excerpt: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ],
    });
  }

  if (category && category !== "All") {
    filters.push({
      category: { equals: category, mode: "insensitive" },
    });
  }

  // Always filter by ACTIVE status for public queries
  filters.push({ status: "ACTIVE" });

  if (filters.length === 1) return filters[0];

  return { AND: filters };
};

type BlogPageQuery = {
  countrySlug?: string | null;
  countryFilterName?: string | null;
  searchQuery?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
};

export const fetchBlogPageData = async ({
  countrySlug,
  countryFilterName,
  searchQuery,
  category,
  page = 1,
  limit = 9,
}: BlogPageQuery) => {
  const where = buildBlogWhere({
    countrySlug,
    countryFilterName,
    searchQuery,
    category,
  });
  const featuredWhere = buildBlogWhere({ countrySlug });

  const skip = (page - 1) * limit;

  const [countries, featuredBlogs, blogs, totalCount, sliderBlogs] =
    await Promise.all([
      prisma.country.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      prisma.blog.findMany({
        where: { ...featuredWhere, isFeatured: true, status: "ACTIVE" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where: featuredWhere,
        orderBy: { publishedAt: "desc" },
        take: 5,
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
    ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    countries,
    featuredBlogs,
    blogs,
    sliderBlogs,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

export const fetchLatestBlogs = async (
  countrySlug?: string | null,
  take = 4,
) => {
  const where = buildBlogWhere({ countrySlug });

  return prisma.blog.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take,
    include: {
      countries: { include: { country: true } },
      destination: true,
    },
  });
};

// New function for client-side filtering - fetches all blogs at once
export const fetchBlogPageDataForClientFilter = async (
  countrySlug?: string | null,
) => {
  const baseWhere = buildBlogWhere({ countrySlug });

  const [destinations, featuredBlogs, allBlogs, sliderBlogs, categories] =
    await Promise.all([
      // Fetch destinations that have at least one blog
      prisma.destination.findMany({
        where: {
          status: "ACTIVE",
          blogs: { some: { status: "ACTIVE" } },
        },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      prisma.blog.findMany({
        where: { ...baseWhere, isFeatured: true, status: "ACTIVE" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
      // Fetch ALL blogs for client-side filtering
      prisma.blog.findMany({
        where: baseWhere,
        orderBy: { publishedAt: "desc" },
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
      prisma.blog.findMany({
        where: baseWhere,
        orderBy: { publishedAt: "desc" },
        take: 5,
        include: {
          countries: { include: { country: true } },
          destination: true,
        },
      }),
      // Fetch all unique categories
      prisma.blog.findMany({
        where: {
          ...baseWhere,
          category: { not: null },
        },
        select: { category: true },
        distinct: ["category"],
      }),
    ]);

  const uniqueCategories = categories
    .map((c) => c.category)
    .filter((c): c is string => c !== null && c !== undefined)
    .sort();

  return {
    destinations,
    featuredBlogs,
    allBlogs,
    sliderBlogs,
    categories: uniqueCategories,
  };
};
