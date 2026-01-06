import { prisma } from "@/lib/prisma";
import ServicesList from "./service-list-client";

export default async function ServicesListServer() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
  });

  const services = await prisma.service.findMany({
    orderBy: { title: "asc" },
  });

  return <ServicesList countries={countries} services={services} />;
}
