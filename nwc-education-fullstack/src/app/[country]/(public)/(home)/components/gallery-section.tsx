"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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

export function GallerySection({
  gallery = [],
  title = "Our Success",
  highlightedWord = "Gallery",
}: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const filteredGallery =
    activeFilter === "ALL"
      ? gallery
      : gallery.filter((item) => item.type === activeFilter);

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
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className={`group relative overflow-hidden rounded-xl cursor-pointer 
                  ${index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}
                  ${index % 7 === 3 ? "lg:col-span-2" : ""}
                  aspect-square
                `}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/80 text-sm line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                    {typeFilters.find((f) => f.value === item.type)?.label || item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No gallery items found</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.image}
              alt={lightboxImage.title}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">
                {lightboxImage.title}
              </h3>
              {lightboxImage.description && (
                <p className="text-white/70 mt-2">{lightboxImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
