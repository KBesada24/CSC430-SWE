
import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert } from '@/types/supabase';

export class NotificationRepository {
  private supabase = createServerClient();

  async create(data: TablesInsert<'notifications'>): Promise<Tables<'notifications'>> {
    const { data: notification, error } = await this.supabase
      .from('notifications')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return notification;
  }

  async createMany(data: TablesInsert<'notifications'>[]): Promise<Tables<'notifications'>[]> {
    const { data: notifications, error } = await this.supabase
      .from('notifications')
      .insert(data)
      .select();

    if (error) throw error;
    return notifications;
  }

  async findByStudentId(studentId: string, limit = 20): Promise<Tables<'notifications'>[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('notification_id', notificationId);

    if (error) throw error;
  }

  async countUnread(studentId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  }
}
