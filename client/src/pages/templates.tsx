import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Download, ArrowRight, Search, Filter, FileText, Star, Eye, Copy, CheckCircle } from "lucide-react";
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
              <span className="text-primary">Template Library</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Ready-to-use templates for performance reviews, goal setting, one-on-ones, 
              and employee development. Customizable and professionally designed.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>65+ Templates</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-1">
                <Copy className="w-4 h-4" />
                <span>Fully Customizable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PopularTemplates = () => {
  const templates = [
    {
      title: "Annual Performance Review Template",
      description: "Comprehensive annual review template with goal assessment, competency ratings, and development planning.",
      category: "Performance Reviews",
      format: "Word + PDF",
      downloads: "15,420",
      rating: 4.9,
      preview: "📊",
      popular: true,
      sections: ["Goal Achievement", "Core Competencies", "Development Areas", "Future Goals"]
    },
    {
      title: "OKR Planning Worksheet",
      description: "Structure your quarterly objectives and key results with this easy-to-use planning template.",
      category: "Goal Setting",
      format: "Excel + Word",
      downloads: "12,680",
      rating: 4.8,
      preview: "🎯",
      popular: true,
      sections: ["Objective Definition", "Key Results", "Action Plans", "Progress Tracking"]
    },
    {
      title: "One-on-One Meeting Agenda",
      description: "Professional agenda template for productive manager-employee one-on-one meetings.",
      category: "Meetings",
      format: "Word + PDF",
      downloads: "18,920",
      rating: 4.9,
      preview: "📋",
      popular: true,
      sections: ["Check-ins", "Goal Progress", "Challenges", "Action Items"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Most Popular Templates
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our most downloaded and highest-rated templates used by thousands of HR professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="absolute -top-3 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
                
                <CardHeader>
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl">{template.preview}</span>
                  </div>
                  <CardTitle className="text-xl text-center leading-tight">{template.title}</CardTitle>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 text-center mb-4">{template.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm">Includes:</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {template.sections.map((section, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                    <span>{template.format}</span>
                    <span>{template.downloads} downloads</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Free
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-3 h-3 mr-2" />
                      Preview
                    </Button>
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

const TemplateCategories = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Templates", count: 65 },
    { id: "reviews", label: "Performance Reviews", count: 18 },
    { id: "goals", label: "Goal Setting", count: 12 },
    { id: "meetings", label: "One-on-Ones", count: 8 },
    { id: "feedback", label: "Feedback & Surveys", count: 10 },
    { id: "development", label: "Development Plans", count: 9 },
    { id: "onboarding", label: "Onboarding", count: 8 }
  ];

  const allTemplates = [
    {
      title: "360-Degree Feedback Template",
      description: "Comprehensive multi-source feedback collection with peer, manager, and direct report sections.",
      category: "feedback",
      format: "Word",
      downloads: "8,420",
      rating: 4.7,
      new: false,
      premium: false
    },
    {
      title: "Quarterly Goal Check-in Template",
      description: "Mid-quarter goal review template with progress assessment and adjustment planning.",
      category: "goals",
      format: "Excel",
      downloads: "5,680",
      rating: 4.6,
      new: true,
      premium: false
    },
    {
      title: "Performance Improvement Plan (PIP)",
      description: "Professional PIP template with clear expectations, timelines, and success metrics.",
      category: "reviews",
      format: "Word + PDF",
      downloads: "3,240",
      rating: 4.8,
      new: false,
      premium: true
    },
    {
      title: "New Employee 30-60-90 Day Plan",
      description: "Structured onboarding template with milestones and check-in points for new hires.",
      category: "onboarding",
      format: "Word",
      downloads: "11,890",
      rating: 4.9,
      new: false,
      premium: false
    },
    {
      title: "Career Development Plan Template",
      description: "Individual development planning with skill assessment and growth pathways.",
      category: "development",
      format: "Word + Excel",
      downloads: "7,650",
      rating: 4.7,
      new: true,
      premium: false
    },
    {
      title: "Employee Engagement Survey",
      description: "Comprehensive engagement survey with eNPS calculation and analysis framework.",
      category: "feedback",
      format: "Survey + Excel",
      downloads: "9,420",
      rating: 4.8,
      new: false,
      premium: false
    },
    {
      title: "Skip-Level Meeting Template",
      description: "Structured agenda for skip-level meetings to gather team insights and feedback.",
      category: "meetings",
      format: "Word",
      downloads: "4,160",
      rating: 4.5,
      new: true,
      premium: false
    },
    {
      title: "Competency Assessment Matrix",
      description: "Role-based competency evaluation template with skill level indicators.",
      category: "reviews",
      format: "Excel",
      downloads: "6,780",
      rating: 4.6,
      new: false,
      premium: true
    },
    {
      title: "Team Retrospective Template",
      description: "Agile team retrospective format adapted for performance and development discussions.",
      category: "meetings",
      format: "Word + PDF",
      downloads: "5,290",
      rating: 4.7,
      new: false,
      premium: false
    }
  ];

  const filteredTemplates = activeCategory === "all" 
    ? allTemplates 
    : allTemplates.filter(template => template.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find the perfect template for your specific performance management needs.
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
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="absolute top-3 right-3 flex gap-1">
                  {template.new && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                  {template.premium && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </span>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight pr-16">
                    {template.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                    <span>{template.downloads} downloads</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                    <span className="bg-neutral-100 px-2 py-1 rounded">{template.format}</span>
                    <span>Free Download</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
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

const CustomTemplateService = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Need a Custom Template?
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          Our professional services team can create custom templates tailored 
          to your organization's specific needs and processes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Custom Design</h3>
              <p className="text-neutral-600 text-sm">
                Templates designed to match your brand and specific requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Review</h3>
              <p className="text-neutral-600 text-sm">
                HR professionals review and optimize for best practices.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-neutral-600 text-sm">
                Custom templates delivered within 5-7 business days.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Button size="lg">
          Request Custom Template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
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
          Ready to Automate Your Templates?
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          While templates are a great start, see how Proxa People can automate 
          your entire performance management process.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" className="group">
              See Platform Demo
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg">
              Explore Features
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function TemplatesPage() {
  return (
    <>
      <Helmet>
        <title>Templates | Proxa People - Free Performance Management Templates</title>
        <meta name="description" content="65+ free performance management templates including reviews, goal setting, one-on-ones, and development plans. Customizable and professionally designed." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <PopularTemplates />
        <TemplateCategories />
        <CustomTemplateService />
        <CTASection />
      </main>
      
      <PublicFooter />
    </>
  );
}