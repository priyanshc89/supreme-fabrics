import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BarChart3, Package, Users, TrendingUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Product, type InsertProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddForm(false);
      toast({ title: "Success", description: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProduct> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({ title: "Success", description: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  });

  const stats = [
    { title: "Total Products", value: products.length, icon: Package, color: "text-blue-600" },
    { title: "Categories", value: new Set(products.map(p => p.category)).size, icon: BarChart3, color: "text-green-600" },
    { title: "Avg. Price", value: products.length > 0 ? `₹${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}` : "₹0", icon: TrendingUp, color: "text-purple-600" },
    { title: "Active Products", value: products.length, icon: Users, color: "text-orange-600" }
  ];

  const handleAddProduct = (productData: InsertProduct) => {
    createProductMutation.mutate(productData);
  };

  const handleEditProduct = (productData: Partial<InsertProduct>) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleViewProduct = (id: string) => {
    console.log('Viewing product:', id);
    // TODO: Implement product detail view
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-6xl px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-6xl px-6 py-8">
          <div className="text-center py-12">
            <p className="text-destructive">Error loading admin dashboard. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-admin-title">
              Admin Portal
            </h1>
            <p className="text-muted-foreground" data-testid="text-admin-subtitle">
              Manage your product catalog and inventory
            </p>
          </div>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" data-testid="button-add-product">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddForm(false)}
                isSubmitting={createProductMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-stat-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1" data-testid={`text-stat-title-${index}`}>
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/20 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span data-testid="text-products-section-title">Product Management</span>
              <span className="text-sm font-normal text-muted-foreground" data-testid="text-products-count">
                {products.length} products
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  image={product.image || '/placeholder-image.jpg'}
                  isAdmin={true}
                  onView={handleViewProduct}
                  onEdit={(id) => setEditingProduct(products.find(p => p.id === id) || null)}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12" data-testid="text-no-products">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleEditProduct}
                onCancel={() => setEditingProduct(null)}
                defaultValues={editingProduct ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: editingProduct.price,
                  category: editingProduct.category,
                  image: editingProduct.image || undefined
                } : undefined}
                isEditing={true}
                isSubmitting={updateProductMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>

      <Footer />
    </div>
  );
}