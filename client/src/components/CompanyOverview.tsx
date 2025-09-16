import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Award } from "lucide-react";

export default function CompanyOverview() {
  const businessDetails = [
    {
      icon: Building2,
      label: "Business Type",
      value: "Textile Manufacturers and Traders"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "49, Murli Textile Tower, Pur Road, Bhilwara, Rajasthan - 311001"
    },
    {
      icon: Calendar,
      label: "Established",
      value: "1990"
    },
    {
      icon: Award,
      label: "Specialization",
      value: "Uniforms & Suiting Materials"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-company-title">
            About Supreme Fabrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-company-description">
            With over three decades of excellence in textile manufacturing, we have established ourselves as a trusted name in the industry, delivering premium quality fabrics for various uniform needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessDetails.map((detail, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-detail-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <detail.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" data-testid={`text-detail-label-${index}`}>
                      {detail.label}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`text-detail-value-${index}`}>
                      {detail.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Specialties */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8" data-testid="text-specialties-title">
            Our Specialties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "School Uniforms",
              "Staff Uniforms", 
              "Security Uniforms",
              "Corporate Suiting",
              "Custom Tailoring",
              "Bulk Orders"
            ].map((specialty, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`card-specialty-${index}`}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-primary" data-testid={`text-specialty-${index}`}>
                    {specialty}
                  </h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}