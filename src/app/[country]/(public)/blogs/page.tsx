export { generateMetadata } from "@/app/(public)/blogs/page";
export { default } from "@/app/(public)/blogs/page";

// Route segment config - must be defined directly, cannot be re-exported
export const revalidate = 3600;
export const dynamicParams = true;
