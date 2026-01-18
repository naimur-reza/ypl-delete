"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  type: string;
};

type GallerySectionProps = {
  gallery: GalleryItem[];
  title?: string;
  highlightedWord?: string;
};

const typeFilters = [
  { value: "ALL", label: "All" },
  { value: "VISA_SUCCESS", label: "Visa Success" },
  { value: "REPRESENTATIVE", label: "Representatives" },
  { value: "EVENT", label: "Events" },
  { value: "STUDENT", label: "Students" },
];

// Bento grid pattern generator - creates an awesome mosaic layout
function getBentoGridClasses(index: number, total: number): string {
  // Pattern for creating a dynamic bento grid
  const patterns = [
    // Large featured items (every 6th item)
    index % 6 === 0 ? "md:col-span-2 md:row-span-2" : "",
    // Wide items (every 7th item)
    index % 7 === 3 ? "md:col-span-2" : "",
    // Tall items (every 9th item)
    index % 9 === 5 ? "md:row-span-2" : "",
  ].filter(Boolean).join(" ");

  return patterns || "";
}

export function GallerySection({
  gallery = [],
  title = "Our Success",
  highlightedWord = "Gallery",
}: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredGallery =
    activeFilter === "ALL"
      ? gallery
      : gallery.filter((item) => item.type === activeFilter);

  // Update lightbox index when image changes
  useEffect(() => {
    if (lightboxImage) {
      const index = filteredGallery.findIndex((item) => item.id === lightboxImage.id);
      setLightboxIndex(index >= 0 ? index : 0);
    }
  }, [lightboxImage, filteredGallery]);

  // Navigation handlers
  const handleNext = () => {
    const nextIndex = (lightboxIndex + 1) % filteredGallery.length;
    setLightboxImage(filteredGallery[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setLightboxImage(filteredGallery[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxImage) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "Escape") setLightboxImage(null);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lightboxIndex, filteredGallery]);

  return (
    <section className="py-16 bg-linear-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="section-title">
            {title} <span className="text-primary">{highlightedWord}</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4">
            Explore our collection of success stories, team moments, and memorable events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.value
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:scale-105"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Bento Grid Gallery */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-fr">
            {filteredGallery.map((item, index) => {
              const bentoClasses = getBentoGridClasses(index, filteredGallery.length);
              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxImage(item)}
                  className={`group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 ${
                    bentoClasses || "aspect-square"
                  } ${!bentoClasses ? "" : "min-h-[200px]"} bg-slate-200`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 6}
                  />
                  {/* Gradient Overlay - Always visible with hover enhancement */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-1 group-hover:line-clamp-none">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-white/90 text-xs md:text-sm line-clamp-1 group-hover:line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 md:px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 shadow-sm">
                      {typeFilters.find((f) => f.value === item.type)?.label || item.type}
                    </span>
                  </div>
                  {/* Click indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No gallery items found</p>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox/Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Navigation Buttons */}
          {filteredGallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all z-10 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all z-10 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-6xl max-h-[90vh] w-full animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={lightboxImage.image}
                alt={lightboxImage.title}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                priority
              />
            </div>
            
            {/* Image Info */}
            <div className="mt-4 md:mt-6 text-center animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-white text-lg md:text-2xl font-semibold mb-2">
                {lightboxImage.title}
              </h3>
              {lightboxImage.description && (
                <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
                  {lightboxImage.description}
                </p>
              )}
              {/* Image counter */}
              {filteredGallery.length > 1 && (
                <p className="text-white/60 text-xs md:text-sm mt-3">
                  {lightboxIndex + 1} / {filteredGallery.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
