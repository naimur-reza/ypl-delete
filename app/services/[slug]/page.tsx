import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/service";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import { MarkdownContent } from "@/components/ui/markdown-content";

async function getServiceBySlug(slug: string) {
  await connectDB();
  const service = await Service.findOne({ slug, isActive: true }).lean();
  if (!service) return null;
  return JSON.parse(JSON.stringify(service));
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="relative h-64 w-full bg-muted sm:h-80">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10" />
              </div>
            )}
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {service.title}
              </h1>
              <SafeHtmlContent
                content={service.description}
                className="mt-4 text-muted-foreground"
              />
            </div>

            {service.features?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Key Features
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-foreground">Details</h2>
              {service.content ? (
                <MarkdownContent content={service.content} className="mt-4" />
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Detailed service information will be available soon.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
