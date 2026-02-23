"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowRight, Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EventRegistrationModal } from "@/components/events/registration-modal";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  imageUrl?: string;
  capacity?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/events?active=true")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Our <span className="text-primary">Events</span> & Workshops
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join our industry-leading webinars, networking meetups, and professional workshops
            designed to help you navigate the talent landscape.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events or locations..."
              className="bg-background pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">All Events</Badge>
            <Badge variant="secondary" className="px-3 py-1">Upcoming</Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-semibold">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-background transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={event.imageUrl || "/images/placeholder-event.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <Badge
                    className="absolute right-4 top-4 capitalize"
                    variant="secondary"
                  >
                    {event.type}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.startDate).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <h3 className="mb-3 text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <SafeHtmlContent 
                    content={event.description} 
                    className="mb-6 line-clamp-3 text-sm text-muted-foreground" 
                  />
                  <div className="mt-auto space-y-3 pb-6 border-b border-muted">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0 text-primary" />
                        <span>Limited to {event.capacity} attendees</span>
                      </div>
                    )}
                  </div>
                  <Button
                    className="mt-6 w-full rounded-xl"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Register Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventRegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
