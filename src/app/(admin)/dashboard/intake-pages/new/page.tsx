"use client";

import { IntakePageForm } from "../_components/IntakePageForm";

export default function NewIntakePagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Intake Page</h1>
        <p className="text-muted-foreground">Create a new intake page</p>
      </div>
      <IntakePageForm />
    </div>
  );
}
