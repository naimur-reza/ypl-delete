import { Wallet, Home } from "lucide-react";
import Image from "next/image";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityCostAndAccommodationProps {
  tuitionFees?: string | null;
  accommodation?: string | null;
  accommodationImage?: string | null;
}

export function UniversityCostAndAccommodation({
  tuitionFees,
  accommodation,
  accommodationImage,
}: UniversityCostAndAccommodationProps) {
  const defaultAccommodationText = `There are a number of options for student residential accommodation, either privately owned or directly leased by the University. All first-year students are given priority for accommodation to ensure a smooth transition to university life.

Our partner universities typically offer self-catering residences. The size of accommodation varies from single bedsits to multi-occupancy flats and are all located within comfortable walking or travelling distance to the campus.

The flats come furnished and complete with standard kitchen facilities, high-speed internet, and 24-hour campus security for your peace of mind.`;

  const accommodationContent = accommodation || defaultAccommodationText;
  const accommodationImageUrl =
    accommodationImage ||
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="space-y-8">
      {/* Cost of Studying Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Cost of Studying
          </h2>
        </div>
        {tuitionFees ? (
          <MarkdownContent content={tuitionFees} />
        ) : (
          <p className="text-slate-500">
            Tuition fee information is currently available upon request.
            Please contact our counselors for the most up-to-date fee structures.
          </p>
        )}
      </div>

      {/* Accommodation Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Accommodation
          </h2>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
          <Image
            src={accommodationImageUrl}
            alt="Student accommodation"
            fill
            className="object-cover"
          />
        </div>

        <MarkdownContent content={accommodationContent} />
      </div>
    </div>
  );
}
