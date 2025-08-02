"use client";

import { useState, useEffect } from "react";
import { roleColors } from "@/utils/team/data";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  personal_quote?: string;
  banner_id?: string;
  banner_url?: string;
  member_since?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_github?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_steam?: string;
  social_kick?: string;
  social_twitch?: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  jersey_number?: string;
  image: string;
  created_at: string;
  profile?: Profile;
}

export default function TeamPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch team members from database with profiles
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        // First get all team members
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (membersError) {
          console.error("Error fetching team members:", membersError);
          setLoading(false);
          return;
        }
        
        // For each team member with a user_id, fetch their profile
        const membersWithProfiles = await Promise.all(
          (membersData || []).map(async (member) => {
            if (member.user_id) {
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", member.user_id)
                .single();
                
              if (!profileError && profileData) {
                return { ...member, profile: profileData };
              }
            }
            return member;
          })
        );
        
        setTeamMembers(membersWithProfiles || []);
      } catch (error) {
        console.error("Error in fetchTeamMembers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, [supabase]);

  // Get unique roles
  const roles = Array.from(new Set(teamMembers.map((member) => member.role)));

  // Filter team members based on selected role
  const filteredMembers = selectedRole
    ? teamMembers.filter((member) => member.role === selectedRole)
    : teamMembers;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Team
            </h1>
          </div>
        
          {/* Role filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedRole(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRole === null
                  ? "bg-[#0ed632] text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRole === role
                    ? "bg-[#0ed632] text-white"
                    : `${roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"} hover:bg-opacity-80`
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Team members grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No team members found. {selectedRole ? `Try selecting a different role or view all team members.` : ''}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}