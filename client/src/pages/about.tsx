import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Users, Target, Heart, Award } from "lucide-react";
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
            Our <span className="text-primary">Mission</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            We believe that people are the heart of every successful organization. 
            Our mission is to help companies build thriving workplace cultures through 
            intelligent performance management and meaningful employee engagement.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const ValuesSection = () => {
  const values = [
    {
      title: "People First",
      description: "Every feature we build starts with how it will impact the employee experience.",
      icon: Heart
    },
    {
      title: "Data-Driven",
      description: "We believe in making decisions based on insights, not assumptions.",
      icon: Target
    },
    {
      title: "Continuous Growth",
      description: "We're committed to helping individuals and teams reach their full potential.",
      icon: Award
    },
    {
      title: "Transparency",
      description: "Open communication and honest feedback create stronger organizations.",
      icon: Users
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our Values
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            The principles that guide everything we do at Proxa People.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-neutral-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to transform how organizations manage performance and employee engagement."
    },
    {
      year: "2023",
      title: "First Product Launch",
      description: "Released our MVP with core performance review and goal tracking features."
    },
    {
      year: "2024",
      title: "Series A Funding",
      description: "Raised $10M Series A to accelerate product development and team growth."
    },
    {
      year: "2024",
      title: "Enterprise Features",
      description: "Launched advanced analytics, custom integrations, and enterprise security features."
    },
    {
      year: "2024",
      title: "10,000 Users",
      description: "Reached 10,000+ active users across 500+ companies worldwide."
    },
    {
      year: "2025",
      title: "AI-Powered Insights",
      description: "Introduced AI-powered performance insights and personalized development recommendations."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Key milestones in our mission to transform performance management.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={`${milestone.year}-${milestone.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {milestone.year}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{milestone.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600">{milestone.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const leadership = [
    {
      name: "Sarah Chen",
      title: "CEO & Co-Founder",
      bio: "Former VP of People at TechCorp with 10+ years in HR technology.",
      avatar: "👩‍💼"
    },
    {
      name: "Michael Rodriguez",
      title: "CTO & Co-Founder", 
      bio: "Former Principal Engineer at DataCorp, expert in scalable systems.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Johnson",
      title: "VP of Product",
      bio: "Former Product Lead at StartupCorp, focused on user experience.",
      avatar: "👩‍🎨"
    },
    {
      name: "David Kim",
      title: "VP of Engineering",
      bio: "Former Engineering Manager at CloudCorp, passionate about quality.",
      avatar: "👨‍🔧"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Leadership Team
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Meet the team behind Proxa People's vision and execution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {leadership.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">{member.avatar}</span>
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.title}</p>
              <p className="text-neutral-600 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About | Proxa People - Our Mission & Team</title>
        <meta name="description" content="Learn about Proxa People's mission to transform performance management, our values, company milestones, and leadership team." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <ValuesSection />
        <TimelineSection />
        <TeamSection />
      </main>
      
      <PublicFooter />
    </>
  );
}