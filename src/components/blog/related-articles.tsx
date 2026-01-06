import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/cards/blog-card";

interface RelatedArticlesProps {
  currentBlogId: string;
  destinationId?: string;
  countrySlug?: string | null;
}

export async function RelatedArticles({
  currentBlogId,
  destinationId,
  countrySlug,
}: RelatedArticlesProps) {
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      id: { not: currentBlogId },
      ...(destinationId ? { destinationId } : {}),
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      author: true,
      publishedAt: true,
      destination: {
        select: { name: true },
      },
    },
  });

  if (relatedBlogs.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Related Articles
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Explore more guides and insights to help your study abroad journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8   mx-auto">
          {relatedBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              countrySlug={countrySlug || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
