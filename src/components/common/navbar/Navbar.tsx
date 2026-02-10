import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  LayoutDashboard,
  Briefcase,
  Wrench,
  Image as ImageIcon,
  FileText,
  LayoutList,
} from "lucide-react";
import { CountryAwareLink } from "./country-aware-link";
import NavDropdown from "./navbar-dropdown";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import CountryModal from "@/app/[country]/(public)/(home)/components/country-modal";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";

type NavbarProps = {
  countrySlug?: string | null;
};

const Navbar = async ({ countrySlug }: NavbarProps) => {
  const session = await getSession();

  const countryScopedFilter = countrySlug
    ? {
      some: {
        country: { slug: countrySlug },
      },
    }
    : undefined;

  const [
    destinations,
    universities,
    courses,
    events,
    globalOffices,
    countries,
 
  ] = await Promise.all([
      prisma.destination.findMany({
        select: { id: true, name: true, slug: true },
        where: countryScopedFilter
          ? {
            OR: [
              { countries: countryScopedFilter },
              { isGlobal: true },
            ],
          }
          : undefined,
      }),
      prisma.university.findMany({
        select: { id: true, name: true, slug: true },
        where: countryScopedFilter
          ? {
            status: "ACTIVE",
            countries: countryScopedFilter,
          }
          : { status: "ACTIVE" },
        take: 20,
      }),
      prisma.course.findMany({
        select: { id: true, title: true, slug: true },
        where: countryScopedFilter
          ? {
            status: "ACTIVE",
          }
          : { status: "ACTIVE" },
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
        where: countryScopedFilter
          ? { countries: countryScopedFilter }
          : undefined,
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          countries: {
            select: {
              country: {
                select: {
                  id: true,
                  name: true,
                  flag: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.country.findMany({
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          slug: true,
          flag: true,
        },
        orderBy: { name: "asc" },
      }),
      prisma.intakePage.findMany({
        where: { status: "ACTIVE" },
        select: {
          intake: true,
          destination: { select: { slug: true, name: true } },
        },
        orderBy: [{ destination: { name: "asc" } }, { intake: "asc" }],
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

  const officeItems = globalOffices.map((office) => {
    // Get the first country's flag, name, and slug for display
    const firstCountry = office.countries?.[0]?.country;
    // If we're on a country-specific page, use that country's route
    // Otherwise, use the office's primary country or 'global'
  
    const href = !countrySlug ? `/global-branches/${office.slug}` : `/${firstCountry?.slug}/global-branches/${office.slug}`
    return {
      title: office.name,
      href,
      phone: office.phone || undefined,
      countryFlag: firstCountry?.flag || undefined,
      countryName: firstCountry?.name || undefined,
    };
  });
 

  const resourceItems = [
    {
      title: "Careers",
      href: "/careers",
      icon: <Briefcase size={18} />,
    },
    {
      title: "Services",
      href: "/services",
      icon: <Wrench size={18} />,
    },
    {
      title: "Gallery",
      href: "/gallery",
      icon: <ImageIcon size={18} />,
    },
    {
      title: "Blogs",
      href: "/blogs",
      icon: <FileText size={18} />,
    },
    {
      title: "Intakes",
      href: "/intakes",
      icon: <LayoutList size={18} />,
    },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-secondary/10 bg-white">
      <div className="flex justify-between items-center h-16 md:h-20 px-4 md:px-10">
        {/* Logo */}
        <CountryAwareLink href="/" className=" shrink-0">
          <Image src="/logo.svg" alt="Logo" width={110} height={110} priority />
        </CountryAwareLink>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center">
          <ul className="flex items-center gap-0">
            {destinationItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/study-abroad"
                  title="Study Abroad"
                  heading="Explore study destinations"
                  viewAllLink="/study-abroad"
                  items={destinationItems}
                />
              </li>
            )}

            {universityItems.length > 0 && (
              <li>
                <CountryAwareLink
                  className="font-medium mx-2  text-muted-foreground transition-colors  hover:bg-slate-100 px-3 py-2 rounded-full"
                  href="/universities"
                >
                  Universities
                </CountryAwareLink>
              </li>
            )}

            {courseItems.length > 0 && (
              <li>
                <CountryAwareLink
                  className="font-medium mx-2  text-muted-foreground transition-colors  hover:bg-slate-100 px-3 py-2 rounded-full"
                  href="/courses"
                >
                  Courses
                </CountryAwareLink>
              </li>
            )}

            {
              <CountryAwareLink
                href="/scholarships"
                className="font-medium mx-2  text-muted-foreground transition-colors text-sm md:text-base  hover:bg-slate-100 px-3 py-2 rounded-full"
              >
                Scholarships
              </CountryAwareLink>
            }

            {eventItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/events"
                  title="Events"
                  heading="Upcoming events and webinars"
                  viewAllLink="/events"
                  items={eventItems}
                />
              </li>
            )}

            {officeItems.length > 0 && (
              <li>
                <NavDropdown
                  href="/global-branches"
                  title="Global Branches"
                  heading="Discover our global footprint."
                  viewAllLink="/global-branches"
                  items={officeItems}
                />
              </li>
            )}

            <NavDropdown
            
              title="Resources"
              heading="Explore our resources"
               
              items={resourceItems}
            />
          </ul>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {session && (
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}
          {/* Country Modal - Visible on all screen sizes */}
          <CountryModal />
          <div className="hidden md:block">
            <CountryAwareLink href={"/apply-now"}>
              <Button size="lg" className="font-medium">
                Book a Free Consultation
              </Button>
            </CountryAwareLink>
          </div>

          {/* Mobile Navigation */}
          <MobileNav
            destinations={destinationItems}
            universities={universityItems}
            courses={courseItems}
            events={eventItems}
            offices={officeItems}
            countries={countries}
            currentCountrySlug={countrySlug}
            resources={resourceItems}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
