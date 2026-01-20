import { Topbar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  Activity,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChartsWrapper } from "./components/charts-wrapper";

const numberFormatter = new Intl.NumberFormat("en-US");
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const detailedDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  APPROVED: "default",
  COMPLETED: "default",
  BOOKED: "default",
  REJECTED: "destructive",
  DECLINED: "destructive",
  CANCELLED: "outline",
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

async function getDashboardData() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);

  const [
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRegistrations,
    confirmedRegistrations,
    cancelledRegistrations,
    totalAppointments,
    pendingAppointments,
    upcomingEventsList,
    recentRegistrations,
    recentAppointments,
    registrationsLast7Days,
    appointmentsLast7Days,
    eventsWithDates,
    thisYearRegistrations,
    lastYearRegistrations,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { startDate: { gte: now } } }),
    prisma.eventRegistration.count(),
    prisma.eventRegistration.count({ where: { status: "PENDING" } }),
    prisma.eventRegistration.count({ where: { status: "CONFIRMED" } }),
    prisma.eventRegistration.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.event.findMany({
      where: { startDate: { gte: now } },
      orderBy: { startDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startDate: true,
        location: true,
        isRegistrationOpen: true,
      },
    }),
    prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        event: { select: { title: true } },
      },
    }),
    prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        preferredAt: true,
        createdAt: true,
        event: { select: { title: true } },
      },
    }),
    // Last 7 days registrations for trend chart
    prisma.eventRegistration.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    // Last 7 days appointments for trend chart
    prisma.appointment.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    // Events for weekly activity
    prisma.event.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    // This year registrations by month
    prisma.eventRegistration.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { createdAt: true },
    }),
    // Last year registrations by month
    prisma.eventRegistration.findMany({
      where: {
        createdAt: { gte: startOfLastYear, lte: endOfLastYear },
      },
      select: { createdAt: true },
    }),
  ]);

  // Process data for charts
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate last 7 days trend data
  const registrationsTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dayRegistrations = registrationsLast7Days.filter(
      (r) => r.createdAt >= dayStart && r.createdAt <= dayEnd
    ).length;
    const dayAppointments = appointmentsLast7Days.filter(
      (a) => a.createdAt >= dayStart && a.createdAt <= dayEnd
    ).length;

    registrationsTrend.push({
      date: dateStr,
      registrations: dayRegistrations,
      appointments: dayAppointments,
    });
  }

  // Status distribution for pie chart
  const statusDistribution = [
    { name: "Pending", value: pendingRegistrations, color: "#f59e0b" },
    { name: "Confirmed", value: confirmedRegistrations, color: "#10b981" },
    { name: "Cancelled", value: cancelledRegistrations, color: "#94a3b8" },
  ].filter((s) => s.value > 0);

  // Weekly activity
  const weeklyActivity = dayNames.map((day, index) => {
    const dayEvents = eventsWithDates.filter(
      (e) => e.createdAt.getDay() === index
    ).length;
    const dayRegs = registrationsLast7Days.filter(
      (r) => r.createdAt.getDay() === index
    ).length;
    return { day, events: dayEvents, registrations: dayRegs };
  });

  // Monthly comparison
  const monthlyComparison = monthNames.map((month, index) => {
    const thisYearCount = thisYearRegistrations.filter(
      (r) => r.createdAt.getMonth() === index
    ).length;
    const lastYearCount = lastYearRegistrations.filter(
      (r) => r.createdAt.getMonth() === index
    ).length;
    return { month, thisYear: thisYearCount, lastYear: lastYearCount };
  });

  return {
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRegistrations,
    totalAppointments,
    pendingAppointments,
    upcomingEventsList,
    recentRegistrations,
    recentAppointments,
    chartData: {
      registrationsTrend,
      statusDistribution,
      weeklyActivity,
      monthlyComparison,
    },
  };
}

const StatIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
    <Icon className="h-5 w-5" />
  </div>
);

export default async function Dashboard() {
  const data = await getDashboardData();

  const totalEngagements = data.totalRegistrations + data.totalAppointments;
  const completionRate =
    data.totalRegistrations > 0
      ? Math.round(
          ((data.totalRegistrations - data.pendingRegistrations) /
            data.totalRegistrations) *
            100
        )
      : 0;

  const statCards: Array<{
    title: string;
    value: number;
    helper: string;
    icon: LucideIcon;
    href: string;
  }> = [
    {
      title: "Events Published",
      value: data.totalEvents,
      helper: `${data.upcomingEvents} upcoming`,
      icon: CalendarDays,
      href: "/dashboard/events",
    },
    {
      title: "Event Applications",
      value: data.totalRegistrations,
      helper: `${data.pendingRegistrations} pending review`,
      icon: ClipboardCheck,
      href: "/dashboard/registrations",
    },
    {
      title: "Appointments",
      value: data.totalAppointments,
      helper: `${data.pendingAppointments} awaiting confirmation`,
      icon: CalendarClock,
      href: "/dashboard/appointments",
    },
    {
      title: "Engagement Volume",
      value: totalEngagements,
      helper: "Registrations + bookings",
      icon: Activity,
      href: "/dashboard/registrations",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Admin Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time visibility into events, registrations, and bookings.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="border-border/70 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                    {stat.title}
                  </CardTitle>
                  <StatIcon icon={stat.icon} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {numberFormatter.format(stat.value)}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.helper}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="col-span-7 lg:col-span-4 border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Sessions scheduled in the next few weeks with registration
                  status.
                </CardDescription>
              </div>
              <Link href="/dashboard/events">
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.upcomingEventsList.length ? (
                <div className="space-y-3">
                  {data.upcomingEventsList.map((event) => (
                    <Link
                      key={event.id}
                      href={`/dashboard/events`}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3 hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {shortDateFormatter.format(event.startDate)} •{" "}
                          {event.location || "Location TBA"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.isRegistrationOpen ? "default" : "outline"
                        }
                        className="text-xs"
                      >
                        {event.isRegistrationOpen ? "Open" : "Closed"}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming events have been scheduled.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-7 lg:col-span-3 border-border/70">
            <CardHeader>
              <CardTitle>Applications Snapshot</CardTitle>
              <CardDescription>
                Quick pulse on registrations and appointment requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href="/dashboard/registrations"
                className="block rounded-lg border border-border/80 p-4 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <p className="text-sm font-medium">Event Applications</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {numberFormatter.format(data.totalRegistrations)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {data.pendingRegistrations} pending
                  </Badge>
                </div>
              </Link>
              <Link
                href="/dashboard/appointments"
                className="block rounded-lg border border-border/80 p-4 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <p className="text-sm font-medium">Appointments</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {numberFormatter.format(data.totalAppointments)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {data.pendingAppointments} awaiting confirmation
                  </Badge>
                </div>
              </Link>
              <div className="rounded-lg border border-border/80 p-4 bg-linear-to-r from-primary/5 to-primary/10">
                <p className="text-sm font-medium">Completion Rate</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{completionRate}%</span>
                  <p className="text-xs text-muted-foreground">
                    Approved vs total applications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <ChartsWrapper data={data.chartData as any} />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Event Applications</CardTitle>
                <CardDescription>
                  Latest submissions across all live events.
                </CardDescription>
              </div>
              <Link href="/dashboard/registrations">
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.recentRegistrations.length ? (
                <div className="space-y-3">
                  {data.recentRegistrations.map((registration) => (
                    <Link
                      key={registration.id}
                      href={`/dashboard/registrations/${registration.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3 hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {registration.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {registration.event?.title || "Unassigned event"} •{" "}
                          {shortDateFormatter.format(registration.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          statusVariantMap[registration.status] || "outline"
                        }
                        className="text-xs"
                      >
                        {formatStatus(registration.status)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No event registrations have been received yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>
                  Booking requests along with preferred consultation times.
                </CardDescription>
              </div>
              <Link href="/dashboard/appointments">
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.recentAppointments.length ? (
                <div className="space-y-3">
                  {data.recentAppointments.map((appointment) => (
                    <Link
                      key={appointment.id}
                      href={`/dashboard/appointments`}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3 hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {appointment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.event?.title || "General consultation"} •{" "}
                          {detailedDateFormatter.format(
                            appointment.preferredAt || appointment.createdAt
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={
                          statusVariantMap[appointment.status] || "outline"
                        }
                        className="text-xs"
                      >
                        {formatStatus(appointment.status)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No appointment requests submitted yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
