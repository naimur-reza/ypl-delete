"use client";

import { GalleryForm } from "../_components/GalleryForm";

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Gallery Items</h1>
        <p className="text-muted-foreground">Create new gallery items</p>
      </div>
      <GalleryForm />
    </div>
  );
}

