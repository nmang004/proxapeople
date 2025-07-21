import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Users, Star, Target, Clock, CheckCircle } from "lucide-react";
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
            Customer <span className="text-primary">Success Stories</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            See how companies across industries use Proxa People to transform their performance 
            management and drive real business results.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">92%</div>
              <div className="text-sm text-neutral-600">Faster Review Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <div className="text-sm text-neutral-600">Increase in Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">76%</div>
              <div className="text-sm text-neutral-600">Reduction in Admin Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturedCaseStudy = () => {
  const caseStudy = {
    company: "TechScale Inc.",
    industry: "Software Development",
    size: "450 employees",
    challenge: "Manual review process taking 6 weeks, low employee engagement (6.2/10), inconsistent goal tracking",
    solution: "Implemented Proxa People's complete performance management suite with automated workflows",
    results: [
      { metric: "Review Cycle Time", before: "6 weeks", after: "5 days", improvement: "92% faster" },
      { metric: "Employee Engagement", before: "6.2/10", after: "8.7/10", improvement: "+40% increase" },
      { metric: "Goal Completion Rate", before: "34%", after: "87%", improvement: "+156% increase" },
      { metric: "Manager Satisfaction", before: "5.1/10", after: "9.1/10", improvement: "+78% increase" }
    ],
    testimonial: "Proxa People transformed how we think about performance management. What used to be a dreaded quarterly process is now something our team actually looks forward to.",
    author: "Sarah Chen",
    title: "VP of People"
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Featured Success Story
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            How TechScale Inc. reduced their review cycle time by 92% while boosting engagement.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Company Info */}
              <div className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">TS</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{caseStudy.company}</h3>
                    <p className="text-neutral-600">{caseStudy.industry} • {caseStudy.size}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">The Challenge</h4>
                    <p className="text-neutral-600 text-sm">{caseStudy.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">The Solution</h4>
                    <p className="text-neutral-600 text-sm">{caseStudy.solution}</p>
                  </div>
                  
                  <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-700">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  
                  <div className="text-sm">
                    <div className="font-semibold">{caseStudy.author}</div>
                    <div className="text-neutral-600">{caseStudy.title}</div>
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div className="p-8">
                <h4 className="text-xl font-bold mb-6">Results After 6 Months</h4>
                
                <div className="space-y-6">
                  {caseStudy.results.map((result, index) => (
                    <motion.div
                      key={result.metric}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="border-b border-neutral-100 pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{result.metric}</span>
                        <span className="text-green-600 font-semibold text-sm">{result.improvement}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-neutral-500">
                          Before: <span className="font-medium">{result.before}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                        <div className="text-xs text-neutral-900">
                          After: <span className="font-semibold">{result.after}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button className="w-full">
                    Read Full Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

const CustomerStories = () => {
  const stories = [
    {
      company: "HealthTech Solutions",
      industry: "Healthcare Technology",
      size: "280 employees",
      logo: "🏥",
      challenge: "Compliance-heavy review process with manual documentation",
      outcome: "Automated compliance tracking, 85% time savings on documentation",
      metrics: { primary: "85%", secondary: "Time Saved", tertiary: "on Documentation" },
      testimonial: "Proxa People made our compliance reviews seamless while maintaining all required documentation.",
      author: "Dr. Michael Rodriguez",
      title: "Chief Medical Officer"
    },
    {
      company: "FinanceFirst Bank",
      industry: "Financial Services",
      size: "1,200 employees",
      logo: "🏦",
      challenge: "Inconsistent goal alignment across 12 departments",
      outcome: "Company-wide OKR implementation with 94% goal completion rate",
      metrics: { primary: "94%", secondary: "Goal Completion", tertiary: "Rate Achieved" },
      testimonial: "The OKR system brought unprecedented clarity to our organizational objectives.",
      author: "Jennifer Walsh",
      title: "Head of Operations"
    },
    {
      company: "GreenEnergy Corp",
      industry: "Renewable Energy",
      size: "650 employees",
      logo: "🌱",
      challenge: "Remote workforce coordination and engagement tracking",
      outcome: "Improved remote team engagement from 6.8 to 9.2 out of 10",
      metrics: { primary: "9.2/10", secondary: "Team Engagement", tertiary: "Score" },
      testimonial: "Our distributed teams have never felt more connected and aligned with company goals.",
      author: "Alex Thompson",
      title: "Director of People & Culture"
    },
    {
      company: "DataDriven Analytics",
      industry: "Data & Analytics",
      size: "180 employees",
      logo: "📊",
      challenge: "Technical teams struggled with traditional review methods",
      outcome: "Implemented data-driven performance metrics with 90% adoption",
      metrics: { primary: "90%", secondary: "Platform Adoption", tertiary: "Rate" },
      testimonial: "Finally, a performance system that speaks our language - data-driven and transparent.",
      author: "Priya Patel",
      title: "Engineering Manager"
    },
    {
      company: "RetailMax",
      industry: "E-commerce",
      size: "850 employees",
      logo: "🛍️",
      challenge: "High turnover rate and low manager effectiveness scores",
      outcome: "Reduced turnover by 43% through better manager-employee relationships",
      metrics: { primary: "43%", secondary: "Turnover", tertiary: "Reduction" },
      testimonial: "Our managers became better coaches, and our retention rates speak for themselves.",
      author: "Marcus Johnson",
      title: "VP of Human Resources"
    },
    {
      company: "EduTech Innovations",
      industry: "Education Technology",
      size: "320 employees",
      logo: "🎓",
      challenge: "Seasonal workforce with complex project-based evaluations",
      outcome: "Streamlined project-based reviews with 88% faster cycle completion",
      metrics: { primary: "88%", secondary: "Faster Review", tertiary: "Cycles" },
      testimonial: "Perfect for our unique needs - flexible enough for project work, structured enough for growth.",
      author: "Dr. Sarah Kim",
      title: "Head of Talent Development"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Success Across Industries
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            From startups to enterprises, see how organizations transform their performance management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{story.logo}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{story.company}</CardTitle>
                      <p className="text-sm text-neutral-600">{story.industry}</p>
                    </div>
                  </div>
                  
                  <div className="text-center bg-primary/5 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-primary">{story.metrics.primary}</div>
                    <div className="text-sm text-neutral-600">{story.metrics.secondary}</div>
                    <div className="text-xs text-neutral-500">{story.metrics.tertiary}</div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Challenge</h4>
                      <p className="text-neutral-600 text-sm">{story.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Outcome</h4>
                      <p className="text-neutral-600 text-sm">{story.outcome}</p>
                    </div>
                    
                    <blockquote className="border-l-2 border-primary/20 pl-3 text-sm italic text-neutral-700">
                      "{story.testimonial}"
                    </blockquote>
                    
                    <div className="text-xs">
                      <div className="font-medium">{story.author}</div>
                      <div className="text-neutral-500">{story.title}</div>
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

const ROICalculator = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Calculate Your ROI
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Based on our customer data, see the potential impact for your organization.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Average Customer Results</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Review Cycle Time Reduction</span>
                    <span className="font-semibold text-green-600">-87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Employee Engagement Increase</span>
                    <span className="font-semibold text-green-600">+34%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Manager Time Savings</span>
                    <span className="font-semibold text-green-600">8 hrs/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Goal Completion Rate</span>
                    <span className="font-semibold text-green-600">+112%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Your Potential Savings</h3>
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$127,000</div>
                  <div className="text-neutral-600 mb-4">Annual savings for 100-person team</div>
                  <div className="text-sm text-neutral-500 space-y-1">
                    <div>• Manager time savings: $89,000</div>
                    <div>• Reduced turnover costs: $28,000</div>
                    <div>• Process efficiency gains: $10,000</div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  Get Custom ROI Calculation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
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
          Ready to Join Our Success Stories?
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          See how Proxa People can transform your organization's performance management.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" className="group">
              Start Your Demo
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Talk to Our Team
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function CustomersPage() {
  return (
    <>
      <Helmet>
        <title>Customer Stories | Proxa People - Real Success Stories</title>
        <meta name="description" content="See how 500+ companies use Proxa People to transform performance management. Real customer stories, metrics, and ROI examples across industries." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <FeaturedCaseStudy />
        <CustomerStories />
        <ROICalculator />
        <CTASection />
      </main>
      
      <PublicFooter />
    </>
  );
}