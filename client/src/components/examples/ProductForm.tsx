import ProductForm from '../ProductForm';

export default function ProductFormExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Product Form */}
        <ProductForm
          onSubmit={(data) => console.log('Add product:', data)}
          onCancel={() => console.log('Add cancelled')}
        />
        
        {/* Edit Product Form */}
        <ProductForm
          onSubmit={(data) => console.log('Update product:', data)}
          onCancel={() => console.log('Edit cancelled')}
          defaultValues={{
            name: "Premium School Uniform Fabric",
            description: "High-quality, durable fabric perfect for school uniforms.",
            price: 450,
            category: "School Uniforms",
            image: "https://example.com/image.jpg"
          }}
          isEditing={true}
        />
      </div>
    </div>
  );
}