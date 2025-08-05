"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Search } from "lucide-react";
import Loading from "@/components/ui/Loading";
import AdminUserList from "@/components/admin/AdminUserList";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

export default function UsersManagementPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
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
      
      setAuthorized(true);
      
      // Get all users from profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }
      
      // Get all admin users
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from("admin_users")
        .select("email");
        
      if (adminUsersError) {
        console.error("Error fetching admin users:", adminUsersError);
        return;
      }
      
      const adminEmails = adminUsers?.map(admin => admin.email) || [];
      
      // Add admin status to users
      const usersWithAdminStatus = profilesData.map(user => ({
        ...user,
        is_admin: adminEmails.includes(user.email)
      }));
      
      setUsers(usersWithAdminStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  if (loading) {
    return <Loading />;
  }

  if (!authorized) {
    return null; // Will redirect in fetchUsers
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-[#0ed632]" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ed632] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
        
      <div className="mb-8 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 pb-4 border-b border-gray-200">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-green-800">{filteredUsers.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Admin Users</p>
            <p className="text-2xl font-bold text-green-800">
              {filteredUsers.filter(user => user.is_admin).length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Regular Users</p>
            <p className="text-2xl font-bold text-green-800">
              {filteredUsers.filter(user => !user.is_admin).length}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <AdminUserList users={filteredUsers} onUserDeleted={handleUserDeleted} />
      </div>
    </div>
  );
}
