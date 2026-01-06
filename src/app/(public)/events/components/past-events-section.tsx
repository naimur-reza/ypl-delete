"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, Image as ImageIcon, Video, Users, TrendingUp } from "lucide-react";

interface PastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  thumbnail: string;
  videoUrl?: string;
  photos?: string[];
  testimonials?: Array<{ name: string; message: string; role: string }>;
  summary?: string;
}

const PAST_EVENTS: PastEvent[] = [
  {
    id: "1",
    title: "UK University Fair 2024",
    date: "March 15, 2024",
    location: "London, UK",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop",
    ],
    testimonials: [
      { name: "John Smith", message: "Amazing event! Met representatives from 20+ universities.", role: "Student" }
    ],
    summary: "Over 500 students attended our UK University Fair, meeting representatives from top institutions including Oxford, Cambridge, and Imperial College.",
  },
  {
    id: "2",
    title: "Virtual Study Webinar - Engineering",
    date: "February 20, 2024",
    location: "Online",
    thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1000&auto=format&fit=crop",
    summary: "Successfully hosted a webinar with 300+ participants exploring engineering programs in Australia and Canada.",
  },
];

export function PastEventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <section className="py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Past Event Highlights
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            Explore the success of our previous events through videos, photos, and testimonials from attendees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PAST_EVENTS.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {event.videoUrl && (
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                      <Play className="w-10 h-10 text-white fill-current ml-1" />
                    </div>
                  </button>
                )}

                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-white/90 text-sm">{event.date} • {event.location}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {event.summary && (
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {event.summary}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {event.videoUrl && (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      <Video className="w-4 h-4" />
                      Watch Video
                    </button>
                  )}
                  {event.photos && event.photos.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowGallery(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <ImageIcon className="w-4 h-4" />
                      View Gallery
                    </button>
                  )}
                  {event.testimonials && event.testimonials.length > 0 && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300">
                      <Users className="w-4 h-4" />
                      Testimonials
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Video/Gallery */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowGallery(false);
              }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-5xl w-full bg-white rounded-2xl overflow-hidden">
              {!showGallery && selectedEvent.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedEvent.videoUrl.replace('watch?v=', 'embed/')}
                    title="Event Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : showGallery && selectedEvent.photos ? (
                <div className="grid grid-cols-2 gap-4 p-6 max-h-[80vh] overflow-y-auto">
                  {selectedEvent.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
