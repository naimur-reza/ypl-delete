"use client";

import { createContext, useContext, ReactNode } from "react";

/**
 * Country context type
 */
export type CountryContextType = {
  country: string | null;
  countryName: string | null;
  isoCode: string | null;
  source: "param" | "geo" | "global";
  isCountrySpecific: boolean;
};

/**
 * Create country context
 */
const CountryContext = createContext<CountryContextType | undefined>(undefined);

/**
 * Country provider props
 */
type CountryProviderProps = {
  country: string | null;
  countryName?: string | null;
  isoCode?: string | null;
  source?: "param" | "geo" | "global";
  children: ReactNode;
};

/**
 * Country provider component
 * Wraps app layouts to provide country context throughout the app
 */
export function CountryProvider({
  country,
  countryName = null,
  isoCode = null,
  source = "global",
  children,
}: CountryProviderProps) {
  const value: CountryContextType = {
    country,
    countryName,
    isoCode,
    source,
    isCountrySpecific: country !== null,
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}

/**
 * Hook to consume country context
 * Use this in client components to get the current country
 * Returns default global values if used outside provider (safe fallback)
 */
export function useCountry(): CountryContextType {
  const context = useContext(CountryContext);

  // Return default global values if outside provider (safe fallback)
  if (context === undefined) {
    return {
      country: null,
      countryName: null,
      isoCode: null,
      source: "global",
      isCountrySpecific: false,
    };
  }

  return context;
}
