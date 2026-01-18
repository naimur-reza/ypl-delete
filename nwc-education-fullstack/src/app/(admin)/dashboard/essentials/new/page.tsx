"use client";

import { EssentialForm } from "../_components/EssentialForm";

export default function NewEssentialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Essential</h1>
        <p className="text-muted-foreground">Create a new essential study guide</p>
      </div>
      <EssentialForm />
    </div>
  );
}

