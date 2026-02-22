import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import Service from "@/lib/models/service";

async function getServices() {
  await connectDB();
  const services = await Service.find({ isActive: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(services));
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
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
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service: any, index: number) => (
              <div
                key={service._id}
                id={service.slug}
                className={`scroll-mt-24 grid gap-8 lg:grid-cols-2 lg:items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {service.features.map((feature: string) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-8">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                      <Link href="/contact">Learn More</Link>
                    </Button>
                  </div>
                </div>
                <div
                  className={`rounded-2xl bg-muted overflow-hidden ${
                    index % 2 === 1 ? "lg:col-start-1" : ""
                  }`}
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[300px] items-center justify-center p-8 lg:p-12">
                      <div className="h-32 w-32 rounded-full bg-primary/10" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 lg:py-24">
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
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
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
