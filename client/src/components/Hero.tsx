import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/Textile_manufacturing_facility_hero_710a8b19.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Supreme Fabrics Manufacturing Facility" 
          className="h-full w-full object-cover"
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
            <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-view-products">
              View Our Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" data-testid="button-contact-us">
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
    </section>
  );
}