import { prisma } from "@/lib/prisma";
import Image from "next/image";

// Helper for a single row
const LogoRow = ({
  items,
  direction = "left",
  speed = "normal",
  rowIndex = 0,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  direction?: "left" | "right";
  speed?: "slow" | "normal";
  rowIndex?: number;
}) => {
  // Mapping logic for v4 classes
  const getAnimationClass = () => {
    if (direction === "right") return "animate-marquee-reverse";
    return speed === "slow" ? "animate-marquee-slow" : "animate-marquee";
  };

  // Progressive reveal animation delay based on row index
  const animationDelay = rowIndex * 0.2;

  // First row images should load with priority for better LCP
  const isPriorityRow = rowIndex === 0;

  return (
    <div 
      className="flex overflow-hidden py-4 animate-fadeIn"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div
        className={`flex items-center gap-16 whitespace-nowrap ${getAnimationClass()}`}
        style={{ minWidth: 'max-content' }}
      >
        {/* We loop twice to ensure the "infinite" scroll doesn't have a gap */}
        {[...items, ...items].map((uni, idx) => (
          <div
            key={`${uni.id}-${idx}`}
            className="relative w-56 h-20 transition-all duration-500 flex items-center justify-center px-6 shrink-0"
          >
            {uni.logo ? (
              <Image
                src={uni.logo || "/placeholder.svg"}
                alt={uni.name}
                fill
                className="object-contain"
                priority={isPriorityRow && idx < 3}
                sizes="224px"
              />
            ) : (
              <span className="text-sm font-bold text-slate-400">
                {uni.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export async function UniversityLogoSlider() {
  // Limit to 30 universities for better performance
  const allUniversities = await prisma.accreditation.findMany({
    where: {
      status: "ACTIVE",
      type: "PARTNER",
    },
    select: {
      id: true,
      name: true,
      logo: true,
    },
    orderBy: { sortOrder: "asc" },
    take: 30,
  });

  // Split data into 3 chunks for the staggered look
  const row1 = allUniversities.filter((_, i) => i % 3 === 0);
  const row2 = allUniversities.filter((_, i) => i % 3 === 1);
  const row3 = allUniversities.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-20 bg-white">
      {/* Header styled like your reference image */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
          <span className="text-primary font-sans font-bold">250+</span> global
          university partners
        </h2>
      </div>

      <div className="relative">
        {/* Side linear Masks for smooth entry/exit */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-8">
          <LogoRow items={row1} direction="left" speed="normal" rowIndex={0} />
          <LogoRow items={row2} direction="right" speed="normal" rowIndex={1} />
          <LogoRow items={row3} direction="left" speed="slow" rowIndex={2} />
        </div>
      </div>
    </section>
  );
}
