"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  quote: string;
  image: string;
  social_twitter?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_github?: string;
  created_at?: string;
  updated_at?: string;
}

// Get all team members from the database
export async function getAllTeamMembers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching team members:", error);
    throw new Error(`Failed to fetch team members: ${error.message}`);
  }

  return data as TeamMember[];
}

// Get a team member by ID
export async function getTeamMemberById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching team member:", error);
    return null;
  }

  return data as TeamMember;
}

// Create a new team member
export async function createTeamMember(teamMember: Omit<TeamMember, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("team_members")
    .insert([teamMember])
    .select();

  if (error) {
    console.error("Error creating team member:", error);
    throw new Error(`Failed to create team member: ${error.message}`);
  }

  revalidatePath('/team');
  revalidatePath('/admin/team');
  
  return data[0] as TeamMember;
}

// Update a team member
export async function updateTeamMember(id: string, teamMember: Partial<TeamMember>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("team_members")
    .update(teamMember)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating team member:", error);
    throw new Error(`Failed to update team member: ${error.message}`);
  }

  revalidatePath('/team');
  revalidatePath(`/team/${id}`);
  revalidatePath('/admin/team');
  
  return data[0] as TeamMember;
}

// Delete a team member
export async function deleteTeamMember(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    throw new Error(`Failed to delete team member: ${error.message}`);
  }

  revalidatePath('/team');
  revalidatePath('/admin/team');
  
  return true;
}

// Get all users from the auth.users table
export async function getAllUsers() {
  const supabase = await createClient();
  
  // First get the authenticated user to check if they're an admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  // Check if user is in the allowed admin emails list
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email)
    .single();
    
  if (adminError || !adminData) {
    throw new Error("Not authorized to access user data");
  }
  
  // If we get here, the user is authorized to see all users
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data;
}

// Check if the current user is an admin
export async function isAdmin() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Check if user is in the allowed admin emails list
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
