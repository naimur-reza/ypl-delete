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
  // Default accommodation text if none provided
  const defaultAccommodationText = `There are a number of options for student residential accommodation, either privately owned or directly leased by the University. All first-year students are given priority for accommodation to ensure a smooth transition to university life.

Our partner universities typically offer self-catering residences. The size of accommodation varies from single bedsits to multi-occupancy flats and are all located within comfortable walking or travelling distance to the campus.

The flats come furnished and complete with standard kitchen facilities, high-speed internet, and 24-hour campus security for your peace of mind.`;

  const accommodationContent = accommodation || defaultAccommodationText;
  const accommodationImageUrl =
    accommodationImage ||
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop";

  return (
    <section
      className="py-16 md:py-20 bg-linear-to-b from-slate-50 to-white"
      id="accommodation"
    >
      <div className="container mx-auto">
        {/* Cost of Studying Section */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Cost of Studying
            </h2>
          </div>
          {tuitionFees ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <MarkdownContent content={tuitionFees} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <p className="text-slate-500 text-lg">
                Tuition fee information is currently available upon request.
                Please contact our counselors for the most up-to-date fee
                structures.
              </p>
            </div>
          )}
        </div>

        {/* Accommodation Split Card */}
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-slate-300/50">
          {/* Left Content (Dark) */}
          <div className="w-full md:w-1/2 bg-linear-to-br from-slate-800 to-slate-900 text-white p-10 md:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Accommodation
              </h2>
            </div>

            <MarkdownContent
              content={accommodationContent}
              className="[&_p]:text-slate-300 [&_strong]:text-white [&_h3]:text-white [&_a]:text-emerald-400"
            />
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px]">
            <Image
              src={accommodationImageUrl}
              alt="Student accommodation"
              fill
              className="object-cover"
            />
            {/* Gradient overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
