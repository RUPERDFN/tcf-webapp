import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User profiles - cooking preferences
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  budgetEurWeek: integer("budget_eur_week").notNull().default(50),
  diners: integer("diners").notNull().default(2),
  mealsPerDay: integer("meals_per_day").notNull().default(2),
  days: integer("days").notNull().default(5),
  dietType: text("diet_type").notNull().default('omnivora'),
  allergies: text("allergies").array().notNull().default([]),
  favoriteFoods: text("favorite_foods").array().notNull().default([]),
  dislikedFoods: text("disliked_foods").array().notNull().default([]),
  pantryItems: text("pantry_items").notNull().default(''),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  updatedAt: true,
});

export const updateProfileSchema = insertProfileSchema.partial().omit({ userId: true });

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Menus - generated meal plans
export const menus = pgTable("menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  menuData: jsonb("menu_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true,
});

export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Menu = typeof menus.$inferSelect;

// Shopping lists
export const shoppingLists = pgTable("shopping_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  items: jsonb("items").notNull(),
  totalCostEur: integer("total_cost_eur"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShoppingListSchema = createInsertSchema(shoppingLists).omit({
  id: true,
  createdAt: true,
});

export type InsertShoppingList = z.infer<typeof insertShoppingListSchema>;
export type ShoppingList = typeof shoppingLists.$inferSelect;
