"use client";

import { UniversityDetailForm } from "../_components/UniversityDetailForm";

export default function NewUniversityDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add University Detail</h1>
        <p className="text-muted-foreground">
          Create detailed information for a university
        </p>
      </div>
      <UniversityDetailForm />
    </div>
  );
}
