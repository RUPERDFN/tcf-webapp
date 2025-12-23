import {
  users,
  profiles,
  menus,
  shoppingLists,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type UpdateProfile,
  type Menu,
  type InsertMenu,
  type ShoppingList,
  type InsertShoppingList,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, data: UpdateProfile): Promise<Profile | undefined>;

  // Menus
  createMenu(menu: InsertMenu): Promise<Menu>;
  getLatestMenu(userId: string): Promise<Menu | undefined>;
  getMenuHistory(userId: string, limit?: number): Promise<Menu[]>;

  // Shopping Lists
  createShoppingList(list: InsertShoppingList): Promise<ShoppingList>;
  getLatestShoppingList(userId: string): Promise<ShoppingList | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfile): Promise<Profile | undefined> {
    const [updated] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updated || undefined;
  }

  // Menus
  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const [menu] = await db
      .insert(menus)
      .values(insertMenu)
      .returning();
    return menu;
  }

  async getLatestMenu(userId: string): Promise<Menu | undefined> {
    const [menu] = await db
      .select()
      .from(menus)
      .where(eq(menus.userId, userId))
      .orderBy(desc(menus.createdAt))
      .limit(1);
    return menu || undefined;
  }

  async getMenuHistory(userId: string, limit: number = 10): Promise<Menu[]> {
    return db
      .select()
      .from(menus)
      .where(eq(menus.userId, userId))
      .orderBy(desc(menus.createdAt))
      .limit(limit);
  }

  // Shopping Lists
  async createShoppingList(insertList: InsertShoppingList): Promise<ShoppingList> {
    const [list] = await db
      .insert(shoppingLists)
      .values(insertList)
      .returning();
    return list;
  }

  async getLatestShoppingList(userId: string): Promise<ShoppingList | undefined> {
    const [list] = await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.userId, userId))
      .orderBy(desc(shoppingLists.createdAt))
      .limit(1);
    return list || undefined;
  }
}

export const storage = new DatabaseStorage();
