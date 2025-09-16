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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-contact-title">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-subtitle">
            Get in touch with us for all your textile needs. We're here to help you find the perfect fabric solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6" data-testid="text-contact-info-title">
              Get in Touch
            </h2>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-contact-info-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1" data-testid={`text-contact-info-title-${index}`}>
                          {info.title}
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-line" data-testid={`text-contact-info-content-${index}`}>
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
                <h3 className="font-semibold mb-3" data-testid="text-additional-info-title">
                  Why Choose Supreme Fabrics?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center" data-testid="text-benefit-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    35+ years of textile manufacturing experience
                  </li>
                  <li className="flex items-center" data-testid="text-benefit-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    Premium quality fabrics at competitive prices
                  </li>
                  <li className="flex items-center" data-testid="text-benefit-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    Custom solutions for bulk orders
                  </li>
                  <li className="flex items-center" data-testid="text-benefit-4">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    Timely delivery across India
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-form-title">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter company name"
                        data-testid="input-contact-company"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                      <SelectTrigger data-testid="select-inquiry-type">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school-uniforms">School Uniforms</SelectItem>
                        <SelectItem value="staff-uniforms">Staff Uniforms</SelectItem>
                        <SelectItem value="security-uniforms">Security Uniforms</SelectItem>
                        <SelectItem value="corporate-suiting">Corporate Suiting</SelectItem>
                        <SelectItem value="bulk-order">Bulk Order</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
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