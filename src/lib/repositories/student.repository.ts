import { createServerClient } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

export type Student = Tables<'students'>;
export type CreateStudentData = TablesInsert<'students'>;
export type UpdateStudentData = TablesUpdate<'students'>;

export class StudentRepository {
  private supabase = createServerClient();

  async create(data: CreateStudentData): Promise<Student> {
    const { data: student, error } = await this.supabase
      .from('students')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }

    return student;
  }

  async findById(id: string): Promise<Student | null> {
    const { data: student, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('student_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find student: ${error.message}`);
    }

    return student;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const { data: student, error } = await this.supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find student by email: ${error.message}`);
    }

    return student;
  }

  async update(id: string, data: UpdateStudentData): Promise<Student> {
    const { data: student, error } = await this.supabase
      .from('students')
      .update(data)
      .eq('student_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }

    return student;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('students')
      .delete()
      .eq('student_id', id);

    if (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }
}
