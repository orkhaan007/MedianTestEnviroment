"use server";

import { createClient } from "@/utils/supabase/server";
import { ImageData, MediaData, MediaType } from "@/types/gallery";

export async function createMedia(mediaData: Omit<MediaData, "id" | "created_at">) {
  const supabase = await createClient();
  
  // Store media_type in description field with a special prefix
  // Format: [TYPE:image|video|youtube]Description text
  let enhancedDescription = mediaData.description || "";
  if (mediaData.media_type) {
    enhancedDescription = `[TYPE:${mediaData.media_type}]${enhancedDescription}`;
  }
  
  const { data, error } = await supabase
    .from("images")
    .insert([
      {
        url: mediaData.url,
        title: mediaData.title || null,
        description: enhancedDescription,
        user_email: mediaData.user_email,
        user_id: mediaData.user_id,
        // media_type column doesn't exist in the database
      },
    ])
    .select();

  if (error) {
    console.error("Error creating media:", error);
    throw new Error(`Failed to create media: ${error.message}`);
  }

  // Add media_type to the returned data
  const returnData = data?.[0] as any;
  if (returnData) {
    returnData.media_type = mediaData.media_type || 'image';
  }

  return returnData as MediaData;
}

// For backward compatibility
export async function createImage(imageData: Omit<ImageData, "id" | "created_at">) {
  return createMedia({
    ...imageData,
    media_type: imageData.media_type || 'image'
  });
}

export async function getAllMedia(): Promise<MediaData[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media:", error);
    throw new Error(`Failed to fetch media: ${error.message}`);
  }

  // Process data to extract media_type from description
  return data.map(item => {
    const description = item.description || "";
    let mediaType: MediaType = 'image';
    let cleanDescription = description;
    
    // Extract media type from description if it exists
    const typeMatch = description.match(/^\[TYPE:(image|youtube)\](.*)$/);
    if (typeMatch) {
      mediaType = typeMatch[1] as MediaType;
      cleanDescription = typeMatch[2];
    } else if (item.url?.includes('youtube.com/embed/')) {
      mediaType = 'youtube';
    }
    
    return {
      ...item,
      description: cleanDescription,
      media_type: mediaType
    };
  }) as MediaData[];
}

// For backward compatibility
export async function getAllImages(): Promise<ImageData[]> {
  return getAllMedia();
}

export async function getMediaByUser(userId: string): Promise<MediaData[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user media:", error);
    throw new Error(`Failed to fetch user media: ${error.message}`);
  }

  // Process data to extract media_type from description
  return data.map(item => {
    const description = item.description || "";
    let mediaType: MediaType = 'image';
    let cleanDescription = description;
    
    // Extract media type from description if it exists
    const typeMatch = description.match(/^\[TYPE:(image|youtube)\](.*)$/);
    if (typeMatch) {
      mediaType = typeMatch[1] as MediaType;
      cleanDescription = typeMatch[2];
    } else if (item.url?.includes('youtube.com/embed/')) {
      mediaType = 'youtube';
    }
    
    return {
      ...item,
      description: cleanDescription,
      media_type: mediaType
    };
  }) as MediaData[];
}

// For backward compatibility
export async function getImagesByUser(userId: string): Promise<ImageData[]> {
  return getMediaByUser(userId);
}

export async function deleteMedia(mediaId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: mediaData } = await supabase
    .from("images")
    .select("user_id")
    .eq("id", mediaId)
    .single();

  if (!mediaData || mediaData.user_id !== userId) {
    throw new Error("Unauthorized to delete this media");
  }

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

// For backward compatibility
export async function deleteImage(imageId: string, userId: string): Promise<boolean> {
  return deleteMedia(imageId, userId);
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
