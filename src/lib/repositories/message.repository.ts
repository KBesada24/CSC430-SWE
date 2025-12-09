
import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert } from '@/types/supabase';

export class MessageRepository {
  private supabase = createServerClient();

  async create(data: TablesInsert<'messages'>): Promise<Tables<'messages'>> {
    const { data: message, error } = await this.supabase
      .from('messages')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return message;
  }

  async findByClubId(clubId: string, limit = 50): Promise<Tables<'messages'>[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select(`
        *,
        student:students(
          student_id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('club_id', clubId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    // Return in chronological order for chat display
    return data.reverse();
  }
}
