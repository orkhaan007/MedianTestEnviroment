"use client";

import { useState } from "react";
import { FormReply } from "@/types/forms";
import { formatDate } from "@/utils/date";
import { Button } from "../common/button";
import { deleteFormReplyAction, updateFormReplyAction } from "@/app/forms/actions";

interface ReplyProps {
  reply: FormReply;
  formId: string;
  currentUserId?: string | null;
}

export default function Reply({ reply, formId, currentUserId }: ReplyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(reply.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOwner = currentUserId === reply.user_id;
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await updateFormReplyAction(reply.id, formId, { content });
      
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reply?")) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteFormReplyAction(reply.id, formId);
      
      if (result.error) {
        setError(result.error);
      }
      // The page will be revalidated by the server action
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4">
      {error && (
        <div className="p-3 mb-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            {reply.user_full_name} replied on {formatDate(reply.created_at)}
            {reply.is_edited && <span className="ml-2 text-gray-400">(edited)</span>}
          </p>
        </div>
        
        {isOwner && !isEditing && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
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
      
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setContent(reply.content);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-2 prose max-w-none">
          <p>{reply.content}</p>
        </div>
      )}
    </div>
  );
}
