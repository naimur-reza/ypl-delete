"use client";

/**
 * Helper function to clear country selection preference
 * This allows users to reset their manual country selection
 * and let the geo-redirect work again
 */
export function clearCountryPreference() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("manual-country-selection");
    sessionStorage.removeItem("geo-redirected");
    // Reload to trigger geo-redirect
    window.location.href = "/";
  }
}
