"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Globe from "@/assets/icons/globe.svg";
import { useCountry } from "@/lib/country-context";
import { useState, useTransition } from "react";
import { Globe as GlobeIcon, Loader2 } from "lucide-react";

type Country = {
  id: string;
  name: string;
  slug: string;
  flag: string | null;
};

type CountryModalClientProps = {
  countries: Country[];
  currentCountrySlug?: string | null;
};

const CountryModalClient = ({
  countries,
  currentCountrySlug,
}: CountryModalClientProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { country: currentCountry, isCountrySpecific } = useCountry();

  // Get current country flag (use context first, fallback to cookie, then prop)
  const countryFromCookie =
    typeof window !== "undefined"
      ? getCookie("user-country")?.toString()
      : null;
  const activeCountrySlug =
    currentCountry || countryFromCookie || currentCountrySlug;
  const currentCountryData = countries.find(
    (c) => c.slug === activeCountrySlug
  );
  const currentFlag = currentCountryData?.flag;

  const handleCountryChange = (country: Country) => {
    // Set cookie to remember user's choice (30 days)
    setCookie("user-country", country.slug, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Clear global preference when selecting a specific country
    deleteCookie("country-preference", { path: "/" });

    // Always navigate to country home page
    const newPath = `/${country.slug}`;

    console.log("🔄 Switching country:", {
      from: currentCountry,
      to: country.slug,
      newPath: newPath,
    });

    // Close modal first
    setIsOpen(false);

    // Use startTransition for smoother navigation and refresh router cache
    startTransition(() => {
      router.push(newPath);
      router.refresh(); // Clear router cache to ensure fresh data
    });
  };

  const handleGoGlobal = () => {
    // Delete the user-country cookie completely
    deleteCookie("user-country", { path: "/" });

    // Also set an explicit "global" preference cookie to prevent auto-redirect
    setCookie("country-preference", "global", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Always navigate to global home page
    const newPath = "/";

    console.log("🌐 Switching to global:", {
      from: currentCountry,
      isCountrySpecific,
      oldPath: pathname,
      newPath: newPath,
    });

    // Close modal first
    setIsOpen(false);

    // Use startTransition for smoother navigation and refresh router cache
    startTransition(() => {
      router.push(newPath);
      router.refresh(); // Clear router cache to ensure fresh data
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-white hover:opacity-80 transition">
          {currentFlag ? (
            <div className="size-8 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer">
              <Image
                src={currentFlag}
                alt={currentCountryData?.name || "Country flag"}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <Globe className="size-8 cursor-pointer" />
          )}
        </button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-md rounded-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Where Would You Like to Visit?
          </DialogTitle>
        </DialogHeader>

        {/* Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {/* Country Grid */}
        {countries.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-6 place-items-center">
            {/* Global Option */}
            <button
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoGlobal}
              disabled={isPending}
            >
              <div
                className={`size-15 rounded-full overflow-hidden border-2 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all ${
                  !activeCountrySlug
                    ? "ring-2 ring-primary ring-offset-2 border-primary"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <GlobeIcon className="size-8 text-white" />
              </div>
              <span
                className={`text-sm font-medium ${
                  !activeCountrySlug ? "text-primary" : ""
                }`}
              >
                Global
              </span>
            </button>

            {countries.map((country) => (
              <button
                key={country.id}
                className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleCountryChange(country)}
                disabled={isPending}
              >
                <div
                  className={`size-15 rounded-full overflow-hidden border-2 transition-all ${
                    activeCountrySlug === country.slug
                      ? "ring-2 ring-primary ring-offset-2 border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={country.flag || "/placeholder-flag.png"}
                    alt={country.name}
                    width={200}
                    height={200}
                    className="size-full object-cover"
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    activeCountrySlug === country.slug ? "text-primary" : ""
                  }`}
                >
                  {country.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {countries.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            No countries available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CountryModalClient;
