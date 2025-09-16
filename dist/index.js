// server/index.ts
import express2 from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import compression from "compression";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false)
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// server/storage.ts
import bcrypt2 from "bcryptjs";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// server/mock-storage.ts
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
var MockStorage = class {
  users = [];
  products = [];
  constructor() {
    this.initializeDefaults();
  }
  async initializeDefaults() {
    const hashedPassword = await bcrypt.hash("password", 10);
    this.users.push({
      id: randomUUID(),
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    this.products = [
      {
        id: randomUUID(),
        name: "Premium School Uniform Fabric",
        description: "High-quality, durable fabric perfect for school uniforms. Available in navy blue and white with excellent color retention and wrinkle resistance.",
        price: 450,
        category: "School Uniforms",
        image: "/generated_images/School_uniform_fabric_samples_bdf2889f.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Security Guard Uniform Material",
        description: "Professional-grade fabric for security personnel. Tough, reliable, and maintains professional appearance even after extensive use.",
        price: 520,
        category: "Security Uniforms",
        image: "/generated_images/Security_uniform_fabric_collection_a6e53df7.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Corporate Staff Uniform Fabric",
        description: "Elegant fabric for corporate and staff uniforms. Perfect blend of comfort and professionalism for office environments.",
        price: 480,
        category: "Staff Uniforms",
        image: "/generated_images/Staff_uniform_fabric_samples_1370191d.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Executive School Blazer Material",
        description: "Premium blazer fabric for school formal wear. Sophisticated finish with excellent drape and durability.",
        price: 650,
        category: "School Uniforms",
        image: "/generated_images/School_uniform_fabric_samples_bdf2889f.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Hospital Staff Uniform Fabric",
        description: "Medical-grade uniform fabric. Easy to clean, comfortable, and maintains color after multiple washes.",
        price: 380,
        category: "Staff Uniforms",
        image: "/generated_images/Staff_uniform_fabric_samples_1370191d.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Security Officer Formal Fabric",
        description: "High-end fabric for senior security officers. Professional appearance with superior durability and comfort.",
        price: 580,
        category: "Security Uniforms",
        image: "/generated_images/Security_uniform_fabric_collection_a6e53df7.png",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
  }
  async getUser(id) {
    return this.users.find((user) => user.id === id);
  }
  async getUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const newUser = {
      id: randomUUID(),
      username: insertUser.username,
      password: hashedPassword,
      isAdmin: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
  async getAllProducts() {
    return [...this.products];
  }
  async getProduct(id) {
    return this.products.find((product) => product.id === id);
  }
  async createProduct(insertProduct) {
    const newProduct = {
      id: randomUUID(),
      ...insertProduct,
      image: insertProduct.image || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }
  async updateProduct(id, updateData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return void 0;
    this.products[index] = {
      ...this.products[index],
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.products[index];
  }
  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
};

// server/storage.ts
var storage = new MockStorage();

// server/routes.ts
import bcrypt3 from "bcryptjs";
import { randomUUID as randomUUID2 } from "crypto";
var productCache = /* @__PURE__ */ new Map();
var CACHE_TTL = 5 * 60 * 1e3;
function getCachedData(key) {
  const cached = productCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  productCache.delete(key);
  return null;
}
function setCachedData(key, data) {
  productCache.set(key, { data, timestamp: Date.now() });
}
function invalidateCache(pattern) {
  if (pattern) {
    for (const key of productCache.keys()) {
      if (key.includes(pattern)) {
        productCache.delete(key);
      }
    }
  } else {
    productCache.clear();
  }
}
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (user && await bcrypt3.compare(password, user.password)) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Session regeneration error:", err);
            return res.status(500).json({ error: "Login failed" });
          }
          req.session.userId = user.id;
          req.session.isAdmin = user.isAdmin;
          req.session.save((err2) => {
            if (err2) {
              console.error("Session save error:", err2);
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
  app2.post("/api/auth/logout", async (req, res) => {
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
  app2.get("/api/auth/me", async (req, res) => {
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
  const requireAuth = (req, res, next) => {
    if (req.session?.userId && req.session?.isAdmin) {
      next();
    } else {
      res.status(401).json({ error: "Authentication required" });
    }
  };
  app2.get("/api/products", async (req, res) => {
    try {
      const cacheKey = "products:all";
      let products2 = getCachedData(cacheKey);
      if (!products2) {
        products2 = await storage.getAllProducts();
        setCachedData(cacheKey, products2);
      }
      res.set({
        "Cache-Control": "public, max-age=300",
        // 5 minutes
        "ETag": `"${products2.length}-${Date.now()}"`
      });
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cacheKey = `products:${id}`;
      let product = getCachedData(cacheKey);
      if (!product) {
        product = await storage.getProduct(id);
        if (product) {
          setCachedData(cacheKey, product);
        }
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.set({
        "Cache-Control": "public, max-age=300",
        // 5 minutes
        "ETag": `"${id}-${product.updatedAt || product.createdAt}"`
      });
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", requireAuth, async (req, res) => {
    try {
      const validationResult = insertProductSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid product data",
          details: validationResult.error.errors
        });
      }
      const product = await storage.createProduct(validationResult.data);
      invalidateCache("products");
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", requireAuth, async (req, res) => {
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
      invalidateCache("products");
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      invalidateCache("products");
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, company, inquiryType, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const inquiry = {
        id: randomUUID2(),
        name,
        email,
        phone: phone || null,
        company: company || null,
        inquiryType: inquiryType || "general",
        message,
        status: "new",
        createdAt: /* @__PURE__ */ new Date()
      };
      console.log("New contact inquiry:", inquiry);
      await new Promise((resolve) => setTimeout(resolve, 500));
      res.status(201).json({
        success: true,
        message: "Thank you for your inquiry! We will get back to you within 24 hours.",
        inquiryId: inquiry.id
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit inquiry. Please try again." });
    }
  });
  app2.get("/api/contact/inquiries", requireAuth, async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });
  app2.post("/api/quote", async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        company,
        productCategory,
        quantity,
        deliveryDate,
        specialRequirements,
        message
      } = req.body;
      if (!name || !email || !productCategory || !quantity) {
        return res.status(400).json({ error: "Name, email, product category, and quantity are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const quoteRequest = {
        id: randomUUID2(),
        name,
        email,
        phone: phone || null,
        company: company || null,
        productCategory,
        quantity: parseInt(quantity),
        deliveryDate: deliveryDate || null,
        specialRequirements: specialRequirements || null,
        message: message || null,
        status: "pending",
        createdAt: /* @__PURE__ */ new Date()
      };
      console.log("New quote request:", quoteRequest);
      await new Promise((resolve) => setTimeout(resolve, 500));
      res.status(201).json({
        success: true,
        message: "Quote request submitted successfully! We will provide a detailed quote within 2 business days.",
        quoteId: quoteRequest.id
      });
    } catch (error) {
      console.error("Quote request error:", error);
      res.status(500).json({ error: "Failed to submit quote request. Please try again." });
    }
  });
  app2.get("/api/quote/requests", requireAuth, async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching quote requests:", error);
      res.status(500).json({ error: "Failed to fetch quote requests" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  const assetsPath = path2.resolve(import.meta.dirname, "..", "attached_assets");
  app2.use("/generated_images", express.static(path2.join(assetsPath, "generated_images")));
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  const assetsPath = path2.resolve(import.meta.dirname, "..", "attached_assets");
  app2.use("/generated_images", express.static(path2.join(assetsPath, "generated_images")));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(compression({
  level: 6,
  // Compression level (1-9, 6 is a good balance)
  threshold: 1024,
  // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers["cache-control"] && req.headers["cache-control"].includes("no-transform")) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false, limit: "10mb" }));
var MemoryStoreSession = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || "supreme-fabrics-secret-key",
  name: "sf.session",
  // Custom session name for security
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 864e5
    // prune expired entries every 24h
  }),
  cookie: {
    secure: app.get("env") === "production",
    // true in production with HTTPS
    httpOnly: true,
    sameSite: "strict",
    // Enhanced CSRF protection
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
