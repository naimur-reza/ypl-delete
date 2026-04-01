import { CVSubmissionForm } from "./CVSubmissionForm";
import Image from "next/image";

export const metadata = {
  title: "Join Our CV Bank | YPL Recruitment",
  description:
    "Register your profile in our exclusive CV bank to connect with elite career opportunities.",
};

export default function SubmitCVPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              For Candidates
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Elevate Your <span className="text-primary  ">Career</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-muted-foreground font-medium">
              Join our exclusive CV Bank and let the best roles find you. We
              partner with leading organizations to match exceptional talent
              with visionary teams.
            </p>

            <div className="mt-12 space-y-8">
              {[
                {
                  title: "Direct Visibility",
                  desc: "Your profile becomes visible to specialized recruiters in your field.",
                },
                {
                  title: "Targeted Matches",
                  desc: "We match based on specific skills, culture fit, and career goals.",
                },
                {
                  title: "Career Guidance",
                  desc: "Our consultants provide feedback and advice to help you stand out.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-white font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-3xl bg-secondary/90 backdrop-blur-sm border border-white/10 shadow-2xl">
              <p className="text-white/80   font-medium">
                "YPL didn't just find me a job; they found me the right
                environment for my next phase of growth. The process was
                professional and highly personalized."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
                <div>
                  <p className="text-sm font-bold text-white">Alex Johnson</p>
                  <p className="text-xs text-white/60">
                    Mid-Level Manager, Tech Corp
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <CVSubmissionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
