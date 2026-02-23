"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Settings,
  Users,
  Building2,
  Briefcase,
  LogOut,
  ChevronUp,
  UserCheck,
  FileSpreadsheet,
  Calendar,
  Files,
  History as HistoryIcon,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
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
    title: "Recruitment",
    items: [
      { title: "Hero Slider", url: "/dashboard/hero", icon: LayoutDashboard },
      { title: "Services", url: "/dashboard/services", icon: Briefcase },
      { title: "Careers", url: "/dashboard/careers", icon: GraduationCap },
      { title: "Departments", url: "/dashboard/departments", icon: Building2 },
      { title: "Roles", url: "/dashboard/roles", icon: UserCheck },
      { title: "Team", url: "/dashboard/team", icon: Users },

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
        title: "CV Bank",
        url: "/dashboard/candidates",
        icon: FileSpreadsheet,
      },
            { title: "Event Leads", url: "/dashboard/event-leads", icon: FileSpreadsheet },
    ],
  },
  {
    title: "Managements",
    items: [
      { title: "Calendars", url: "/dashboard/calendars", icon: Calendar },
      { title: "Insights", url: "/dashboard/insights", icon: Files },
      { title: "Events", url: "/dashboard/events", icon: HistoryIcon },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Users", url: "/dashboard/users", icon: Users },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
      { title: "Activity Log", url: "/dashboard/settings/activities", icon: HistoryIcon, roles: ["superadmin"] },
    ],
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <Sidebar className="border-r border-border bg-linear-to-b from-background to-muted/20">
      <SidebarHeader className="border-b border-border bg-linear-to-r from-primary/5 to-primary/10 p-4">
        <Link href="/">
          <Image src="/images/ypl-logo.png" alt="Logo" width={100} height={50} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-5 space-y-6">
        {menuSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase text-muted-foreground tracking-wide">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2 space-y-1">
              {section.items
                .filter((item) => !item.roles || (user?.role && item.roles.includes(user.role)))
                .map((item) => {
                  const active = isActive(item.url);
                return (
                  <SidebarMenu key={item.title} className="space-y-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          "gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                          active &&
                            "border border-primary/25 bg-primary/10 text-primary shadow-sm",
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
        ))}
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
                <span className="text-xs text-muted-foreground truncate capitalize">
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
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
