"use client";

import { useState } from "react";
import { createFormReplyAction } from "@/app/forms/actions";
import { Button } from "../common/button";

interface ReplyFormProps {
  formId: string;
}

export default function ReplyForm({ formId }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createFormReplyAction({
        form_id: formId,
        content,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setContent(""); // Clear the form after successful submission
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reply-content" className="block text-sm font-medium mb-1">
          Your Reply
        </label>
        <textarea
          id="reply-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          required
          disabled={isSubmitting}
          placeholder="Write your reply here..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  );
}
