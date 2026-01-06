import { prisma } from "@/lib/prisma";
import Image from "next/image";

// Helper for a single row
const LogoRow = ({
  items,
  direction = "left",
  speed = "normal",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  direction?: "left" | "right";
  speed?: "slow" | "normal";
}) => {
  // Mapping logic for v4 classes
  const getAnimationClass = () => {
    if (direction === "right") return "animate-marquee-reverse";
    return speed === "slow" ? "animate-marquee-slow" : "animate-marquee";
  };

  return (
    <div className="flex overflow-hidden py-2">
      <div
        className={`flex items-center gap-12 whitespace-nowrap ${getAnimationClass()}`}
      >
        {/* We loop twice to ensure the "infinite" scroll doesn't have a gap */}
        {[...items, ...items].map((uni, idx) => (
          <div
            key={`${uni.id}-${idx}`}
            className="relative w-40 h-16 grayscale opacity-70 transition-all duration-500 hover:grayscale-0 hover:opacity-100 flex items-center justify-center px-4 shrink-0"
          >
            {uni.logo ? (
              <Image
                src={uni.logo}
                alt={uni.name}
                fill
                className="object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-slate-400">
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
  const allUniversities = await prisma.university.findMany({
    where: { logo: { not: null } },
    take: 45, // Grab enough to fill 3 distinct rows
    select: { id: true, name: true, logo: true },
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
          <span className="text-blue-700 font-sans font-bold">250+</span> global
          university partners
        </h2>
      </div>

      <div className="relative">
        {/* Side linear Masks for smooth entry/exit */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-6">
          <LogoRow items={row1} direction="left" speed="normal" />
          <LogoRow items={row2} direction="right" />
          <LogoRow items={row3} direction="left" speed="slow" />
        </div>
      </div>
    </section>
  );
}
