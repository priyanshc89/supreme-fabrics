import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-xl font-bold text-primary" data-testid="text-footer-logo">Supreme Fabrics</div>
              <div className="text-xs text-muted-foreground">Est. 1990</div>
            </div>
            <p className="text-muted-foreground mb-6" data-testid="text-footer-description">
              Leading textile manufacturers and traders specializing in premium quality uniform fabrics and suiting materials for over three decades.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground" data-testid="text-footer-address">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                49, Murli Textile Tower, Pur Road, Bhilwara, Rajasthan - 311001
              </div>
              <div className="flex items-center text-sm text-muted-foreground" data-testid="text-footer-phone">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                +91 98765 43210
              </div>
              <div className="flex items-center text-sm text-muted-foreground" data-testid="text-footer-email">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                info@supremefabrics.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-links-title">Quick Links</h4>
            <nav className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" }
              ].map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}>
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-hours-title">Business Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground" data-testid="text-footer-hours">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <div>Mon - Sat: 9:00 AM - 7:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © 2024 Supreme Fabrics. All rights reserved. | Textile Manufacturers since 1990
          </p>
        </div>
      </div>
    </footer>
  );
}