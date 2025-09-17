import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Factory, Truck } from "lucide-react";

export default function About() {
  const milestones = [
    { year: "1990", event: "Company established in Bhilwara, Rajasthan" },
    { year: "1995", event: "Expanded into school uniform fabrics" },
    { year: "2000", event: "Added security uniform materials to product line" },
    { year: "2005", event: "Introduced corporate staff uniform fabrics" },
    { year: "2010", event: "Modernized manufacturing facility" },
    { year: "2015", event: "Achieved ISO quality certification" },
    { year: "2020", event: "Expanded distribution network across India" },
    { year: "2024", event: "Celebrating 34+ years of excellence" }
  ];

  const values = [
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We maintain the highest standards in every fabric we produce, ensuring durability and comfort."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Our customers' satisfaction drives everything we do, from design to delivery."
    },
    {
      icon: Factory,
      title: "Innovation",
      description: "Continuously improving our processes and products to meet evolving market needs."
    },
    {
      icon: Truck,
      title: "Reliable Service",
      description: "Timely delivery and consistent quality that you can depend on."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-title">
            About Supreme Fabrics
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-about-subtitle">
            Three decades of excellence in textile manufacturing, serving customers across India with premium quality uniform fabrics and suiting materials.
          </p>
        </div>

        {/* Company Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6" data-testid="text-story-title">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p data-testid="text-story-paragraph-1">
                  Founded in 1990 in the textile hub of Bhilwara, Rajasthan, Supreme Fabrics began as a small family business with a vision to provide high-quality uniform fabrics to educational institutions and corporations.
                </p>
                <p data-testid="text-story-paragraph-2">
                  Over the past three decades, we have grown from a local supplier to a trusted manufacturer serving clients across India. Our commitment to quality, innovation, and customer satisfaction has been the cornerstone of our success.
                </p>
                <p data-testid="text-story-paragraph-3">
                  Today, Supreme Fabrics is recognized as a leading supplier of uniform fabrics, specializing in school uniforms, staff uniforms, security uniforms, and premium suiting materials. We take pride in our state-of-the-art manufacturing facility and skilled workforce.
                </p>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6" data-testid="text-highlights-title">Company Highlights</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center" data-testid="stat-years">
                  <div className="text-3xl font-bold text-primary mb-2">35+</div>
                  <div className="text-sm text-muted-foreground">Years of Experience</div>
                </div>
                <div className="text-center" data-testid="stat-clients">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Satisfied Clients</div>
                </div>
                <div className="text-center" data-testid="stat-products">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Product Variants</div>
                </div>
                <div className="text-center" data-testid="stat-states">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">States Served</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-values-title">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`card-value-${index}`}>
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-value-description-${index}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Management Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-management-title">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover-elevate" data-testid="card-management-1">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2" data-testid="text-management-name-1">Ramprakash Chitlangia</h3>
                <p className="text-primary font-medium mb-2" data-testid="text-management-position-1">Managing Director</p>
                <p className="text-sm text-muted-foreground" data-testid="text-management-description-1">
                  With over 25 years of experience in textile manufacturing, Ramprakash leads our strategic vision and ensures operational excellence across all departments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-elevate" data-testid="card-management-2">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2" data-testid="text-management-name-2">Ayush Chitlanngia</h3>
                <p className="text-primary font-medium mb-2" data-testid="text-management-position-2">Production Head</p>
                <p className="text-sm text-muted-foreground" data-testid="text-management-description-2">
                  Ayush oversees our manufacturing operations, ensuring quality control and efficiency in our production processes with her 20+ years of expertise.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-elevate" data-testid="card-management-3">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2" data-testid="text-management-name-3">Priyansh Chitlangia</h3>
                <p className="text-primary font-medium mb-2" data-testid="text-management-position-3">Quality Assurance Manager</p>
                <p className="text-sm text-muted-foreground" data-testid="text-management-description-3">
                  Priyansh ensures that every fabric meets our stringent quality standards, maintaining our reputation for excellence in the textile industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-timeline-title">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors" data-testid={`timeline-item-${index}`}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary" data-testid={`text-timeline-year-${index}`}>
                    {milestone.year}
                  </span>
                </div>
                <p className="text-muted-foreground" data-testid={`text-timeline-event-${index}`}>
                  {milestone.event}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-muted/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4" data-testid="text-contact-section-title">
            Ready to Work With Us?
          </h3>
          <p className="text-muted-foreground mb-6" data-testid="text-contact-section-description">
            Experience the Supreme Fabrics difference. Contact us today to discuss your textile requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="inline-block">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors" data-testid="button-contact-us">
                Contact Us
              </button>
            </a>
            <a href="/products" className="inline-block">
              <button className="border border-border hover:bg-muted px-6 py-2 rounded-md font-medium transition-colors" data-testid="button-view-products">
                View Products
              </button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
