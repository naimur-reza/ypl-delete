import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  Plane,
  BadgeDollarSign,
  BookOpen,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { WhyChooseUsVideo } from "./why-choose-us-video";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

// Icon mapping for service icons
const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  BadgeDollarSign,
  Plane,
  BookOpen,
  // Add more as needed
};

// Color schemes for services
const colorSchemes = [
  { color: "text-pink-600", bgColor: "bg-pink-50" },
  { color: "text-purple-600", bgColor: "bg-purple-50" },
  { color: "text-blue-600", bgColor: "bg-blue-50" },
  { color: "text-emerald-600", bgColor: "bg-emerald-50" },
];

interface WhyChooseUsProps {
  countrySlug?: string | null;
}

export default async function WhyChooseUs({ countrySlug }: WhyChooseUsProps) {
  // Fetch 4 services filtered by country
  const services = await prisma.service.findMany({
    where: {
      status: "ACTIVE",
      OR: countrySlug
        ? [
            {
              countries: {
                some: {
                  country: {
                    slug: countrySlug,
                  },
                },
              },
            },
            { isGlobal: true },
          ]
        : [{ isGlobal: true }],
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      summary: true,
      icon: true,
      slug: true,
    },
  });

  // Map services to display format with icons and colors
  const displayServices = services.map((service, index) => {
    const iconName = service.icon || "GraduationCap";
    const IconComponent = iconMap[iconName] || GraduationCap;
    const colors = colorSchemes[index % colorSchemes.length];

    return {
      id: service.id,
      title: service.title,
      description: service.summary || "",
      icon: IconComponent,
      ...colors,
      slug: service.slug,
    };
  });

  // Fallback services if none found
  const finalServices =
    displayServices.length > 0
      ? displayServices
      : [
          {
            id: "1",
            title: "University Admission Support",
            description:
              "Obtain your university admission with our comprehensive guidance and partnership with 750+ global institutions.",
            icon: GraduationCap,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            slug: "university-admission-support",
          },
          {
            id: "2",
            title: "Finance Application Support",
            description:
              "Navigate financial applications, scholarships, and student loans effortlessly with our expert financial support team.",
            icon: BadgeDollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            slug: "finance-application-support",
          },
          {
            id: "3",
            title: "Visa Application Support",
            description:
              "Simplify complex visa procedures with our 98% success rate guidance system and document preparation.",
            icon: Plane,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            slug: "visa-application-support",
          },
          {
            id: "4",
            title: "IELTS 360",
            description:
              "Boost your confidence & proficiency with our specialized language training program designed for high band scores.",
            icon: BookOpen,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            slug: "ielts-360",
     
            },
        ];

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* LEFT COLUMN: Video Section */}
          <WhyChooseUsVideo />

          {/* RIGHT COLUMN: Services List */}
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <span className="text-sm font-bold tracking-widest text-pink-600 uppercase bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                Our Services
              </span>

              <h2 className="section-title mt-6 mb-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Everything you need to <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-primary">
                  Study Abroad
                </span>
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                We provide end-to-end support, from choosing the right
                university to landing in your dream destination.
              </p>
            </div>

            <div className="space-y-4">
              {finalServices.map((service) => {
                const Icon = service.icon;
                return (
                  <CountryAwareLink
                    href={`/services/${service.slug}`}
                    key={service.id}
                    className="group block p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-pink-100 transition-all duration-300"
                  >
                    <div className="flex gap-5 items-start">
                      {/* Icon Box */}
                      <div
                        className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${service.bgColor}`}
                      >
                        <Icon className={`w-7 h-7 ${service.color}`} />
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-pink-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600" />
                      </div>
                    </div>
                  </CountryAwareLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
