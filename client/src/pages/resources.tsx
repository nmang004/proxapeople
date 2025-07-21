import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Download, ArrowRight, Search, Filter, BookOpen, FileText, Video, Headphones, Calculator, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
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
              Performance Management <br />
              <span className="text-primary">Resource Center</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Free guides, templates, calculators, and best practices to help you build 
              better performance management and employee engagement programs.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>50+ Guides</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>Free Downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Expert-Vetted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturedResources = () => {
  const featured = [
    {
      title: "The Complete Guide to Performance Management",
      description: "A comprehensive 47-page guide covering everything from goal setting to performance reviews.",
      type: "Guide",
      pages: "47 pages",
      downloads: "12,420",
      icon: BookOpen,
      premium: false
    },
    {
      title: "OKR Implementation Playbook",
      description: "Step-by-step framework for implementing OKRs in your organization with real examples.",
      type: "Playbook",
      pages: "32 pages",
      downloads: "8,950",
      icon: FileText,
      premium: true
    },
    {
      title: "Performance Review Template Library",
      description: "15 customizable templates for different review types and organizational needs.",
      type: "Templates",
      pages: "Templates",
      downloads: "15,680",
      icon: FileText,
      premium: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Featured Resources
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our most popular and comprehensive resources for performance management excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                {resource.premium && (
                  <div className="absolute -top-3 left-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Premium
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <resource.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl leading-tight">{resource.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {resource.type}
                    </span>
                    <span>{resource.pages}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 mb-6">{resource.description}</p>
                  <Button className="w-full group">
                    <Download className="w-4 h-4 mr-2" />
                    Download Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ResourceCategories = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Resources", count: 127 },
    { id: "guides", label: "Guides & Playbooks", count: 28 },
    { id: "templates", label: "Templates", count: 45 },
    { id: "calculators", label: "Calculators", count: 12 },
    { id: "checklists", label: "Checklists", count: 18 },
    { id: "research", label: "Research & Reports", count: 15 },
    { id: "videos", label: "Videos & Webinars", count: 9 }
  ];

  const resources = [
    {
      title: "Performance Review Email Templates",
      description: "Professional email templates for review invitations, reminders, and feedback requests.",
      type: "Template",
      category: "templates",
      format: "DOCX",
      time: "5 min setup",
      downloads: "3,420",
      icon: FileText,
      new: true
    },
    {
      title: "Employee Engagement Survey Builder",
      description: "Step-by-step guide to creating effective engagement surveys with question libraries.",
      type: "Guide",
      category: "guides",
      format: "PDF",
      time: "15 min read",
      downloads: "5,680",
      icon: BookOpen,
      new: false
    },
    {
      title: "ROI Calculator for Performance Management",
      description: "Calculate the return on investment for your performance management initiatives.",
      type: "Calculator",
      category: "calculators",
      format: "Excel",
      time: "10 min",
      downloads: "2,190",
      icon: Calculator,
      new: true
    },
    {
      title: "Manager Training Checklist",
      description: "Essential skills and knowledge areas for effective performance management.",
      type: "Checklist",
      category: "checklists",
      format: "PDF",
      time: "Quick reference",
      downloads: "4,350",
      icon: CheckCircle,
      new: false
    },
    {
      title: "Goal Setting Framework Workshop",
      description: "Interactive workshop materials for teaching OKR and SMART goal methodologies.",
      type: "Video",
      category: "videos",
      format: "MP4",
      time: "45 min",
      downloads: "1,890",
      icon: Video,
      new: false
    },
    {
      title: "Remote Performance Management Guide",
      description: "Best practices for managing performance in distributed and hybrid teams.",
      type: "Guide",
      category: "guides",
      format: "PDF",
      time: "20 min read",
      downloads: "6,780",
      icon: BookOpen,
      new: true
    },
    {
      title: "One-on-One Meeting Agenda Templates",
      description: "Structured agenda formats for different types of manager-employee meetings.",
      type: "Template",
      category: "templates",
      format: "DOCX",
      time: "Instant use",
      downloads: "8,450",
      icon: FileText,
      new: false
    },
    {
      title: "Performance Improvement Plan Template",
      description: "Professional PIP template with legal compliance and best practice guidance.",
      type: "Template",
      category: "templates",
      format: "DOCX",
      time: "10 min setup",
      downloads: "2,340",
      icon: FileText,
      new: false
    },
    {
      title: "Employee Retention Research Report",
      description: "Latest trends and data on what drives employee retention in 2025.",
      type: "Report",
      category: "research",
      format: "PDF",
      time: "12 min read",
      downloads: "3,670",
      icon: BookOpen,
      new: true
    }
  ];

  const filteredResources = activeCategory === "all" 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Browse All Resources
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find exactly what you need with our organized resource library.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="text-sm"
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </Button>
          ))}
        </div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {resource.new && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {resource.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="bg-neutral-100 px-2 py-1 rounded">{resource.format}</span>
                        <span>{resource.time}</span>
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsletterSignup = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Stay Updated with New Resources
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Get notified when we publish new guides, templates, and research. 
          Plus, get exclusive access to premium content.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Button size="lg" className="whitespace-nowrap">
                Subscribe Free
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-neutral-500 flex items-center justify-center gap-4">
              <span>✓ Weekly new resources</span>
              <span>✓ Exclusive content</span>
              <span>✓ No spam, unsubscribe anytime</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-16 md:py-24 bg-primary/5">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Ready to Transform Your Performance Management?
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          These resources are just the beginning. See how Proxa People can automate 
          and enhance everything you've learned.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" className="group">
              Get Live Demo
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function ResourcesPage() {
  return (
    <>
      <Helmet>
        <title>Resources | Proxa People - Free Performance Management Guides</title>
        <meta name="description" content="Free performance management resources including guides, templates, calculators, and best practices. Expert-vetted content for HR professionals." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <FeaturedResources />
        <ResourceCategories />
        <NewsletterSignup />
        <CTASection />
      </main>
      
      <PublicFooter />
    </>
  );
}