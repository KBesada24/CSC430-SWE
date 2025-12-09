
import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert } from '@/types/supabase';

export class ReviewRepository {
  private supabase = createServerClient();

  async create(data: TablesInsert<'reviews'>): Promise<Tables<'reviews'>> {
    const { data: review, error } = await this.supabase
      .from('reviews')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return review;
  }

  async findByClubId(clubId: string, limit = 20): Promise<Tables<'reviews'>[]> {
    const { data, error } = await this.supabase
      .from('reviews')
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
    return data;
  }

  async hasReviewed(clubId: string, studentId: string): Promise<boolean> {
    const { count, error } = await this.supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('student_id', studentId);
    
    if (error) throw error;
    return (count || 0) > 0;
  }
}
