"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  image: string;
  social_instagram?: string;
  social_github?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_steam?: string;
  social_kick?: string;
  social_twitch?: string;
}

const roleOptions = ["boss", "og", "big brother", "brother", "member"];

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    description: "",
    bio: "",
    social_instagram: "",
    social_github: "",
    social_tiktok: "",
    social_youtube: "",
    social_steam: "",
    social_kick: "",
    social_twitch: "",
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
        
        // Fetch team member
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", params.id)
          .single();
          
        if (error) {
          console.error("Error fetching team member:", error);
          alert("Team member not found");
          router.push("/admin/team");
          return;
        }
        
        setTeamMember(data);
        
        // Set form data
        setFormData({
          role: data.role || "member",
          name: data.name || "",
          description: data.description || "",
          bio: data.bio || "",
          social_instagram: data.social_instagram || "",
          social_github: data.social_github || "",
          social_tiktok: data.social_tiktok || "",
          social_youtube: data.social_youtube || "",
          social_steam: data.social_steam || "",
          social_kick: data.social_kick || "",
          social_twitch: data.social_twitch || "",
        });
      } catch (error) {
        console.error("Error in fetchTeamMember:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMember();
  }, [params.id, router, supabase]);

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
      // Update team member
      const { data, error } = await supabase
        .from("team_members")
        .update({
          role: formData.role,
          name: formData.name,
          description: formData.description,
          bio: formData.bio,
          social_instagram: formData.social_instagram,
          social_github: formData.social_github,
          social_tiktok: formData.social_tiktok,
          social_youtube: formData.social_youtube,
          social_steam: formData.social_steam,
          social_kick: formData.social_kick,
          social_twitch: formData.social_twitch,
        })
        .eq("id", params.id)
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
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
            <Image
              src={teamMember.image || "/team/placeholder.svg"}
              alt={teamMember.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-lg text-gray-900">
              {teamMember.name}
            </div>
            <div className="text-gray-500">User ID: {teamMember.user_id}</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                required
              />
            </div>
            
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g. Lead Developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                required
              />
            </div>
            

          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
              required
            ></textarea>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="social_tiktok" className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  id="social_tiktok"
                  name="social_tiktok"
                  value={formData.social_tiktok}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="social_instagram"
                  name="social_instagram"
                  value={formData.social_instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_youtube" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  id="social_youtube"
                  name="social_youtube"
                  value={formData.social_youtube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/c/channel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_github" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  id="social_github"
                  name="social_github"
                  value={formData.social_github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_steam" className="block text-sm font-medium text-gray-700 mb-1">
                  Steam
                </label>
                <input
                  type="url"
                  id="social_steam"
                  name="social_steam"
                  value={formData.social_steam}
                  onChange={handleInputChange}
                  placeholder="https://steamcommunity.com/id/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_kick" className="block text-sm font-medium text-gray-700 mb-1">
                  Kick
                </label>
                <input
                  type="url"
                  id="social_kick"
                  name="social_kick"
                  value={formData.social_kick}
                  onChange={handleInputChange}
                  placeholder="https://kick.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="social_twitch" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitch
                </label>
                <input
                  type="url"
                  id="social_twitch"
                  name="social_twitch"
                  value={formData.social_twitch}
                  onChange={handleInputChange}
                  placeholder="https://twitch.tv/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
                />
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
              {submitting ? "Updating..." : "Update Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
