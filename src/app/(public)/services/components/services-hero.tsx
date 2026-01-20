"use client";

import { DynamicHero } from "@/components/hero/DynamicHero";
import Image from "next/image";

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
        {value}
      </div>
      <div className="text-sm md:text-base text-white/80">{label}</div>
    </div>
  );
}

export default function ServicesHero() {
  const stats = [
    { value: "99.95%", label: "Visas approved" },
    { value: "100+", label: "Global offices" },
    { value: "2006", label: "Established" },
    { value: "250+", label: "Universities partnered" },
  ];

  return (
    <section className="w-full">
      {/* Top Section with Dynamic Hero */}
      <DynamicHero
        slug="services"
        countrySlug={null}
        defaultTitle="Comprehensive support you can count on"
        defaultSubtitle="Begin your journey to study abroad at a top-ranking university with support from the world's most trusted higher education specialist."
        defaultBackgroundUrl="https://media.istockphoto.com/id/1468830962/photo/attractive-young-female-university-student-using-a-laptop-while-studying.jpg?s=612x612&w=0&k=20&c=83aQUi8FwXMN1kqjfuM7oqZkckX05SebsBtemAn1kfc="
      />

      {/* Bottom Section with Dark Navy Background */}
      <div className="bg-[#0a1628] py-12 md:py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-balance">
              We've assisted 1.3M+ students achieve their dream of studying
              abroad
            </h2>
          </div>

          {/* Stats Grid
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="relative">
                <Stat value={stat.value} label={stat.label} />
                {index < stats.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-white/20" />
                )}
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
