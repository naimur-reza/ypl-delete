import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/service";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

async function getServices() {
  await connectDB();
  const services = await Service.find({ isActive: true })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(services));
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              What We Offer
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80">
              Comprehensive talent solutions designed to support every stage of
              your career or hiring journey. From recruitment to career
              management, we have you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Explore Our Services
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Choose the right solution for your hiring or career goals.
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {services.length} Services
            </Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service: any) => (
              <Card
                key={service._id}
                className="group scroll-mt-24 overflow-hidden border-border/70 py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-primary/10" />
                    </div>
                  )}
                </div>

                <CardHeader className="px-5 pt-5 pb-0">
                  <CardTitle className="line-clamp-1 text-xl group-hover:text-primary">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 pt-3">
                  <SafeHtmlContent
                    content={service.description}
                    className="text-sm text-muted-foreground line-clamp-3"
                  />
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {service.features.slice(0, 3).map((feature: string) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="line-clamp-1 text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>

                <CardFooter className="mt-auto px-5 pb-5">
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    asChild
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-secondary p-8 text-center lg:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-secondary-foreground/80">
              Contact us today to discuss how our services can support your
              recruitment or career needs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
