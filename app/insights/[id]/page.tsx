import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/lib/data";

interface InsightDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>

          <div className="mt-6">
            <span className="inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-medium text-primary-foreground">
              {post.category}
            </span>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-6 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <article className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="mt-8 space-y-6 text-muted-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <h2 className="text-xl font-semibold text-foreground">
                    Key Takeaways
                  </h2>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur
                    </li>
                    <li>
                      Neque porro quisquam est, qui dolorem ipsum quia dolor sit
                      amet
                    </li>
                    <li>
                      Ut enim ad minima veniam, quis nostrum exercitationem
                      ullam
                    </li>
                    <li>
                      Quis autem vel eum iure reprehenderit qui in ea voluptate
                    </li>
                  </ul>
                  <h2 className="text-xl font-semibold text-foreground">
                    Looking Ahead
                  </h2>
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident.
                  </p>
                  <p>
                    Similique sunt in culpa qui officia deserunt mollitia animi,
                    id est laborum et dolorum fuga. Et harum quidem rerum
                    facilis est et expedita distinctio.
                  </p>
                </div>
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <span className="font-semibold text-foreground">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {post.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Content Writer at Talentix
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <aside>
              <div className="sticky top-24">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground">
                    Need Career Advice?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team of experts is here to help you navigate your career
                    journey.
                  </p>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-foreground">
                      Related Articles
                    </h3>
                    <div className="mt-4 space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/insights/${relatedPost.id}`}
                          className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
                        >
                          <p className="font-medium text-foreground">
                            {relatedPost.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {relatedPost.date}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}
