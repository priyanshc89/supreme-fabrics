import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { type InsertProduct } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional().or(z.literal("")),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: InsertProduct) => void;
  onCancel: () => void;
  defaultValues?: Partial<ProductFormData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const categories = [
  "School Uniforms",
  "Staff Uniforms", 
  "Security Uniforms",
  "Suiting Materials",
  "Corporate Wear",
  "Industrial Wear"
];

export default function ProductForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  isSubmitting = false
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image || null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price || 0,
      category: defaultValues?.category || "",
      image: defaultValues?.image || "",
    }
  });

  const watchedImage = watch("image");

  const handleFormSubmit = (data: ProductFormData) => {
    const productData: InsertProduct = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image || undefined,
    };
    onSubmit(productData);
  };

  const handleImageChange = (value: string) => {
    setValue("image", value);
    setImagePreview(value);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setValue("image", result.imageUrl);
      setImagePreview(result.imageUrl);
      setUploadedFile(file);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
    setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    reset();
    setImagePreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter product name"
              data-testid="input-product-name"
            />
            {errors.name && (
              <p className="text-sm text-destructive" data-testid="error-name">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter product description"
              rows={3}
              data-testid="textarea-product-description"
            />
            {errors.description && (
              <p className="text-sm text-destructive" data-testid="error-description">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ per meter) *</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="0"
                data-testid="input-product-price"
              />
              {errors.price && (
                <p className="text-sm text-destructive" data-testid="error-price">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger data-testid="select-product-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive" data-testid="error-category">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Product Image</Label>
            
            {/* File Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSubmitting}
                  className="flex items-center gap-2"
                  data-testid="button-upload-image"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  or enter URL below
                </span>
              </div>
              
              {/* Image URL Input */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm">Image URL</Label>
                <Input
                  id="image"
                  {...register("image")}
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => handleImageChange(e.target.value)}
                  data-testid="input-product-image"
                />
                {errors.image && (
                  <p className="text-sm text-destructive" data-testid="error-image">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Image Preview</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-destructive hover:text-destructive"
                  data-testid="button-remove-image"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="aspect-[4/3] w-full max-w-sm overflow-hidden rounded-lg border relative group">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                  data-testid="img-product-preview"
                  onError={() => setImagePreview(null)}
                />
                {uploadedFile && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    <ImageIcon className="h-3 w-3 inline mr-1" />
                    Uploaded
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit-product"
            >
              {isSubmitting 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Product" : "Create Product")
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              data-testid="button-cancel-product"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
