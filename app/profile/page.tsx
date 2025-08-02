"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getCurrentUser } from "@/utils/gallery/db";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";
import { Instagram, Github } from "lucide-react";
import { FaTiktok, FaYoutube, FaSteam, FaTwitch } from "react-icons/fa";
import { SiKick } from "react-icons/si";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    social_instagram?: string;
    social_github?: string;
    social_tiktok?: string;
    social_youtube?: string;
    social_steam?: string;
    social_kick?: string;
    social_twitch?: string;
    banner_url?: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<any>(null);
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
        
        // Also fetch the user's profile from the profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUser(user as UserProfile);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, [router]);
  
  if (loading) {
    return <Loading />;
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
      case 'GitHub':
        return `https://github.com/${username}`;
      case 'YouTube':
        return `https://youtube.com/c/${username}`;
      case 'TikTok':
        return `https://tiktok.com/@${username}`;
      case 'Steam':
        return `https://steamcommunity.com/id/${username}`;
      case 'Kick':
        return `https://kick.com/${username}`;
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
            {/* Use profile.banner_url first, then fall back to user metadata */}
            {(profile?.banner_url || user?.user_metadata?.banner_url) ? (
              <img 
                src={profile?.banner_url || user?.user_metadata?.banner_url} 
                alt="Profile banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-[#1a2a6c] via-[#b21f1f] to-[#0ed632] h-full w-full animate-gradient-x">
                {/* Overlay with slight transparency for better text visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>
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
              
              {/* Social Media Links */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  Social Media
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Instagram */}
                  {user.user_metadata?.social_instagram && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-pink-50 p-2 rounded-full">
                        <Instagram className="h-5 w-5 text-pink-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Instagram</h3>
                        <a 
                          href={getSocialMediaUrl('Instagram', user.user_metadata.social_instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          @{user.user_metadata.social_instagram}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* GitHub */}
                  {user.user_metadata?.social_github && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-gray-200 p-2 rounded-full">
                        <Github className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">GitHub</h3>
                        <a 
                          href={getSocialMediaUrl('GitHub', user.user_metadata.social_github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          @{user.user_metadata.social_github}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* TikTok */}
                  {user.user_metadata?.social_tiktok && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-black p-2 rounded-full">
                        <FaTiktok className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">TikTok</h3>
                        <a 
                          href={getSocialMediaUrl('TikTok', user.user_metadata.social_tiktok)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          @{user.user_metadata.social_tiktok}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* YouTube */}
                  {user.user_metadata?.social_youtube && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-red-100 p-2 rounded-full">
                        <FaYoutube className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">YouTube</h3>
                        <a 
                          href={getSocialMediaUrl('YouTube', user.user_metadata.social_youtube)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          {user.user_metadata.social_youtube}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Steam */}
                  {user.user_metadata?.social_steam && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaSteam className="h-5 w-5 text-blue-800" />
                      </div>
                      <div>
                        <h3 className="font-medium">Steam</h3>
                        <a 
                          href={getSocialMediaUrl('Steam', user.user_metadata.social_steam)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          {user.user_metadata.social_steam}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Kick */}
                  {user.user_metadata?.social_kick && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-green-100 p-2 rounded-full">
                        <SiKick className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Kick</h3>
                        <a 
                          href={getSocialMediaUrl('Kick', user.user_metadata.social_kick)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          {user.user_metadata.social_kick}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Twitch */}
                  {user.user_metadata?.social_twitch && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FaTwitch className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Twitch</h3>
                        <a 
                          href={getSocialMediaUrl('Twitch', user.user_metadata.social_twitch)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0ed632] hover:underline text-sm"
                        >
                          {user.user_metadata.social_twitch}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Show message if no social media */}
                  {!user.user_metadata?.social_instagram && 
                   !user.user_metadata?.social_github && 
                   !user.user_metadata?.social_tiktok && 
                   !user.user_metadata?.social_youtube && 
                   !user.user_metadata?.social_steam && 
                   !user.user_metadata?.social_kick && 
                   !user.user_metadata?.social_twitch && (
                    <div className="col-span-2 text-center py-6 text-gray-500 italic">
                      No social media links provided
                    </div>
                  )}
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
