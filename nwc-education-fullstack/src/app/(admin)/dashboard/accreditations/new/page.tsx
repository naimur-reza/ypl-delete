"use client";

import { AccreditationForm } from "../_components/AccreditationForm";

export default function NewAccreditationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Accreditation</h1>
        <p className="text-muted-foreground">Create a new accreditation</p>
      </div>
      <AccreditationForm />
    </div>
  );
}

