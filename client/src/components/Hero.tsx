import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import heroImage1 from "@assets/generated_images/Textile_manufacturing_facility_hero_710a8b19.png";
import heroImage2 from "@assets/generated_images/School_uniform_fabric_samples_bdf2889f.png";
import heroImage3 from "@assets/generated_images/Security_uniform_fabric_collection_a6e53df7.png";
import heroImage4 from "@assets/generated_images/Staff_uniform_fabric_samples_1370191d.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  
  // Array of hero images
  const heroImages = [
    { src: heroImage1, alt: "Supreme Fabrics Manufacturing Facility" },
    { src: heroImage2, alt: "School Uniform Fabric Samples" },
    { src: heroImage3, alt: "Security Uniform Fabric Collection" },
    { src: heroImage4, alt: "Staff Uniform Fabric Samples" }
  ];
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-switch images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleViewProducts = () => {
    setLocation("/products");
  };

  const handleContactUs = () => {
    setLocation("/contact");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImages[currentImageIndex].src} 
          alt={heroImages[currentImageIndex].alt} 
          className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      
      {/* Hero Content */}
      <div className="relative container mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" data-testid="text-hero-title">
            Premium Textile Manufacturing Since 1990
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200" data-testid="text-hero-description">
            Leading manufacturers and traders of high-quality uniform fabrics. Specializing in school uniforms, staff uniforms, security uniforms, and premium suiting materials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90" 
              data-testid="button-view-products"
              onClick={handleViewProducts}
            >
              View Our Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10" 
              data-testid="button-contact-us"
              onClick={handleContactUs}
            >
              Contact Us
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center" data-testid="stat-experience">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">35+</span>
              </div>
              <p className="text-sm text-gray-300">Years Experience</p>
            </div>
            <div className="text-center" data-testid="stat-products">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">500+</span>
              </div>
              <p className="text-sm text-gray-300">Products</p>
            </div>
            <div className="text-center" data-testid="stat-clients">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">1000+</span>
              </div>
              <p className="text-sm text-gray-300">Happy Clients</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}