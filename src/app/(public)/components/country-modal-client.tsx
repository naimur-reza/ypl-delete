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
import { setCookie, getCookie } from "cookies-next";
import Globe from "@/assets/icons/globe.svg";
import { useCountry } from "@/lib/country-context";
import { useState } from "react";

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
    (c) => c.slug === activeCountrySlug
  );
  const currentFlag = currentCountryData?.flag;

  const handleCountryChange = (country: Country) => {
    // Set cookie to remember user's choice (30 days)
    setCookie("user-country", country.slug, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    let newPath: string;

    if (isCountrySpecific && currentCountry) {
      // We're on a country-specific route - replace the country
      const pathSegments = pathname.split("/").filter(Boolean);
      pathSegments[0] = country.slug; // Replace first segment (current country)
      newPath = "/" + pathSegments.join("/");
    } else {
      // We're on a global route - prepend country
      newPath = `/${country.slug}${pathname}`;
    }

    console.log("🔄 Switching country:", {
      from: currentCountry,
      to: country.slug,
      isCountrySpecific,
      oldPath: pathname,
      newPath: newPath,
    });

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

      {/* Modal Content */}
      <DialogContent className="max-w-md rounded-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Where Would You Like to Visit?
          </DialogTitle>
        </DialogHeader>

        {/* Country Grid */}
        {countries.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-6 place-items-center">
            {countries.map((country) => (
              <button
                key={country.id}
                className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleCountryChange(country)}
              >
                <div className="size-15 rounded-full overflow-hidden border">
                  <Image
                    src={country.flag || "/placeholder-flag.png"}
                    alt={country.name}
                    width={200}
                    height={200}
                    className="size-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{country.name}</span>
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
