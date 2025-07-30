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
}

export interface ImageData extends MediaData {}