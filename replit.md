# Supreme Fabrics - Textile Manufacturing Website

## Overview

Supreme Fabrics is a professional B2B website for a textile manufacturing company established in 1990, specializing in uniform fabrics and suiting materials. The application is built as a full-stack web application with a React frontend and Express backend, designed to showcase products, company information, and provide an admin interface for product management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following professional B2B aesthetics
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **API Design**: RESTful API structure with CRUD operations for products
- **Storage**: In-memory storage with interface abstraction for easy database migration
- **Development**: Hot module replacement via Vite integration in development

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Products Table**: Product catalog (id, name, description, price, category, image)
- **Schema Validation**: Drizzle-zod integration for type-safe database operations

### Design System
- **Color Palette**: Professional navy blue primary, warm gray accents, minimal gold highlights
- **Typography**: Inter font family with structured hierarchy
- **Layout**: Container-based layout with max-width 1200px, consistent spacing units
- **Components**: Hover effects, elevation states, and responsive design patterns
- **Theme Support**: Light/dark mode support via CSS custom properties

### Authentication & Authorization
- Currently structured for basic username/password authentication
- Admin portal for product management operations
- Session-based authentication infrastructure prepared

### API Structure
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve single product
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL database connection via Neon
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

### UI & Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variant management
- **clsx**: Conditional className utility

### Development & Build Tools
- **vite**: Fast frontend build tool and development server
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: JavaScript bundler for production builds

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Form validation resolvers
- **wouter**: Minimalist routing library
- **zod**: TypeScript-first schema validation

### Backend Dependencies
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store (prepared for future use)
- **date-fns**: Modern date utility library

### Asset Management
- Hero and product images stored in attached_assets directory
- Generated placeholder images for development and demonstration