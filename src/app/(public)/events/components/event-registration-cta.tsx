import { GradientButton } from "@/components/ui/gradient-button";
import { Calendar, Users } from "lucide-react";

export function EventRegistrationCTA() {
  return (
    <section className="py-20 px-4 md:px-8 bg-linear-to-br from-primary via-primary/90 to-blue-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm">Limited Seats Available</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Don't Miss Out on Your Next Event
        </h2>

        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
          Register now to secure your spot at our upcoming education fairs and webinars. 
          Connect with top universities and take the first step towards your study abroad journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <GradientButton 
            variant="secondary" 
            className="bg-white text-primary hover:bg-slate-100 min-w-[200px]"
          >
            Register for Event
          </GradientButton>
          <button className="px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-all duration-300 min-w-[200px]">
            View All Events
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
          {[
            { label: "Universities", value: "150+" },
            { label: "Events Hosted", value: "200+" },
            { label: "Students Helped", value: "10k+" },
            { label: "Success Rate", value: "98%" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/80 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
