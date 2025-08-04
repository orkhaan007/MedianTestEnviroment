"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/ui/Loading";
import { useParams } from "next/navigation";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
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

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  description?: string;
  bio?: string;
  image?: string;
  jersey_number?: string;
  social_instagram?: string;
  social_github?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_steam?: string;
  social_kick?: string;
  social_twitch?: string;
  email?: string;
  profile?: Profile;
}

const roleOptions = ["BOSS", "OG", "BIG BROTHER", "BROTHER", "MEMBER"];

export default function EditTeamMemberPage() {

  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    jersey_number: "",
    email: ""
  });
  
  const router = useRouter();
  const supabase = createClient();

  // Fetch team member data
  useEffect(() => {
    async function fetchTeamMember() {
      try {
        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/");
          return;
        }
        
        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (adminError || !adminData) {
          router.push("/");
          return;
        }
        

        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
          console.error("Error fetching team member:", error);
          alert("Team member not found");
          router.push("/admin/team");
          return;
        }
        
        setTeamMember(data);
        
        // Get complete profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user_id)
          .single();
          
        // Add profile data to team member
        if (profileData) {
          setTeamMember(prev => prev ? { ...prev, profile: profileData } : null);
        }
        
        // Set form data
        setFormData({
          role: data.role || "member",
          name: data.name || "",
          jersey_number: data.jersey_number || "",
          email: profileData?.email || ""
        });
      } catch (error) {
        console.error("Error in fetchTeamMember:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMember();
  }, [id, router, supabase]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamMember) {
      alert("Team member not found");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Update role and jersey number of the team member
      const { data, error } = await supabase
        .from("team_members")
        .update({
          role: formData.role,
          jersey_number: formData.jersey_number
        })
        .eq("id", id)
        .select();
        
      if (error) {
        console.error("Error updating team member:", error);
        alert("Failed to update team member");
      } else {
        alert("Team member updated successfully");
        router.push("/admin/team");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred while updating the team member");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Team member not found</h1>
        <Link 
          href="/admin/team"
          className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
        >
          Back to Team Management
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/team" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Team Member Info Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Member Info</h2>
          
          <div className="flex items-center">
            <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4">
              {teamMember.profile?.avatar_url ? (
                <Image
                  src={teamMember.profile.avatar_url}
                  alt={teamMember.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-green-600 via-[#0ed632] to-green-400">
                  <div className="text-xl text-white font-bold">
                    {teamMember.name ? teamMember.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-xl text-gray-900">
                {teamMember.name}
              </div>
              <div className="text-gray-500">{formData.email}</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Current Role</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{teamMember.role}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Jersey Number</div>
                <div className="mt-1 text-lg font-medium text-gray-900">{teamMember.jersey_number || 'Not assigned'}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Role Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Team Member</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="jersey_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Jersey Number
                </label>
                <input
                  type="text"
                  id="jersey_number"
                  name="jersey_number"
                  value={formData.jersey_number}
                  onChange={handleInputChange}
                  placeholder="e.g. 23"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Only the role and jersey number can be edited. Other information must be updated by the user in their profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/team"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}