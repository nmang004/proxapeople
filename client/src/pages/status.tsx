import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";
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
            System <span className="text-primary">Status</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Real-time status of Proxa People services and infrastructure. 
            Check here for any ongoing issues or scheduled maintenance.
          </p>
          
          {/* Overall Status */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">All Systems Operational</span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ServiceStatus = () => {
  const services = [
    {
      name: "Web Application",
      description: "Main Proxa People web platform",
      status: "operational",
      uptime: "99.98%"
    },
    {
      name: "API",
      description: "REST API and integrations",
      status: "operational", 
      uptime: "99.95%"
    },
    {
      name: "Mobile App",
      description: "iOS and Android applications",
      status: "operational",
      uptime: "99.97%"
    },
    {
      name: "Database",
      description: "Primary database systems",
      status: "operational",
      uptime: "99.99%"
    },
    {
      name: "Authentication",
      description: "User login and Auth0 services",
      status: "operational",
      uptime: "99.96%"
    },
    {
      name: "Email Notifications",
      description: "System and user email delivery",
      status: "degraded",
      uptime: "98.12%"
    },
    {
      name: "File Storage",
      description: "Document and asset storage",
      status: "operational",
      uptime: "99.94%"
    },
    {
      name: "Analytics",
      description: "Reporting and analytics engine",
      status: "operational",
      uptime: "99.91%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-600";
      case "degraded": return "text-yellow-600";
      case "partial": return "text-orange-600";
      case "outage": return "text-red-600";
      default: return "text-neutral-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "degraded": return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "partial": return <Clock className="w-5 h-5 text-orange-600" />;
      case "outage": return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <CheckCircle className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational": return "Operational";
      case "degraded": return "Degraded Performance";
      case "partial": return "Partial Outage";
      case "outage": return "Major Outage";
      default: return "Unknown";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Service Status
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Current operational status of all Proxa People services.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-neutral-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </div>
                      <div className="text-neutral-500 text-sm">
                        {service.uptime} uptime
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IncidentHistory = () => {
  const incidents = [
    {
      date: "January 15, 2025",
      title: "Email Delivery Delays",
      status: "Resolved",
      duration: "2h 15m",
      description: "Some users experienced delays in receiving email notifications. Issue has been resolved and all pending emails have been delivered.",
      severity: "Minor"
    },
    {
      date: "December 28, 2024",
      title: "Scheduled Maintenance",
      status: "Completed",
      duration: "30m",
      description: "Planned maintenance window for database optimization and security updates. All services returned to normal operation.",
      severity: "Maintenance"
    },
    {
      date: "December 20, 2024",
      title: "API Rate Limiting Issues",
      status: "Resolved",
      duration: "45m",
      description: "High traffic caused API rate limiting to trigger incorrectly. Limits have been adjusted and monitoring improved.",
      severity: "Minor"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800";
      case "Major": return "bg-orange-100 text-orange-800";
      case "Minor": return "bg-yellow-100 text-yellow-800";
      case "Maintenance": return "bg-blue-100 text-blue-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Recent Incidents
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            History of recent incidents and maintenance windows.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <p className="text-neutral-500 text-sm mt-1">{incident.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="text-sm text-neutral-500">{incident.duration}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">{incident.description}</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      {incident.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function StatusPage() {
  return (
    <>
      <Helmet>
        <title>System Status | Proxa People - Service Health Dashboard</title>
        <meta name="description" content="Real-time status of Proxa People services. Check current operational status and view incident history." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <ServiceStatus />
        <IncidentHistory />
      </main>
      
      <PublicFooter />
    </>
  );
}