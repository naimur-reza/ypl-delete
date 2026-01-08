"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  // Clear both auth cookies
  cookieStore.delete("session");
  cookieStore.delete("auth-token");

  redirect("/login");
}
