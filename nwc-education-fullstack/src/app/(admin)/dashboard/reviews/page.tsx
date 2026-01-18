"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to testimonials page which now handles all reviews
    router.replace("/dashboard/testimonials");
  }, [router]);

  return null;
}
