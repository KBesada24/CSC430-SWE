import { createServerClient } from '@/lib/supabase/server';

export interface InviteToken {
  token_id: string;
  club_id: string;
  token: string;
  created_at: string | null;
}

export interface CreateInviteData {
  club_id: string;
  token: string;
}

export class InviteRepository {
  private supabase = createServerClient();

  /**
   * Create a new invite token
   */
  async create(data: CreateInviteData): Promise<InviteToken> {
    const { data: invite, error } = await this.supabase
      .from('invite_tokens')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create invite token: ${error.message}`);
    }

    return invite;
  }

  /**
   * Find invite token by club ID
   */
  async findByClubId(clubId: string): Promise<InviteToken | null> {
    const { data: invite, error } = await this.supabase
      .from('invite_tokens')
      .select('*')
      .eq('club_id', clubId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find invite token: ${error.message}`);
    }

    return invite;
  }

  /**
   * Find invite token by token string
   */
  async findByToken(token: string): Promise<InviteToken | null> {
    const { data: invite, error } = await this.supabase
      .from('invite_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find invite token: ${error.message}`);
    }

    return invite;
  }

  /**
   * Delete invite token by club ID
   */
  async deleteByClubId(clubId: string): Promise<void> {
    const { error } = await this.supabase
      .from('invite_tokens')
      .delete()
      .eq('club_id', clubId);

    if (error) {
      throw new Error(`Failed to delete invite token: ${error.message}`);
    }
  }
}
