import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from '@supabase/supabase-js';

// Delete a user by ID (admin only)
export async function deleteUserAdmin(userId: string) {
  const supabase = await createClient();
  
  try {
    // First get the user to check if they're an admin
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user:", userError);
      throw new Error(`Failed to fetch user: ${userError.message}`);
    }
    
    // Check if user is an admin in admin_users table
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', userData.email)
      .single();
      
    if (adminData) {
      throw new Error('Cannot delete admin users');
    }
    
    // Delete user's media
    const { error: mediaError } = await supabase
      .from('images')
      .delete()
      .eq('user_id', userId);
      
    if (mediaError) {
      console.error("Error deleting user's media:", mediaError);
    }
    
    // Delete user from admin_users if they exist there
    await supabase
      .from('admin_users')
      .delete()
      .eq('email', userData.email);
    
    // Delete user from profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      throw new Error(`Failed to delete user profile: ${profileError.message}`);
    }
    
    // Note: Deleting from auth.users requires server-side admin API access
    // For this implementation, we'll just delete from profiles
    // In a production environment, you would use Supabase Functions or
    // server-side admin API to delete the user from auth.users
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteUserAdmin:", error);
    throw error;
  }
}

// Get all users with admin status
export async function getAllUsers() {
  const supabase = await createClient();
  
  // Get all users from profiles
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (usersError) {
    console.error("Error fetching users:", usersError);
    throw new Error(`Failed to fetch users: ${usersError.message}`);
  }
  
  // Get all admin users
  const { data: adminUsers, error: adminError } = await supabase
    .from('admin_users')
    .select('email');
    
  if (adminError) {
    console.error("Error fetching admin users:", adminError);
    throw new Error(`Failed to fetch admin users: ${adminError.message}`);
  }
  
  const adminEmails = adminUsers?.map((admin: { email: string }) => admin.email) || [];
  
  // Add admin status to users
  const processedUsers = users.map((user: any) => ({
    ...user,
    is_admin: adminEmails.includes(user.email)
  }));
  
  return processedUsers;
}

// Check if a user is an admin
export async function checkUserIsAdmin(email: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error) {
    return false;
  }
  
  return !!data;
}
