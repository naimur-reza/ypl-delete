"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { LayoutDashboard, Briefcase, Building2, UserCheck, Users, GraduationCap, FileSpreadsheet, Loader2 } from "lucide-react";

interface Stats {
  branches: number;
  applications: number;
  users: number;
  services: number;
  careers: number;
  salaryGuideLeads: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [branches, applications, users, services, careers, leads] = await Promise.all([
          fetch("/api/branches").then((r) => r.json()),
          fetch("/api/applications").then((r) => r.json()).catch(() => []),
          fetch("/api/users").then((r) => r.json()).catch(() => []),
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/careers").then((r) => r.json()),
          fetch("/api/salary-guide-leads").then((r) => r.json()).catch(() => []),
        ]);
        setStats({
          branches: Array.isArray(branches) ? branches.length : 0,
          applications: Array.isArray(applications) ? applications.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          careers: Array.isArray(careers) ? careers.length : 0,
          salaryGuideLeads: Array.isArray(leads) ? leads.length : 0,
        });
      } catch {
        setStats({ branches: 0, applications: 0, users: 0, services: 0, careers: 0, salaryGuideLeads: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { title: "Careers", value: stats?.careers ?? 0, icon: GraduationCap, color: "text-blue-600 bg-blue-500/10" },
    { title: "Branches", value: stats?.branches ?? 0, icon: Building2, color: "text-emerald-600 bg-emerald-500/10" },
    { title: "Applications", value: stats?.applications ?? 0, icon: UserCheck, color: "text-violet-600 bg-violet-500/10" },
    { title: "Services", value: stats?.services ?? 0, icon: Briefcase, color: "text-rose-600 bg-rose-500/10" },
    { title: "Salary Guide Leads", value: stats?.salaryGuideLeads ?? 0, icon: FileSpreadsheet, color: "text-amber-600 bg-amber-500/10" },
    { title: "Users", value: stats?.users ?? 0, icon: Users, color: "text-cyan-600 bg-cyan-500/10" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={LayoutDashboard} title="Dashboard" description="Overview of your recruitment platform" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} className="border-border/60 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}