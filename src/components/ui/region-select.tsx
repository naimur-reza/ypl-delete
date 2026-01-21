"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { apiClient } from "@/lib/api-client";
import { Globe, Loader2 } from "lucide-react";

interface Country {
  id: string;
  name: string;
  slug: string;
}

interface CountrySelectProps {
  value: string[];
  onChange: (countryIds: string[]) => void;
  label?: string;
  isGlobal?: boolean;
  onGlobalChange?: (isGlobal: boolean) => void;
  showGlobalOption?: boolean;
}

export function CountrySelect({
  value = [],
  onChange,
  label = "Countries",
  isGlobal = false,
  onGlobalChange,
  showGlobalOption = false,
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
    if (isGlobal) return; // Don't allow country selection when global is checked
    const currentValue = Array.isArray(value) ? value : [];
    if (currentValue.includes(countryId)) {
      onChange(currentValue.filter((id) => id !== countryId));
    } else {
      onChange([...currentValue, countryId]);
    }
  };

  const handleGlobalChange = (checked: boolean) => {
    if (onGlobalChange) {
      onGlobalChange(checked);
      if (checked) {
        // Clear country selection when global is checked
        onChange([]);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Global Option */}
      {showGlobalOption && (
        <div className="flex items-center justify-between p-3 border border-primary/30 rounded-md bg-primary/5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="global-checkbox"
              checked={isGlobal}
              onCheckedChange={(checked) => handleGlobalChange(checked === true)}
            />
            <label
              htmlFor="global-checkbox"
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Globe className="h-4 w-4 text-primary" />
              Global (Show in all countries)
            </label>
          </div>
          {isGlobal && (
            <Badge variant="default" className="bg-primary">
              Global
            </Badge>
          )}
        </div>
      )}

      {/* Country Selection - disabled when global is checked */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading countries...
        </div>
      ) : countries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No countries available</p>
      ) : (
        <div className={`space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 transition-opacity ${
          isGlobal ? "opacity-50 pointer-events-none border-gray-200 bg-gray-50" : "border-gray-200"
        }`}>
          {isGlobal && (
            <p className="text-xs text-muted-foreground italic mb-2">
              Country selection disabled when Global is selected
            </p>
          )}
          {countries.map((country) => {
            const currentValue = Array.isArray(value) ? value : [];
            const isChecked = currentValue.includes(country.id);
            return (
              <div key={country.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(country.id)}
                  disabled={isGlobal}
                />
                <label
                  htmlFor={`country-${country.id}`}
                  className={`text-sm font-normal cursor-pointer flex-1 ${isGlobal ? "text-muted-foreground" : ""}`}
                >
                  {country.name}
                </label>
              </div>
            );
          })}
        </div>
      )}
      {!isGlobal && Array.isArray(value) && value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} countr{value.length !== 1 ? "ies" : "y"} selected
        </p>
      )}
    </div>
  );
}
