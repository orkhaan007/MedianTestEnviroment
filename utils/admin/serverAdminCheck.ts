"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server-side utility to check if the current user is an admin
 * Redirects to home page if not an admin
 * @returns Promise<boolean> - True if the user is an admin
 */
export async function checkAdminServerSide(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if the user exists in the admin_users table
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email)
    .single();

  const isAdmin = !!adminUser && !error;
  
  if (!isAdmin) {
    redirect("/");
  }
  
  return true;
}
