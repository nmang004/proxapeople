import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Calendar, User, ArrowRight } from "lucide-react";
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
            The Proxa People <span className="text-primary">Blog</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Insights, best practices, and thought leadership on performance management, 
            employee engagement, and building better workplace cultures.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturedArticle = () => {
  const featuredPost = {
    title: "The Future of Performance Reviews: Moving Beyond Annual Cycles",
    excerpt: "Why continuous feedback and quarterly check-ins are replacing traditional annual performance reviews, and how to make the transition in your organization.",
    author: "Sarah Chen",
    date: "January 18, 2025",
    readTime: "8 min read",
    category: "Performance Management",
    image: "📊"
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Featured Article
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="bg-neutral-100 flex items-center justify-center p-12">
                <span className="text-8xl">{featuredPost.image}</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-neutral-500">{featuredPost.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  
                  <div className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <span className="text-sm font-medium">Read Article</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

const BlogGrid = () => {
  const posts = [
    {
      title: "Building a Culture of Continuous Feedback",
      excerpt: "How to implement effective feedback systems that employees actually want to use.",
      author: "Emily Johnson",
      date: "January 15, 2025",
      readTime: "6 min read",
      category: "Culture",
      image: "💬"
    },
    {
      title: "OKRs vs. Traditional Goals: Which is Right for Your Team?",
      excerpt: "A comprehensive comparison of goal-setting methodologies and when to use each approach.",
      author: "Michael Rodriguez",
      date: "January 12, 2025", 
      readTime: "10 min read",
      category: "Goal Setting",
      image: "🎯"
    },
    {
      title: "The ROI of Employee Engagement: Data-Driven Insights",
      excerpt: "How engaged employees drive business results, backed by real data from our platform.",
      author: "David Kim",
      date: "January 8, 2025",
      readTime: "7 min read",
      category: "Analytics",
      image: "📈"
    },
    {
      title: "Remote Performance Management: Best Practices for 2025",
      excerpt: "Essential strategies for managing and developing remote team performance effectively.",
      author: "Sarah Chen",
      date: "January 5, 2025",
      readTime: "9 min read",
      category: "Remote Work",
      image: "🏠"
    },
    {
      title: "One-on-One Meetings That Actually Make a Difference",
      excerpt: "Transform your manager-employee relationships with structured, meaningful conversations.",
      author: "Emily Johnson",
      date: "January 2, 2025",
      readTime: "5 min read",
      category: "Management",
      image: "👥"
    },
    {
      title: "Performance Review Bias: How to Spot and Prevent It",
      excerpt: "Common biases that affect performance evaluations and practical steps to minimize them.",
      author: "Michael Rodriguez",
      date: "December 28, 2024",
      readTime: "8 min read",
      category: "Performance Management",
      image: "⚖️"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Recent Posts
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Latest insights and best practices from our team and industry experts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-4xl">{post.image}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-500">{post.readTime}</span>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
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

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Blog | Proxa People - Performance Management Insights</title>
        <meta name="description" content="Expert insights on performance management, employee engagement, and workplace culture. Learn best practices from the Proxa People team." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <FeaturedArticle />
        <BlogGrid />
      </main>
      
      <PublicFooter />
    </>
  );
}