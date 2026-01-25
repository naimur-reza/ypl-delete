"use server";

import { redirect } from "next/navigation";
import { createIntakePage, updateIntakePage, deleteIntakePage } from "@/lib/intake-actions-logic";

export async function handleCreateIntakeAction(data: any) {
  try {
    await createIntakePage(data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create intake");
  }

  redirect("/dashboard/intake-management?tab=details");
}

export async function handleUpdateIntakeAction(id: string, data: any) {
  try {
    await updateIntakePage(id, data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update intake");
  }

  redirect("/dashboard/intake-management?tab=details");
}

export async function handleDeleteIntakeAction(id: string) {
  try {
    await deleteIntakePage(id);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete intake");
  }

  redirect("/dashboard/intake-management?tab=details");
}
