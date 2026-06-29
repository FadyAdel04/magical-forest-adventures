import type { ProductFeature, ProductSlide } from "./types";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      products: {
        Row: {
          id: string;
          badge: string;
          title: string;
          title_highlight: string;
          description: string;
          price_before: number;
          price_after: number;
          offer_enabled: boolean;
          currency: string;
          features: ProductFeature[];
          slides: ProductSlide[];
          sku_code: string;
          active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          badge: string;
          title: string;
          title_highlight: string;
          description: string;
          price_before: number;
          price_after: number;
          offer_enabled: boolean;
          currency: string;
          features?: ProductFeature[];
          slides?: ProductSlide[];
          sku_code?: string;
          active?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      shipping_settings: {
        Row: {
          id: string;
          default_fee: number;
          governorate_fees: { governorate: string; fee: number }[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          default_fee: number;
          governorate_fees: { governorate: string; fee: number }[];
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shipping_settings"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          phone: string;
          governorate: string;
          address: string;
          notes: string;
          quantity: number;
          unit_price: number;
          shipping_fee: number;
          subtotal: number;
          total: number;
          email: string;
          city: string;
          area: string;
          bosta_district_id: string | null;
          payment_method: string;
          bosta_status: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          bosta_order_sent: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          phone: string;
          governorate: string;
          address: string;
          notes?: string;
          quantity: number;
          unit_price: number;
          shipping_fee: number;
          subtotal: number;
          total: number;
          email?: string;
          city?: string;
          area?: string;
          bosta_district_id?: string | null;
          payment_method?: string;
          bosta_status?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          bosta_order_sent?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          book_id: string;
          title: string;
          sku_code: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          book_id: string;
          title: string;
          sku_code: string;
          quantity: number;
          price: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
};
