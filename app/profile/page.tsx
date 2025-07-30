"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getCurrentUser } from "@/utils/gallery/db";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    social_url1?: string;
    social_name1?: string;
    social_url2?: string;
    social_name2?: string;
    banner_url?: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/sign-in");
          return;
        }
        
        setUser(user as UserProfile);
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, [router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">You need to sign in to view your profile</h1>
        <Link 
          href="/sign-in"
          className="px-4 py-2 bg-[#0ed632] text-white rounded hover:bg-[#0bc52d] transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getSocialMediaUrl = (platform: string, username: string): string => {
    if (!username) return '#';
    
    // If it's already a full URL, return it
    if (username.startsWith('http://') || username.startsWith('https://')) {
      return username;
    }
    
    // Otherwise, construct the URL based on the platform
    switch (platform) {
      case 'Instagram':
        return `https://instagram.com/${username}`;
      case 'Twitter':
        return `https://twitter.com/${username}`;
      case 'Facebook':
        return `https://facebook.com/${username}`;
      case 'LinkedIn':
        return `https://linkedin.com/in/${username}`;
      case 'GitHub':
        return `https://github.com/${username}`;
      case 'YouTube':
        return `https://youtube.com/@${username}`;
      case 'TikTok':
        return `https://tiktok.com/@${username}`;
      case 'Pinterest':
        return `https://pinterest.com/${username}`;
      case 'Reddit':
        return `https://reddit.com/user/${username}`;
      case 'Twitch':
        return `https://twitch.tv/${username}`;
      default:
        return `https://${username}`;
    }
  };
  
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner Image */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="h-64 bg-gray-100 relative overflow-hidden">
            {user.user_metadata?.banner_url ? (
              <img 
                src={user.user_metadata.banner_url} 
                alt="Profile banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-[#0ed632] h-full w-full animate-gradient-x"></div>
            )}
            
            {/* Profile Actions - Positioned on the banner */}
            <div className="absolute bottom-4 right-4 flex space-x-3">
              <Link
                href="/profile/settings"
                className="px-4 py-2 bg-white text-[#0ed632] font-medium rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Edit Profile
              </Link>
              <Link
                href="/media/my-uploads"
                className="px-4 py-2 bg-white text-gray-700 font-medium rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                My Uploads
              </Link>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="px-8 py-6 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || user.email} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400 font-bold">
                    {(user.user_metadata?.full_name?.[0] || user.email[0]).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-16">
              {/* User Name and Email */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.user_metadata?.full_name || 'User'}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              {/* Bio Section */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About
                </h2>
                <p className="text-gray-700">
                  {user.user_metadata?.bio ? user.user_metadata.bio : <span className="text-gray-400 italic">No bio provided</span>}
                </p>
              </div>
              
              {/* Contact & Social Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="text-gray-800">
                      {user.user_metadata?.location || <span className="text-gray-400 italic">Not specified</span>}
                    </p>
                  </div>
                </div>
                
                {/* Social Link 1 */}
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                    {user.user_metadata?.social_name1 ? (
                      <a 
                        href={getSocialMediaUrl(user.user_metadata.social_name1, user.user_metadata.social_url1 || '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0ed632] hover:underline inline-block"
                      >
                        {user.user_metadata.social_name1}
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">Not provided</p>
                    )}
                  </div>
                </div>
                
                {/* Social Link 2 */}
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                    {user.user_metadata?.social_name2 ? (
                      <a 
                        href={getSocialMediaUrl(user.user_metadata.social_name2, user.user_metadata.social_url2 || '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0ed632] hover:underline inline-block"
                      >
                        {user.user_metadata.social_name2}
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
