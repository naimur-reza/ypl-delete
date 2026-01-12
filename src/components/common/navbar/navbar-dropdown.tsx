"use client";

import { ChevronDown, Phone, ExternalLink } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import { CountryAwareLink } from "./country-aware-link";
import { type ReactNode, useRef, useState } from "react";
import Image from "next/image";

interface NavItem {
  icon?: ReactNode;
  title: string;
  description?: string;
  href?: string;
  phone?: string;
  countryFlag?: string;
  countryName?: string;
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small buffer to prevent accidental hiding
  };

  return (
    <div className="static group">
      {/* Dropdown Button */}
      <CountryAwareLink
        href={(href as string) || "#"}
        className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-secondary font-medium transition-colors cursor-pointer group-hover:bg-slate-50 h-16 md:h-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        className={`absolute left-0 right-0 top-full w-full bg-black/70 backdrop-blur-sm border-t border-white/10 shadow-2xl transition-all duration-200 z-50  ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible pointer-events-none -translate-y-2"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Container for alignment */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          {/* Header */}
          {(heading || viewAllLink) && (
            <div className="flex justify-between items-center py-3 md:py-4 border-b border-white/10">
              {heading && (
                <h3 className="text-sm md:text-base font-semibold text-white">
                  {heading}
                </h3>
              )}
              {viewAllLink && (
                <CountryAwareLink
                  href={viewAllLink}
                  className="flex items-center gap-1.5 text-xs font-medium bg-primary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:bg-primary/90 transition-colors ml-auto"
                >
                  View All
                  <ExternalLink className="w-3 h-3" />
                </CountryAwareLink>
              )}
            </div>
          )}

          {/* Items - Grid layout */}
          <div className="py-4 md:py-8 max-h-[500px] overflow-y-auto no-scrollbar">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {items.map((item, index) => (
                  <CountryAwareLink
                    href={item.href || "#"}
                    key={index}
                    className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    {/* Flag Icon */}
                    {item.countryFlag ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-2 border-white/10 group-hover:border-white/30 transition-colors shrink-0">
                        {item.countryFlag.startsWith("http") || item.countryFlag.startsWith("/") ? (
                          <Image
                            src={item.countryFlag}
                            alt={item.countryName || item.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.parentElement) {
                                target.style.display = 'none';
                                const fallback = document.createElement('span');
                                fallback.className = 'text-2xl';
                                fallback.textContent = item.countryFlag || '🌍';
                                target.parentElement.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl">{item.countryFlag}</span>
                        )}
                      </div>
                    ) : item.icon ? (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10 group-hover:border-white/30 transition-colors text-white group-hover:text-white shrink-0">
                        {item.icon}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10 group-hover:border-white/30 transition-colors shrink-0">
                        <span className="text-lg text-slate-300 group-hover:text-white">{item.title.charAt(0)}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="font-semibold text-xs md:text-sm text-white/80 text-center group-hover:text-white transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    {/* Phone */}
                    {item.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Phone className="w-3 h-3" />
                        <span className="line-clamp-1">{item.phone}</span>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-400 text-center line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </CountryAwareLink>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300 text-center py-8">
                No items available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
