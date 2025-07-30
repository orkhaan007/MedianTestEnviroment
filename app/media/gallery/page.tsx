"use client";

import { useState, useEffect } from "react";
import { getAllMedia, getCurrentUser } from "@/utils/gallery/db";
import Layout from "@/components/layout/Layout";
import MediaTabs from "@/components/gallery/MediaTabs";

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Use useEffect to fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMedia = await getAllMedia();
        const currentUser = await getCurrentUser();
        setMediaItems(fetchedMedia);
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter media by type
  const images = mediaItems.filter(item => item.media_type === "image");
  const videos = mediaItems.filter(item => item.media_type === "youtube");
  
  return (
    <Layout>
      <MediaTabs
        images={images}
        videos={videos}
        currentUser={user}
        pageTitle="Media Gallery"
        isMyUploads={false}
      />
    </Layout>
  );
}