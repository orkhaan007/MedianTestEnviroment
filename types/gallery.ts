export type MediaType = 'image' | 'youtube';

export interface MediaData {
  id: string;
  url: string;
  title?: string;
  description?: string;
  user_email: string;
  user_id: string;
  created_at: string;
  media_type: MediaType;
  user_details?: any; // For admin view with user profile details
  profiles?: any; // Raw join data from Supabase
}

export interface ImageData extends MediaData {}