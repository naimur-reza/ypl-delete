import React from "react"
import Link from "next/link";
import {
  User,
  Target,
  Clock,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { Service } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  user: User,
  target: Target,
  clock: Clock,
  briefcase: Briefcase,
  "arrow-right": ArrowRight,
  "trending-up": TrendingUp,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || User;

  return (
    <Link
      href={`/services#${service.id}`}
      className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
        {service.title}
      </h3>

      <p className="text-sm text-muted-foreground">{service.description}</p>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
        <span>Learn more</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
