"use server";

import { createClient } from "@/utils/supabase/server";
import { MediaData } from "@/types/gallery";

/**
 * Admin function to delete any media regardless of ownership
 * @param mediaId - ID of the media to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export async function deleteMediaAdmin(mediaId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("images")
    .delete()
    .eq("id", mediaId);

  if (error) {
    console.error("Error deleting media:", error);
    throw new Error(`Failed to delete media: ${error.message}`);
  }

  return true;
}

/**
 * Admin function to get all media with additional metadata
 * @returns Promise<MediaData[]> - Array of all media items
 */
export async function getAllMediaAdmin(): Promise<MediaData[]> {
  const supabase = await createClient();
  
  // Fetch all media without trying to join with profiles
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media:", error);
    throw new Error(`Failed to fetch media: ${error.message}`);
  }
  
  // Fetch user details separately if needed
  const userIds = Array.from(new Set(data.map(item => item.user_id)));
  const { data: userProfiles, error: userError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);
    
  if (userError) {
    console.error("Error fetching user profiles:", userError);
  }
  
  // Create a map of user profiles for easy lookup
  const userProfileMap: Record<string, any> = {};
  if (userProfiles) {
    userProfiles.forEach(profile => {
      userProfileMap[profile.id] = profile;
    });
  }

  // Process data to extract media_type from description
  return data.map(item => {
    const description = item.description || "";
    let mediaType = 'image';
    let cleanDescription = description;
    
    // Extract media type from description if it exists
    const typeMatch = description.match(/^\[TYPE:(image|youtube)\](.*)$/);
    if (typeMatch) {
      mediaType = typeMatch[1];
      cleanDescription = typeMatch[2];
    } else if (item.url?.includes('youtube.com/embed/')) {
      mediaType = 'youtube';
    }
    
    return {
      ...item,
      description: cleanDescription,
      media_type: mediaType,
      user_details: userProfileMap[item.user_id] || null
    };
  }) as MediaData[];
}
