"use client";

import { IntakeSeasonForm } from "../_components/IntakeSeasonForm";

export default function NewIntakeSeasonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Intake Season</h1>
        <p className="text-muted-foreground">Create a new intake season</p>
      </div>
      <IntakeSeasonForm />
    </div>
  );
}

