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
        </div>
      </div>
    </section>
  );
}
