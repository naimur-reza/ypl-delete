"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface NavDropdownItemProps {
  icon?: ReactNode;
  title: string;
  href: string;
  description?: string;
}

export const NavDropdownItem = ({
  icon,
  title,
  href,
  description,
}: NavDropdownItemProps) => {
  return (
    <Link href={href}>
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-background transition-colors">
        {icon && <div className=" shrink-0 mt-0.5 text-primary">{icon}</div>}
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm line-clamp-1">
            {title}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
