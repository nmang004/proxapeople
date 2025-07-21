import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/components/card";
import { PublicHeader } from "@/shared/ui/components/public-header";
import { PublicFooter } from "@/shared/ui/components/public-footer";

const HeroSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

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
              The Perfect Plan for <br />
              <span className="text-primary">Every Team</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your team size and needs. All plans include full features with transparent pricing.
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isAnnual ? 'text-neutral-900' : 'text-neutral-500'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isAnnual ? 'text-neutral-900' : 'text-neutral-500'}`}>Annual</span>
              {isAnnual && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PricingTiers = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "For teams just getting started with performance management",
      monthlyPrice: 5,
      annualPrice: 4,
      features: [
        "Up to 50 users",
        "Basic goal tracking",
        "Performance reviews",
        "Email support",
        "Basic analytics",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Pro",
      description: "For growing teams that need advanced features",
      monthlyPrice: 12,
      annualPrice: 10,
      features: [
        "Up to 500 users",
        "Advanced goal management with OKRs",
        "360-degree reviews",
        "Priority support",
        "Advanced analytics & reporting",
        "Custom integrations",
        "One-on-one meeting tools",
        "Employee surveys"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      monthlyPrice: null,
      annualPrice: null,
      customPrice: "Custom",
      features: [
        "Unlimited users",
        "Full analytics suite",
        "Dedicated support manager",
        "Custom development",
        "Advanced security features",
        "Single Sign-On (SSO)",
        "API access",
        "Custom reporting",
        "Training and onboarding"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`h-full ${plan.popular ? 'border-primary border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-neutral-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mb-6">
                    {plan.customPrice ? (
                      <div>
                        <span className="text-4xl font-bold">{plan.customPrice}</span>
                        <span className="text-neutral-600 ml-2">contact sales</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-neutral-600 ml-2">per user/month</span>
                        {isAnnual && (
                          <div className="text-sm text-green-600 mt-1">
                            Billed annually
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureComparison = () => {
  const features = [
    { name: "Users included", starter: "Up to 50", pro: "Up to 500", enterprise: "Unlimited" },
    { name: "Goal tracking", starter: "✓", pro: "✓", enterprise: "✓" },
    { name: "Performance reviews", starter: "✓", pro: "✓", enterprise: "✓" },
    { name: "Basic analytics", starter: "✓", pro: "✓", enterprise: "✓" },
    { name: "Mobile app", starter: "✓", pro: "✓", enterprise: "✓" },
    { name: "OKR framework", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "360-degree reviews", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Advanced analytics", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Custom integrations", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "One-on-one tools", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Employee surveys", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Priority support", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Single Sign-On", starter: "—", pro: "—", enterprise: "✓" },
    { name: "API access", starter: "—", pro: "—", enterprise: "✓" },
    { name: "Custom development", starter: "—", pro: "—", enterprise: "✓" },
    { name: "Dedicated support", starter: "—", pro: "—", enterprise: "✓" }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Full Feature Comparison
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Compare all features across our plans to find the perfect fit.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 bg-neutral-100 p-4 font-semibold">
              <div>Feature</div>
              <div className="text-center">Starter</div>
              <div className="text-center">Pro</div>
              <div className="text-center">Enterprise</div>
            </div>
            
            {features.map((feature, index) => (
              <div key={feature.name} className={`grid grid-cols-4 p-4 border-b border-neutral-100 ${index % 2 === 1 ? 'bg-neutral-50' : ''}`}>
                <div className="font-medium">{feature.name}</div>
                <div className="text-center">{feature.starter}</div>
                <div className="text-center">{feature.pro}</div>
                <div className="text-center">{feature.enterprise}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How is billing calculated?",
      answer: "Billing is based on the number of active users in your account. You're only charged for users who are actively using the platform each month."
    },
    {
      question: "Can I change plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for all plans. No credit card required to start your trial."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You can export all your data at any time. After cancellation, we retain your data for 30 days to allow for reactivation, then it's permanently deleted."
    },
    {
      question: "Do you offer annual discounts?",
      answer: "Yes, annual plans save 20% compared to monthly billing. Enterprise customers may be eligible for additional volume discounts."
    },
    {
      question: "What support is included?",
      answer: "Starter plans include email support, Pro plans get priority support, and Enterprise customers have a dedicated support manager."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Common questions about pricing, billing, and plan limitations.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-neutral-200 last:border-b-0">
              <button
                className="w-full text-left py-6 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-6 text-neutral-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing | Proxa People - Performance Management Platform</title>
        <meta name="description" content="Transparent pricing for Proxa People's performance management platform. Choose from Starter, Pro, or Enterprise plans with 14-day free trial." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <PricingTiers />
        <FeatureComparison />
        <FAQ />
      </main>
      
      <PublicFooter />
    </>
  );
}