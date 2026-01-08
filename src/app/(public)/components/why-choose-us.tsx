import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  Globe2,
  Building2,
  Users,
  Award,
  Globe,
  CheckCircle,
  Star,
  Calendar,
  Briefcase,
  BookOpen,
  MapPin,
  ArrowLeftRight,
  LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Globe2,
  Building2,
  Users,
  Award,
  Globe,
  CheckCircle,
  Star,
  Calendar,
  Briefcase,
  BookOpen,
  MapPin,
  ArrowLeftRight,
};

// Color mapping for card styling
const colorMap: Record<
  string,
  { iconBg: string; iconColor: string; numberColor: string }
> = {
  pink: {
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    numberColor: "text-pink-500",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    numberColor: "text-purple-500",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    numberColor: "text-blue-500",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    numberColor: "text-emerald-500",
  },
  indigo: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    numberColor: "text-indigo-500",
  },
  orange: {
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    numberColor: "text-orange-500",
  },
  red: {
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    numberColor: "text-red-500",
  },
  green: {
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    numberColor: "text-green-500",
  },
  cyan: {
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    numberColor: "text-cyan-500",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    numberColor: "text-amber-500",
  },
};

// Default fallback stats
const defaultStats = [
  {
    icon: GraduationCap,
    title: "18+",
    subtitle: "Years of Excellence",
    description:
      "Experience helping students find their perfect study-abroad destination.",
    colors: colorMap.pink,
  },
  {
    icon: Building2,
    title: "750+",
    subtitle: "Global Partners",
    description:
      "Institution partners across the UK, Ireland, USA, Canada, Australia & more.",
    colors: colorMap.purple,
  },
  {
    icon: Globe2,
    title: "100K+",
    subtitle: "Students Counselled",
    description:
      "Students counselled from over 65 different countries across the globe.",
    colors: colorMap.blue,
  },
];

interface WhyChooseUsProps {
  countrySlug?: string | null;
}

export default async function WhyChooseUs({ countrySlug }: WhyChooseUsProps) {
  // Fetch dynamic stats from database
  const stats = await prisma.stat.findMany({
    where: {
      section: "why-choose-us",
      isActive: true,
      OR: countrySlug
        ? [
            {
              countries: {
                some: {
                  country: { slug: countrySlug },
                },
              },
            },
            { countries: { none: {} } }, // Global stats (no country filter)
          ]
        : undefined,
    },
    orderBy: { sortOrder: "asc" },
  });

  // Map database stats to display format
  const displayStats =
    stats.length > 0
      ? stats.map((stat, idx) => {
          const iconName = stat.icon || "GraduationCap";
          const colorName = stat.color || ["pink", "purple", "blue"][idx % 3];
          const colors = colorMap[colorName] || colorMap.pink;
          const Icon = iconMap[iconName] || GraduationCap;

          return {
            icon: Icon,
            title: stat.title,
            subtitle: stat.subtitle,
            description: "", // Can be extended later if needed
            colors,
          };
        })
      : defaultStats;

  return (
    <section className="relative w-full py-14 px-6 overflow-hidden bg-slate-50">
      {/* Static Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-bold tracking-widest text-pink-500 uppercase bg-pink-50 px-4 py-2 rounded-full">
            Who We Are
          </span>
          <h2 className="mt-6 text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Hi, we are{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">
              NWC Education
            </span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Your trusted partner for global education opportunities. We&apos;ve
            been transforming dreams into reality since 2006.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-1 gap-8 ${
            displayStats.length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : displayStats.length >= 3
              ? "md:grid-cols-3"
              : ""
          }`}
        >
          {displayStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-white/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 ${stat.colors.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon className={`w-7 h-7 ${stat.colors.iconColor}`} />
                </div>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-slate-800 to-slate-500 mb-4">
                  {stat.title}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {stat.subtitle}
                </h3>
                {stat.description && (
                  <p className="text-slate-500 leading-relaxed">
                    {stat.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
