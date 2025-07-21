import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Play, ArrowRight, CheckCircle, Users, Target, BarChart3, Calendar, Star, Clock } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/card";
import { PublicHeader } from "@/shared/ui/components/public-header";
import { PublicFooter } from "@/shared/ui/components/public-footer";
import DashboardScreenshotPath from "@/assets/dashtest.png";

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
            See Proxa People <br />
            <span className="text-primary">In Action</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Experience how our performance management platform transforms HR processes 
            with interactive demos, guided tours, and real-world examples.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group">
              <Play className="w-5 h-5 mr-2" />
              Start Interactive Demo
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Schedule Personal Demo
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-neutral-500 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>5 min demo</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Real data examples</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState("dashboard");

  const demoSections = [
    {
      id: "dashboard",
      title: "Performance Dashboard",
      description: "See how managers get instant insights into team performance and engagement",
      icon: BarChart3,
      features: ["Real-time analytics", "Team health metrics", "Goal progress tracking"]
    },
    {
      id: "goals",
      title: "OKR Management",
      description: "Experience our intuitive goal setting and tracking system",
      icon: Target,
      features: ["Cascading objectives", "Progress visualization", "Alignment tracking"]
    },
    {
      id: "reviews",
      title: "Performance Reviews",
      description: "Walk through our streamlined review process",
      icon: Star,
      features: ["360-degree feedback", "Review workflows", "Rating calibration"]
    },
    {
      id: "meetings",
      title: "One-on-One Meetings",
      description: "Discover how we facilitate meaningful manager-employee conversations",
      icon: Calendar,
      features: ["Agenda collaboration", "Action item tracking", "Meeting analytics"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Interactive Product Tour
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore key features with real data examples. Click through different modules 
            to see how Proxa People works in practice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Navigation */}
          <div className="space-y-4">
            {demoSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    activeDemo === section.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveDemo(section.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeDemo === section.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                      }`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 text-sm mb-3">{section.description}</p>
                    <ul className="space-y-1">
                      {section.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-neutral-500 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Demo Screen */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <Card className="overflow-hidden">
                <div className="bg-neutral-100 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-sm text-neutral-600">
                      app.proxapeople.com/{activeDemo}
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={DashboardScreenshotPath} 
                    alt="Demo Screenshot" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <Button size="lg" className="shadow-lg">
                      <Play className="w-5 h-5 mr-2" />
                      Start {demoSections.find(s => s.id === activeDemo)?.title} Demo
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DemoOptions = () => {
  const demoTypes = [
    {
      title: "Self-Guided Tour",
      description: "Explore at your own pace with interactive hotspots and guided tooltips",
      duration: "5-10 minutes",
      features: [
        "Interactive product walkthrough",
        "Real data examples",
        "No signup required",
        "Available 24/7"
      ],
      cta: "Start Tour",
      popular: true
    },
    {
      title: "Personal Demo",
      description: "Get a customized demo tailored to your organization's specific needs",
      duration: "30 minutes",
      features: [
        "Personalized to your use case",
        "Q&A with product expert",
        "Custom implementation discussion",
        "ROI calculation"
      ],
      cta: "Schedule Demo",
      popular: false
    },
    {
      title: "Free Trial",
      description: "Try Proxa People with your own data and team for 14 days",
      duration: "14 days",
      features: [
        "Full platform access",
        "Import your existing data",
        "Team collaboration",
        "Setup assistance included"
      ],
      cta: "Start Free Trial",
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Choose Your Demo Experience
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Whether you want a quick overview or deep dive, we have the perfect demo format for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {demoTypes.map((demo, index) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`h-full ${demo.popular ? 'ring-2 ring-primary' : ''}`}>
                {demo.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{demo.title}</CardTitle>
                  <p className="text-neutral-600 mt-2">{demo.description}</p>
                  <div className="text-sm text-primary font-medium mt-2">
                    {demo.duration}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {demo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={demo.popular ? "default" : "outline"}
                  >
                    {demo.cta}
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

const SocialProof = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
        Join 500+ Companies Already Using Proxa People
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 mb-12">
        {["TechCorp", "InnovateCo", "DataSoft", "CloudScale", "StartupXYZ", "EnterprisePlus", "GrowthTech", "ScaleUp"].map((company, index) => (
          <div key={company} className="text-2xl font-bold text-neutral-600">
            {company}
          </div>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto">
        <blockquote className="text-xl text-neutral-600 mb-6">
          "The demo showed us exactly how Proxa People would transform our performance management. 
          We went from quarterly reviews taking weeks to completing them in days."
        </blockquote>
        <div className="text-sm text-neutral-500">
          <strong>Sarah Johnson</strong>, VP of People @ TechCorp
        </div>
      </div>
    </div>
  </section>
);

export default function DemoPage() {
  return (
    <>
      <Helmet>
        <title>Live Demo | Proxa People - See Our Platform in Action</title>
        <meta name="description" content="Experience Proxa People with interactive demos, guided tours, and personalized walkthroughs. See how our performance management platform works." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <InteractiveDemo />
        <DemoOptions />
        <SocialProof />
      </main>
      
      <PublicFooter />
    </>
  );
}