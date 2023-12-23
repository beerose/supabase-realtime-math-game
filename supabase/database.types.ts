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
      results: {
        Row: {
          created_at: string
          name: string
          result: number
          room_name: string
        }
        Insert: {
          created_at?: string
          name: string
          result?: number
          room_name: string
        }
        Update: {
          created_at?: string
          name?: string
          result?: number
          room_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_room_name"
            columns: ["room_name"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["room_name"]
          }
        ]
      }
      rooms: {
        Row: {
          created_at: string
          id: number
          room_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          room_name: string
        }
        Update: {
          created_at?: string
          id?: number
          room_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      lca: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      lquery_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text2ltree: {
        Args: {
          "": string
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
