import {
  Briefcase,
  Clock,
  Home,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  Clock,
  Briefcase,
  Home,
  CheckCircle,
  Star,
  Target,
  Lightbulb,
};

// Default benefits if none provided from database
const defaultBenefits = [
  {
    title: "Get Organized",
    description:
      "The January intake provides extra time to prepare your application. You can use the months after your final exams to carefully select universities, gather documents, improve English skills, and get finances in order. This reduced pressure results in a standout application.",
    icon: "Clock",
  },
  {
    title: "Enhanced Employability",
    description:
      "Graduating in January or February can give you an advantage in the job market. Many companies start recruitment drives in the spring, so you will be finishing your course just as new jobs are being advertised, making it easier to begin your career.",
    icon: "Briefcase",
  },
  {
    title: "Flexibility",
    description:
      "The January intake offers great flexibility, giving you a chance to begin your studies sooner rather than waiting for the next academic year. Classes are often smaller, meaning you may get more individual attention from your professors.",
    icon: "Home",
  },
];

interface Benefit {
  title: string;
  description?: string | null;
  icon?: string | null;
}

interface WhyChooseIntakeProps {
  title?: string | null;
  description?: string | null;
  benefits?: Benefit[];
  intakeMonth?: string;
}

export default function WhyChooseIntake({
  title,
  description,
  benefits,
  intakeMonth = "January",
}: WhyChooseIntakeProps) {
  // Use provided benefits or fall back to defaults
  const displayBenefits = benefits?.length ? benefits : defaultBenefits;

  const colors = ["bg-blue-600", "bg-blue-700", "bg-blue-800"];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-[20%] -left-[5%] w-72 h-72 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {title || (
              <>
                Why Apply for the{" "}
                <span className="text-red-600 relative inline-block">
                  {intakeMonth} Intake?
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-red-200 -z-10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                    />
                  </svg>
                </span>
              </>
            )}
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            {description ||
              `Choosing to apply for the ${intakeMonth} intake has several benefits that can make your transition to UK education smoother and more strategic. Here is why it provides a fantastic second chance without waiting a whole year.`}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon
              ? iconMap[benefit.icon] || Clock
              : Clock;
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 ${colorClass} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 grow">
                  {benefit.description}
                </p>

                {/* Learn more visual */}
                <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}