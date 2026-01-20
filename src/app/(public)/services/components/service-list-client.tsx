"use client";

import type React from "react";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Country,
  Service,
} from "../../../../../prisma/src/generated/prisma/client";

interface ServicesListProps {
  countries: Country[];
  services: Service[];
}

const ServicesList = ({ countries, services }: ServicesListProps) => {
  // Country filtering commented out as requested
  // const [selectedCountry, setSelectedCountry] = useState(
  //   countries[0]?.id || ""
  // );

  // const filteredServices = services.filter(
  //   (service) => selectedCountry === "" || service.id !== selectedCountry
  // );

  // Show all services
  const filteredServices = services;

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
          <h2 className="section-title">University application services</h2>
          <p className="section-subtitle">
            With dedicated one-to-one support, our application services can help
            you secure an offer from a best-fit course and university. Let us
            help you take the first step.
          </p>
        </div>

        {/* Country Tabs - COMMENTED OUT AS REQUESTED */}
        {/* <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                selectedCountry === country.id
                  ? "bg-primary text-white outline-2"
                  : "bg-white text-primary outline-primary  outline-2 hover:bg-blue-50"
              }`}
            >
              {country.name}
            </button>
          ))}
        </div> */}

        {/* Services List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:bg-primary/80 hover:border-primary/80 cursor-pointer block"
            >
              <div className="absolute -bottom-5 -right-5 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-full h-full text-white/20"
                  viewBox="0 0 128 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M128 128C128 57.3075 70.6925 0 0 0V128H128Z"
                    fill="currentColor"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-primary group-hover:bg-white rounded-lg flex items-center justify-center transition-colors duration-300">
                  <GraduationCap className="w-7 h-7 text-white group-hover:text-blue-600 transition-colors duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-black group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-black/70 group-hover:text-white/90 leading-relaxed min-h-[80px] transition-colors duration-300">
                  {service.summary}
                </p>

                <Button
                  size={"lg"}
                  className="    text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
