/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param url YouTube URL
 * @returns YouTube video ID or null if not found
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Get YouTube thumbnail URL from video ID
 * @param videoId YouTube video ID
 * @returns YouTube thumbnail URL
 */
export const getYoutubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Convert YouTube video URL to embed URL
 * @param url YouTube video URL
 * @returns YouTube embed URL
 */
export const getYoutubeEmbedUrl = (url: string): string | null => {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Check if a URL is a valid YouTube URL
 * @param url URL to check
 * @returns true if URL is a valid YouTube URL
 */
export const isYoutubeUrl = (url: string): boolean => {
  return !!extractYoutubeVideoId(url);
};
