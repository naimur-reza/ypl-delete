export { generateMetadata } from "@/app/(public)/blogs/page";
export { default } from "@/app/(public)/blogs/page";

// Route segment config - must be defined directly, cannot be re-exported
export const revalidate = 300;
export const dynamicParams = true;
