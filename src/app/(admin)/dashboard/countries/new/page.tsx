"use client";

import { CountryForm } from "../_components/CountryForm";

export default function NewCountryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Country</h1>
 
      </div>
      <CountryForm />
    </div>
  );
}

