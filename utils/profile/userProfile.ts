"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export interface UserProfileData {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  social_url1?: string;
  social_name1?: string;
  social_url2?: string;
  social_name2?: string;
  banner_url?: string;
}

/**
 * Get the current user profile data
 * @returns User profile data or null if not authenticated
 */
export async function getUserProfile() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error("Error getting user profile:", error);
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    user_metadata: user.user_metadata || {}
  };
}

/**
 * Update the user profile data in Supabase
 * @param profileData User profile data to update
 * @returns Success status and message
 */
export async function updateUserProfile(profileData: UserProfileData) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.updateUser({
      data: profileData
    });
    
    if (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        message: error.message || "Failed to update profile"
      };
    }
    
    return {
      success: true,
      message: "Profile updated successfully",
      user: data.user
    };
  } catch (error: any) {
    console.error("Exception updating user profile:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
}

/**
 * Change user password
 * @param currentPassword Current password for verification
 * @param newPassword New password to set
 * @returns Success status and message
 */
export async function changeUserPassword(currentPassword: string, newPassword: string) {
  try {
    const supabase = await createClient();
    
    // First verify the current password by attempting to sign in
    const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !currentUser?.email) {
      return {
        success: false,
        message: "Authentication error. Please sign in again."
      };
    }
    
    // Attempt to sign in with current password to verify it
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword
    });
    
    if (signInError) {
      return {
        success: false,
        message: "Current password is incorrect"
      };
    }
    
    // Update to the new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      return {
        success: false,
        message: error.message || "Failed to update password"
      };
    }
    
    return {
      success: true,
      message: "Password updated successfully"
    };
  } catch (error: any) {
    console.error("Exception changing user password:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
}
