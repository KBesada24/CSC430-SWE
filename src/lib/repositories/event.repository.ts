import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import { Pagination } from './club.repository';
export type { Pagination } from './club.repository';

export type Event = Tables<'events'>;
export type CreateEventData = TablesInsert<'events'>;
export type UpdateEventData = TablesUpdate<'events'>;

export interface EventFilters {
  clubId?: string;
  upcoming?: boolean;
}

export interface EventQueryResult {
  events: Event[];
  total: number;
}

export class EventRepository {
  private supabase = createServerClient();

  async create(data: CreateEventData): Promise<Event> {
    const { data: event, error } = await this.supabase
      .from('events')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return event;
  }

  async findById(id: string): Promise<Event | null> {
    const { data: event, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('event_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find event: ${error.message}`);
    }

    return event;
  }

  async findAll(filters: EventFilters, pagination: Pagination): Promise<EventQueryResult> {
    let query = this.supabase.from('events').select('*', { count: 'exact' });

    // Apply club filter
    if (filters.clubId) {
      query = query.eq('club_id', filters.clubId);
    }

    // Apply upcoming filter
    if (filters.upcoming) {
      query = query.gte('event_date', new Date().toISOString());
    }

    // Order by event date
    query = query.order('event_date', { ascending: true });

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data: events, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return {
      events: events || [],
      total: count || 0,
    };
  }

  async findByClubId(clubId: string): Promise<Event[]> {
    const { data: events, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('club_id', clubId)
      .order('event_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch events by club: ${error.message}`);
    }

    return events || [];
  }

  async update(id: string, data: UpdateEventData): Promise<Event> {
    const { data: event, error } = await this.supabase
      .from('events')
      .update(data)
      .eq('event_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return event;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('event_id', id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  async getAttendeeCount(eventId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) {
      throw new Error(`Failed to get attendee count: ${error.message}`);
    }

    return count || 0;
  }
  async countCreatedAfter(date: Date): Promise<number> {
    const { count, error } = await this.supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', date.toISOString());

    if (error) {
      throw new Error(`Failed to count recently created events: ${error.message}`);
    }

    return count || 0;
  }

  async countUpcoming(until: Date): Promise<number> {
    const { count, error } = await this.supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('event_date', new Date().toISOString())
      .lte('event_date', until.toISOString());

    if (error) {
      throw new Error(`Failed to count upcoming events: ${error.message}`);
    }

    return count || 0;
  }
}
