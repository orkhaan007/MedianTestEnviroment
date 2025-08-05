import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Check if the current user is an admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is in admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();
      
    if (adminError || !adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user email first for admin check
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user is an admin
    const { data: adminUserData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', userData.email)
      .single();
      
    if (adminUserData) {
      return NextResponse.json({ error: "Cannot delete admin users" }, { status: 403 });
    }
    
    // 1. Delete user's media
    const { error: mediaError } = await supabase
      .from('images')
      .delete()
      .eq('user_id', userId);
      
    if (mediaError) {
      console.error("Error deleting user's media:", mediaError);
    }
    
    // 2. Delete user from profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return NextResponse.json({ error: "Failed to delete user profile" }, { status: 500 });
    }
    
    // For auth.users deletion, we would need server-side admin privileges
    // In this implementation, we'll focus on removing the user from the visible tables
    // A complete implementation would use Supabase Edge Functions with service_role key
    // to delete from auth.users as well
    
    // For now, let's make sure we delete from all accessible tables
    try {
      // Delete from any other tables where this user might have data
      // For example, team_members if that exists
      const { error: teamError } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', userId);
        
      if (teamError) {
        console.error("Error removing user from team:", teamError);
      }
      
      // Delete any user comments if they exist
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('user_id', userId);
        
      if (commentsError) {
        console.error("Error deleting user comments:", commentsError);
      }
    } catch (error) {
      console.error("Error cleaning up user data:", error);
      // Continue anyway - we've deleted from profiles which is the main visible table
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", message: error.message },
      { status: 500 }
    );
  }
}
