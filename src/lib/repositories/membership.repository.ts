import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

export type Membership = Tables<'memberships'>;
export type CreateMembershipData = TablesInsert<'memberships'>;
export type UpdateMembershipData = TablesUpdate<'memberships'>;

export type MembershipStatus = 'pending' | 'active' | 'rejected';

export class MembershipRepository {
  private supabase = createServerClient();

  async create(studentId: string, clubId: string): Promise<Membership> {
    const { data: membership, error } = await this.supabase
      .from('memberships')
      .insert({
        student_id: studentId,
        club_id: clubId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create membership: ${error.message}`);
    }

    return membership;
  }

  async findByStudentAndClub(studentId: string, clubId: string): Promise<Membership | null> {
    const { data: membership, error } = await this.supabase
      .from('memberships')
      .select('*')
      .eq('student_id', studentId)
      .eq('club_id', clubId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find membership: ${error.message}`);
    }

    return membership;
  }

  async findByStudent(studentId: string): Promise<Membership[]> {
    const { data: memberships, error } = await this.supabase
      .from('memberships')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find memberships by student: ${error.message}`);
    }

    return memberships || [];
  }

  async findByClub(clubId: string, status?: MembershipStatus): Promise<Membership[]> {
    let query = this.supabase
      .from('memberships')
      .select('*')
      .eq('club_id', clubId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data: memberships, error } = await query;

    if (error) {
      throw new Error(`Failed to find memberships by club: ${error.message}`);
    }

    return memberships || [];
  }

  async updateStatus(studentId: string, clubId: string, status: MembershipStatus): Promise<Membership> {
    const { data: membership, error } = await this.supabase
      .from('memberships')
      .update({ status })
      .eq('student_id', studentId)
      .eq('club_id', clubId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update membership status: ${error.message}`);
    }

    return membership;
  }

  async delete(studentId: string, clubId: string): Promise<void> {
    const { error } = await this.supabase
      .from('memberships')
      .delete()
      .eq('student_id', studentId)
      .eq('club_id', clubId);

    if (error) {
      throw new Error(`Failed to delete membership: ${error.message}`);
    }
  }

  async countAllActiveMembers(): Promise<number> {
    const { count, error } = await this.supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to count active memberships: ${error.message}`);
    }

    return count || 0;
  }

  async countRecentMemberships(since: Date): Promise<number> {
    const { count, error } = await this.supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to count recent memberships: ${error.message}`);
    }

    return count || 0;
  }
}
