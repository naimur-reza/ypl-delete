"use client";

import { CareerForm } from "../_components/CareerForm";

export default function NewCareerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Career</h1>
        <p className="text-muted-foreground">Create a new career opportunity</p>
      </div>
      <CareerForm />
    </div>
  );
}

