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
  image: string;
}

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  banner_id?: string;
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
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="relative h-80 md:h-full w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-3 ${
                      roleColors[member.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {member.role}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                  
                  {member.jersey_number && (
                    <p className="text-lg text-gray-600 mt-2">Jersey #: {member.jersey_number}</p>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    {profile?.banner_id && (
                      <div className="inline-block bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-700">
                        Banner ID: {profile.banner_id}
                      </div>
                    )}
                    
                    {profile?.member_since && (
                      <div className="inline-block bg-gray-50 px-3 py-1 rounded-md text-sm text-gray-600">
                        Member since: {new Date(profile.member_since).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {profile?.bio && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                {profile?.personal_quote && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Quote</h2>
                    <blockquote className="italic text-gray-700 border-l-4 border-[#0ed632] pl-4">
                      "{profile.personal_quote}"
                    </blockquote>
                  </div>
                )}

                <div className="flex space-x-4">
                  {profile?.social_tiktok && (
                    <a 
                      href={profile.social_tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#000000] transition-colors"
                    >
                      <FaTiktok className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_instagram && (
                    <a 
                      href={profile.social_instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#E1306C] transition-colors"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_youtube && (
                    <a 
                      href={profile.social_youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF0000] transition-colors"
                    >
                      <FaYoutube className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_github && (
                    <a 
                      href={profile.social_github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#333] transition-colors"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_steam && (
                    <a 
                      href={profile.social_steam} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#1b2838] transition-colors"
                    >
                      <FaSteam className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_kick && (
                    <a 
                      href={profile.social_kick} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#53fc18] transition-colors"
                    >
                      <SiKick className="h-6 w-6" />
                    </a>
                  )}
                  {profile?.social_twitch && (
                    <a 
                      href={profile.social_twitch} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#6441a5] transition-colors"
                    >
                      <FaTwitch className="h-6 w-6" />
                    </a>
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
