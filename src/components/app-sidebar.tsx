"use client";

import {
  LayoutDashboard,
  Globe,
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  FileText,
  HelpCircle,
  MessageSquare,
  MapPin,
  Settings,
  Users,
  FolderTree,
  Building2,
  Briefcase,
  BadgeCheck,
  PlayCircle,
  ClipboardList,
  CalendarRange,
  Wrench,
  ClipboardCheck,
  CalendarClock,
  Image as ImageIcon,
  Monitor,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      {
        title: "Content Library",
        icon: FolderTree,
        url: "#",
        children: [

          {
            title: "Countries",
            url: "/dashboard/countries",
            icon: MapPin,
          },
          {
            title: "Global Offices",
            url: "/dashboard/global-offices",
            icon: Building2,
          },
          {
            title: "Destinations",
            url: "/dashboard/destinations",
            icon: Globe,
          },
          {
            title: "Essential Studies",
            url: "/dashboard/essentials",
            icon: FileText,
          },
          {
            title: "Services",
            url: "/dashboard/services",
            icon: ClipboardList,
          },
          {
            title: "Accreditations",
            url: "/dashboard/accreditations",
            icon: BadgeCheck,
          },
          {
            title: "Careers",
            url: "/dashboard/careers",
            icon: Briefcase,
          },
          {
            title: "Intake Pages",
            url: "/dashboard/intake-pages",
            icon: CalendarRange,
          },
          {
            title: "Intake Seasons",
            url: "/dashboard/intake-seasons",
            icon: CalendarClock,
          },
          {
            title: "University Details",
            url: "/dashboard/university-details",
            icon: Wrench,
          },
          {
            title: "Gallery",
            url: "/dashboard/gallery",
            icon: ImageIcon,
          },
          {
            title: "Stats",
            url: "/dashboard/stats",
            icon: BarChart3,
          },
        ],
      },
      { title: "Heroes", url: "/dashboard/heroes", icon: Monitor },
      {
        title: "Universities",
        url: "/dashboard/universities",
        icon: GraduationCap,
      },
      { title: "Courses", url: "/dashboard/courses", icon: BookOpen },
      { title: "Scholarships", url: "/dashboard/scholarships", icon: Award },
      { title: "Events", url: "/dashboard/events", icon: Calendar },
      { title: "Blogs", url: "/dashboard/blogs", icon: FileText },
      { title: "FAQs", url: "/dashboard/faqs", icon: HelpCircle },
      {
        title: "Testimonials",
        url: "/dashboard/testimonials",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        title: "Event Applications",
        url: "/dashboard/registrations",
        icon: ClipboardCheck,
      },
      {
        title: "Appointments",
        url: "/dashboard/appointments",
        icon: CalendarClock,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Users", url: "/dashboard/users", icon: Users },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border bg-linear-to-b from-background to-muted/20">
      <SidebarHeader className="border-b border-border bg-linear-to-r from-primary/5 to-primary/10 p-4">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={100} height={50} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-5 space-y-6">
        {menuSections.map((section) => {
          return (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase text-muted-foreground tracking-wide">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2 space-y-3">
                {section.items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const active = isActive(item.url);

                  if (hasChildren) {
                    return (
                      <div
                        key={item.title}
                        className="space-y-2 rounded-lg border border-border/70 bg-card/60 p-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                      >
                        <p className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                          {item.title}
                        </p>
                        <SidebarMenu className="space-y-1">
                          {item.children!.map((child) => {
                            const childActive = isActive(child.url);
                            return (
                              <SidebarMenuItem key={child.title}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={childActive}
                                  className={cn(
                                    "gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                                    childActive &&
                                      "border border-primary/20 bg-primary/10 text-primary shadow-sm"
                                  )}
                                >
                                  <Link href={child.url}>
                                    <child.icon className="h-4 w-4" />
                                    <span>{child.title}</span>
                                    {child.badge && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-[11px]"
                                      >
                                        {child.badge}
                                      </Badge>
                                    )}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </div>
                    );
                  }

                  return (
                    <SidebarMenu key={item.title} className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className={cn(
                            "gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                            active &&
                              "border border-primary/25 bg-primary/10 text-primary shadow-sm"
                          )}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[11px]"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-background/50 p-3 backdrop-blur-sm">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Admin"
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate">
              Administrator
            </span>
            <span className="text-xs text-muted-foreground truncate">
              Admin Access
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
