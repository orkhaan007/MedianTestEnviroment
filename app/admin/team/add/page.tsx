"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Search, Check, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  profile?: {
    bio?: string;
    personal_quote?: string;
    jersey_number?: string;
    social_twitter?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_linkedin?: string;
    social_github?: string;
  };
}

const roleOptions = ["BOSS", "OG", "BIG BROTHER", "BROTHER", "MEMBER"];

export default function AddTeamMemberPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    role: "MEMBER",
    jersey_number: ""
  });
  
  const router = useRouter();
  const supabase = createClient();

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
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
        
        // Get profiles data instead of using admin API
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*");
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        } else {
          // Format profiles data as users
          const formattedUsers = profilesData?.map((profile: any) => {
            return {
              id: profile.id,
              email: profile.email,
              created_at: profile.created_at,
              user_metadata: {
                full_name: profile.full_name,
                avatar_url: profile.avatar_url
              },
              profile
            };
          }) || [];
          
          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error in fetchUsers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [router, supabase]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.user_metadata?.full_name && 
         user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    
    // Set form data from selected user
    const setFormDataFromUser = (user: User) => {
      // We don't need to set anything from the user profile here
      // as we'll use their profile data directly when creating the team member
    };

    setFormDataFromUser(user);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create team member
      const { data, error } = await supabase
        .from("team_members")
        .insert([{
          user_id: selectedUser.id,
          name: selectedUser.user_metadata?.full_name || selectedUser.email.split("@")[0],
          role: formData.role,
          jersey_number: formData.jersey_number,
          image: selectedUser.user_metadata?.avatar_url || "/team/placeholder.svg"
        }])
        .select();
        
      if (error) {
        console.error("Error creating team member:", error);
        alert("Failed to create team member");
      } else {
        alert("Team member added successfully");
        router.push("/admin/team");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred while adding the team member");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/team" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Selection Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select User</h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li 
                    key={user.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center ${selectedUser?.id === user.id ? 'bg-green-50 border border-green-200' : ''}`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={user.user_metadata?.avatar_url || "/team/placeholder.svg"}
                        alt={user.user_metadata?.full_name || user.email}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email.split("@")[0]}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
        
        {/* Team Member Form */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Member Details</h2>
          
          {selectedUser ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={selectedUser.user_metadata?.avatar_url || "/team/placeholder.svg"}
                    alt={selectedUser.user_metadata?.full_name || selectedUser.email}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-lg text-gray-900">
                    {selectedUser.user_metadata?.full_name || selectedUser.email.split("@")[0]}
                  </div>
                  <div className="text-gray-500">{selectedUser.email}</div>
                </div>
              </div>
              
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
                        Bio, personal quote, and social media links will be automatically used from the user's profile. You don't need to enter them here.
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
                  {submitting ? "Adding..." : "Add Team Member"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <X className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg">Please select a user from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
