import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ExternalLink } from "lucide-react";
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
            Integrate with <br />
            <span className="text-primary">Your Favorite Tools</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Connect Proxa People with the tools your team already uses to create a seamless workflow experience.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const IntegrationCard = ({ integration, index }: { integration: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{integration.logo}</span>
        </div>
        <CardTitle className="text-lg">{integration.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-neutral-600 text-sm mb-4">{integration.description}</p>
        <div className="flex items-center justify-center text-primary text-sm group-hover:text-primary/80 transition-colors">
          <span>Learn more</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const IntegrationsGallery = () => {
  const integrationCategories = [
    {
      title: "HRIS & Payroll",
      integrations: [
        {
          name: "BambooHR",
          description: "Sync employee data and organizational structure automatically.",
          logo: "🎋"
        },
        {
          name: "Workday",
          description: "Enterprise-grade HR data synchronization and reporting.",
          logo: "📊"
        },
        {
          name: "ADP",
          description: "Seamless payroll and HR information integration.",
          logo: "💼"
        },
        {
          name: "Gusto",
          description: "Small business HR and payroll data synchronization.",
          logo: "🏢"
        }
      ]
    },
    {
      title: "Communication",
      integrations: [
        {
          name: "Slack",
          description: "Get performance notifications and celebrate wins in Slack.",
          logo: "💬"
        },
        {
          name: "Microsoft Teams",
          description: "Integrate performance updates with your Teams workflow.",
          logo: "🗣️"
        },
        {
          name: "Zoom",
          description: "Schedule and track one-on-one meetings seamlessly.",
          logo: "📹"
        },
        {
          name: "Gmail",
          description: "Email notifications and calendar integration.",
          logo: "📧"
        }
      ]
    },
    {
      title: "Single Sign-On",
      integrations: [
        {
          name: "Okta",
          description: "Enterprise identity management and single sign-on.",
          logo: "🔐"
        },
        {
          name: "Auth0",
          description: "Secure authentication and user management.",
          logo: "🛡️"
        },
        {
          name: "Azure AD",
          description: "Microsoft Active Directory integration.",
          logo: "🏢"
        },
        {
          name: "Google SSO",
          description: "Sign in with your Google Workspace account.",
          logo: "🔑"
        }
      ]
    },
    {
      title: "Project Management",
      integrations: [
        {
          name: "Jira",
          description: "Connect goals with project deliverables and sprints.",
          logo: "📋"
        },
        {
          name: "Asana",
          description: "Sync project goals with team performance metrics.",
          logo: "✅"
        },
        {
          name: "Trello",
          description: "Visual project tracking and goal alignment.",
          logo: "📌"
        },
        {
          name: "Monday.com",
          description: "Project management and performance tracking.",
          logo: "🗓️"
        }
      ]
    },
    {
      title: "Analytics & BI",
      integrations: [
        {
          name: "Tableau",
          description: "Advanced analytics and custom reporting dashboards.",
          logo: "📈"
        },
        {
          name: "Power BI",
          description: "Microsoft business intelligence and data visualization.",
          logo: "📊"
        },
        {
          name: "Looker",
          description: "Data platform integration for custom insights.",
          logo: "🔍"
        },
        {
          name: "Google Analytics",
          description: "Performance metrics and user behavior tracking.",
          logo: "📉"
        }
      ]
    },
    {
      title: "Learning & Development",
      integrations: [
        {
          name: "Coursera",
          description: "Track learning goals and skill development progress.",
          logo: "🎓"
        },
        {
          name: "LinkedIn Learning",
          description: "Professional development and course completion tracking.",
          logo: "📚"
        },
        {
          name: "Udemy",
          description: "Online course integration for employee growth.",
          logo: "🎯"
        },
        {
          name: "Pluralsight",
          description: "Technical skills assessment and progress tracking.",
          logo: "💻"
        }
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {integrationCategories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-16 last:mb-0">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                {category.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.integrations.map((integration, index) => (
                <IntegrationCard
                  key={integration.name}
                  integration={integration}
                  index={categoryIndex * 4 + index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const APISection = () => (
  <section className="py-16 md:py-24 bg-neutral-50">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          Need a Custom Integration?
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Use our REST API to build custom integrations with your existing tools and workflows. 
          Enterprise customers get dedicated support for custom development.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔌</span>
              </div>
              <CardTitle>REST API</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-neutral-600 text-sm">
                Full REST API access for custom integrations and data synchronization.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-neutral-600 text-sm">
                Comprehensive API documentation with examples and SDKs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <CardTitle>Custom Development</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-neutral-600 text-sm">
                Enterprise customers get dedicated support for custom integrations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);

export default function IntegrationsPage() {
  return (
    <>
      <Helmet>
        <title>Integrations | Proxa People - Connect Your Favorite Tools</title>
        <meta name="description" content="Connect Proxa People with HRIS, communication tools, SSO providers, project management, and analytics platforms. Plus custom API integration support." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <IntegrationsGallery />
        <APISection />
      </main>
      
      <PublicFooter />
    </>
  );
}