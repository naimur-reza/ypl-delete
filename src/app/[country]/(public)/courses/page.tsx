export { generateMetadata } from "@/app/(public)/courses/page";
export { default } from "@/app/(public)/courses/page";

// Route segment config - must be defined directly, cannot be re-exported
export const dynamic = "force-static";
export const revalidate = 3600;
