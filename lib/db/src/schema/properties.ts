import {
  pgTable,
  text,
  serial,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull().default("sale"),
  propertyType: text("property_type").notNull().default("apartment"),
  status: text("status").notNull().default("active"),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: numeric("area", { precision: 10, scale: 2 }).notNull().default("0"),
  location: text("location").notNull(),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  agentName: text("agent_name"),
  agentPhone: text("agent_phone"),
  agentEmail: text("agent_email"),
  featured: boolean("featured").notNull().default(false),
  possessionStatus: text("possession_status").default("ready_to_move"),
  possessionDate: timestamp("possession_date"),
  facing: text("facing"),
  vastuCompliant: boolean("vastu_compliant").notNull().default(false),
  nearbyMetro: text("nearby_metro"),
  nearbySchool: text("nearby_school"),
  nearbyHospital: text("nearby_hospital"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
