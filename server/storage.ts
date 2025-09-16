import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    
    // Initialize with some sample products
    this.initializeSampleProducts();
  }

  private async initializeSampleProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium School Uniform Fabric",
        description: "High-quality, durable fabric perfect for school uniforms. Available in navy blue and white with excellent color retention and wrinkle resistance.",
        price: 450,
        category: "School Uniforms",
        image: "/generated_images/School_uniform_fabric_samples_bdf2889f.png"
      },
      {
        name: "Security Guard Uniform Material",
        description: "Professional-grade fabric for security personnel. Tough, reliable, and maintains professional appearance even after extensive use.",
        price: 520,
        category: "Security Uniforms",
        image: "/generated_images/Security_uniform_fabric_collection_a6e53df7.png"
      },
      {
        name: "Corporate Staff Uniform Fabric",
        description: "Elegant fabric for corporate and staff uniforms. Perfect blend of comfort and professionalism for office environments.",
        price: 480,
        category: "Staff Uniforms",
        image: "/generated_images/Staff_uniform_fabric_samples_1370191d.png"
      },
      {
        name: "Executive School Blazer Material",
        description: "Premium blazer fabric for school formal wear. Sophisticated finish with excellent drape and durability.",
        price: 650,
        category: "School Uniforms",
        image: "/generated_images/School_uniform_fabric_samples_bdf2889f.png"
      },
      {
        name: "Hospital Staff Uniform Fabric",
        description: "Medical-grade uniform fabric. Easy to clean, comfortable, and maintains color after multiple washes.",
        price: 380,
        category: "Staff Uniforms",
        image: "/generated_images/Staff_uniform_fabric_samples_1370191d.png"
      },
      {
        name: "Security Officer Formal Fabric",
        description: "High-end fabric for senior security officers. Professional appearance with superior durability and comfort.",
        price: 580,
        category: "Security Uniforms",
        image: "/generated_images/Security_uniform_fabric_collection_a6e53df7.png"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      image: insertProduct.image || null
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct: Product = { ...existingProduct, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
