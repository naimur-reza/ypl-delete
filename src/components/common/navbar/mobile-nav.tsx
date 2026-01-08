"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface NavItem {
  icon?: ReactNode;
  title: string;
  description?: string;
  href?: string;
}

interface MobileNavProps {
  destinations: NavItem[];
  universities: NavItem[];
  courses: NavItem[];
  events: NavItem[];
  offices: NavItem[];
}

export function MobileNav({
  destinations,
  universities,
  courses,
  events,
  offices,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuSections = [
    { title: "Destinations", items: destinations },
    { title: "Universities", items: universities },
    { title: "Courses", items: courses },
    { title: "Events", items: events },
    { title: "Offices", items: offices },
  ];

  const toggleExpanded = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-muted rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white border-t border-border overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {menuSections.map((section) => (
              <div key={section.title}>
                {section.items.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleExpanded(section.title)}
                      className="w-full text-left px-3 py-2 font-semibold text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors flex justify-between items-center"
                    >
                      {section.title}
                      <span className="text-xs">
                        {expandedMenu === section.title ? "−" : "+"}
                      </span>
                    </button>
                    {expandedMenu === section.title && (
                      <div className="ml-4 space-y-1 bg-muted rounded-md p-2">
                        {section.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href || "#"}
                            className="flex gap-2 items-start px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-background rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon && (
                              <div className="text-primary flex-shrink-0 mt-0.5">
                                {item.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="line-clamp-2">{item.title}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Static Links */}
            <hr className="my-3" />
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 font-semibold text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 font-semibold text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 font-semibold text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile CTA */}
          <div className="p-4 border-t">
            <Button size="lg" className="w-full font-medium">
              Book a Free Consultation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
