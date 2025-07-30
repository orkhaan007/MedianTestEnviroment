"use client";

import { useState, useEffect } from "react";
import { MediaData } from "@/types/gallery";
import MediaGallery from "./MediaGallery";
import { useRouter } from "next/navigation";

interface RefreshableGalleryProps {
  initialImages: MediaData[];
  currentUserId?: string;
}

export default function RefreshableGallery({ 
  initialImages, 
  currentUserId 
}: RefreshableGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaData[]>(initialImages);
  const router = useRouter();

  const handleMediaDeleted = () => {
    // Refresh the page to get updated media items
    router.refresh();
  };

  // Update media items when initialImages prop changes
  useEffect(() => {
    setMediaItems(initialImages);
  }, [initialImages]);

  return (
    <MediaGallery 
      mediaItems={mediaItems} 
      currentUserId={currentUserId}
      onMediaDeleted={handleMediaDeleted}
    />
  );
}
