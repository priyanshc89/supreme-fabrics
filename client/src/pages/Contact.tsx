import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Contact form submitted:', formData);
    // todo: replace with actual form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Thank you for your inquiry! We will get back to you soon.');
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      inquiryType: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "49, Murli Textile Tower, Pur Road, Bhilwara, Rajasthan - 311001"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 98765 43210"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@supremefabrics.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-subtitle">
            Get in touch with us for all your textile needs. We're here to help you find the perfect fabric solutions.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4" data-testid="text-contact-info-title">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Reach out to us for any questions about our products or services.
              </p>
            </div>
            
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover-elevate border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-200" data-testid={`card-contact-info-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold mb-2 text-foreground" data-testid={`text-contact-info-title-${index}`}>
                          {info.title}
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed" data-testid={`text-contact-info-content-${index}`}>
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4" data-testid="text-additional-info-title">
                  Why Choose Supreme Fabrics?
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start" data-testid="text-benefit-1">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>35+ years of textile manufacturing experience</span>
                  </li>
                  <li className="flex items-start" data-testid="text-benefit-2">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>Premium quality fabrics at competitive prices</span>
                  </li>
                  <li className="flex items-start" data-testid="text-benefit-3">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>Custom solutions for bulk orders</span>
                  </li>
                  <li className="flex items-start" data-testid="text-benefit-4">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>Timely delivery across India</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4" data-testid="text-form-title">
                Send us a Message
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter company name"
                        data-testid="input-contact-company"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType" className="text-sm font-medium">Inquiry Type</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                      <SelectTrigger data-testid="select-inquiry-type">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school-uniforms">School Uniforms</SelectItem>
                        <SelectItem value="staff-uniforms">Staff Uniforms</SelectItem>
                        <SelectItem value="security-uniforms">Security Uniforms</SelectItem>
                        <SelectItem value="suiting-materials">Suiting Materials</SelectItem>
                        <SelectItem value="corporate-wear">Corporate Wear</SelectItem>
                        <SelectItem value="industrial-wear">Industrial Wear</SelectItem>
                        <SelectItem value="bulk-order">Bulk Order</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your requirements..."
                      rows={5}
                      required
                      data-testid="input-contact-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-send-message"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}