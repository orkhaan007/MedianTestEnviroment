"use client";

import { createClient } from "@/utils/supabase/client";
import { Form, FormReply } from "@/types/forms";

/**
 * Subscribe to real-time updates for a specific form and its replies
 */
export function subscribeToFormUpdates(
  formId: string,
  onFormUpdate: (form: Form) => void,
  onReplyInsert: (reply: FormReply) => void,
  onReplyUpdate: (reply: FormReply) => void,
  onReplyDelete: (id: string) => void
) {
  const supabase = createClient();
  
  // Subscribe to form updates
  const formSubscription = supabase
    .channel(`form:${formId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "forms",
        filter: `id=eq.${formId}`
      },
      (payload) => {
        onFormUpdate(payload.new as Form);
      }
    )
    .subscribe();
  
  // Subscribe to reply changes
  const replySubscription = supabase
    .channel(`form_replies:${formId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "form_replies",
        filter: `form_id=eq.${formId}`
      },
      (payload) => {
        onReplyInsert(payload.new as FormReply);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "form_replies",
        filter: `form_id=eq.${formId}`
      },
      (payload) => {
        onReplyUpdate(payload.new as FormReply);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "form_replies",
        filter: `form_id=eq.${formId}`
      },
      (payload) => {
        onReplyDelete(payload.old.id as string);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    formSubscription.unsubscribe();
    replySubscription.unsubscribe();
  };
}

/**
 * Subscribe to real-time updates for the forms list
 */
export function subscribeToFormsListUpdates(
  onFormInsert: (form: Form) => void,
  onFormUpdate: (form: Form) => void,
  onFormDelete: (id: string) => void
) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel("forms_list")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "forms"
      },
      (payload) => {
        onFormInsert(payload.new as Form);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "forms"
      },
      (payload) => {
        onFormUpdate(payload.new as Form);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "forms"
      },
      (payload) => {
        onFormDelete(payload.old.id as string);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}
