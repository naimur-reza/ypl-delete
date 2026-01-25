"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

export function WhyChooseUsVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "EVKLsUq_p8A";

  return (
    <div className="h-full min-h-[400px] lg:min-h-[550px] relative group rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white bg-slate-900">
      {!isPlaying ? (
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

          {/* Text Overlay */}
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
        <div className="absolute inset-0 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <span className="text-xs font-bold px-2">✕ Close</span>
          </button>
        </div>
      )}
    </div>
  );
}
