import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { EventWithRelations } from "@/lib/events";

interface EventCardProps {
  event: EventWithRelations;
  variant?: "home" | "page";
}

/**
 * Shared EventCard component used by both home page and events listing page
 */
export function EventCard({ event, variant = "home" }: EventCardProps) {
  const formattedDate = new Date(event.startDate).toLocaleDateString();
  const formattedTime = event.endDate
    ? `${new Date(event.startDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(event.endDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : new Date(event.startDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  const location = event.location || event.destination?.name || "";
  const href = `/events/${event.slug}`;

  if (variant === "page") {
    // Use the existing EventCard from events page (more detailed)
    return (
      <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
        {/* Header Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Event Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
              {event.eventType.replace("_", " ")}
            </span>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-4 right-4 bg-white/95 flex items-center gap-2 backdrop-blur-sm rounded-xl py-2 px-3 text-center shadow-lg">
            <div className="text-2xl font-bold text-primary">
              {new Date(event.startDate).getDate()}
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase">
              {new Date(event.startDate).toLocaleDateString("en-US", {
                month: "short",
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-14">
            {event.title}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span>
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                {new Date(event.startDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-1">
              {event.description}
            </p>
          )}

          {/* Action Button */}
          <Link
            href={href}
            className="flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary hover:text-white text-primary rounded-xl transition-all duration-300 group/btn font-semibold mt-auto"
          >
            {new Date(event.startDate) > new Date()
              ? "Register Now"
              : "View Details"}
            <span className="group-hover/btn:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Home variant (simpler card)
  return (
    <article className="bg-white rounded-2xl p-1 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
      <div className="relative p-7 flex flex-col h-full rounded-xl bg-white">
        <div className="h-16 mb-4 flex items-start">
          <Image
            height={64}
            width={150}
            src="/logo.svg"
            alt="Event"
            className="object-contain"
          />
        </div>

        <span className="absolute top-7 right-7 inline-flex items-center justify-center bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
          {event.eventType}
        </span>

        <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
          {event.title}
        </h3>

        <div className="space-y-3 mb-8 mt-auto text-sm text-gray-600">
          <div className="flex items-center font-medium">
            <CalendarDays className="h-4 w-4 mr-3 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center font-medium">
            <Clock className="h-4 w-4 mr-3 text-gray-400" />
            <span>{formattedTime}</span>
          </div>
          {location && (
            <div className="flex items-center font-medium">
              <MapPin className="h-4 w-4 mr-3 text-gray-400" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <Link
          href={href}
          className="w-fit bg-primary text-white py-2.5 px-3 rounded font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center shadow-md shadow-indigo-100"
        >
          View event
        </Link>
      </div>
    </article>
  );
}
