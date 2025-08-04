"use server";

import { createClient } from "@/utils/supabase/server";
import { MediaData, MediaType } from "@/types/gallery";

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

/**
 * Admin function to get a single media item by ID
 * @param mediaId - ID of the media to fetch
 * @returns Promise<MediaData | null> - Media item or null if not found
 */
export async function getMediaByIdAdmin(mediaId: string): Promise<MediaData | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("id", mediaId)
    .single();

  if (error) {
    console.error("Error fetching media:", error);
    return null;
  }
  
  if (!data) return null;

  // Fetch user details
  const { data: userProfile, error: userError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", data.user_id)
    .single();
    
  if (userError) {
    console.error("Error fetching user profile:", userError);
  }

  // Process data to extract media_type from description
  const description = data.description || "";
  let mediaType = 'image';
  let cleanDescription = description;
  
  // Extract media type from description if it exists
  const typeMatch = description.match(/^\[TYPE:(image|youtube)\](.*)$/);
  if (typeMatch) {
    mediaType = typeMatch[1];
    cleanDescription = typeMatch[2];
  } else if (data.url?.includes('youtube.com/embed/')) {
    mediaType = 'youtube';
  }
  
  return {
    ...data,
    description: cleanDescription,
    media_type: mediaType as MediaType,
    user_details: userProfile || null
  } as MediaData;
}

/**
 * Admin function to update a media item
 * @param mediaId - ID of the media to update
 * @param updates - Object containing fields to update
 * @returns Promise<MediaData | null> - Updated media item or null if failed
 */
export async function updateMediaAdmin(
  mediaId: string, 
  updates: { title?: string; description?: string; media_type?: MediaType }
): Promise<MediaData | null> {
  const supabase = await createClient();
  
  // First get the existing media to preserve the media type
  const existingMedia = await getMediaByIdAdmin(mediaId);
  if (!existingMedia) {
    return null;
  }
  
  // Prepare the description with media type prefix
  let updatedDescription = updates.description || existingMedia.description || "";
  const mediaType = updates.media_type || existingMedia.media_type;
  
  // Add media type prefix to description
  updatedDescription = `[TYPE:${mediaType}]${updatedDescription}`;
  
  // Update the media item
  const { data, error } = await supabase
    .from("images")
    .update({
      title: updates.title !== undefined ? updates.title : existingMedia.title,
      description: updatedDescription
    })
    .eq("id", mediaId)
    .select()
    .single();

  if (error) {
    console.error("Error updating media:", error);
    return null;
  }
  
  // Return the updated media with processed fields
  return getMediaByIdAdmin(mediaId);
}
