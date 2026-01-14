import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  ArrowLeftRight,
  Building2,
  GraduationCap,
  Users,
  Award,
  Globe,
  CheckCircle,
  Star,
  Calendar,
  Briefcase,
  BookOpen,
  LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  MapPin,
  ArrowLeftRight,
  Building2,
  GraduationCap,
  Users,
  Award,
  Globe,
  CheckCircle,
  Star,
  Calendar,
  Briefcase,
  BookOpen,
};

// Color mapping for dynamic colors
const colorMap: Record<string, { color: string; lightColor: string }> = {
  pink: { color: "bg-pink-500", lightColor: "bg-pink-100 text-pink-600" },
  emerald: {
    color: "bg-emerald-500",
    lightColor: "bg-emerald-100 text-emerald-600",
  },
  blue: { color: "bg-blue-500", lightColor: "bg-blue-100 text-blue-600" },
  indigo: {
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100 text-indigo-600",
  },
  purple: {
    color: "bg-purple-500",
    lightColor: "bg-purple-100 text-purple-600",
  },
  orange: {
    color: "bg-orange-500",
    lightColor: "bg-orange-100 text-orange-600",
  },
  red: { color: "bg-red-500", lightColor: "bg-red-100 text-red-600" },
  green: { color: "bg-green-500", lightColor: "bg-green-100 text-green-600" },
  cyan: { color: "bg-cyan-500", lightColor: "bg-cyan-100 text-cyan-600" },
  amber: { color: "bg-amber-500", lightColor: "bg-amber-100 text-amber-600" },
};

// Default fallback stats if none are configured
const defaultCards = [
  {
    icon: MapPin,
    title: "Located in",
    subtitle: "15+ Countries",
    color: "bg-pink-500",
    lightColor: "bg-pink-100 text-pink-600",
  },
  {
    icon: ArrowLeftRight,
    title: "End to End",
    subtitle: "Services",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Building2,
    title: "140+ Partner",
    subtitle: "Institutions",
    color: "bg-blue-500",
    lightColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: GraduationCap,
    title: "500+ British",
    subtitle: "Council Trained Counsellors",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100 text-indigo-600",
  },
];

export async function AboutSection() {
  // Fetch dynamic stats from database
  const stats = await prisma.stat.findMany({
    where: {
      section: "about",
      status: "ACTIVE",
    },
    orderBy: { sortOrder: "asc" },
  });

  // Map database stats to card format
  const cards =
    stats.length > 0
      ? stats.map((stat, idx) => {
          const iconName = stat.icon || "GraduationCap";
          const colorName =
            stat.color || ["pink", "emerald", "blue", "indigo"][idx % 4];
          const colors = colorMap[colorName] || colorMap.blue;

          return {
            icon: iconMap[iconName] || GraduationCap,
            title: stat.title,
            subtitle: stat.subtitle,
            color: colors.color,
            lightColor: colors.lightColor,
          };
        })
      : defaultCards;

  return (
    <section className="relative bg-white py-16 overflow-hidden">
      {/* Subtle background shapes/linears for visual interest */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-linear-to-br from-blue-100 to-red-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-linear-to-tl from-emerald-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Text */}
          <div className="space-y-5 text-gray-800">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                Achieve Your UK Study Dreams with{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-red-600">
                  NWC.
                </span>
              </h2>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
              At NWC, we're dedicated to transforming your ambition to study in
              the UK into a reality. From selecting the perfect course and
              university to navigating funding and visa applications, our expert
              guidance ensures a smooth and successful journey.
            </p>

            <div className="pt-4">
              <CountryAwareLink
                href="/apply-now"
                className="group flex items-center gap-3 w-fit text-red-600 font-bold border-b-2 border-red-500 pb-1 hover:text-red-700 transition-colors duration-300"
              >
                Discover Our Expert Consultants
                <ArrowLeftRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </CountryAwareLink>
            </div>
          </div>

          {/* Right Content - The Cards */}
          <div className="grid sm:grid-cols-2 gap-8">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`
                    relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100
                    transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl
                    ${idx % 2 === 1 ? "lg:translate-y-12" : ""}
                  `}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${card.lightColor} flex items-center justify-center mb-6 shadow-md`}
                  >
                    <Icon
                      size={32}
                      strokeWidth={2.5}
                      className={card.color.replace("bg-", "text-")}
                    />
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-base font-semibold text-gray-600 uppercase tracking-wider mt-2">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
