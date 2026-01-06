import { Users, Globe, Award, TrendingUp, Building, Handshake } from "lucide-react";

const REASONS = [
  {
    icon: Users,
    title: "Meet University Representatives",
    description: "Connect directly with admissions officers and get instant answers to your questions.",
  },
  {
    icon: Globe,
    title: "Explore Global Opportunities",
    description: "Discover programs from top universities across multiple countries in one place.",
  },
  {
    icon: Award,
    title: "Learn About Scholarships",
    description: "Get information on financial aid, scholarships, and funding opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Career Guidance",
    description: "Understand career prospects and industry trends for various programs.",
  },
  {
    icon: Building,
    title: "Campus Life Insights",
    description: "Learn about student life, accommodation, and campus facilities firsthand.",
  },
  {
    icon: Handshake,
    title: "On-Spot Offers",
    description: "Receive conditional offers and speed up your application process.",
  },
];

export function WhyAttendSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Attend Our Events?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our education events provide unparalleled opportunities to explore your study abroad dreams.
            Here's what makes them essential for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group bg-white border-2 border-slate-100 rounded-2xl p-8 hover:border-primary hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
