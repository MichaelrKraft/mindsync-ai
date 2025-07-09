export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          content: string
          content_type: string
          image_url: string | null
          favicon_url: string | null
          tags: string[]
          ai_tags: string[]
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title: string
          content: string
          content_type: string
          image_url?: string | null
          favicon_url?: string | null
          tags?: string[]
          ai_tags?: string[]
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string
          content?: string
          content_type?: string
          image_url?: string | null
          favicon_url?: string | null
          tags?: string[]
          ai_tags?: string[]
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string
          confidence: number
          related_content_ids: string[]
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description: string
          confidence: number
          related_content_ids?: string[]
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string
          confidence?: number
          related_content_ids?: string[]
          is_read?: boolean
          created_at?: string
        }
      }
      content_connections: {
        Row: {
          id: string
          user_id: string
          source_id: string
          target_id: string
          relationship: string
          strength: number
          reason: string
          discovered_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_id: string
          target_id: string
          relationship: string
          strength: number
          reason: string
          discovered_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_id?: string
          target_id?: string
          relationship?: string
          strength?: number
          reason?: string
          discovered_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
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