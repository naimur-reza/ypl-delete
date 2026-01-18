"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GalleryForm } from "../../_components/GalleryForm";
import { toast } from "sonner";

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [galleryItem, setGalleryItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gallery/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Gallery item not found");
            router.push("/dashboard/gallery");
            return;
          }
          throw new Error("Failed to fetch gallery item");
        }
        const data = await response.json();
        setGalleryItem(data);
      } catch (error) {
        console.error("Error fetching gallery item:", error);
        toast.error("Failed to load gallery item");
        router.push("/dashboard/gallery");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGalleryItem();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Gallery Item</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!galleryItem) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Gallery Item</h1>
        <p className="text-muted-foreground">Update gallery item information</p>
      </div>
      <GalleryForm initialData={galleryItem} />
    </div>
  );
}

