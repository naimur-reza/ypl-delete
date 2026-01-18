import Image from "next/image";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityServicesProps {
  heading?: string | null;
  description?: string | null;
  image?: string | null;
}

export function UniversityServices({ heading, description, image }: UniversityServicesProps) {
  if (!heading && !description && !image) return null;

  return (
    <section className="py-12 md:py-20 bg-slate-50" id="services">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {heading || "Student Services"}
            </h2>
            {description && (
              <MarkdownContent content={description} />
            )}
          </div>

          {/* Image */}
          {image && (
            <div className="flex-1 w-full relative aspect-video md:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt="University Services"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
