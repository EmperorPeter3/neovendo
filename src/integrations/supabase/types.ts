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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          atv_brand: string | null
          atv_condition: string | null
          atv_engine_type: string | null
          atv_engine_volume: number | null
          atv_max_passengers: number | null
          atv_mileage: number | null
          atv_model: string | null
          atv_origin_country: string | null
          atv_power: number | null
          atv_power_watt: number | null
          atv_type: string | null
          atv_year: number | null
          car_body_condition: string | null
          car_body_type: string | null
          car_brand: string | null
          car_condition: string | null
          car_drive_type: string | null
          car_engine_type: string | null
          car_engine_volume: number | null
          car_fuel_consumption: number | null
          car_mileage: number | null
          car_model: string | null
          car_power: number | null
          car_power_watt: number | null
          car_seats: number | null
          car_steering_position: string | null
          car_transmission: string | null
          car_trunk_volume: number | null
          car_year: number | null
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          country: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          kart_brand: string | null
          kart_condition: string | null
          kart_model: string | null
          lat: number | null
          lng: number | null
          moped_brand: string | null
          moped_condition: string | null
          moped_engine_type: string | null
          moped_engine_volume: number | null
          moped_mileage: number | null
          moped_model: string | null
          moped_origin_country: string | null
          moped_power: number | null
          moped_power_watt: number | null
          moped_type: string | null
          moped_year: number | null
          moto_brand: string | null
          moto_condition: string | null
          moto_cooling: string | null
          moto_cylinders: number | null
          moto_drive_type: string | null
          moto_engine_type: string | null
          moto_engine_volume: number | null
          moto_fuel_delivery: string | null
          moto_gears: number | null
          moto_mileage: number | null
          moto_model: string | null
          moto_origin_country: string | null
          moto_power_hp: number | null
          moto_power_watt: number | null
          moto_strokes: number | null
          moto_transmission: string | null
          moto_type: string | null
          moto_year: number | null
          owner_id: string
          price: number
          quad_brand: string | null
          quad_condition: string | null
          quad_engine_type: string | null
          quad_engine_volume: number | null
          quad_max_passengers: number | null
          quad_mileage: number | null
          quad_model: string | null
          quad_origin_country: string | null
          quad_power: number | null
          quad_power_watt: number | null
          quad_type: string | null
          quad_year: number | null
          status: Database["public"]["Enums"]["listing_status"]
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          atv_brand?: string | null
          atv_condition?: string | null
          atv_engine_type?: string | null
          atv_engine_volume?: number | null
          atv_max_passengers?: number | null
          atv_mileage?: number | null
          atv_model?: string | null
          atv_origin_country?: string | null
          atv_power?: number | null
          atv_power_watt?: number | null
          atv_type?: string | null
          atv_year?: number | null
          car_body_condition?: string | null
          car_body_type?: string | null
          car_brand?: string | null
          car_condition?: string | null
          car_drive_type?: string | null
          car_engine_type?: string | null
          car_engine_volume?: number | null
          car_fuel_consumption?: number | null
          car_mileage?: number | null
          car_model?: string | null
          car_power?: number | null
          car_power_watt?: number | null
          car_seats?: number | null
          car_steering_position?: string | null
          car_transmission?: string | null
          car_trunk_volume?: number | null
          car_year?: number | null
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          country: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          kart_brand?: string | null
          kart_condition?: string | null
          kart_model?: string | null
          lat?: number | null
          lng?: number | null
          moped_brand?: string | null
          moped_condition?: string | null
          moped_engine_type?: string | null
          moped_engine_volume?: number | null
          moped_mileage?: number | null
          moped_model?: string | null
          moped_origin_country?: string | null
          moped_power?: number | null
          moped_power_watt?: number | null
          moped_type?: string | null
          moped_year?: number | null
          moto_brand?: string | null
          moto_condition?: string | null
          moto_cooling?: string | null
          moto_cylinders?: number | null
          moto_drive_type?: string | null
          moto_engine_type?: string | null
          moto_engine_volume?: number | null
          moto_fuel_delivery?: string | null
          moto_gears?: number | null
          moto_mileage?: number | null
          moto_model?: string | null
          moto_origin_country?: string | null
          moto_power_hp?: number | null
          moto_power_watt?: number | null
          moto_strokes?: number | null
          moto_transmission?: string | null
          moto_type?: string | null
          moto_year?: number | null
          owner_id: string
          price: number
          quad_brand?: string | null
          quad_condition?: string | null
          quad_engine_type?: string | null
          quad_engine_volume?: number | null
          quad_max_passengers?: number | null
          quad_mileage?: number | null
          quad_model?: string | null
          quad_origin_country?: string | null
          quad_power?: number | null
          quad_power_watt?: number | null
          quad_type?: string | null
          quad_year?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          atv_brand?: string | null
          atv_condition?: string | null
          atv_engine_type?: string | null
          atv_engine_volume?: number | null
          atv_max_passengers?: number | null
          atv_mileage?: number | null
          atv_model?: string | null
          atv_origin_country?: string | null
          atv_power?: number | null
          atv_power_watt?: number | null
          atv_type?: string | null
          atv_year?: number | null
          car_body_condition?: string | null
          car_body_type?: string | null
          car_brand?: string | null
          car_condition?: string | null
          car_drive_type?: string | null
          car_engine_type?: string | null
          car_engine_volume?: number | null
          car_fuel_consumption?: number | null
          car_mileage?: number | null
          car_model?: string | null
          car_power?: number | null
          car_power_watt?: number | null
          car_seats?: number | null
          car_steering_position?: string | null
          car_transmission?: string | null
          car_trunk_volume?: number | null
          car_year?: number | null
          category?: Database["public"]["Enums"]["listing_category"]
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          kart_brand?: string | null
          kart_condition?: string | null
          kart_model?: string | null
          lat?: number | null
          lng?: number | null
          moped_brand?: string | null
          moped_condition?: string | null
          moped_engine_type?: string | null
          moped_engine_volume?: number | null
          moped_mileage?: number | null
          moped_model?: string | null
          moped_origin_country?: string | null
          moped_power?: number | null
          moped_power_watt?: number | null
          moped_type?: string | null
          moped_year?: number | null
          moto_brand?: string | null
          moto_condition?: string | null
          moto_cooling?: string | null
          moto_cylinders?: number | null
          moto_drive_type?: string | null
          moto_engine_type?: string | null
          moto_engine_volume?: number | null
          moto_fuel_delivery?: string | null
          moto_gears?: number | null
          moto_mileage?: number | null
          moto_model?: string | null
          moto_origin_country?: string | null
          moto_power_hp?: number | null
          moto_power_watt?: number | null
          moto_strokes?: number | null
          moto_transmission?: string | null
          moto_type?: string | null
          moto_year?: number | null
          owner_id?: string
          price?: number
          quad_brand?: string | null
          quad_condition?: string | null
          quad_engine_type?: string | null
          quad_engine_volume?: number | null
          quad_max_passengers?: number | null
          quad_mileage?: number | null
          quad_model?: string | null
          quad_origin_country?: string | null
          quad_power?: number | null
          quad_power_watt?: number | null
          quad_type?: string | null
          quad_year?: number | null
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: string[] | null
          chat_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          rating: number | null
          rating_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles_public_cache: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          name: string | null
          rating: number | null
          rating_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          name?: string | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          name?: string | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          reviewed_user_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          reviewed_user_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          name: string | null
          rating: number | null
          rating_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: never
          name?: string | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: never
          name?: string | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      listing_category:
        | "transport"
        | "realEstate"
        | "jobs"
        | "services"
        | "personalItems"
        | "homeAndGarden"
        | "autoParts"
        | "electronics"
        | "hobbies"
        | "animals"
        | "business"
      listing_status: "active" | "deleted"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      listing_category: [
        "transport",
        "realEstate",
        "jobs",
        "services",
        "personalItems",
        "homeAndGarden",
        "autoParts",
        "electronics",
        "hobbies",
        "animals",
        "business",
      ],
      listing_status: ["active", "deleted"],
    },
  },
} as const
