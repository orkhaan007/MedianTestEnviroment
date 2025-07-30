import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/gallery/db";
import ClientUploader from "@/components/gallery/ClientUploader";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await getCurrentUser();
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/media/gallery" 
            className="text-green-600 hover:text-green-800 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Gallery
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Upload New Media</h1>
        
        <ClientUploader 
          userEmail={user.email || "unknown@example.com"} 
          userId={user.id}
        />
        
        <div className="mt-8 text-center text-gray-500">
          <p>Images and videos will be uploaded to our gallery and visible to all users.</p>
          <p>You can also add YouTube videos by pasting the video URL.</p>
          <p>Please ensure you have the rights to share any media you upload.</p>
        </div>
      </div>
    </Layout>
  );
}
