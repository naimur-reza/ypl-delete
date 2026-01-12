export { default } from "@/app/(public)/scholarships/page";
export { generateMetadata } from "@/app/(public)/scholarships/page";

// Route segment config - must be defined directly, cannot be re-exported
export const dynamic = "force-static";
export const revalidate = 3600;
