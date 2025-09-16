import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";

export default function ProductShowcase() {
  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    }
  });

  // Group products by category and take the first from each
  const categoryGroups = allProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = product;
    }
    return acc;
  }, {} as Record<string, Product>);

  const featuredProducts = Object.values(categoryGroups).slice(0, 3).map(product => ({
    id: product.id,
    title: product.category,
    description: product.description,
    image: product.image || '/placeholder-image.jpg',
    features: getFeaturesByCategory(product.category)
  }));

  function getFeaturesByCategory(category: string) {
    const featureMap: Record<string, string[]> = {
      "School Uniforms": ["Wrinkle-resistant", "Color-fast", "Easy care"],
      "Security Uniforms": ["Tear-resistant", "Professional look", "Comfortable fit"],
      "Staff Uniforms": ["Business formal", "Breathable", "Premium finish"],
      default: ["High quality", "Durable", "Professional"]
    };
    return featureMap[category] || featureMap.default;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-showcase-title">
            Our Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-showcase-description">
            Discover our range of premium textile products, carefully crafted to meet the highest standards of quality and durability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover-elevate group" data-testid={`card-showcase-${product.id}`}>
              <CardHeader className="p-0">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    data-testid={`img-showcase-${product.id}`}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="mb-3" data-testid={`text-showcase-title-${product.id}`}>
                  {product.title}
                </CardTitle>
                <p className="text-muted-foreground mb-4" data-testid={`text-showcase-description-${product.id}`}>
                  {product.description}
                </p>
                
                <ul className="space-y-1 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center" data-testid={`text-feature-${product.id}-${index}`}>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" data-testid="button-view-all-products">
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}