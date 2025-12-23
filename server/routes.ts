import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  insertUserSchema,
  insertProfileSchema,
  updateProfileSchema,
  insertMenuSchema,
  insertShoppingListSchema,
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "tcf-secret-key-change-in-production";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.userId = user.userId;
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);

      // Check if user exists
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
      });

      // Create default profile
      await storage.createProfile({
        userId: user.id,
        budgetEurWeek: 50,
        diners: 2,
        mealsPerDay: 2,
        days: 5,
        dietType: "omnivora",
        allergies: [],
        favoriteFoods: [],
        dislikedFoods: [],
        pantryItems: "",
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        user: { id: user.id, email: user.email },
        token,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        user: { id: user.id, email: user.email },
        token,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });

  // Profile routes
  app.get("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const profile = await storage.getProfile(req.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", authenticateToken, async (req: any, res) => {
    try {
      const data = updateProfileSchema.parse(req.body);
      const updated = await storage.updateProfile(req.userId, data);
      if (!updated) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(400).json({ error: error.message || "Failed to update profile" });
    }
  });

  // Menu routes
  app.post("/api/menus", authenticateToken, async (req: any, res) => {
    try {
      const menuData = req.body;
      const menu = await storage.createMenu({
        userId: req.userId,
        menuData,
      });
      res.json(menu);
    } catch (error: any) {
      console.error("Create menu error:", error);
      res.status(400).json({ error: "Failed to save menu" });
    }
  });

  app.get("/api/menus/latest", authenticateToken, async (req: any, res) => {
    try {
      const menu = await storage.getLatestMenu(req.userId);
      if (!menu) {
        return res.json([]);
      }
      res.json(menu.menuData);
    } catch (error: any) {
      console.error("Get latest menu error:", error);
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  app.get("/api/menus/history", authenticateToken, async (req: any, res) => {
    try {
      const menus = await storage.getMenuHistory(req.userId);
      res.json(menus);
    } catch (error: any) {
      console.error("Get menu history error:", error);
      res.status(500).json({ error: "Failed to fetch menu history" });
    }
  });

  // Shopping list routes
  app.post("/api/shopping", authenticateToken, async (req: any, res) => {
    try {
      const { items, totalCostEur } = req.body;
      const list = await storage.createShoppingList({
        userId: req.userId,
        items,
        totalCostEur,
      });
      res.json(list);
    } catch (error: any) {
      console.error("Create shopping list error:", error);
      res.status(400).json({ error: "Failed to save shopping list" });
    }
  });

  app.get("/api/shopping/latest", authenticateToken, async (req: any, res) => {
    try {
      const list = await storage.getLatestShoppingList(req.userId);
      if (!list) {
        return res.json({ items: [] });
      }
      res.json(list.items);
    } catch (error: any) {
      console.error("Get latest shopping list error:", error);
      res.status(500).json({ error: "Failed to fetch shopping list" });
    }
  });

  return httpServer;
}
