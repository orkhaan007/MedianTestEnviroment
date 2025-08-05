import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { 
      full_name, 
      age, 
      discord_nick, 
      discord_id, 
      steam_profile, 
      fivem_hours, 
      why_median,
      accept_warning_system,
      accept_ck_possibility,
      accept_hierarchy,
      southside_meaning
    } = body;
    
    // Validate required fields
    if (!full_name || !discord_nick || !discord_id || !steam_profile || !why_median || !southside_meaning) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }
    
    // Check if user already has a pending application
    const { data: existingApplication, error: checkError } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(1);
    
    if (checkError) {
      console.error("Error checking existing applications:", checkError);
      return NextResponse.json(
        { error: "Failed to check existing applications" },
        { status: 500 }
      );
    }
    
    if (existingApplication && existingApplication.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending application" },
        { status: 400 }
      );
    }
    
    // Insert new application
    const { data: newApplication, error: insertError } = await supabase
      .from("applications")
      .insert([
        {
          user_id: user.id,
          full_name,
          age: parseInt(age),
          discord_nick,
          discord_id,
          steam_profile,
          fivem_hours: parseInt(fivem_hours),
          why_median,
          accept_warning_system: !!accept_warning_system,
          accept_ck_possibility: !!accept_ck_possibility,
          accept_hierarchy: !!accept_hierarchy,
          southside_meaning,
          status: "pending"
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error("Error submitting application:", insertError);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      application: newApplication
    });
  } catch (error) {
    console.error("Error in application submission API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
