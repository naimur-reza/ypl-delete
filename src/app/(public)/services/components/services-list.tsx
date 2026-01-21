import { prisma } from "@/lib/prisma";
import ServicesList from "./service-list-client";

interface ServicesListServerProps {
  services: any[];
}

export default async function ServicesListServer({
  services,
}: ServicesListServerProps) {
  return <ServicesList services={services} />;
}
