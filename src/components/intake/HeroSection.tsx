import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CountryAwareLink } from "../common/navbar/country-aware-link";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  media?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  destinationName: string;
  intakeName: string;
  countrySlug?: string;
}

export function HeroSection({
  title,
  subtitle,
  media,
  ctaLabel = "Apply Now",
  ctaUrl = "/apply-now",
  destinationName,
  intakeName,
  countrySlug,
}: HeroSectionProps) {
  const defaultTitle = `${intakeName} Intake - Study in ${destinationName}`;
  const defaultSubtitle = `Start your journey to study in ${destinationName} with the ${intakeName} intake. Get expert guidance on universities, courses, and visa process.`;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {media ? (
        media.endsWith(".mp4") || media.endsWith(".webm") ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={media} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={media}
            alt={title || defaultTitle}
            fill
            className="object-cover"
            priority
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-600" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {title || defaultTitle}
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          {subtitle || defaultSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="  text-white px-8 py-4 text-lg font-semibold min-h-[56px]"
          >
            <CountryAwareLink href={ctaUrl}>{ctaLabel}</CountryAwareLink>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
