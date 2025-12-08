import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { Event } from './event.repository';

export type Club = Tables<'clubs'>;
export type CreateClubData = TablesInsert<'clubs'>;
export type UpdateClubData = TablesUpdate<'clubs'>;

export interface ClubFilters {
  category?: string;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface ClubQueryResult {
  clubs: Club[];
  total: number;
}

export class ClubRepository {
  private supabase = createServerClient();

  async create(data: CreateClubData): Promise<Club> {
    const { data: club, error } = await this.supabase
      .from('clubs')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create club: ${error.message}`);
    }

    return club;
  }

  async findById(id: string): Promise<Club | null> {
    const { data: club, error } = await this.supabase
      .from('clubs')
      .select('*')
      .eq('club_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find club: ${error.message}`);
    }

    return club;
  }

  async findAll(filters: ClubFilters, pagination: Pagination): Promise<ClubQueryResult> {
    let query = this.supabase.from('clubs').select('*', { count: 'exact' });

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data: clubs, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch clubs: ${error.message}`);
    }

    return {
      clubs: clubs || [],
      total: count || 0,
    };
  }

  async update(id: string, data: UpdateClubData): Promise<Club> {
    const { data: club, error } = await this.supabase
      .from('clubs')
      .update(data)
      .eq('club_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update club: ${error.message}`);
    }

    return club;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('clubs')
      .delete()
      .eq('club_id', id);

    if (error) {
      throw new Error(`Failed to delete club: ${error.message}`);
    }
  }

  async getMemberCount(clubId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to get member count: ${error.message}`);
    }

    return count || 0;
  }

  async getNextEvent(clubId: string): Promise<Event | null> {
    const { data: event, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('club_id', clubId)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get next event: ${error.message}`);
    }

    return event;
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected' | 'suspended'): Promise<Club[]> {
    const { data: clubs, error } = await this.supabase
      .from('clubs')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find clubs by status: ${error.message}`);
    }

    return clubs || [];
  }

  async updateStatus(clubId: string, status: 'pending' | 'approved' | 'rejected' | 'suspended'): Promise<Club> {
    const { data: club, error } = await this.supabase
      .from('clubs')
      .update({ status })
      .eq('club_id', clubId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update club status: ${error.message}`);
    }

    return club;
  }
  async countCreatedAfter(date: Date): Promise<number> {
    const { count, error } = await this.supabase
      .from('clubs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', date.toISOString());

    if (error) {
      throw new Error(`Failed to count recently created clubs: ${error.message}`);
    }

    return count || 0;
  }
}
