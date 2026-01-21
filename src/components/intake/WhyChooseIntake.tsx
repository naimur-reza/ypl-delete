import {
  GraduationCap,
  Clock,
  DollarSign,
  Users,
  Star,
  Award,
  BookOpen,
  Target,
} from "lucide-react";

interface Benefit {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
}

interface WhyChooseIntakeProps {
  title?: string;
  description?: string;
  benefits?: Benefit[];
  intakeName: string;
  destinationName: string;
}

// Icon mapping
const iconMap: Record<string, any> = {
  GraduationCap,
  Clock,
  DollarSign,
  Users,
  Star,
  Award,
  BookOpen,
  Target,
};

export function WhyChooseIntake({
  title,
  description,
  benefits,
  intakeName,
  destinationName,
}: WhyChooseIntakeProps) {
  // Default benefits if none provided
  const defaultBenefits: Benefit[] = [
    {
      id: "1",
      title: "Wide Course Selection",
      description: `Access to hundreds of programs starting in ${intakeName}`,
      icon: "BookOpen",
      sortOrder: 0,
    },
    {
      id: "2",
      title: "Early Application Advantage",
      description: "Apply early to secure your spot at top universities",
      icon: "Clock",
      sortOrder: 1,
    },
    {
      id: "3",
      title: "Scholarship Opportunities",
      description: "Many scholarships have deadlines aligned with this intake",
      icon: "DollarSign",
      sortOrder: 2,
    },
    {
      id: "4",
      title: "Expert Guidance",
      description: "Get personalized support throughout your application",
      icon: "Users",
      sortOrder: 3,
    },
  ];

  const displayBenefits =
    benefits && benefits.length > 0 ? benefits : defaultBenefits;
  const defaultTitle = `Why Choose ${intakeName} Intake?`;
  const defaultDescription = `Discover the advantages of applying for the ${intakeName} intake to study in ${destinationName}`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title || defaultTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description || defaultDescription}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayBenefits.map((benefit) => {
            const IconComponent = benefit.icon
              ? iconMap[benefit.icon] || Star
              : Star;

            return (
              <div
                key={benefit.id}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Expert Counselors</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Success Rate: 98%</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>10,000+ Students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
