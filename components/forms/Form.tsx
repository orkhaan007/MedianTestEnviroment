"use client";

import { useState, useEffect } from "react";
import { Form as FormType, FormReply, FormWithReplies } from "@/types/forms";
import { formatDate } from "@/utils/date";
import { Button } from "../common/button";
import { Badge } from "../common/badge";
import { deleteFormAction, toggleFormSolvedStatusAction } from "@/app/forms/actions";
import { useRouter } from "next/navigation";
import Reply from "@/components/forms/Reply";
import ReplyForm from "@/components/forms/ReplyForm";
import { subscribeToFormUpdates } from "@/utils/forms/realtime";

interface FormProps {
  form: FormWithReplies;
  currentUserId?: string | null;
}

export default function Form({ form: initialForm, currentUserId }: FormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormWithReplies>(initialForm);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOwner = currentUserId === form.user_id;
  
  // Set up real-time subscription
  useEffect(() => {
    // Only set up real-time if we have a user
    if (!currentUserId) return;
    
    const unsubscribe = subscribeToFormUpdates(
      form.id,
      // Handle form updates
      (updatedForm) => {
        setForm((prevForm) => ({
          ...prevForm,
          ...updatedForm,
        }));
      },
      // Handle reply inserts
      (newReply) => {
        setForm((prevForm) => ({
          ...prevForm,
          replies: [...prevForm.replies, newReply].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ),
        }));
      },
      // Handle reply updates
      (updatedReply) => {
        setForm((prevForm) => ({
          ...prevForm,
          replies: prevForm.replies.map((reply) =>
            reply.id === updatedReply.id ? updatedReply : reply
          ),
        }));
      },
      // Handle reply deletes
      (deletedReplyId) => {
        setForm((prevForm) => ({
          ...prevForm,
          replies: prevForm.replies.filter((reply) => reply.id !== deletedReplyId),
        }));
      }
    );
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [form.id, currentUserId]);
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this form?")) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteFormAction(form.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/forms");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleToggleSolvedStatus = async () => {
    setIsTogglingStatus(true);
    setError(null);
    
    try {
      const result = await toggleFormSolvedStatusAction(form.id, form.is_solved);
      
      if (result.error) {
        setError(result.error);
      }
      // Form will be updated via real-time subscription
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsTogglingStatus(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {form.title}
              {form.is_solved && (
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                  Solved
                </Badge>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Posted by {form.user_full_name} on {formatDate(form.created_at)}
              {form.is_edited && <span className="ml-2 text-gray-400">(edited)</span>}
            </p>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/forms/${form.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant={form.is_solved ? "outline" : "default"}
                size="sm"
                onClick={handleToggleSolvedStatus}
                disabled={isTogglingStatus}
              >
                {isTogglingStatus
                  ? "Updating..."
                  : form.is_solved
                  ? "Mark as Unsolved"
                  : "Mark as Solved"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-4 prose max-w-none">
          <p>{form.content}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Replies</h2>
        
        {form.replies.length === 0 ? (
          <p className="text-gray-500">No replies yet</p>
        ) : (
          <div className="space-y-4">
            {form.replies.map((reply) => (
              <Reply
                key={reply.id}
                reply={reply}
                formId={form.id}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
        
        {currentUserId && (
          <div className="mt-6">
            <ReplyForm formId={form.id} />
          </div>
        )}
      </div>
    </div>
  );
}
