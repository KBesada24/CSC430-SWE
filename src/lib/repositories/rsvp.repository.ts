import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

export type Rsvp = Tables<'rsvps'>;
export type CreateRsvpData = TablesInsert<'rsvps'>;
export type UpdateRsvpData = TablesUpdate<'rsvps'>;

export class RsvpRepository {
  private supabase = createServerClient();

  async create(studentId: string, eventId: string): Promise<Rsvp> {
    const { data: rsvp, error } = await this.supabase
      .from('rsvps')
      .insert({
        student_id: studentId,
        event_id: eventId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create RSVP: ${error.message}`);
    }

    return rsvp;
  }

  async findByStudentAndEvent(studentId: string, eventId: string): Promise<Rsvp | null> {
    const { data: rsvp, error } = await this.supabase
      .from('rsvps')
      .select('*')
      .eq('student_id', studentId)
      .eq('event_id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find RSVP: ${error.message}`);
    }

    return rsvp;
  }

  async findByStudent(studentId: string): Promise<Rsvp[]> {
    const { data: rsvps, error } = await this.supabase
      .from('rsvps')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find RSVPs by student: ${error.message}`);
    }

    return rsvps || [];
  }

  async findByEvent(eventId: string): Promise<Rsvp[]> {
    const { data: rsvps, error } = await this.supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find RSVPs by event: ${error.message}`);
    }

    return rsvps || [];
  }

  async delete(studentId: string, eventId: string): Promise<void> {
    const { error } = await this.supabase
      .from('rsvps')
      .delete()
      .eq('student_id', studentId)
      .eq('event_id', eventId);

    if (error) {
      throw new Error(`Failed to delete RSVP: ${error.message}`);
    }
  }
}
