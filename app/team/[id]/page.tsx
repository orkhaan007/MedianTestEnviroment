"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Instagram, Github } from "lucide-react";
import { FaTiktok, FaYoutube, FaSteam, FaTwitch } from "react-icons/fa";
import { SiKick } from "react-icons/si";
import { useParams, useRouter } from "next/navigation";
import { roleColors } from "@/utils/team/data";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  jersey_number?: string;
  image?: string;
}

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  banner_url?: string;
  bio?: string;
  personal_quote?: string;
  social_instagram?: string;
  social_github?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_steam?: string;
  social_kick?: string;
  social_twitch?: string;
  member_since?: string;
}

export default function TeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTeamMember() {
      try {
        if (!params.id) return;
        
        // Fetch team member data
        const { data: memberData, error: memberError } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", params.id)
          .single();
          
        if (memberError || !memberData) {
          console.error("Error fetching team member:", memberError);
          setLoading(false);
          return;
        }
        
        setMember(memberData);
        
        // If the member has a user_id, fetch their profile data
        if (memberData.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", memberData.user_id)
            .single();
            
          if (!profileError && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error in fetchTeamMember:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMember();
  }, [params.id, supabase]);

  if (loading) {
    return <Loading />;
  }

  if (!member) {
    return (
      <>
        <Header />
        <div className="bg-white min-h-screen">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
            <Link 
              href="/team" 
              className="inline-flex items-center px-6 py-3 bg-[#0ed632] text-white font-medium rounded-lg hover:bg-[#0bc02c] transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Team
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Link 
            href="/team" 
            className="inline-flex items-center text-gray-600 hover:text-[#0ed632] mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Team
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Banner Section */}
            <div className="h-96 bg-gray-100 relative overflow-hidden">
              {profile?.banner_url ? (
                <img 
                  src={profile.banner_url} 
                  alt="Team member banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gradient-to-r from-[#1a2a6c] via-[#b21f1f] to-[#0ed632] h-full w-full animate-gradient-x">
                  {/* Overlay with slight transparency for better text visibility */}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
              )}
              
              {/* Team member name and role overlay on banner */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center">
                  {/* Profile image/avatar */}
                  <div className="mr-4 h-20 w-20 rounded-full border-2 border-white overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center shadow-lg">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-gray-600 font-bold">
                        {member.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Name and role */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          roleColors[member.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.role}
                      </span>
                      {member.jersey_number && (
                        <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                          #{member.jersey_number}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-white">{member.name}</h1>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Member since info */}
              {profile?.member_since && (
                <div className="mb-6 inline-block bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm">
                  <span className="font-medium">Member since:</span> {new Date(profile.member_since).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              
              {/* Bio Section */}
              {profile?.bio && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Quote Section */}
              {profile?.personal_quote && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Quote
                  </h2>
                  <blockquote className="italic text-gray-700 border-l-4 border-[#0ed632] pl-4 py-2">
                    "{profile.personal_quote}"
                  </blockquote>
                </div>
              )}

              {/* Social Media Section */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  Connect
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile?.social_tiktok && (
                    <a 
                      href={profile.social_tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-black p-2 rounded-full group-hover:scale-110 transition-transform">
                        <FaTiktok className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-700 group-hover:text-black">TikTok</span>
                    </a>
                  )}
                  {profile?.social_instagram && (
                    <a 
                      href={profile.social_instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-pink-50 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <Instagram className="h-5 w-5 text-pink-500" />
                      </div>
                      <span className="text-gray-700 group-hover:text-pink-500">Instagram</span>
                    </a>
                  )}
                  {profile?.social_youtube && (
                    <a 
                      href={profile.social_youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-red-100 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <FaYoutube className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-red-600">YouTube</span>
                    </a>
                  )}
                  {profile?.social_github && (
                    <a 
                      href={profile.social_github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-gray-200 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <Github className="h-5 w-5 text-gray-700" />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900">GitHub</span>
                    </a>
                  )}
                  {profile?.social_steam && (
                    <a 
                      href={profile.social_steam} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-blue-100 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <FaSteam className="h-5 w-5 text-blue-800" />
                      </div>
                      <span className="text-gray-700 group-hover:text-blue-800">Steam</span>
                    </a>
                  )}
                  {profile?.social_kick && (
                    <a 
                      href={profile.social_kick} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-green-100 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <SiKick className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 group-hover:text-green-600">Kick</span>
                    </a>
                  )}
                  {profile?.social_twitch && (
                    <a 
                      href={profile.social_twitch} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="bg-purple-100 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <FaTwitch className="h-5 w-5 text-purple-700" />
                      </div>
                      <span className="text-gray-700 group-hover:text-purple-700">Twitch</span>
                    </a>
                  )}
                  
                  {/* Show message if no social media */}
                  {!profile?.social_instagram && 
                   !profile?.social_github && 
                   !profile?.social_tiktok && 
                   !profile?.social_youtube && 
                   !profile?.social_steam && 
                   !profile?.social_kick && 
                   !profile?.social_twitch && (
                    <div className="col-span-full text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg">
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
