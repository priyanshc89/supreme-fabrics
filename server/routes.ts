import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for image uploads
  const storage_dir = path.join(process.cwd(), "attached_assets", "generated_images");
  
  // Ensure the directory exists
  if (!fs.existsSync(storage_dir)) {
    fs.mkdirSync(storage_dir, { recursive: true });
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, storage_dir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });

  // Authentication Routes
  
  // POST /api/auth/login - User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (user && await bcrypt.compare(password, user.password)) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Session regeneration error:", err);
            return res.status(500).json({ error: "Login failed" });
          }
          
          req.session.userId = user.id;
          req.session.isAdmin = user.isAdmin;
          
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              return res.status(500).json({ error: "Login failed" });
            }
            
            return res.json({
              success: true,
              user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
              }
            });
          });
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // POST /api/auth/logout - User logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ error: "Logout failed" });
        }
        
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // GET /api/auth/me - Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (req.session?.userId) {
        const user = await storage.getUser(req.session.userId);
        
        if (user) {
          res.json({
            user: {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin
            }
          });
        } else {
          res.status(401).json({ error: "Not authenticated" });
        }
      } else {
        res.status(401).json({ error: "Not authenticated" });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Authentication check failed" });
    }
  });

  // Image Upload Routes
  
  // POST /api/upload/image - Upload product image
  app.post("/api/upload/image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Check if user is authenticated and is admin
      if (!req.session?.userId || !req.session?.isAdmin) {
        // Delete the uploaded file if user is not authorized
        fs.unlinkSync(req.file.path);
        return res.status(401).json({ error: "Unauthorized" });
      }

      const imageUrl = `/generated_images/${req.file.filename}`;
      res.json({ 
        success: true, 
        imageUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  });

  // Product Routes
  
  // GET /api/products - Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // GET /api/products/:id - Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // POST /api/products - Create new product
  app.post("/api/products", async (req, res) => {
    try {
      const validationResult = insertProductSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid product data", 
          details: validationResult.error.errors 
        });
      }
      
      const product = await storage.createProduct(validationResult.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // PUT /api/products/:id - Update product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validationResult = insertProductSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid product data", 
          details: validationResult.error.errors 
        });
      }
      
      const product = await storage.updateProduct(id, validationResult.data);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // DELETE /api/products/:id - Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
