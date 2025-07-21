import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Shield, Lock, Eye, FileCheck, Server, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/card";
import { PublicHeader } from "@/shared/ui/components/public-header";
import { PublicFooter } from "@/shared/ui/components/public-footer";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-white pt-16 pb-20 md:pt-24 md:pb-28">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
            Enterprise-Grade <span className="text-primary">Security</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Your data security is our top priority. Learn about our comprehensive 
            security measures, compliance certifications, and data protection policies.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const SecurityOverview = () => {
  const securityFeatures = [
    {
      title: "Data Encryption",
      description: "End-to-end encryption with AES-256 for data at rest and TLS 1.3 for data in transit.",
      icon: Lock
    },
    {
      title: "Access Controls",
      description: "Role-based access control (RBAC) with multi-factor authentication and SSO integration.",
      icon: Users
    },
    {
      title: "Infrastructure Security",
      description: "SOC 2 Type II compliant infrastructure hosted on enterprise cloud platforms.",
      icon: Server
    },
    {
      title: "Privacy Protection",
      description: "GDPR and CCPA compliant data handling with comprehensive privacy controls.",
      icon: Eye
    },
    {
      title: "Audit & Monitoring",
      description: "Continuous security monitoring with comprehensive audit logs and alerting.",
      icon: Shield
    },
    {
      title: "Compliance",
      description: "Regular security assessments and compliance with industry standards.",
      icon: FileCheck
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Security Architecture
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Built with security-first principles to protect your sensitive HR data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComplianceSection = () => (
  <section className="py-16 md:py-24 bg-neutral-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Compliance & Certifications
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          We maintain the highest standards of compliance with industry regulations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            title: "SOC 2 Type II",
            description: "Certified for security, availability, processing integrity, confidentiality, and privacy.",
            badge: "🏆"
          },
          {
            title: "ISO 27001",
            description: "International standard for information security management systems.",
            badge: "🛡️"
          },
          {
            title: "GDPR Compliant",
            description: "Full compliance with European data protection regulations.",
            badge: "🇪🇺"
          },
          {
            title: "CCPA Compliant", 
            description: "California Consumer Privacy Act compliance for US customers.",
            badge: "🇺🇸"
          }
        ].map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">{cert.badge}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
            <p className="text-neutral-600 text-sm">{cert.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DataProtection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Data Protection Policies
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive policies governing how we collect, use, and protect your data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• AES-256 encryption for all data at rest</p>
              <p>• TLS 1.3 for all data in transit</p>
              <p>• Regular key rotation and management</p>
              <p>• End-to-end encryption for sensitive data</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Role-based access control (RBAC)</p>
              <p>• Multi-factor authentication (MFA)</p>
              <p>• Single Sign-On (SSO) integration</p>
              <p>• Regular access reviews and audits</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• SOC 2 Type II certified data centers</p>
              <p>• 99.9% uptime SLA with redundancy</p>
              <p>• Regular security patches and updates</p>
              <p>• Isolated environments and networks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Monitoring & Auditing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• 24/7 security monitoring and alerting</p>
              <p>• Comprehensive audit logs and trails</p>
              <p>• Regular penetration testing</p>
              <p>• Incident response procedures</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);

export default function SecurityPage() {
  return (
    <>
      <Helmet>
        <title>Security | Proxa People - Enterprise Data Protection</title>
        <meta name="description" content="Learn about Proxa People's enterprise-grade security measures, compliance certifications, and data protection policies." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <SecurityOverview />
        <ComplianceSection />
        <DataProtection />
      </main>
      
      <PublicFooter />
    </>
  );
}