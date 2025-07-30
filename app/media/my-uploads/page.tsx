"use client";

import { useState, useEffect } from "react";
import { getMediaByUser as getUserMedia, getCurrentUser } from "@/utils/gallery/db";
import Layout from "@/components/layout/Layout";
import MediaTabs from "@/components/gallery/MediaTabs";
import { redirect } from "next/navigation";

export default function MyUploadsPage() {
  const [user, setUser] = useState<any>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          redirect("/sign-in");
          return;
        }
        
        setUser(currentUser);
        
        const userMedia = await getUserMedia(currentUser.id);
        setMediaItems(userMedia);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  // Filter media by type
  const images = mediaItems.filter(item => item.media_type === "image");
  const videos = mediaItems.filter(item => item.media_type === "youtube");
  
  return (
    <Layout>
      <MediaTabs
        images={images}
        videos={videos}
        currentUser={user}
        pageTitle="My Uploads"
        isMyUploads={true}
      />
    </Layout>
  );
}
