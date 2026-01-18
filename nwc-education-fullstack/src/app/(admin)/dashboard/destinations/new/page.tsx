"use client";

import { DestinationForm } from "../_components/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Destination</h1>
        <p className="text-muted-foreground">Create a new destination</p>
      </div>
      <DestinationForm />
    </div>
  );
}

