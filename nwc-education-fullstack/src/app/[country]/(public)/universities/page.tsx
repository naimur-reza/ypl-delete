export { default } from "@/app/(public)/universities/page";
export { metadata } from "@/app/(public)/universities/page";

// Route segment config - must be defined directly, cannot be re-exported
export const dynamic = "force-static";
export const revalidate = 3600;
