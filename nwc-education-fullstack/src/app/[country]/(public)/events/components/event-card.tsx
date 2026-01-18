import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Event } from "../../../../../../prisma/src/generated/prisma/client";
 

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.startDate);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Header Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={event.banner || "/logo.svg"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
            {event.eventType.replace('_', ' ')}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary">
            {eventDate.getDate()}
          </div>
          <div className="text-xs font-semibold text-slate-600 uppercase">
            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{event.location}</span>
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
          href={`/events/${event.slug}`}
          className="flex items-center justify-between px-4 py-3 bg-primary/5 hover:bg-primary hover:text-white text-primary rounded-xl transition-all duration-300 group/btn font-semibold mt-auto"
        >
          {isUpcoming ? 'Register Now' : 'View Details'}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
