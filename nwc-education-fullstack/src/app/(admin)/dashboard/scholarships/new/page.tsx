"use client";

import { ScholarshipForm } from "../_components/ScholarshipForm";

export default function NewScholarshipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Scholarship</h1>
        <p className="text-muted-foreground">Create a new scholarship</p>
      </div>
      <ScholarshipForm />
    </div>
  );
}

