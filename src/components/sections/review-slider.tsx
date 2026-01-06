"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Star,
  PlayCircle,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  name: string;
  message?: string | null;
  content?: string | null; // Testimonial uses content instead of message
  image?: string | null;
  avatar?: string | null; // Testimonial uses avatar instead of image
  rating?: number | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  reviewType?: "STUDENT" | "GMB" | string;
  type?: "STUDENT" | "REPRESENTATIVE" | "GMB"; // Testimonial type field
  videoId?: string;
  videoUrl?: string | null; // Testimonial uses videoUrl
}

interface ReviewSliderProps {
  title: string;
  description?: string;
  items: ReviewItem[];
  type: "video" | "text";
  icon?: React.ReactNode;
}

export function ReviewSlider({
  title,
  description,
  items,
  type,
  icon,
}: ReviewSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ⬅ Add popup video state
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-8 ">
      <div className="flex items-end justify-between mb-10 px-2">
        <div className="max-w-2xl">
          {icon && <div className="mb-4 inline-block">{icon}</div>}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-slate-400 text-lg leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-slate-800/50 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x px-2 -mx-2"
      >
        {items.map((review, index) => (
          <div
            key={review.id || index}
            className={cn(
              "snap-center shrink-0 transition-all duration-300",
              type === "video"
                ? "min-w-[300px] md:min-w-[400px]"
                : "min-w-[320px] md:min-w-[380px]"
            )}
          >
            {type === "video" ? (
              // ▶ VIDEO CARD
              <div
                onClick={() => {
                  // Extract YouTube video ID from videoUrl if present
                  const videoId = review.videoId || (review.videoUrl ? review.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/)?.[1] : undefined);
                  if (videoId) setActiveVideo(videoId);
                }}
                className="relative group cursor-pointer rounded-3xl overflow-hidden aspect-square bg-slate-800 border border-slate-700/50 shadow-2xl"
              >
                <Image
                  src={
                    review.image || review.avatar ||
                    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop"
                  }
                  alt={review.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />

                {(review.videoId || review.videoUrl) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:bg-blue-600/90 group-hover:border-blue-500">
                      <PlayCircle className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent pt-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {review.name}
                  </h3>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {review.message || review.content || ""}
                  </p>
                </div>
              </div>
            ) : (
              // ⭐ TEXT CARD
              <div className="h-full bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300 flex flex-col shadow-xl">
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      fill={i < (review.rating || 5) ? "currentColor" : "none"}
                      className={cn(
                        "w-5 h-5",
                        i >= (review.rating || 5) && "text-slate-600"
                      )}
                    />
                  ))}
                </div>
                <div className="relative mb-6 grow">
                  <Quote className="absolute -top-4 -left-2 w-8 h-8 text-blue-500/20 transform -scale-x-100" />
                  <p className="text-slate-300 leading-relaxed relative z-10 text-lg italic">
                    "{review.message || review.content || ""}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-700/50 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">
                      {review.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {(review.publishedAt || review.createdAt)
                        ? new Date(review.publishedAt || review.createdAt!).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "Recent Review"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 VIDEO POPUP MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-2 z-50 text-white text-3xl"
            >
              &times;
            </button>

            <div className="relative w-full h-[60vh]">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&controls=0&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
