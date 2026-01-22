"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { RepresentativeVideo } from "@/lib/representative-videos";
import Image from "next/image";

interface RepresentativeVideoSliderProps {
  videos?: RepresentativeVideo[];
  title?: string;
  description?: string;
}

// Helper to convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Already an embed URL
  if (url.includes("/embed/")) {
    // Ensure autoplay is enabled
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}autoplay=1`;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId: string | null = null;
  
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }
  
  // youtube.com/v/VIDEO_ID
  const vMatch = url.match(/youtube\.com\/v\/([^?&]+)/);
  if (vMatch) {
    videoId = vMatch[1];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  
  return null;
}

export function RepresentativeVideoSlider({
  videos = [],
  title = "Meet our partners",
  description = "Representative insights tailored to your journey.",
}: RepresentativeVideoSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeVideo, setActiveVideo] = useState<RepresentativeVideo | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      const progress =
        totalScrollable > 0 ? (scrollLeft / totalScrollable) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const openVideoModal = (video: RepresentativeVideo) => {
    setActiveVideo(video);
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = useCallback(() => {
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeVideo) {
        closeVideoModal();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeVideo, closeVideoModal]);

  if (!videos?.length) {
    return null;
  }

  const embedUrl = activeVideo?.videoUrl ? getYouTubeEmbedUrl(activeVideo.videoUrl) : null;

  return (
    <>
      <section className="py-14 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-blue-500 font-semibold tracking-wide text-sm uppercase">
              Our partners
            </span>
            <h2 className="section-title mt-3">{title}</h2>
            <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <div className="relative group">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => video.videoUrl && openVideoModal(video)}
                  className="relative shrink-0 w-[280px] md:w-[320px] aspect-3/4 rounded-3xl overflow-hidden snap-center cursor-pointer group/card"
                >
                  <Image
                    width={320}
                    height={480}
                    src={
                      video.avatar ||
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={video.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      type="button"
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-6 h-6 text-white fill-current" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between z-20">
                    <div className="flex-1 mr-4">
                      <h3 className="text-white font-bold text-lg leading-tight mb-1">
                        {video.name}
                      </h3>
                      {video.countries?.length ? (
                        <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">
                          {video.countries
                            .map(({ country }) => country.name)
                            .join(", ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="w-10 h-10 rounded-xl border border-gray-400/50 flex items-center justify-center text-white group-hover/card:bg-white group-hover/card:text-black transition-colors duration-300">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-slate-900 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeVideoModal}
        >
          {/* Close button */}
          <button
            onClick={closeVideoModal}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video container */}
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={activeVideo.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <p className="text-white text-lg">Video not available</p>
              </div>
            )}
          </div>

          {/* Video info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <h3 className="text-white font-bold text-xl">{activeVideo.name}</h3>
            {activeVideo.countries?.length ? (
              <p className="text-gray-400 text-sm mt-1">
                {activeVideo.countries.map(({ country }) => country.name).join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
