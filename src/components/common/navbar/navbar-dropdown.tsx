"use client";

import { ChevronDown } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import { CountryAwareLink } from "./country-aware-link";
import { type ReactNode, useState } from "react";

interface NavItem {
  icon?: ReactNode;
  title: string;
  description?: string;
  href?: string;
}

interface NavDropdownProps {
  title: string;
  href?: Url;
  heading?: string;
  viewAllLink?: string;
  items: NavItem[];
}

const NavDropdown = ({
  title,
  href,
  heading,
  viewAllLink,
  items,
}: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block group">
      {/* Dropdown Button */}
      <CountryAwareLink
        href={(href as string) || "#"}
        className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary font-medium transition-colors cursor-pointer group-hover:bg-background"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CountryAwareLink>

      {/* Dropdown Content */}
      <div
        className={`absolute left-0 top-full mt-0.5 w-80 bg-white border border-border rounded shadow-lg transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Header */}
        {heading && (
          <div className="flex justify-between items-center px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
            {viewAllLink && (
              <CountryAwareLink
                href={viewAllLink}
                className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
              >
                View All
              </CountryAwareLink>
            )}
          </div>
        )}

        {/* Items - Single column layout */}
        <div className="max-h-96 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item, index) => (
              <CountryAwareLink
                href={item.href || "#"}
                key={index}
                className="flex gap-3 items-start px-4 py-3 hover:bg-background transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </CountryAwareLink>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
