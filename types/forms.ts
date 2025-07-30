export interface Form {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user_full_name: string;
  is_solved: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormReply {
  id: string;
  form_id: string;
  content: string;
  user_id: string;
  user_full_name: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormWithReplies extends Form {
  replies: FormReply[];
}

export interface NewForm {
  title: string;
  content: string;
}

export interface NewFormReply {
  form_id: string;
  content: string;
}

export interface UpdateForm {
  title?: string;
  content?: string;
  is_solved?: boolean;
}

export interface UpdateFormReply {
  content: string;
}
