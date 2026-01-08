import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/top-bar";
import { QueryProvider } from "@/components/providers/query-provider";
import { getSession } from "@/lib/auth-helpers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "NWC Education - Dashboard",
  description: "NWC Education Admin Dashboard",
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

  const user = {
    name: session.name,
    email: session.email,
    role: session.role,
  };

  return (
    <QueryProvider>
      <SidebarProvider>
        <div className={`flex min-h-screen w-full`}>
          <AppSidebar user={user} />

          <main className="flex-1 overflow-auto">
            <Topbar user={user} />
            <div className="p-8">{children}</div>
          </main>
        </div>
        <Toaster position="bottom-right" richColors />
      </SidebarProvider>
    </QueryProvider>
  );
}
