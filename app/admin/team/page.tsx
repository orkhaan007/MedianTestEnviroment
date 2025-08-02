"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Edit, Trash2, Plus, ArrowLeft, Search } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  personal_quote?: string;
  banner_id?: string;
  member_since?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_github?: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  jersey_number?: string;
  image?: string;
  created_at: string;
  profile?: Profile;
}

// Define our own User interface that's compatible with Supabase Auth User type
interface User {
  id: string;
  email: string | undefined;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
}

export default function TeamManagementPage() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Fetch team members and users
  useEffect(() => {
    async function fetchData() {
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
        
        // Fetch team members
        const { data: teamData, error: teamError } = await supabase
          .from("team_members")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (teamError) {
          console.error("Error fetching team members:", teamError);
        } else {
          setTeamMembers(teamData || []);
        }
        
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*");
          
        if (userError) {
          console.error("Error fetching users:", userError);
        } else {
          // Get user details from auth.users
          try {
            // This approach doesn't work with the client SDK, we need to use a different approach
            // Instead, let's use the auth.getUser() method for the current user
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            
            // For a real admin panel, you'd need a server-side API endpoint with admin privileges
            // to list all users. For now, we'll just use the profiles table.
            const { data: profileUsers, error: profileError } = await supabase
              .from('profiles')
              .select('*');
              
            if (profileError) {
              console.error("Error fetching profiles:", profileError);
            } else {
              // Convert profile data to our User interface
              const formattedUsers: User[] = profileUsers.map(profile => ({
                id: profile.id,
                email: profile.email,
                user_metadata: {
                  full_name: profile.full_name,
                  avatar_url: profile.avatar_url
                },
                created_at: profile.created_at
              }));
              
              setUsers(formattedUsers);
            }
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, supabase]);

  // Filter team members based on search term
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.jersey_number && member.jersey_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Delete team member
  const deleteTeamMember = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        const { error } = await supabase
          .from("team_members")
          .delete()
          .eq("id", id);
          
        if (error) {
          console.error("Error deleting team member:", error);
          alert("Failed to delete team member");
        } else {
          // Update local state
          setTeamMembers(prev => prev.filter(member => member.id !== id));
          alert("Team member deleted successfully");
        }
      } catch (error) {
        console.error("Error in deleteTeamMember:", error);
        alert("An error occurred while deleting the team member");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Link 
          href="/admin/team/add"
          className="flex items-center justify-center px-4 py-2 bg-[#0ed632] text-white rounded-md hover:bg-[#0bc02c] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Team Member
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jersey Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeamMembers.length > 0 ? (
                filteredTeamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            <div className="text-xl text-white font-bold">
                              {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {member.jersey_number ? (
                        <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                          #{member.jersey_number}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/team/edit/${member.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => deleteTeamMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? "No team members found matching your search." : "No team members found. Add your first team member!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
