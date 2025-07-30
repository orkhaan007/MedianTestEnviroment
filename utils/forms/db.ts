import { createClient } from "@/utils/supabase/server";
import { Form, FormReply, FormWithReplies, NewForm, NewFormReply, UpdateForm, UpdateFormReply } from "@/types/forms";

/**
 * Get all forms with pagination
 */
export async function getForms(page = 1, limit = 10) {
  const supabase = await createClient();
  
  const offset = (page - 1) * limit;
  
  const { data, error, count } = await supabase
    .from("forms")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error("Error fetching forms:", error);
    return { forms: [], count: 0 };
  }
  
  return { forms: data as Form[], count: count || 0 };
}

/**
 * Get a single form by ID with its replies
 */
export async function getFormById(id: string): Promise<FormWithReplies | null> {
  const supabase = await createClient();
  
  // Get the form
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();
    
  if (formError) {
    console.error("Error fetching form:", formError);
    return null;
  }
  
  // Get the replies for this form
  const { data: replies, error: repliesError } = await supabase
    .from("form_replies")
    .select("*")
    .eq("form_id", id)
    .order("created_at", { ascending: true });
    
  if (repliesError) {
    console.error("Error fetching form replies:", repliesError);
    return { ...form as Form, replies: [] };
  }
  
  return { ...form as Form, replies: replies as FormReply[] };
}

/**
 * Create a new form
 */
export async function createForm(formData: NewForm, userId: string, userFullName: string): Promise<Form | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("forms")
    .insert([
      {
        ...formData,
        user_id: userId,
        user_full_name: userFullName,
        is_solved: false,
        is_edited: false
      }
    ])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating form:", error);
    return null;
  }
  
  return data as Form;
}

/**
 * Update an existing form
 */
export async function updateForm(id: string, formData: UpdateForm): Promise<Form | null> {
  const supabase = await createClient();
  
  // If we're updating content, mark as edited
  const updateData = { 
    ...formData,
    ...(formData.content ? { is_edited: true } : {}),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from("forms")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating form:", error);
    return null;
  }
  
  return data as Form;
}

/**
 * Delete a form
 */
export async function deleteForm(id: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("forms")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting form:", error);
    return false;
  }
  
  return true;
}

/**
 * Create a new reply to a form
 */
export async function createFormReply(replyData: NewFormReply, userId: string, userFullName: string): Promise<FormReply | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("form_replies")
    .insert([
      {
        ...replyData,
        user_id: userId,
        user_full_name: userFullName,
        is_edited: false
      }
    ])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating form reply:", error);
    return null;
  }
  
  return data as FormReply;
}

/**
 * Update an existing reply
 */
export async function updateFormReply(id: string, replyData: UpdateFormReply): Promise<FormReply | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("form_replies")
    .update({
      ...replyData,
      is_edited: true,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating form reply:", error);
    return null;
  }
  
  return data as FormReply;
}

/**
 * Delete a reply
 */
export async function deleteFormReply(id: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("form_replies")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting form reply:", error);
    return false;
  }
  
  return true;
}

/**
 * Toggle the solved status of a form
 */
export async function toggleFormSolvedStatus(id: string, currentStatus: boolean): Promise<Form | null> {
  return updateForm(id, { is_solved: !currentStatus });
}

/**
 * Get the current user's profile
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  // Get the user's full name from metadata
  const fullName = user.user_metadata?.full_name || 
                  `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                  user.email?.split('@')[0] || 
                  'Anonymous User';
  
  return {
    id: user.id,
    email: user.email,
    fullName
  };
}
