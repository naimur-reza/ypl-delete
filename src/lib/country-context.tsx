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
 */
export function useCountry(): CountryContextType {
  const context = useContext(CountryContext);

  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }

  return context;
}
