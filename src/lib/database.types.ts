
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "memories": {
                  Row: {
                    "accepted_answers": (string)[],"answer": string | null,"answer_display": string | null,"body": string,"created_at": string,"due_on": string,"id": string,"lapse_count": number,"last_reviewed_on": string | null,"pack_card_id": string | null,"pack_id": string | null,"review_count": number,"search_query": string | null,"stage": number,"title": string,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"body"?: string,"created_at"?: string,"due_on": string,"id"?: string,"lapse_count"?: number,"last_reviewed_on"?: string | null,"pack_card_id"?: string | null,"pack_id"?: string | null,"review_count"?: number,"search_query"?: string | null,"stage"?: number,"title": string,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"body"?: string,"created_at"?: string,"due_on"?: string,"id"?: string,"lapse_count"?: number,"last_reviewed_on"?: string | null,"pack_card_id"?: string | null,"pack_id"?: string | null,"review_count"?: number,"search_query"?: string | null,"stage"?: number,"title"?: string,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "memories_pack_card_id_fkey"
      columns: ["pack_card_id"]
isOneToOne: false
      referencedRelation: "pack_cards"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "memories_pack_id_fkey"
      columns: ["pack_id"]
isOneToOne: false
      referencedRelation: "packs"
      referencedColumns: ["id"]
    }
                  ]
                },"pack_cards": {
                  Row: {
                    "accepted_answers": (string)[],"answer": string | null,"answer_display": string | null,"body": string,"id": string,"pack_id": string,"position": number,"search_query": string | null,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"body": string,"id": string,"pack_id": string,"position": number,"search_query"?: string | null,"title": string
                  }
                  Update: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"body"?: string,"id"?: string,"pack_id"?: string,"position"?: number,"search_query"?: string | null,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "pack_cards_pack_id_fkey"
      columns: ["pack_id"]
isOneToOne: false
      referencedRelation: "packs"
      referencedColumns: ["id"]
    }
                  ]
                },"pack_categories": {
                  Row: {
                    "id": string,"name": string,"position": number,"tagline": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id": string,"name": string,"position"?: number,"tagline": string
                  }
                  Update: {
                    "id"?: string,"name"?: string,"position"?: number,"tagline"?: string
                  }
                  Relationships: [
                    
                  ]
                },"packs": {
                  Row: {
                    "category_id": string,"course": string,"description": string,"id": string,"position": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category_id": string,"course": string,"description": string,"id": string,"position"?: number,"title": string
                  }
                  Update: {
                    "category_id"?: string,"course"?: string,"description"?: string,"id"?: string,"position"?: number,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "packs_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "pack_categories"
      referencedColumns: ["id"]
    }
                  ]
                },"reviews": {
                  Row: {
                    "attempts": number,"id": number,"memory_id": string | null,"passed": boolean,"reviewed_at": string,"reviewed_on": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attempts"?: number,"id"?: never,"memory_id"?: string | null,"passed": boolean,"reviewed_at"?: string,"reviewed_on": string,"user_id"?: string
                  }
                  Update: {
                    "attempts"?: number,"id"?: never,"memory_id"?: string | null,"passed"?: boolean,"reviewed_at"?: string,"reviewed_on"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_memory_id_fkey"
      columns: ["memory_id"]
isOneToOne: false
      referencedRelation: "memories"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "my_pack_progress": {
                  Row: {
                    "card_count": number | null,"mastered_count": number | null,"pack_id": string | null,"started_count": number | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "memories_pack_id_fkey"
      columns: ["pack_id"]
isOneToOne: false
      referencedRelation: "packs"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "add_pack":
{ Args: { "p_pack_id": string,"p_per_day"?: number,"p_today": string }; Returns: number
                           },
"assert_local_today":
{ Args: { "p_today": string }; Returns: undefined
                           },
"delete_account":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"fib":
{ Args: { "n": number }; Returns: number
                           },
"get_progress":
{ Args: { "p_today": string }; Returns: Json
                           },
"review_memory":
{ Args: { "p_attempts"?: number,"p_memory_id": string,"p_passed": boolean,"p_today": string }; Returns: {
              "accepted_answers": (string)[],
"answer": string | null,
"answer_display": string | null,
"body": string,
"created_at": string,
"due_on": string,
"id": string,
"lapse_count": number,
"last_reviewed_on": string | null,
"pack_card_id": string | null,
"pack_id": string | null,
"review_count": number,
"search_query": string | null,
"stage": number,
"title": string,
"updated_at": string,
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "memories"
        isOneToOne: true
        isSetofReturn: false
      } }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
