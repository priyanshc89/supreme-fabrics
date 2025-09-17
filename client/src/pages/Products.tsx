import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Package, Send, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Handle product inquiry
  const handleInquiry = (product: Product) => {
    setSelectedProduct(product);
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      quantity: "",
      message: `I'm interested in ${product.name} (${product.category}) at ₹${product.price.toLocaleString()}/meter. Please provide more information about pricing and availability for the quantity I need.`
    });
    setIsInquiryModalOpen(true);
  };

  // Handle inquiry form submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Inquiry submitted:', {
        product: selectedProduct,
        inquiry: inquiryForm
      });
      
      alert('Thank you for your inquiry! We will get back to you soon.');
      
      // Reset form and close modal
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        quantity: "",
        message: ""
      });
      setIsInquiryModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Inquiry submission error:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    // Validate quantity field
    if (field === 'quantity') {
      const numValue = parseInt(value);
      if (value !== '' && (isNaN(numValue) || numValue < 1)) {
        return; // Don't update if invalid
      }
    }
    setInquiryForm(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto max-w-6xl px-6 py-8 flex-1">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto max-w-6xl px-6 py-8 flex-1">
          <div className="text-center py-12">
            <p className="text-destructive">Error loading products. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of textile fabrics designed for various industries and applications.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              image={product.image || '/placeholder-image.svg'}
              isAdmin={false}
              onView={() => handleInquiry(product)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No products available at the moment."
              }
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        )}

        {/* Inquiry Modal */}
        <Dialog open={isInquiryModalOpen} onOpenChange={setIsInquiryModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                Product Inquiry
              </DialogTitle>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-6">
                {/* Product Information */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="aspect-square w-16 h-16 overflow-hidden rounded-lg bg-muted">
                        <img 
                          src={selectedProduct.image || '/placeholder-image.svg'} 
                          alt={selectedProduct.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{selectedProduct.category}</p>
                        <p className="text-lg font-bold text-primary">₹{selectedProduct.price.toLocaleString()}/meter</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Specify quantity below for accurate pricing
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inquiry Form */}
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-name">Full Name *</Label>
                      <Input
                        id="inquiry-name"
                        value={inquiryForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-email">Email *</Label>
                      <Input
                        id="inquiry-email"
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-phone">Phone Number</Label>
                      <Input
                        id="inquiry-phone"
                        value={inquiryForm.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry-company">Company/Organization</Label>
                      <Input
                        id="inquiry-company"
                        value={inquiryForm.company}
                        onChange={(e) => handleFormChange('company', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry-quantity">Quantity Required *</Label>
                    <Input
                      id="inquiry-quantity"
                      type="number"
                      min="1"
                      value={inquiryForm.quantity}
                      onChange={(e) => handleFormChange('quantity', e.target.value)}
                      placeholder="Enter quantity in meters"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Please specify the quantity you need in meters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry-message">Message *</Label>
                    <Textarea
                      id="inquiry-message"
                      value={inquiryForm.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsInquiryModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
