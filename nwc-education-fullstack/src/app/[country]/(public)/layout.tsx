import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  // Navbar and Footer are already provided by the parent country layout.
  return <div className="min-h-[calc(100vh-120px)]">{children}</div>;
};

export default MainLayout;
