"use client";

export async function generateSignature() {
  try {
    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate signature');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    throw error;
  }
}

export function getPublicIdFromUrl(url: string): string {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return '';
    
    const afterVersion = parts[1].replace(/^v\d+\//, '');
    
    return afterVersion.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return '';
  }
}
