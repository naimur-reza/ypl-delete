"use client";

import { usePathname } from "next/navigation";
import { SalaryGuideModal } from "@/components/salary-guide-modal";
import { Topbar } from "@/components/topbar";

export function PublicShell({ 
  children, 
  navbar, 
  footer 
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Topbar />
      {navbar}
      <main>{children}</main>
      {footer}
      <SalaryGuideModal />
    </>
  );
}
