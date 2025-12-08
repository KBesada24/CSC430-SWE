export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clubs: {
        Row: {
          admin_student_id: string | null
          category: string
          club_id: string
          cover_photo_url: string | null
          created_at: string | null
          description: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_student_id?: string | null
          category: string
          club_id?: string
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_student_id?: string | null
          category?: string
          club_id?: string
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_admin_student_id_fkey"
            columns: ["admin_student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string
          created_at: string | null
          description: string | null
          event_date: string
          event_id: string
          location: string
          title: string
          updated_at: string | null
        }
        Insert: {
          club_id: string
          created_at?: string | null
          description?: string | null
          event_date: string
          event_id?: string
          location: string
          title: string
          updated_at?: string | null
        }
        Update: {
          club_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_id?: string
          location?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
          },
        ]
      }
      invite_tokens: {
        Row: {
          token_id: string
          club_id: string
          token: string
          created_at: string
          expires_at: string
          used_at: string | null
          used_by_student_id: string | null
          max_uses: number | null
          uses_count: number
        }
        Insert: {
          token_id?: string
          club_id: string
          token: string
          created_at?: string
          expires_at: string
          used_at?: string | null
          used_by_student_id?: string | null
          max_uses?: number | null
          uses_count?: number
        }
        Update: {
          token_id?: string
          club_id?: string
          token?: string
          created_at?: string
          expires_at?: string
          used_at?: string | null
          used_by_student_id?: string | null
          max_uses?: number | null
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "invite_tokens_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "invite_tokens_used_by_student_id_fkey"
            columns: ["used_by_student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      memberships: {
        Row: {
          club_id: string
          created_at: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          club_id: string
          created_at?: string | null
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          club_id?: string
          created_at?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "memberships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "rsvps_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          last_name: string
          password_hash: string
          role: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          last_name: string
          password_hash: string
          role?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          last_name?: string
          password_hash?: string
          role?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
