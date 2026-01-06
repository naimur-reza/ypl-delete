import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/top-bar";
import { getSession } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "Sales CRM - Dashboard",
  description: "Modern Sales CRM Interface",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full`}>
        <AppSidebar />

        <main className="flex-1 overflow-auto">
          <Topbar />
          <div className="p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
