export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      email_verifications: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id?: string;
          token: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_verifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_chromas: {
        Row: {
          contentId: string;
          purchased_date: string | null;
          userId: string;
        };
        Insert: {
          contentId: string;
          purchased_date?: string | null;
          userId: string;
        };
        Update: {
          contentId?: string;
          purchased_date?: string | null;
          userId?: string;
        };
        Relationships: [];
      };
      user_skins: {
        Row: {
          contentId: string;
          purchased_date: string;
          userId: string;
        };
        Insert: {
          contentId: string;
          purchased_date: string;
          userId: string;
        };
        Update: {
          contentId?: string;
          purchased_date?: string;
          userId?: string;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          user_id: string;
          wishlist_id: string;
        };
        Insert: {
          user_id: string;
          wishlist_id: string;
        };
        Update: {
          user_id?: string;
          wishlist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_subscriptions_wishlist_id_wishlists_id_fk";
            columns: ["wishlist_id"];
            isOneToOne: false;
            referencedRelation: "wishlists";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_verified: boolean;
          name: string;
          password: string;
          role: Database["public"]["Enums"]["role"];
          updated_at: string;
        };
        Insert: {
          created_at: string;
          email: string;
          id?: string;
          is_verified?: boolean;
          name: string;
          password: string;
          role?: Database["public"]["Enums"]["role"];
          updated_at: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_verified?: boolean;
          name?: string;
          password?: string;
          role?: Database["public"]["Enums"]["role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          chromas: string[];
          created_at: string;
          id: string;
          link: string;
          name: string;
          private: boolean;
          skins: string[];
          subscribers: number;
          updated_at: string;
          user_id: string;
          views: number;
        };
        Insert: {
          chromas?: string[];
          created_at?: string;
          id?: string;
          link: string;
          name: string;
          private?: boolean;
          skins?: string[];
          subscribers?: number;
          updated_at: string;
          user_id: string;
          views?: number;
        };
        Update: {
          chromas?: string[];
          created_at?: string;
          id?: string;
          link?: string;
          name?: string;
          private?: boolean;
          skins?: string[];
          subscribers?: number;
          updated_at?: string;
          user_id?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_refresh_token: {
        Args: { p_token: string };
        Returns: {
          token: string;
          user_id: string;
        }[];
      };
      get_skin_social_stats: {
        Args: { p_owned_skin_ids: string[]; p_user_id: string };
        Returns: Json;
      };
    };
    Enums: {
      role: "user" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      role: ["user", "admin"],
    },
  },
} as const;
