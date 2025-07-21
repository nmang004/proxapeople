import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Calendar, ArrowRight } from "lucide-react";
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
            Product <span className="text-primary">Updates</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes to Proxa People.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const UpdatesTimeline = () => {
  const updates = [
    {
      date: "January 15, 2025",
      version: "v3.2.0",
      title: "Enhanced Analytics Dashboard",
      type: "Feature",
      description: "New visual charts and improved performance metrics with real-time updates and custom date ranges.",
      highlights: [
        "Interactive performance trend charts",
        "Custom date range selection",
        "Real-time dashboard updates",
        "Export analytics to PDF"
      ]
    },
    {
      date: "January 8, 2025",
      version: "v3.1.5",
      title: "Mobile App Performance Improvements",
      type: "Improvement",
      description: "Significant performance improvements to the mobile app with faster loading times and smoother animations.",
      highlights: [
        "50% faster app load times",
        "Improved offline functionality",
        "Smoother page transitions",
        "Better battery optimization"
      ]
    },
    {
      date: "December 20, 2024",
      version: "v3.1.0",
      title: "Advanced Goal Templates",
      type: "Feature",
      description: "Pre-built goal templates for common use cases and the ability to create custom templates for your organization.",
      highlights: [
        "20+ pre-built goal templates",
        "Custom template creation",
        "Template sharing across teams",
        "Industry-specific templates"
      ]
    },
    {
      date: "December 12, 2024",
      version: "v3.0.8",
      title: "Security & Compliance Updates",
      type: "Security",
      description: "Enhanced security measures and SOC 2 Type II compliance certification completion.",
      highlights: [
        "SOC 2 Type II certification",
        "Enhanced encryption protocols",
        "Improved audit logging",
        "GDPR compliance updates"
      ]
    },
    {
      date: "November 28, 2024",
      version: "v3.0.5",
      title: "Slack Integration Enhancement",
      type: "Improvement",
      description: "Improved Slack integration with better notifications and the ability to complete quick actions directly from Slack.",
      highlights: [
        "In-Slack goal updates",
        "Smart notification preferences",
        "Team celebration messages",
        "Quick feedback commands"
      ]
    },
    {
      date: "November 15, 2024",
      version: "v3.0.0",
      title: "Major Platform Redesign",
      type: "Feature",
      description: "Complete platform redesign with improved user experience, modern interface, and enhanced accessibility.",
      highlights: [
        "Modern, intuitive interface",
        "Improved accessibility features",
        "Dark mode support",
        "Mobile-first responsive design"
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Feature": return "bg-blue-100 text-blue-800";
      case "Improvement": return "bg-green-100 text-green-800";
      case "Security": return "bg-red-100 text-red-800";
      case "Fix": return "bg-yellow-100 text-yellow-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
            
            {updates.map((update, index) => (
              <motion.div
                key={update.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md"></div>
                
                {/* Content */}
                <div className="ml-16">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-500">{update.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                            {update.type}
                          </span>
                          <span className="text-sm text-neutral-500">{update.version}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 mb-4">{update.description}</p>
                      <ul className="space-y-2">
                        {update.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <ArrowRight className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function UpdatesPage() {
  return (
    <>
      <Helmet>
        <title>Updates | Proxa People - Latest Platform Changes</title>
        <meta name="description" content="Stay updated with the latest features, improvements, and security updates to the Proxa People performance management platform." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <UpdatesTimeline />
      </main>
      
      <PublicFooter />
    </>
  );
}