/**
 * Database type definitions for the Smart Restaurant Management System.
 *
 * These types mirror the Supabase Postgres schema defined in
 * supabase/migrations/001_initial_schema.sql.
 *
 * For full auto-generated types, run:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/lib/types/database.ts
 *
 * The manual types below serve as a working baseline until the Supabase
 * project is connected.
 */

// ========================
// Enum Types
// ========================

export type AvailabilityStatus = "available" | "low" | "out";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served"
  | "billed";

export type TableStatus = "free" | "occupied" | "reserved";

export type StaffRole = "admin" | "manager" | "chef" | "waiter";

export type ReservationStatus = "waiting" | "seated" | "cancelled" | "completed";

export type CourseCategory = "starter" | "main" | "dessert" | "beverage";

// ========================
// Row Types (what you get from a SELECT)
// ========================

export interface Restaurant {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  availability_status: AvailabilityStatus;
  is_veg: boolean;
  prep_time_minutes: number | null;
  course_category: CourseCategory;
  available_modifiers: { name: string; price: number }[];
  created_at: string;
}

export interface Ingredient {
  id: string;
  restaurant_id: string;
  name: string;
  unit: string;
  quantity_in_stock: number;
  low_stock_threshold: number;
  allergens: string[];
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  menu_item_id: string;
  ingredient_id: string;
  quantity_required: number;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  status: TableStatus;
  occupied_since: string | null;
}

export interface Staff {
  id: string;
  user_id: string | null;
  restaurant_id: string;
  name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  pin_code: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  staff_id: string | null;
  customer_name: string | null;
  status: OrderStatus;
  special_instructions: string | null;
  total_amount: number;
  placed_at: string;
  confirmed_at: string | null;
  preparing_at: string | null;
  ready_at: string | null;
  served_at: string | null;
  billed_at: string | null;
  chef_override_minutes: number | null;
  reservation_id: string | null;
  is_pre_order: boolean;
  ingredients_deducted: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string | null;
  course_override: CourseCategory | null;
  modifiers: { name: string; price: number }[];
  is_held: boolean;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  party_size: number;
  status: ReservationStatus;
  queue_position: number | null;
  estimated_wait_minutes: number | null;
  reserved_for: string | null;
  created_at: string;
}

// ========================
// Insert Types (what you send to an INSERT)
// ========================

export interface RestaurantInsert {
  id?: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  logo_url?: string | null;
  settings?: Record<string, unknown>;
  created_at?: string;
}

export interface CategoryInsert {
  id?: string;
  restaurant_id: string;
  name: string;
  sort_order?: number;
}

export interface MenuItemInsert {
  id?: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  availability_status?: AvailabilityStatus;
  is_veg?: boolean;
  prep_time_minutes?: number | null;
  course_category?: CourseCategory;
  available_modifiers?: { name: string; price: number }[];
  created_at?: string;
}

export interface IngredientInsert {
  id?: string;
  restaurant_id: string;
  name: string;
  unit: string;
  quantity_in_stock?: number;
  low_stock_threshold?: number;
  allergens?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RecipeIngredientInsert {
  id?: string;
  menu_item_id: string;
  ingredient_id: string;
  quantity_required: number;
}

export interface TableInsert {
  id?: string;
  restaurant_id: string;
  table_number: string;
  capacity?: number;
  status?: TableStatus;
  occupied_since?: string | null;
}

export interface StaffInsert {
  id?: string;
  user_id?: string | null;
  restaurant_id: string;
  name: string;
  email: string;
  role?: StaffRole;
  is_active?: boolean;
  pin_code?: string | null;
  created_at?: string;
}

export interface OrderInsert {
  id?: string;
  restaurant_id: string;
  table_id?: string | null;
  staff_id?: string | null;
  customer_name?: string | null;
  status?: OrderStatus;
  special_instructions?: string | null;
  total_amount?: number;
  placed_at?: string;
  confirmed_at?: string | null;
  preparing_at?: string | null;
  ready_at?: string | null;
  served_at?: string | null;
  billed_at?: string | null;
  chef_override_minutes?: number | null;
  reservation_id?: string | null;
  is_pre_order?: boolean;
  ingredients_deducted?: boolean;
}

export interface OrderItemInsert {
  id?: string;
  order_id: string;
  menu_item_id: string;
  quantity?: number;
  unit_price: number;
  subtotal: number;
  notes?: string | null;
  course_override?: CourseCategory | null;
  modifiers?: { name: string; price: number }[];
  is_held?: boolean;
}

export interface ReservationInsert {
  id?: string;
  restaurant_id: string;
  table_id?: string | null;
  customer_name: string;
  customer_phone?: string | null;
  party_size?: number;
  status?: ReservationStatus;
  queue_position?: number | null;
  estimated_wait_minutes?: number | null;
  reserved_for?: string | null;
  created_at?: string;
}

// ========================
// Update Types (what you send to an UPDATE — all fields optional)
// ========================

export type RestaurantUpdate = Partial<RestaurantInsert>;
export type CategoryUpdate = Partial<CategoryInsert>;
export type MenuItemUpdate = Partial<MenuItemInsert>;
export type IngredientUpdate = Partial<IngredientInsert>;
export type RecipeIngredientUpdate = Partial<RecipeIngredientInsert>;
export type TableUpdate = Partial<TableInsert>;
export type StaffUpdate = Partial<StaffInsert>;
export type OrderUpdate = Partial<OrderInsert>;
export type OrderItemUpdate = Partial<OrderItemInsert>;
export type ReservationUpdate = Partial<ReservationInsert>;

// ========================
// Supabase Database Type (for createClient<Database> generic)
// ========================

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: Restaurant;
        Insert: RestaurantInsert;
        Update: RestaurantUpdate;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [
          { foreignKeyName: "categories_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] }
        ];
      };
      menu_items: {
        Row: MenuItem;
        Insert: MenuItemInsert;
        Update: MenuItemUpdate;
        Relationships: [
          { foreignKeyName: "menu_items_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] },
          { foreignKeyName: "menu_items_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "categories"; referencedColumns: ["id"] }
        ];
      };
      ingredients: {
        Row: Ingredient;
        Insert: IngredientInsert;
        Update: IngredientUpdate;
        Relationships: [
          { foreignKeyName: "ingredients_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] }
        ];
      };
      recipe_ingredients: {
        Row: RecipeIngredient;
        Insert: RecipeIngredientInsert;
        Update: RecipeIngredientUpdate;
        Relationships: [
          { foreignKeyName: "recipe_ingredients_menu_item_id_fkey"; columns: ["menu_item_id"]; isOneToOne: false; referencedRelation: "menu_items"; referencedColumns: ["id"] },
          { foreignKeyName: "recipe_ingredients_ingredient_id_fkey"; columns: ["ingredient_id"]; isOneToOne: false; referencedRelation: "ingredients"; referencedColumns: ["id"] }
        ];
      };
      tables: {
        Row: Table;
        Insert: TableInsert;
        Update: TableUpdate;
        Relationships: [
          { foreignKeyName: "tables_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] }
        ];
      };
      staff: {
        Row: Staff;
        Insert: StaffInsert;
        Update: StaffUpdate;
        Relationships: [
          { foreignKeyName: "staff_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] }
        ];
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [
          { foreignKeyName: "orders_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_table_id_fkey"; columns: ["table_id"]; isOneToOne: false; referencedRelation: "tables"; referencedColumns: ["id"] }
        ];
      };
      order_items: {
        Row: OrderItem;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; isOneToOne: false; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_menu_item_id_fkey"; columns: ["menu_item_id"]; isOneToOne: false; referencedRelation: "menu_items"; referencedColumns: ["id"] }
        ];
      };
      reservations: {
        Row: Reservation;
        Insert: ReservationInsert;
        Update: ReservationUpdate;
        Relationships: [
          { foreignKeyName: "reservations_restaurant_id_fkey"; columns: ["restaurant_id"]; isOneToOne: false; referencedRelation: "restaurants"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: {
      availability_status: AvailabilityStatus;
      order_status: OrderStatus;
      table_status: TableStatus;
      staff_role: StaffRole;
      reservation_status: ReservationStatus;
      course_category: CourseCategory;
    };
  };
}

// ========================
// Utility Types (for joins, extended queries)
// ========================

/** MenuItem with its category name joined */
export interface MenuItemWithCategory extends MenuItem {
  category: Pick<Category, "id" | "name">;
}

/** Order with its items and table info joined */
export interface OrderWithDetails extends Order {
  table: Pick<Table, "id" | "table_number" | "capacity">;
  order_items: (OrderItem & {
    menu_item: Pick<MenuItem, "id" | "name" | "is_veg" | "image_url" | "course_category">;
  })[];
}

/** Reservation with table info joined */
export interface ReservationWithTable extends Reservation {
  table: Pick<Table, "id" | "table_number" | "capacity"> | null;
}
