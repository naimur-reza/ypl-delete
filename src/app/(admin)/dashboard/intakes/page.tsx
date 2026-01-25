import { redirect } from "next/navigation";

export default function IntakesRedirect() {
  redirect("/dashboard/intake-management?tab=details");
}
