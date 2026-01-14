"use client";

import { ServiceForm } from "../_components/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Service</h1>
        <p className="text-muted-foreground">Create a new service</p>
      </div>
      <ServiceForm />
    </div>
  );
}

