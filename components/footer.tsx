import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Our Services" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
  candidates: [
    { href: "/jobs", label: "Search Jobs" },
    { href: "/job-seekers", label: "Candidate Services" },
    { href: "/insights", label: "Career Advice" },
  ],
  employers: [
    { href: "/employers", label: "Hiring Solutions" },
    { href: "/contact?type=vacancy", label: "Submit a Vacancy" },
    { href: "/services", label: "Recruitment Services" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/ypl-logo.png"
                alt="YPL"
                width={80}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/80">
              Supporting the full talent lifecycle with expert recruitment and
              career management services.
            </p>
            <div className="mt-6">
              <p className="text-sm text-secondary-foreground/80">
                123 Business Street
                <br />
                London, EC1A 1BB
                <br />
                United Kingdom
              </p>
              <p className="mt-4 text-sm text-secondary-foreground/80">
                <a href="tel:+442012345678" className="hover:text-secondary-foreground">
                  +44 (0) 20 1234 5678
                </a>
                <br />
                <a href="mailto:info@ypl.com" className="hover:text-secondary-foreground">
                  info@ypl.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              For Candidates
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.candidates.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.employers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-foreground/20 pt-8">
          <p className="text-center text-sm text-secondary-foreground/60">
            &copy; {new Date().getFullYear()} YPL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
