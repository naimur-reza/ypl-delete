"use client";

import { useTransition } from "react";
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
  LogOut,
  ChevronUp,
  UserCheck,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { logout } from "@/app/actions/auth";

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

interface AppSidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
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
        title: "Job Applications",
        url: "/dashboard/applications",
        icon: UserCheck,
      },
      {
        title: "Event Registrations",
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

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

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
                                  <Link href={child.url} prefetch={false}>
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
                          <Link href={item.url} prefetch={false}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg bg-background/50 p-3 backdrop-blur-sm w-full hover:bg-background/80 transition-colors">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarFallback className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="text-sm font-semibold truncate">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.role || "Admin Access"}
                </span>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
