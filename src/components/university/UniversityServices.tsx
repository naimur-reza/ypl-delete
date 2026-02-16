import Image from "next/image";
import { Briefcase } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityServicesProps {
  heading?: string | null;
  description?: string | null;
  image?: string | null;
}

export function UniversityServices({ heading, description, image }: UniversityServicesProps) {
  if (!heading && !description && !image) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          {heading || "Student Services"}
        </h2>
      </div>

      {image && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
          <Image
            src={image}
            alt="University Services"
            fill
            className="object-cover"
          />
        </div>
      )}

      {description && (
        <MarkdownContent content={description} />
      )}
    </div>
  );
}
