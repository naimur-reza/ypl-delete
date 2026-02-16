import { prisma } from "@/lib/prisma";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Metadata } from "next";
import CallToActionBanner from "@/components/CallToActionBanner";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.legalPage.findUnique({
    where: { type: "PRIVACY_POLICY" },
  });
  return {
    title: page?.title ? `${page.title} | NWC Education` : "Privacy Policy | NWC Education",
    description:
      page?.subtitle ?? "Read our privacy policy and how we handle your data.",
  };
}

export default async function PrivacyPolicyPage() {
  const page = await prisma.legalPage.findUnique({
    where: { type: "PRIVACY_POLICY" },
  });

  const title = page?.title ?? "Privacy Policy";
  const subtitle = page?.subtitle ?? null;
  const content = page?.content;

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-slate-600 mb-10">{subtitle}</p>
            )}
            {content ? (
              <MarkdownContent
                content={content}
                className="prose prose-lg max-w-none"
              />
            ) : (
              <p className="text-slate-500">Content coming soon.</p>
            )}
          </div>
        </div>
      </section>
      <CallToActionBanner />
    </div>
  );
}
