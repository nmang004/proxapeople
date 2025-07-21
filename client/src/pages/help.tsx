import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Search, Book, Settings, Users, CreditCard, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/card";
import { PublicHeader } from "@/shared/ui/components/public-header";
import { PublicFooter } from "@/shared/ui/components/public-footer";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-white pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Help <span className="text-primary">Center</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Find answers to your questions and learn how to get the most out of Proxa People.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ category, index }: { category: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <category.icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{category.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 mb-4">{category.description}</p>
        <div className="space-y-2">
          {category.articles.map((article: string, idx: number) => (
            <div key={idx} className="flex items-center text-sm text-neutral-700 hover:text-primary cursor-pointer">
              <ArrowRight className="w-3 h-3 mr-2 flex-shrink-0" />
              {article}
            </div>
          ))}
        </div>
        <div className="mt-4 text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
          View all articles →
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const HelpCategories = () => {
  const categories = [
    {
      title: "Getting Started",
      description: "Everything you need to know to start using Proxa People effectively.",
      icon: Book,
      articles: [
        "Setting up your account",
        "Inviting team members",
        "Creating your first goals",
        "Understanding the dashboard",
        "Mobile app setup"
      ]
    },
    {
      title: "Account & Billing",
      description: "Manage your subscription, billing, and account settings.",
      icon: CreditCard,
      articles: [
        "Changing your plan",
        "Updating payment methods",
        "Understanding usage limits",
        "Downloading invoices",
        "Canceling your subscription"
      ]
    },
    {
      title: "Feature Guides",
      description: "Detailed guides on how to use Proxa People's key features.",
      icon: Settings,
      articles: [
        "Setting up performance reviews",
        "Creating OKR templates",
        "Managing one-on-one meetings",
        "Using analytics dashboards",
        "Setting up integrations"
      ]
    },
    {
      title: "Team Management",
      description: "How to manage users, permissions, and organizational structure.",
      icon: Users,
      articles: [
        "Adding and removing users",
        "Setting user permissions",
        "Creating departments",
        "Managing reporting structure",
        "Bulk user operations"
      ]
    },
    {
      title: "Security & Privacy",
      description: "Information about data security, privacy, and compliance.",
      icon: Shield,
      articles: [
        "Data security overview",
        "GDPR compliance",
        "Single Sign-On setup",
        "Two-factor authentication",
        "Data export and deletion"
      ]
    },
    {
      title: "Troubleshooting",
      description: "Solutions to common issues and error messages.",
      icon: Search,
      articles: [
        "Login and access issues",
        "Performance and loading problems",
        "Email notification troubleshooting",
        "Mobile app issues",
        "Integration connection problems"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find answers organized by topic to quickly get the help you need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSupport = () => (
  <section className="py-16 md:py-24 bg-neutral-50">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
        Still Need Help?
      </h2>
      <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
        Can't find what you're looking for? Our support team is here to help.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Get instant help from our support team during business hours.
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Start Chat
            </button>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Send Email
            </button>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold mb-2">Schedule Call</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Book a personalized demo or training session with our team.
            </p>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Book Call
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

export default function HelpPage() {
  return (
    <>
      <Helmet>
        <title>Help Center | Proxa People - Support & Documentation</title>
        <meta name="description" content="Find answers, guides, and support for Proxa People. Browse help articles by category or search for specific topics." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <HelpCategories />
        <ContactSupport />
      </main>
      
      <PublicFooter />
    </>
  );
}