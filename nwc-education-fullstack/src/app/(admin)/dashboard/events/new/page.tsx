"use client";

import { EventForm } from "../_components/EventForm";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Event</h1>
        <p className="text-muted-foreground">Create a new event</p>
      </div>
      <EventForm />
    </div>
  );
}
