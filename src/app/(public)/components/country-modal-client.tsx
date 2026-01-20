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
import { useState } from "react";
import { Globe as GlobeIcon } from "lucide-react";

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
  const { country: currentCountry, isCountrySpecific } = useCountry();

  // Get current country flag (use context first, fallback to cookie, then prop)
  const countryFromCookie =
    typeof window !== "undefined"
      ? getCookie("user-country")?.toString()
      : null;
  const activeCountrySlug =
    currentCountry || countryFromCookie || currentCountrySlug;
  const currentCountryData = countries.find(
    (c) => c.slug === activeCountrySlug,
  );
  const currentFlag = currentCountryData?.flag;

  const handleCountryChange = (country: Country) => {
    // Set cookie to remember user's choice (30 days)
    setCookie("user-country", country.slug, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Always navigate to country home page
    const newPath = `/${country.slug}`;

    router.push(newPath);
    router.refresh();
    router.push(newPath);
  };

  const handleGoGlobal = () => {
    // Delete the user-country cookie
    deleteCookie("user-country", { path: "/" });

    // Always navigate to global home page
    const newPath = "/";

    router.push(newPath);
    router.refresh();

    // Close modal and navigate
    setIsOpen(false);
    router.push(newPath);
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

      {/* Modal Content - Full screen on mobile */}
      <DialogContent className="w-full max-w-md sm:max-w-md rounded-none sm:rounded-xl p-4 sm:p-6 md:p-8 h-full sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            Where Would You Like to Visit?
          </DialogTitle>
        </DialogHeader>

        {/* Country Grid - Responsive grid */}
        {countries.length > 0 && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 place-items-center overflow-y-auto flex-1">
            {/* Global Option */}
            <button
              className="flex flex-col items-center gap-2 sm:gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer touch-manipulation min-w-20 sm:min-w-[100px]"
              onClick={handleGoGlobal}
            >
              <div
                className={`size-12 sm:size-14 md:size-16 rounded-full overflow-hidden border-2 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all ${
                  !activeCountrySlug
                    ? "ring-2 ring-primary ring-offset-2 border-primary"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <GlobeIcon className="size-6 sm:size-7 md:size-8 text-white" />
              </div>
              <span
                className={`text-xs sm:text-sm font-medium text-center ${
                  !activeCountrySlug ? "text-primary" : ""
                }`}
              >
                Global
              </span>
            </button>

            {countries.map((country) => (
              <button
                key={country.id}
                className="flex flex-col items-center gap-2 sm:gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer touch-manipulation min-w-20 sm:min-w-[100px]"
                onClick={() => handleCountryChange(country)}
              >
                <div
                  className={`size-12 sm:size-14 md:size-16 rounded-full overflow-hidden border-2 transition-all ${
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
                  className={`text-xs sm:text-sm font-medium text-center ${
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
