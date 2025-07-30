import { createClient } from '@/utils/supabase/client';

export async function signOutUser() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}