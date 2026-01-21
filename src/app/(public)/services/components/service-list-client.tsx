"use client";

import type React from "react";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Service } from "../../../../../prisma/src/generated/prisma/client";

interface ServicesListProps {
  services: Service[];
}

const ServicesList = ({ services }: ServicesListProps) => {
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

        {/* Services List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:bg-primary hover:border-primary cursor-pointer block"
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
                  <GraduationCap className="w-7 h-7 text-white group-hover:text-primary transition-colors duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-black group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-black/70 group-hover:text-white/90 leading-relaxed min-h-[80px] transition-colors duration-300">
                  {service.summary}
                </p>

                <Button
                  size={"lg"}
                  className="bg-primary hover:bg-primary/90 group-hover:bg-white group-hover:text-primary group-hover:hover:bg-gray-100 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300"
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
