"use client";

import { EventWithRelations } from "@/lib/events";
import { format } from "date-fns";
import { Play, Image as ImageIcon, MapPin, GraduationCap, Globe, Layers, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import * as Dialog from "@radix-ui/react-dialog";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type PastEventsSectionProps = {
  events: EventWithRelations[];
};

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

function Lightbox({ isOpen, onClose, images, initialIndex }: LightboxProps) {
  if (!images.length) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/95 z-100 backdrop-blur-sm animate-in fade-in duration-300" />
        <Dialog.Content className="fixed inset-0 z-101 flex items-center justify-center p-4 md:p-10 outline-none">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-102 bg-white/10 p-2 rounded-full hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full h-full relative group">
            <Swiper
              initialSlide={initialIndex}
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '.lightbox-prev',
                nextEl: '.lightbox-next',
              }}
              pagination={{ clickable: true }}
              className="w-full h-full select-none"
              spaceBetween={50}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={img + idx} className="flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-contain"
                      priority
                      quality={90}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="lightbox-prev absolute left-4 top-1/2 -translate-y-1/2 z-102 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="lightbox-next absolute right-4 top-1/2 -translate-y-1/2 z-102 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function EventCard({ event }: { event: EventWithRelations }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxState, setLightboxState] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  
  const videoId = event.video ? getYouTubeId(event.video) : null;
  const gallery = event.gallery || [];
  const hasVideo = !!videoId;
  const hasGallery = gallery.length > 0;
  
  // All previewable images (thumbnail + banner + gallery)
  const allImages = [
    ...(event.thumbnail ? [event.thumbnail] : []),
    ...(event.banner ? [event.banner] : []),
    ...gallery
  ].filter((v, i, a) => a.indexOf(v) === i); // Unique

  const openLightbox = (imgUrl: string) => {
    const idx = allImages.indexOf(imgUrl);
    setLightboxState({ open: true, index: idx >= 0 ? idx : 0 });
  };

  const mainImage = event.thumbnail || (hasGallery ? gallery[0] : null) || event.banner || (videoId ? getYouTubeThumbnail(videoId) : null);

  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full">
      <Lightbox 
        isOpen={lightboxState.open} 
        onClose={() => setLightboxState({ ...lightboxState, open: false })}
        images={allImages}
        initialIndex={lightboxState.index}
      />

      {/* Media Section */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        {isPlaying && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={event.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full group/media">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                onClick={() => !videoId && openLightbox(mainImage)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                <Layers className="w-12 h-12 opacity-10" />
              </div>
            )}
            
            {/* Play Button Overlay */}
            {videoId && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/30 transition-colors">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group/btn"
                >
                  <Play className="w-7 h-7 text-white ml-1 fill-white" />
                  <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20 group-hover/btn:opacity-40" />
                </button>
              </div>
            )}

            {/* Media Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 transition-transform group-hover:translate-x-1">
              {hasVideo && (
                <div className="bg-red-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Play className="w-3 h-3 fill-currentColor" />
                  VIDEO
                </div>
              )}
              {hasGallery && (
                <div className="bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <ImageIcon className="w-3 h-3" />
                  GALLERY
                </div>
              )}
            </div>

            {/* View Fullscreen Overlay (only for images) */}
            {!videoId && mainImage && (
              <div 
                className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover/media:opacity-100 cursor-pointer"
                onClick={() => openLightbox(mainImage)}
              >
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-xs font-semibold">
                  View Fullscreen
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
            {format(new Date(event.startDate), "MMM d, yyyy")}
          </span>
          {event.status === "ACTIVE" && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active Event" />
          )}
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2 mb-3 leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
          {event.description || "Relive the highlights and key takeaways from this successful event session."}
        </p>

        {/* Gallery Slider Strip */}
        {hasGallery && (
          <div className="mb-6 relative group/slider">
            <Swiper
              modules={[Navigation]}
              spaceBetween={8}
              slidesPerView={4.2}
              navigation={{
                prevEl: '.gallery-prev-' + event.id,
                nextEl: '.gallery-next-' + event.id,
              }}
              className="rounded-xl overflow-visible"
            >
              {gallery.map((img, idx) => (
                <SwiperSlide key={img + idx}>
                  <div 
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all bg-slate-100 group/img shadow-sm"
                    onClick={() => openLightbox(img)}
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover transition-transform group-hover/img:scale-110"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Tiny navigation buttons */}
            <button className={cn(
              "gallery-prev-" + event.id,
              "absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
            )}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className={cn(
              "gallery-next-" + event.id,
              "absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
            )}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-3 pt-5 border-t border-slate-100 mb-5 text-[13px]">
          {event.location && (
            <div className="flex items-start gap-3 text-slate-600 group/info">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover/info:bg-blue-50 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover/info:text-blue-500" />
              </div>
              <div className="pt-1">
                <p className="font-semibold text-slate-700 leading-none mb-1">Location</p>
                <span className="text-xs text-slate-500 line-clamp-1">{event.location}</span>
              </div>
            </div>
          )}
          {event.university && (
            <div className="flex items-start gap-3 text-slate-600 group/info">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover/info:bg-orange-50 transition-colors">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 group-hover/info:text-orange-500" />
              </div>
              <div className="pt-1">
                <p className="font-semibold text-slate-700 leading-none mb-1">Partner University</p>
                <span className="text-xs text-slate-500 line-clamp-1">{event.university.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Success Quote / Shoutout */}
        {event.successSummary && (
          <div className="mt-auto group/success relative overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50/30 p-4 rounded-2xl border border-emerald-100/50">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Event Milestone</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-semibold italic">
                "{event.successSummary}"
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function PastEventsSection({ events }: PastEventsSectionProps) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Past Highlights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Recent Events & Success Stories
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl text-lg">
              Missed an event? Catch up on the highlights, recordings, and success stories from our recent sessions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
