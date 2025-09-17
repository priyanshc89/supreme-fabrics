import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAdmin?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ 
  id, 
  name, 
  description, 
  price, 
  category, 
  image, 
  isAdmin = false,
  onView,
  onEdit,
  onDelete 
}: ProductCardProps) {
  return (
    <Card className="hover-elevate h-full flex flex-col" data-testid={`card-product-${id}`}>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
          <img 
            src={image || '/placeholder-image.svg'} 
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            data-testid={`img-product-${id}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
            }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg" data-testid={`text-product-name-${id}`}>
            {name}
          </CardTitle>
          <Badge variant="secondary" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4" data-testid={`text-product-description-${id}`}>
          {description}
        </p>
        
        <div className="text-2xl font-bold text-primary" data-testid={`text-product-price-${id}`}>
          ₹{price.toLocaleString()}/meter
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 gap-2">
        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView?.(id)}
              data-testid={`button-view-${id}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(id)}
              data-testid={`button-edit-${id}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete?.(id)}
              data-testid={`button-delete-${id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full"
            onClick={() => onView?.(id)}
            data-testid={`button-inquire-${id}`}
          >
            Inquire Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}