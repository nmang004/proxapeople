import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
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
            Join Our <span className="text-primary">Mission</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Help us build the future of performance management and create meaningful 
            impact for teams around the world. We're looking for passionate people 
            who share our values.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const CultureSection = () => {
  const benefits = [
    {
      title: "Remote-First Culture",
      description: "Work from anywhere with flexible hours and async-friendly processes.",
      icon: "🌍"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness stipend.",
      icon: "🏥"
    },
    {
      title: "Growth & Learning",
      description: "$2,000 annual learning budget and dedicated time for professional development.",
      icon: "📚"
    },
    {
      title: "Equity & Ownership",
      description: "Competitive equity package so you share in our success.",
      icon: "📈"
    },
    {
      title: "Time Off",
      description: "Unlimited PTO policy with a minimum 3-week requirement.",
      icon: "🏝️"
    },
    {
      title: "Equipment",
      description: "Top-tier laptop, monitor, and $1,000 home office setup budget.",
      icon: "💻"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Work at Proxa People?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We believe in taking care of our team so they can do their best work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-neutral-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JobOpenings = () => {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, performant user interfaces using React, TypeScript, and modern web technologies.",
      requirements: [
        "5+ years React/TypeScript experience",
        "Experience with design systems",
        "Strong CSS and responsive design skills",
        "Performance optimization experience"
      ]
    },
    {
      title: "Backend Engineer",
      department: "Engineering", 
      location: "Remote",
      type: "Full-time",
      description: "Design and build scalable APIs and services that power our performance management platform.",
      requirements: [
        "3+ years backend development experience",
        "Experience with Node.js, Python, or Go",
        "Database design and optimization",
        "Cloud platforms (AWS, GCP, Azure)"
      ]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time", 
      description: "Create intuitive, user-centered designs that make performance management delightful.",
      requirements: [
        "4+ years product design experience",
        "Strong portfolio of B2B/SaaS products",
        "Proficiency in Figma",
        "User research and testing experience"
      ]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers maximize value from Proxa People and drive expansion opportunities.",
      requirements: [
        "3+ years customer success experience",
        "B2B SaaS background preferred",
        "Strong communication skills",
        "Data-driven approach to customer health"
      ]
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      description: "Generate qualified leads and help grow our customer base through outbound prospecting.",
      requirements: [
        "1-2 years sales experience preferred",
        "Excellent written and verbal communication",
        "Experience with CRM tools",
        "Passion for helping businesses succeed"
      ]
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote", 
      type: "Full-time",
      description: "Drive demand generation and brand awareness through digital marketing campaigns.",
      requirements: [
        "3+ years B2B marketing experience",
        "Experience with marketing automation",
        "Content creation and SEO knowledge",
        "Analytics and performance measurement"
      ]
    }
  ];

  const departments = ["All", "Engineering", "Design", "Customer Success", "Sales", "Marketing"];
  
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Open Positions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join our growing team and help shape the future of performance management.
          </p>
        </div>
        
        {/* Department Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={dept === "All" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              {dept}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {jobs.map((job, index) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {job.department}
                        </span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 mb-4">{job.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-sm">Key Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-neutral-600 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full group">
                    Apply Now
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

export default function CareersPage() {
  return (
    <>
      <Helmet>
        <title>Careers | Proxa People - Join Our Team</title>
        <meta name="description" content="Join Proxa People's mission to transform performance management. Remote-first culture with competitive benefits and growth opportunities." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <CultureSection />
        <JobOpenings />
      </main>
      
      <PublicFooter />
    </>
  );
}