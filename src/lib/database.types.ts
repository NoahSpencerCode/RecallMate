
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
                },"profession_card_reports": {
                  Row: {
                    "card_id": string,"created_at": string,"id": number,"note": string | null,"reason": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "card_id": string,"created_at"?: string,"id"?: never,"note"?: string | null,"reason": string,"user_id"?: string
                  }
                  Update: {
                    "card_id"?: string,"created_at"?: string,"id"?: never,"note"?: string | null,"reason"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_card_reports_card_id_fkey"
      columns: ["card_id"]
isOneToOne: false
      referencedRelation: "profession_cards"
      referencedColumns: ["id"]
    }
                  ]
                },"profession_card_states": {
                  Row: {
                    "card_id": string,"due_on": string,"lapse_count": number,"last_reviewed_on": string | null,"opened_at": string,"opened_on": string,"profession_id": string,"review_count": number,"stage": number,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "card_id": string,"due_on": string,"lapse_count"?: number,"last_reviewed_on"?: string | null,"opened_at"?: string,"opened_on": string,"profession_id": string,"review_count"?: number,"stage"?: number,"user_id": string
                  }
                  Update: {
                    "card_id"?: string,"due_on"?: string,"lapse_count"?: number,"last_reviewed_on"?: string | null,"opened_at"?: string,"opened_on"?: string,"profession_id"?: string,"review_count"?: number,"stage"?: number,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_card_states_card_id_fkey"
      columns: ["card_id"]
isOneToOne: false
      referencedRelation: "profession_cards"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profession_card_states_profession_id_fkey"
      columns: ["profession_id"]
isOneToOne: false
      referencedRelation: "professions"
      referencedColumns: ["id"]
    }
                  ]
                },"profession_cards": {
                  Row: {
                    "accepted_answers": (string)[],"answer": string | null,"answer_display": string | null,"as_of": string | null,"body": string,"checkpoint": boolean,"difficulty": number,"id": string,"kind": string,"module_id": string,"position": number,"profession_id": string,"refs": (string)[],"retired": boolean,"search_query": string | null,"tags": (string)[],"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"as_of"?: string | null,"body": string,"checkpoint"?: boolean,"difficulty": number,"id": string,"kind": string,"module_id": string,"position": number,"profession_id": string,"refs"?: (string)[],"retired"?: boolean,"search_query"?: string | null,"tags"?: (string)[],"title": string
                  }
                  Update: {
                    "accepted_answers"?: (string)[],"answer"?: string | null,"answer_display"?: string | null,"as_of"?: string | null,"body"?: string,"checkpoint"?: boolean,"difficulty"?: number,"id"?: string,"kind"?: string,"module_id"?: string,"position"?: number,"profession_id"?: string,"refs"?: (string)[],"retired"?: boolean,"search_query"?: string | null,"tags"?: (string)[],"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_cards_module_id_fkey"
      columns: ["module_id"]
isOneToOne: false
      referencedRelation: "profession_modules"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profession_cards_profession_id_fkey"
      columns: ["profession_id"]
isOneToOne: false
      referencedRelation: "professions"
      referencedColumns: ["id"]
    }
                  ]
                },"profession_enrollments": {
                  Row: {
                    "profession_id": string,"start_position": number,"started_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "profession_id": string,"start_position"?: number,"started_at"?: string,"user_id": string
                  }
                  Update: {
                    "profession_id"?: string,"start_position"?: number,"started_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_enrollments_profession_id_fkey"
      columns: ["profession_id"]
isOneToOne: false
      referencedRelation: "professions"
      referencedColumns: ["id"]
    }
                  ]
                },"profession_modules": {
                  Row: {
                    "id": string,"planned_cards": number,"position": number,"practice": NonNullable<Json>,"profession_id": string,"refs": (string)[],"summary": string,"tier": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id": string,"planned_cards": number,"position": number,"practice"?: NonNullable<Json>,"profession_id": string,"refs"?: (string)[],"summary": string,"tier": number,"title": string
                  }
                  Update: {
                    "id"?: string,"planned_cards"?: number,"position"?: number,"practice"?: NonNullable<Json>,"profession_id"?: string,"refs"?: (string)[],"summary"?: string,"tier"?: number,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_modules_profession_id_fkey"
      columns: ["profession_id"]
isOneToOne: false
      referencedRelation: "professions"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profession_modules_profession_id_tier_fkey"
      columns: ["profession_id","tier"]
isOneToOne: false
      referencedRelation: "profession_tiers"
      referencedColumns: ["profession_id","tier"]
    }
                  ]
                },"profession_tiers": {
                  Row: {
                    "milestone": string | null,"name": string,"planned_cards": number,"profession_id": string,"slug": string,"summary": string,"tier": number
                  }
                  ComputedFields: never
                  Insert: {
                    "milestone"?: string | null,"name": string,"planned_cards": number,"profession_id": string,"slug": string,"summary": string,"tier": number
                  }
                  Update: {
                    "milestone"?: string | null,"name"?: string,"planned_cards"?: number,"profession_id"?: string,"slug"?: string,"summary"?: string,"tier"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "profession_tiers_profession_id_fkey"
      columns: ["profession_id"]
isOneToOne: false
      referencedRelation: "professions"
      referencedColumns: ["id"]
    }
                  ]
                },"professions": {
                  Row: {
                    "accent": string,"description": string,"gradient": (string)[],"icon": string,"id": string,"name": string,"planned_cards": number,"position": number,"tagline": string
                  }
                  ComputedFields: never
                  Insert: {
                    "accent": string,"description": string,"gradient": (string)[],"icon": string,"id": string,"name": string,"planned_cards": number,"position"?: number,"tagline": string
                  }
                  Update: {
                    "accent"?: string,"description"?: string,"gradient"?: (string)[],"icon"?: string,"id"?: string,"name"?: string,"planned_cards"?: number,"position"?: number,"tagline"?: string
                  }
                  Relationships: [
                    
                  ]
                },"reviews": {
                  Row: {
                    "attempts": number,"id": number,"memory_id": string | null,"passed": boolean,"profession_card_id": string | null,"reviewed_at": string,"reviewed_on": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attempts"?: number,"id"?: never,"memory_id"?: string | null,"passed": boolean,"profession_card_id"?: string | null,"reviewed_at"?: string,"reviewed_on": string,"user_id"?: string
                  }
                  Update: {
                    "attempts"?: number,"id"?: never,"memory_id"?: string | null,"passed"?: boolean,"profession_card_id"?: string | null,"reviewed_at"?: string,"reviewed_on"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_memory_id_fkey"
      columns: ["memory_id"]
isOneToOne: false
      referencedRelation: "memories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_profession_card_id_fkey"
      columns: ["profession_card_id"]
isOneToOne: false
      referencedRelation: "profession_cards"
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
"get_profession_detail":
{ Args: { "p_profession_id": string,"p_today": string }; Returns: Json
                           },
"get_profession_overview":
{ Args: { "p_today": string }; Returns: Json
                           },
"get_progress":
{ Args: { "p_today": string }; Returns: Json
                           },
"next_schedule":
{ Args: { "p_passed": boolean,"p_stage": number }; Returns: Record<string, unknown>
                           },
"open_next_profession_card":
{ Args: { "p_profession_id": string,"p_today": string }; Returns: Json
                           },
"profession_due_cards":
{ Args: { "p_limit"?: number,"p_profession_id": string,"p_today": string }; Returns: {
              "accepted_answers": (string)[],"answer": string,"answer_display": string,"as_of": string,"body": string,"difficulty": number,"due_on": string,"id": string,"kind": string,"module_id": string,"module_title": string,"position": number,"refs": (string)[],"review_count": number,"search_query": string,"stage": number,"tags": (string)[],"title": string
            }[]
                           },
"profession_module_cards":
{ Args: { "p_module_id": string }; Returns: {
              "checkpoint": boolean,"difficulty": number,"due_on": string,"id": string,"kind": string,"position": number,"stage": number,"title": string
            }[]
                           },
"reset_account":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"reset_profession":
{ Args: { "p_profession_id": string }; Returns: undefined
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
      } },
"review_profession_card":
{ Args: { "p_attempts"?: number,"p_card_id": string,"p_passed": boolean,"p_today": string }; Returns: {
              "card_id": string,
"due_on": string,
"lapse_count": number,
"last_reviewed_on": string | null,
"opened_at": string,
"opened_on": string,
"profession_id": string,
"review_count": number,
"stage": number,
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "profession_card_states"
        isOneToOne: true
        isSetofReturn: false
      } },
"start_profession":
{ Args: { "p_profession_id": string,"p_start_tier"?: number }; Returns: {
              "profession_id": string,
"start_position": number,
"started_at": string,
"user_id": string
            }
                          SetofOptions: {
        from: "*"
        to: "profession_enrollments"
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
