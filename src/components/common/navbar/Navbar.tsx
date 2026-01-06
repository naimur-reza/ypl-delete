import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";
import { BookOpen, GraduationCap, CalendarDays } from "lucide-react";
import { CountryAwareLink } from "./country-aware-link";
import NavDropdown from "./navbar-dropdown";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import CountryModal from "@/app/[country]/(public)/(home)/components/country-modal";
import Link from "next/link";

type NavbarProps = {
  countrySlug?: string | null;
};

const Navbar = async ({ countrySlug }: NavbarProps) => {
  const countryScopedFilter = countrySlug
    ? {
        some: {
          country: { slug: countrySlug },
        },
      }
    : undefined;

  const [destinations, universities, courses, events, globalOffices] =
    await Promise.all([
      prisma.destination.findMany({
        select: { id: true, name: true, slug: true },
        where: countryScopedFilter
          ? { countries: countryScopedFilter }
          : undefined,
      }),
      prisma.university.findMany({
        select: { id: true, name: true, slug: true },
        where: countryScopedFilter
          ? {
              isActive: true,
              countries: countryScopedFilter,
            }
          : { isActive: true },
        take: 20,
      }),
      prisma.course.findMany({
        select: { id: true, title: true, slug: true },
        where: countryScopedFilter
          ? {
              isActive: true,
              countries: countryScopedFilter,
            }
          : { isActive: true },
        take: 20,
      }),
      prisma.event.findMany({
        select: { id: true, title: true, slug: true, eventType: true },
        where: countryScopedFilter
          ? {
              countries: countryScopedFilter,
            }
          : undefined,
        take: 10,
      }),
      prisma.globalOffice.findMany({
        select: { id: true, name: true, slug: true },
        where: countryScopedFilter
          ? { countries: countryScopedFilter }
          : undefined,
      }),
    ]);

  const destinationItems = destinations.map((dest) => ({
    icon: <GraduationCap size={18} />,
    title: dest.name,
    href: `/study-abroad/${dest.slug}`,
  }));

  const universityItems = universities.map((uni) => ({
    icon: <GraduationCap size={18} />,
    title: uni.name,
    href: `/universities/${uni.slug}`,
  }));

  const courseItems = courses.map((course) => ({
    icon: <BookOpen size={18} />,
    title: course.title,
    href: `/courses/${course.slug}`,
  }));

  const eventItems = events.map((event) => ({
    icon: <CalendarDays size={18} />,
    title: event.title,
    href: `/events/${event.slug}`,
  }));

  const officeItems = globalOffices.map((office) => ({
    title: office.name,
    href: `/global-branches/${office.slug}`,
  }));

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-secondary/10 bg-white">
      <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-10">
        {/* Logo */}
        <CountryAwareLink href="/" className=" shrink-0">
          <Image src="/logo.svg" alt="Logo" width={110} height={110} />
        </CountryAwareLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center gap-0">
            {destinationItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/study-abroad"
                  title="Study Abroad"
                  items={destinationItems}
                />
              </li>
            )}

            {universityItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/universities"
                  title="Universities"
                  items={universityItems}
                />
              </li>
            )}

            {courseItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/courses"
                  title="Courses"
                  items={courseItems}
                />
              </li>
            )}

            {eventItems.length > 0 && (
              <li>
                <NavDropdown href="/events" title="Events" items={eventItems} />
              </li>
            )}

            {officeItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/global-branches"
                  title="Global Branches"
                  items={officeItems}
                />
              </li>
            )}

            <NavDropdown
              href={"#"}
              title="Resources"
              items={[
                {
                  title: "Scholarships",
                  href: "/scholarships",
                },
                {
                  title: "Careers",
                  href: "/careers",
                },
                {
                  title: "Services",
                  href: "/services",
                },
                {
                  title: "Gallery",
                  href: "/gallery",
                },
                {
                  title: "Blogs",
                  href: "/blogs",
                },
              ]}
            />

            <li>
              <CountryAwareLink
                href="/events"
                className="px-3 py-2 rounded-md text-muted-foreground font-medium hover:text-primary hover:bg-background transition-colors"
              >
                Events
              </CountryAwareLink>
            </li>
          </ul>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:block">
            <CountryModal />
          </div>
          <div className="hidden md:block">
            <Link href={"/apply-now"}>
              <Button size="lg" className="font-medium">
                Book a Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNav
            destinations={destinationItems}
            universities={universityItems}
            courses={courseItems}
            events={eventItems}
            offices={officeItems}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
