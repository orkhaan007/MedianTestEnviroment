"use client";

import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";

interface ClientUploaderProps {
  userEmail: string;
  userId: string;
}

export default function ClientUploader({ userEmail, userId }: ClientUploaderProps) {
  const router = useRouter();
  
  const handleUploadComplete = () => {

    router.push("/media/gallery");
  };
  
  return (
    <MediaUploader 
      userEmail={userEmail} 
      userId={userId}
      onUploadComplete={handleUploadComplete}
    />
  );
}
