import { redirect } from "next/navigation";

export default function IntakeSeasonsRedirect() {
  redirect("/dashboard/intake-management?tab=seasons");
}
