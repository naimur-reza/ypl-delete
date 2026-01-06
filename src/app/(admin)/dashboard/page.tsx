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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

  const [
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRegistrations,
    totalAppointments,
    pendingAppointments,
    upcomingEventsList,
    recentRegistrations,
    recentAppointments,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { startDate: { gte: now } } }),
    prisma.eventRegistration.count(),
    prisma.eventRegistration.count({ where: { status: "PENDING" } }),
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
  ]);

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
  }> = [
    {
      title: "Events Published",
      value: data.totalEvents,
      helper: `${data.upcomingEvents} upcoming`,
      icon: CalendarDays,
    },
    {
      title: "Event Applications",
      value: data.totalRegistrations,
      helper: `${data.pendingRegistrations} pending review`,
      icon: ClipboardCheck,
    },
    {
      title: "Appointments",
      value: data.totalAppointments,
      helper: `${data.pendingAppointments} awaiting confirmation`,
      icon: CalendarClock,
    },
    {
      title: "Engagement Volume",
      value: totalEngagements,
      helper: "Registrations + bookings",
      icon: Activity,
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
            <Card key={stat.title} className="border-border/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
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
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="col-span-7 lg:col-span-4 border-border/70">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Sessions scheduled in the next few weeks with registration
                status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.upcomingEventsList.length ? (
                <div className="space-y-3">
                  {data.upcomingEventsList.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3"
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
                    </div>
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
              <div className="rounded-lg border border-border/80 p-4">
                <p className="text-sm font-medium">Event Applications</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {numberFormatter.format(data.totalRegistrations)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {data.pendingRegistrations} pending
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border/80 p-4">
                <p className="text-sm font-medium">Appointments</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {numberFormatter.format(data.totalAppointments)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {data.pendingAppointments} awaiting confirmation
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border/80 p-4">
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

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Recent Event Applications</CardTitle>
              <CardDescription>
                Latest submissions across all live events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentRegistrations.length ? (
                <div className="space-y-3">
                  {data.recentRegistrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3"
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
                    </div>
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
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>
                Booking requests along with preferred consultation times.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentAppointments.length ? (
                <div className="space-y-3">
                  {data.recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between rounded-lg border border-border/80 px-4 py-3"
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
                    </div>
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
