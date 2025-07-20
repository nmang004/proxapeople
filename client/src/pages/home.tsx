import { Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
import LogoIconPurplePath from "@assets/LogoIcon_Purple.png";
import DashboardScreenshotPath from "@assets/dashtest.png";

// Hero Section Component
const HeroSection = () => (
  <section className="relative overflow-hidden bg-white pt-16 pb-20 md:pt-24 md:pb-28 lg:py-32">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              The people <br />
              platform that <br />
              <span className="text-primary">drives success</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-lg">
              Proxa People empowers your team with intelligent performance management, 
              data-driven insights, and frictionless collaboration tools.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started Free
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden shadow-2xl"
          >
            <img 
              src={DashboardScreenshotPath} 
              alt="Proxa People Dashboard" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

// Features Section Component
const FeaturesSection = () => (
  <section id="features" className="py-16 md:py-24 bg-neutral-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Everything you need to manage your people
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          From performance reviews to goal tracking, Proxa People provides all the tools 
          you need to build a thriving workplace culture.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Performance Reviews",
            description: "Streamlined review cycles with customizable templates and automated workflows.",
            icon: "📊"
          },
          {
            title: "Goal Management", 
            description: "Set, track, and achieve goals with OKR frameworks and progress insights.",
            icon: "🎯"
          },
          {
            title: "Team Analytics",
            description: "Data-driven insights to understand engagement and performance trends.",
            icon: "📈"
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-neutral-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Pricing Section Component  
const PricingSection = () => (
  <section id="pricing" className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Choose the plan that fits your team size and needs. Always with full features and support.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            name: "Starter",
            price: "$5",
            period: "per user/month",
            features: ["Up to 50 users", "Basic analytics", "Email support"],
            popular: false
          },
          {
            name: "Professional", 
            price: "$12",
            period: "per user/month",
            features: ["Up to 500 users", "Advanced analytics", "Priority support", "Custom integrations"],
            popular: true
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "contact sales",
            features: ["Unlimited users", "Full analytics suite", "Dedicated support", "Custom development"],
            popular: false
          }
        ].map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative bg-white p-8 rounded-xl shadow-sm border-2 ${
              plan.popular ? 'border-primary' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-neutral-600 ml-2">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <ArrowRight size={16} className="text-primary mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full" 
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// CTA Section Component
const CTASection = () => (
  <section className="py-16 md:py-24 bg-primary/5">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Ready to transform your people management?
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Join thousands of teams already using Proxa People to build better workplace cultures 
          and drive business success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Start Free Trial
              <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// Main HomePage Component
export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Proxa | The People Management Platform That People Love</title>
        <meta name="description" content="Proxa's unified people management platform simplifies performance reviews, goal setting, and employee engagement with powerful tools designed for both HR teams and managers." />
      </Helmet>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={LogoIconPurplePath} alt="Proxa People Logo" className="h-8 w-8" />
              <span className="font-heading text-xl font-bold">Proxa People</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-primary">Features</a>
            <a href="#pricing" className="text-sm font-medium text-neutral-600 hover:text-primary">Pricing</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={LogoIconPurplePath} alt="Proxa People Logo" className="h-6 w-6" />
                <span className="font-heading text-lg font-bold">Proxa People</span>
              </div>
              <p className="text-neutral-400 text-sm">
                The people management platform that drives success.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Updates"]
              },
              {
                title: "Company", 
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Support",
                links: ["Help Center", "Security", "Status", "Privacy"]
              }
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-neutral-400 hover:text-white text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400 text-sm">
            © 2025 Proxa People. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}