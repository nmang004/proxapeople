import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowRight, Target, BarChart3, Users, MessageCircle, Calendar, Shield, Zap, Globe, Clock, CheckCircle, Award } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/components/card";
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
            A Smarter Way to <br />
            <span className="text-primary">Manage Performance</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Discover how Proxa People transforms traditional HR processes into engaging, 
            data-driven experiences that employees love and managers rely on.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <feature.icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
        <CardDescription className="text-neutral-600">
          {feature.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {feature.benefits.map((benefit: string, idx: number) => (
            <li key={idx} className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </motion.div>
);

const FeaturesBreakdown = () => {
  const featureGroups = [
    {
      title: "Goal Management",
      features: [
        {
          title: "OKR Framework",
          description: "Set and track objectives with key results that align teams and drive outcomes.",
          icon: Target,
          benefits: [
            "Quarterly goal planning and review cycles",
            "Automated progress tracking and updates",
            "Team alignment with company objectives",
            "Visual progress dashboards"
          ]
        },
        {
          title: "Performance Analytics",
          description: "Data-driven insights into individual and team performance trends.",
          icon: BarChart3,
          benefits: [
            "Real-time performance metrics",
            "Trend analysis and forecasting", 
            "Custom reporting and dashboards",
            "Benchmark comparisons"
          ]
        }
      ]
    },
    {
      title: "Performance Reviews",
      features: [
        {
          title: "360-Degree Reviews",
          description: "Comprehensive feedback from peers, managers, and direct reports.",
          icon: Users,
          benefits: [
            "Multi-source feedback collection",
            "Anonymous and open feedback options",
            "Customizable review templates",
            "Automated review scheduling"
          ]
        },
        {
          title: "Continuous Feedback",
          description: "Real-time feedback and recognition that builds stronger teams.",
          icon: MessageCircle,
          benefits: [
            "Instant feedback and praise",
            "Peer-to-peer recognition",
            "Feedback trend tracking",
            "Integration with Slack and Teams"
          ]
        }
      ]
    },
    {
      title: "Employee Engagement",
      features: [
        {
          title: "One-on-One Meetings",
          description: "Structured meeting tools that strengthen manager-employee relationships.",
          icon: Calendar,
          benefits: [
            "Meeting agenda templates",
            "Action item tracking",
            "Meeting history and notes",
            "Calendar integration"
          ]
        },
        {
          title: "Employee Surveys",
          description: "Pulse surveys and engagement tracking to measure team sentiment.",
          icon: Award,
          benefits: [
            "Custom survey templates",
            "Anonymous response collection",
            "Engagement trend analysis",
            "Actionable insights and recommendations"
          ]
        }
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {featureGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-20 last:mb-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {group.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {group.features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  index={groupIndex * 2 + index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const AdditionalFeatures = () => {
  const additionalFeatures = [
    {
      title: "Enterprise Security",
      description: "SOC 2 compliant with enterprise-grade security.",
      icon: Shield
    },
    {
      title: "Fast Performance",
      description: "Lightning-fast interface that scales with your team.",
      icon: Zap
    },
    {
      title: "Global Teams",
      description: "Multi-timezone support for distributed teams.",
      icon: Globe
    },
    {
      title: "Time Tracking",
      description: "Built-in time tracking for project management.",
      icon: Clock
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Additional features that make Proxa People the complete solution for modern HR teams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
          See our plans and pricing to find the perfect fit for your team.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="group">
            See Plans and Pricing
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features | Proxa People - Performance Management Platform</title>
        <meta name="description" content="Discover Proxa People's comprehensive performance management features including OKRs, 360 reviews, continuous feedback, and employee engagement tools." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <FeaturesBreakdown />
        <AdditionalFeatures />
        <CTASection />
      </main>
      
      <PublicFooter />
    </>
  );
}