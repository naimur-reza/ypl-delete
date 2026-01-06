"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

interface Country {
  id: string;
  name: string;
  slug: string;
}

interface CountrySelectProps {
  value: string[];
  onChange: (countryIds: string[]) => void;
  label?: string;
}

export function CountrySelect({
  value = [],
  onChange,
  label = "Countries",
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiClient.get<{ data: Country[] }>(
          "/api/countries",
          { limit: "1000" }
        );
        if (response.data) {
          setCountries(
            Array.isArray(response.data)
              ? response.data
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (response.data as any).data || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleToggle = (countryId: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (currentValue.includes(countryId)) {
      onChange(currentValue.filter((id) => id !== countryId));
    } else {
      onChange([...currentValue, countryId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading countries...
        </div>
      ) : countries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No countries available</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
          {countries.map((country) => {
            const currentValue = Array.isArray(value) ? value : [];
            const isChecked = currentValue.includes(country.id);
            return (
              <div key={country.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(country.id)}
                />
                <label
                  htmlFor={`country-${country.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {country.name}
                </label>
              </div>
            );
          })}
        </div>
      )}
      {Array.isArray(value) && value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} countr{value.length !== 1 ? "ies" : "y"} selected
        </p>
      )}
    </div>
  );
}
