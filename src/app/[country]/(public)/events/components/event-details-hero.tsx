"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, ChevronDown, Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { Event } from "../../../../../../prisma/src/generated/prisma/client";

interface EventDetailsHeroProps {
  event: Event;
}

export function EventDetailsHero({ event }: EventDetailsHeroProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShareOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  // Format date
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time
  const startTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = endDate
    ? endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

  // Generate calendar URLs
  const eventTitle = encodeURIComponent(event.title);
  const eventDescription = encodeURIComponent(event.description || "");
  const eventLocation = encodeURIComponent(event.location || "");
  
  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDateForGoogle(eventDate)}/${formatDateForGoogle(endDate || new Date(eventDate.getTime() + 3600000))}&details=${eventDescription}&location=${eventLocation}`;

  const generateICalContent = () => {
    const formatICalDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
    };
    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatICalDate(eventDate)}
DTEND:${formatICalDate(endDate || new Date(eventDate.getTime() + 3600000))}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;
  };

  const downloadIcs = () => {
    const icsContent = generateICalContent();
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setCalendarOpen(false);
  };

  // Share functionality
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`Check out ${event.title}!`);

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleMaps = () => {
    if (event.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, "_blank");
    }
  };

  return (
    <section className="relative w-full bg-primary/50 min-h-[400px] md:min-h-[480px]">
      {/* Decorative Blue Abstract Shapes - Bottom Right */}
 

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Event Type Badge */}
          <div className="inline-block mb-8">
            <span className="px-4 py-2 bg-[#3538cd] text-white text-xs font-bold uppercase tracking-wider rounded-md">
              {event.eventType.replace("_", "-")}
            </span>
          </div>

          {/* Event Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e1b4b] mb-10 font-serif">
            {event.title}
          </h1>

          {/* Date, Time, Location Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 mb-10">
            {/* Date */}
            <div className="flex flex-col items-center px-6 md:border-r border-[#3538cd]/30 shrink-0">
              <div className="flex items-center gap-2 text-[#3538cd] text-sm font-medium mb-1">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <p className="text-[#1e1b4b] font-bold text-lg">{formattedDate}</p>
            </div>

            {/* Time */}
            <div className="flex flex-col items-center px-6 md:border-r border-[#3538cd]/30 shrink-0">
              <div className="flex items-center gap-2 text-[#3538cd] text-sm font-medium mb-1">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </div>
              <p className="text-[#1e1b4b] font-bold text-lg">{timeRange}</p>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center px-6 max-w-xs md:max-w-sm">
              <div className="flex items-center gap-2 text-[#3538cd] text-sm font-medium mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <button
                onClick={openGoogleMaps}
                className="text-[#1e1b4b] font-bold text-lg hover:text-[#3538cd] transition-colors cursor-pointer text-center line-clamp-2 underline decoration-dotted underline-offset-2"
                title={event.location || "Online"}
              >
                {event.location || "Online"}
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Add to Calendar Dropdown */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => {
                  setCalendarOpen(!calendarOpen);
                  setShareOpen(false);
                }}
                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors min-w-[220px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700 font-medium">Add to calendar</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`} />
              </button>

              {calendarOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setCalendarOpen(false)}
                  >
                    <span className="text-slate-700">Google Calendar</span>
                  </a>
                  <button
                    onClick={downloadIcs}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <span className="text-slate-700">Apple Calendar / iCal</span>
                  </button>
                  <button
                    onClick={downloadIcs}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <span className="text-slate-700">Outlook</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Dropdown */}
            <div className="relative" ref={shareRef}>
              <button
                onClick={() => {
                  setShareOpen(!shareOpen);
                  setCalendarOpen(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#3538cd] text-white rounded-lg hover:bg-[#2d2fb8] transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share Event</span>
              </button>

              {shareOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[180px]">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700">Facebook</span>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span className="text-slate-700">Twitter / X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span className="text-slate-700">LinkedIn</span>
                  </a>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
