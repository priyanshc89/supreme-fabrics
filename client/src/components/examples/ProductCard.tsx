import ProductCard from '../ProductCard';
import schoolUniformImage from "@assets/generated_images/School_uniform_fabric_samples_bdf2889f.png";

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <ProductCard
        id="1"
        name="Premium School Uniform Fabric"
        description="High-quality, durable fabric perfect for school uniforms. Available in navy blue and white."
        price={450}
        category="School Uniforms"
        image={schoolUniformImage}
        onView={(id) => console.log('View product:', id)}
      />
      
      <ProductCard
        id="2"
        name="Premium School Uniform Fabric"
        description="High-quality, durable fabric perfect for school uniforms. Available in navy blue and white."
        price={450}
        category="School Uniforms"
        image={schoolUniformImage}
        isAdmin={true}
        onView={(id) => console.log('View product:', id)}
        onEdit={(id) => console.log('Edit product:', id)}
        onDelete={(id) => console.log('Delete product:', id)}
      />
    </div>
  );
}