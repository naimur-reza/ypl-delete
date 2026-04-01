"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  Users,
  GraduationCap,
  FileSpreadsheet,
  Loader2,
  FileText,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";

interface Stats {
  applications: number;
  users: number;
  services: number;
  careers: number;
  salaryGuideLeads: number;
}

type CVStatus = "New" | "Contacted" | "Qualified" | "Converted";
type CVExperienceBand =
  | "0-3 Years"
  | "4-7 Years"
  | "8-12 Years"
  | "13-18 Years"
  | "19+ Years";

const STATUSES: CVStatus[] = ["New", "Contacted", "Qualified", "Converted"];
const EXPERIENCE_RANGES: CVExperienceBand[] = [
  "0-3 Years",
  "4-7 Years",
  "8-12 Years",
  "13-18 Years",
  "19+ Years",
];
const AVAILABILITY = ["Immediate", "15 Days", "1 Month+"] as const;

type CVLead = {
  department?: string;
  role?: string;
  status?: string;
  totalExperience?: string;
  industry?: string;
  location?: string;
  availableFromDate?: string;
  submittedAt?: string | Date;
};

const toNumber = (val: unknown) => {
  const n = typeof val === "number" ? val : Number(val);
  return Number.isFinite(n) ? n : 0;
};

const normalizeText = (val?: string) =>
  typeof val === "string" && val.trim().length > 0 ? val.trim() : "Unknown";

const PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const colorForIndex = (idx: number) => PALETTE[idx % PALETTE.length];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cvs, setCvs] = useState<CVLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [applications, users, services, careers, leads] = await Promise.all([
          fetch("/api/applications").then((r) => r.json()).catch(() => []),
          fetch("/api/users").then((r) => r.json()).catch(() => []),
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/careers").then((r) => r.json()),
          fetch("/api/salary-guide-leads").then((r) => r.json()).catch(() => []),
        ]);

        const safeLeads = Array.isArray(leads) ? (leads as CVLead[]) : [];
        setCvs(safeLeads);

        setStats({
          applications: Array.isArray(applications) ? applications.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          careers: Array.isArray(careers) ? careers.length : 0,
          salaryGuideLeads: safeLeads.length,
        });
      } catch {
        setCvs([]);
        setStats({
          applications: 0,
          users: 0,
          services: 0,
          careers: 0,
          salaryGuideLeads: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalCvs = cvs.length;

  const cvCountsByStatus = useMemo(() => {
    const map = new Map<CVStatus, number>();
    STATUSES.forEach((s) => map.set(s, 0));

    for (const cv of cvs) {
      const s = cv.status as CVStatus | undefined;
      if (s && STATUSES.includes(s)) map.set(s, (map.get(s) || 0) + 1);
    }

    return STATUSES.map((status) => ({
      status,
      count: map.get(status) || 0,
      color: colorForIndex(STATUSES.indexOf(status)),
    }));
  }, [cvs]);

  const topByKey = useMemo(() => {
    const depCounts = new Map<string, number>();
    const industryCounts = new Map<string, number>();
    const locationCounts = new Map<string, number>();
    const roleCounts = new Map<string, number>();

    for (const cv of cvs) {
      const dep = normalizeText(cv.department);
      depCounts.set(dep, (depCounts.get(dep) || 0) + 1);

      const ind = normalizeText(cv.industry);
      industryCounts.set(ind, (industryCounts.get(ind) || 0) + 1);

      const loc = normalizeText(cv.location);
      locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);

      const role = normalizeText(cv.role);
      roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
    }

    const toSorted = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]);

    const topN = (sorted: Array<[string, number]>, n: number) => {
      const top = sorted.slice(0, n);
      const other = sorted.slice(n);
      const otherSum = other.reduce((acc, [, v]) => acc + v, 0);
      return otherSum > 0 ? [...top, ["Other", otherSum] as const] : top;
    };

    const topDepartments = topN(toSorted(depCounts), 6).map(([department, count], idx) => ({
      department,
      count: toNumber(count),
      color: colorForIndex(idx),
    }));
    const topIndustries = topN(toSorted(industryCounts), 6).map(([industry, count], idx) => ({
      industry,
      count: toNumber(count),
      color: colorForIndex(idx),
    }));
    const topLocations = topN(toSorted(locationCounts), 6).map(([location, count], idx) => ({
      location,
      count: toNumber(count),
      color: colorForIndex(idx),
    }));
    const topRoles = topN(toSorted(roleCounts), 6).map(([role, count], idx) => ({
      role,
      count: toNumber(count),
      color: colorForIndex(idx),
    }));

    return { topDepartments, topIndustries, topLocations, topRoles };
  }, [cvs]);

  const cvExperienceDistribution = useMemo(() => {
    const counts = new Map<CVExperienceBand, number>();
    EXPERIENCE_RANGES.forEach((band) => counts.set(band, 0));

    for (const cv of cvs) {
      const band = cv.totalExperience as CVExperienceBand | undefined;
      if (band && EXPERIENCE_RANGES.includes(band)) {
        counts.set(band, (counts.get(band) || 0) + 1);
      }
    }

    return EXPERIENCE_RANGES.map((band, idx) => ({
      band,
      count: counts.get(band) || 0,
      color: colorForIndex(idx),
    }));
  }, [cvs]);

  const cvAvailabilityDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    [...AVAILABILITY, "Unknown"].forEach((v) => counts.set(v, 0));

    for (const cv of cvs) {
      const v = cv.availableFromDate;
      const normalized =
        typeof v === "string" && (AVAILABILITY as readonly string[]).includes(v)
          ? v
          : "Unknown";
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }

    const ordered = [...AVAILABILITY, "Unknown"];
    return ordered.map((value, idx) => ({
      value,
      count: counts.get(value) || 0,
      color: colorForIndex(idx),
    }));
  }, [cvs]);

  const submissionsByMonth = useMemo(() => {
    const now = new Date();
    // last 6 months (inclusive current month)
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString(undefined, { month: "short", year: "numeric" });
      return { key, label, year: d.getFullYear(), month: d.getMonth() };
    });

    const bucket = new Map<string, number>();
    months.forEach((m) => bucket.set(m.key, 0));

    for (const cv of cvs) {
      const dateVal = cv.submittedAt ? new Date(cv.submittedAt) : null;
      if (!dateVal || Number.isNaN(dateVal.getTime())) continue;
      const key = `${dateVal.getFullYear()}-${dateVal.getMonth()}`;
      if (bucket.has(key)) bucket.set(key, (bucket.get(key) || 0) + 1);
    }

    return months.map((m) => ({
      month: m.label,
      key: m.key,
      count: bucket.get(m.key) || 0,
    }));
  }, [cvs]);

  const cards = useMemo(() => {
    const newCount =
      cvCountsByStatus.find((s) => s.status === "New")?.count ?? 0;

    return [
      {
        title: "Total CVs",
        value: totalCvs,
        icon: FileText,
        color: "text-blue-600 bg-blue-500/10",
      },
      {
        title: "Applications",
        value: stats?.applications ?? 0,
        icon: UserCheck,
        color: "text-violet-600 bg-violet-500/10",
      },
      {
        title: "Careers",
        value: stats?.careers ?? 0,
        icon: GraduationCap,
        color: "text-blue-600 bg-blue-500/10",
      },
      {
        title: "Services",
        value: stats?.services ?? 0,
        icon: Briefcase,
        color: "text-rose-600 bg-rose-500/10",
      },
      {
        title: "CVs (New)",
        value: newCount,
        icon: Sparkles,
        color: "text-cyan-600 bg-cyan-500/10",
      },
      {
        title: "Users",
        value: stats?.users ?? 0,
        icon: Users,
        color: "text-amber-600 bg-amber-500/10",
      },
    ];
  }, [cvCountsByStatus, stats, totalCvs]);

  const emptyChartConfig = {} as any;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="CV Bank analytics driven by your candidate data"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {cards.map((card) => (
              <Card
                key={card.title}
                className="border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <card.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  CVs by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[300px] w-full">
                  <BarChart data={topByKey.topDepartments} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                    <XAxis
                      dataKey="department"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      interval={0}
                      minTickGap={10}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">
                                {payload?.department}
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                {value} CVs
                              </div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {topByKey.topDepartments.map((entry) => (
                        <Cell key={entry.department} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {topByKey.topDepartments.slice(0, 4).map((d) => (
                    <div key={d.department} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="truncate">{d.department}</span>
                      </span>
                      <span className="font-mono text-foreground">{d.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-4 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Status Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[300px] w-full">
                  <BarChart data={cvCountsByStatus} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                    <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{payload?.status}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {cvCountsByStatus.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>

                <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                  {cvCountsByStatus.map((s) => (
                    <div key={s.status} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="truncate">{s.status}</span>
                      </span>
                      <span className="font-mono text-foreground">{s.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-7 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Submissions by Month
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <LineChart data={submissionsByMonth} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} interval={0} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{payload?.month}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="CVs"
                      stroke={colorForIndex(0)}
                      strokeWidth={3}
                      dot={{ r: 3, fill: colorForIndex(0), stroke: colorForIndex(0) }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-5 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Industry Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, name: any, _item: any, _index: any, _payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{name}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={topByKey.topIndustries}
                      dataKey="count"
                      nameKey="industry"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      strokeWidth={4}
                    >
                      {topByKey.topIndustries.map((entry) => (
                        <Cell key={entry.industry} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                  {topByKey.topIndustries.slice(0, 4).map((d) => (
                    <div key={d.industry} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                        <span className="truncate">{d.industry}</span>
                      </span>
                      <span className="font-mono text-foreground">{d.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-6 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Experience Ranges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <BarChart data={cvExperienceDistribution} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/60" />
                    <XAxis dataKey="band" tickLine={false} axisLine={false} tickMargin={10} interval={0} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{payload?.band}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {cvExperienceDistribution.map((entry) => (
                        <Cell key={entry.band} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-6 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Location Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <BarChart
                    data={topByKey.topLocations}
                    layout="vertical"
                    margin={{ left: 0, right: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/60" />
                    <YAxis
                      dataKey="location"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={120}
                    />
                    <XAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{payload?.location}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count">
                      {topByKey.topLocations.map((entry) => (
                        <Cell key={entry.location} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-6 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, name: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{name}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={cvAvailabilityDistribution}
                      dataKey="count"
                      nameKey="value"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      strokeWidth={4}
                    >
                      {cvAvailabilityDistribution.map((entry) => (
                        <Cell key={entry.value} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-6 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Top Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={emptyChartConfig} className="h-[280px] w-full">
                  <BarChart data={topByKey.topRoles} layout="vertical" margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/60" />
                    <YAxis
                      dataKey="role"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={140}
                    />
                    <XAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          hideLabel
                          hideIndicator
                          formatter={(value: any, _name: any, _item: any, _index: any, payload: any) => (
                            <div className="grid gap-0.5">
                              <div className="font-medium text-foreground">{payload?.role}</div>
                              <div className="font-mono text-xs text-muted-foreground">{value} CVs</div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count">
                      {topByKey.topRoles.map((entry) => (
                        <Cell key={entry.role} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}