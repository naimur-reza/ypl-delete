"use client"; // Required for interactivity (useState)

import { useState } from "react";
import {
  GraduationCap,
  Plane,
  BadgeDollarSign,
  BookOpen,
  Play,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OurServices() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Replace this ID with your actual YouTube Video ID
  const videoId = "EVKLsUq_p8A";

  const services = [
    {
      title: "University Admission Support",
      description:
        "Obtain your university admission with our comprehensive guidance and partnership with 750+ global institutions.",
      icon: GraduationCap,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      href: "/services/admission",
    },
    {
      title: "Finance Application Support",
      description:
        "Navigate financial applications, scholarships, and student loans effortlessly with our expert financial support team.",
      icon: BadgeDollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/services/finance",
    },
    {
      title: "Visa Application Support",
      description:
        "Simplify complex visa procedures with our 98% success rate guidance system and document preparation.",
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/services/visa",
    },
    {
      title: "IELTS 360",
      description:
        "Boost your confidence & proficiency with our specialized language training program designed for high band scores.",
      icon: BookOpen,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/services/ielts",
    },
  ];

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* LEFT COLUMN: Video Section */}
          <div className="h-full min-h-[400px] lg:min-h-[550px] relative group rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white bg-slate-900">
            {!isPlaying ? (
              /* 1. THUMBNAIL STATE (Default) */
              <>
                <Image
                  src="https://img.youtube.com/vi/EVKLsUq_p8A/maxresdefault.jpg"
                  alt="Students consulting"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/30 transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 cursor-pointer shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group/play outline-none"
                    >
                      <Play className="w-8 h-8 text-white fill-white ml-1 group-hover/play:text-pink-600 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Text Overlay (Only visible when video is NOT playing) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-semibold text-white mb-3">
                    Success Stories
                  </span>
                  <h3 className="text-2xl font-bold text-white leading-snug mb-2">
                    See how we helped 100,000+ students achieve their dreams
                  </h3>
                  <p className="text-white/80 text-sm">
                    Watch our latest PR & Study Abroad Guide
                  </p>
                </div>
              </>
            ) : (
              /* 2. VIDEO PLAYER STATE (Active) */
              <div className="absolute inset-0 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
                  title="YouTube video player"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {/* Close Button (Optional) */}
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <span className="text-xs font-bold px-2">✕ Close</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Services List */}
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <span className="text-sm font-bold tracking-widest text-pink-600 uppercase bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                Our Services
              </span>

              <h2 className="section-title mt-6 mb-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Everything you need to <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-primary">
                  Study Abroad
                </span>
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                We provide end-to-end support, from choosing the right
                university to landing in your dream destination.
              </p>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <Link
                  href={service.href}
                  key={index}
                  className="group block p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-pink-100 transition-all duration-300"
                >
                  <div className="flex gap-5 items-start">
                    {/* Icon Box */}
                    <div
                      className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${service.bgColor}`}
                    >
                      <service.icon className={`w-7 h-7 ${service.color}`} />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-pink-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
