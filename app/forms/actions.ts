"use server";

import { revalidatePath } from "next/cache";
import { 
  createForm, 
  createFormReply, 
  deleteForm, 
  deleteFormReply, 
  getCurrentUser, 
  toggleFormSolvedStatus, 
  updateForm, 
  updateFormReply 
} from "@/utils/forms/db";
import { NewForm, NewFormReply, UpdateForm, UpdateFormReply } from "@/types/forms";
import { redirect } from "next/navigation";

/**
 * Create a new form
 */
export async function createFormAction(formData: NewForm) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to create a form" };
  }
  
  try {
    const form = await createForm(formData, user.id, user.fullName);
    
    if (!form) {
      return { error: "Failed to create form" };
    }
    
    revalidatePath("/forms");
    return { success: true, formId: form.id };
  } catch (error) {
    console.error("Error creating form:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update an existing form
 */
export async function updateFormAction(id: string, formData: UpdateForm) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to update a form" };
  }
  
  try {
    const form = await updateForm(id, formData);
    
    if (!form) {
      return { error: "Failed to update form" };
    }
    
    revalidatePath(`/forms/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating form:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete a form
 */
export async function deleteFormAction(id: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to delete a form" };
  }
  
  try {
    const success = await deleteForm(id);
    
    if (!success) {
      return { error: "Failed to delete form" };
    }
    
    revalidatePath("/forms");
    return { success: true };
  } catch (error) {
    console.error("Error deleting form:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Create a new reply to a form
 */
export async function createFormReplyAction(replyData: NewFormReply) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to reply to a form" };
  }
  
  try {
    const reply = await createFormReply(replyData, user.id, user.fullName);
    
    if (!reply) {
      return { error: "Failed to create reply" };
    }
    
    revalidatePath(`/forms/${replyData.form_id}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update an existing reply
 */
export async function updateFormReplyAction(id: string, formId: string, replyData: UpdateFormReply) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to update a reply" };
  }
  
  try {
    const reply = await updateFormReply(id, replyData);
    
    if (!reply) {
      return { error: "Failed to update reply" };
    }
    
    revalidatePath(`/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating reply:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete a reply
 */
export async function deleteFormReplyAction(id: string, formId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to delete a reply" };
  }
  
  try {
    const success = await deleteFormReply(id);
    
    if (!success) {
      return { error: "Failed to delete reply" };
    }
    
    revalidatePath(`/forms/${formId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting reply:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Toggle the solved status of a form
 */
export async function toggleFormSolvedStatusAction(id: string, currentStatus: boolean) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "You must be logged in to update a form" };
  }
  
  try {
    const form = await toggleFormSolvedStatus(id, currentStatus);
    
    if (!form) {
      return { error: "Failed to update form status" };
    }
    
    revalidatePath(`/forms/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating form status:", error);
    return { error: "An unexpected error occurred" };
  }
}
