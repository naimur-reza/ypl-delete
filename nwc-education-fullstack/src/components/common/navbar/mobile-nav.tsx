"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Globe,
  Briefcase,
  Award,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type NavItem = {
  icon?: ReactNode;
  title: string;
  href: string;
  phone?: string;
  countryFlag?: string;
  countryName?: string;
};

type MobileNavProps = {
  destinations: NavItem[];
  universities: NavItem[];
  courses: NavItem[];
  events: NavItem[];
  offices: NavItem[];
  resources?: NavItem[];
};

export function MobileNav({
  destinations,
  universities,
  courses,
  events,
  offices,
  resources,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navSections = [
    {
      title: "Study Abroad",
      href: "/study-abroad",
      icon: <GraduationCap className="w-5 h-5" />,
      items: destinations,
    },
    {
      title: "Universities",
      href: "/universities",
      icon: <GraduationCap className="w-5 h-5" />,
      items: universities,
    },
    {
      title: "Courses",
      href: "/courses",
      icon: <BookOpen className="w-5 h-5" />,
      items: courses,
    },
    {
      title: "Scholarships",
      href: "/scholarships",
      icon: <Award className="w-5 h-5" />,
      items: [],
    },
    {
      title: "Events",
      href: "/events",
      icon: <CalendarDays className="w-5 h-5" />,
      items: events,
    },
    {
      title: "Global Branches",
      href: "/global-branches",
      icon: <Globe className="w-5 h-5" />,
      items: offices,
    },
  ];

  const resourceLinks = resources || [
    {
      title: "Careers",
      href: "/careers",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      title: "Services",
      href: "/services",
      icon: <Award className="w-4 h-4" />,
    },
    { title: "Gallery", href: "/gallery", icon: <Globe className="w-4 h-4" /> },
    { title: "Blogs", href: "/blogs", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden relative"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <SheetTitle className="text-left text-lg font-semibold">
            Navigation
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-4 py-4">
            {/* Main Navigation Links - Direct Links Only */}
            <nav className="space-y-1">
              {navSections.map((section) => (
                <Link
                  key={section.title}
                  href={section.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <span className="text-muted-foreground">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-4 border-t border-border/50" />

            {/* Resources Section */}
            <div className="px-4 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </h3>
            </div>
            <nav className="space-y-1">
              {resourceLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <span className="text-muted-foreground">{link.icon}</span>
                  <span className="text-sm">{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background">
          <Link href="/apply-now" onClick={() => setOpen(false)}>
            <Button className="w-full" size="lg">
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
