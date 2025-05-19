import { Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { 
  ChevronRight, 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  Target, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Award, 
  TrendingUp,
  Activity,
  DownloadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoIconPurplePath from "@assets/LogoIcon_Purple.png";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Proxa | The People Management Platform That People Love</title>
        <meta name="description" content="Proxa's unified people management platform simplifies performance reviews, goal setting, and employee engagement with powerful tools designed for both HR teams and managers." />
      </Helmet>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LogoIconPurplePath} alt="Proxa Logo" className="h-8 w-8" />
            <span className="font-heading text-xl font-bold">Proxa</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-primary">Features</a>
            <a href="#integrations" className="text-sm font-medium text-neutral-600 hover:text-primary">Integrations</a>
            <a href="#testimonials" className="text-sm font-medium text-neutral-600 hover:text-primary">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-neutral-600 hover:text-primary">Pricing</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 md:pt-24 md:pb-28 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col">
              <h1 className="mb-4 font-heading text-4xl sm:text-5xl font-bold tracking-tight text-neutral-800 md:text-6xl">
                The HR platform <br className="hidden sm:block" />
                that people love
              </h1>
              <p className="mb-6 md:mb-8 text-lg md:text-xl text-neutral-600 max-w-lg">
                Proxa helps you build stronger teams with intuitive performance management, data-driven insights, and seamless workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Book a Demo
                  </Button>
                </a>
              </div>
              
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-600">
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-neutral-600">
                  Trusted by <span className="font-medium">10,000+</span> companies
                </div>
              </div>
            </div>
            
            <div className="relative h-full rounded-xl">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-neutral-800">"Proxa transformed how we manage performance reviews and goals across our organization."</p>
                    <p className="text-xs text-neutral-500 mt-1">Sarah T. — HR Director</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-[10%] -right-10 md:-right-16 bg-white rounded-lg shadow-lg p-3 z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check size={16} />
                  </div>
                  <span className="text-sm font-medium">Goals aligned</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-[20%] -left-10 md:-left-16 bg-white rounded-lg shadow-lg p-3 z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-sm font-medium">Performance up 24%</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brands Section */}
      <section className="border-y bg-neutral-50 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {['Acme Inc.', 'GlobalTech', 'Innovex', 'FutureCorp', 'Zenith', 'Quantum'].map((brand) => (
              <div key={brand} className="text-neutral-500 text-base md:text-lg font-semibold">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Assistant Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Proxa AI Assistant</h2>
            <p className="text-lg text-neutral-600">
              Our AI-powered tool helps managers and HR teams work more efficiently with automated insights, recommendations, and actionable feedback.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-neutral-50 p-6 rounded-xl max-w-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">How could I improve communication in my team?</h3>
                  <p className="text-xs text-neutral-500">Manager question</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-3">
                <p className="text-sm text-neutral-700">Based on recent feedback, consider:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Implementing weekly check-ins to address concerns early</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Creating a shared document for asynchronous updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Establishing clear goals and expectations for all projects</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative w-20 hidden md:block">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white p-1 rounded-full">
                  <ArrowRight size={24} className="text-neutral-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-xl max-w-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Communication Enhancement Plan</h3>
                  <p className="text-xs text-neutral-500">AI-generated recommendation</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-3">
                <p className="text-sm text-neutral-700">I've analyzed team feedback and created a plan:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-medium text-neutral-500 mb-1">Current score</p>
                    <p className="text-2xl font-bold text-neutral-800">6.2/10</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs font-medium text-neutral-500 mb-1">Target</p>
                    <p className="text-2xl font-bold text-primary">8.5/10</p>
                  </div>
                </div>
                <Button className="w-full">View detailed plan</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Everything you need to build stronger teams</h2>
            <p className="text-lg text-neutral-600">
              Our platform brings together tools for performance management, employee engagement, and team development into one seamless experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Performance Reviews",
                description: "Streamline the review process with customizable templates, automated workflows, and real-time feedback.",
                icon: <Award size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
              {
                title: "Goals & OKRs",
                description: "Set, track and align goals across your organization with intuitive tools that keep everyone moving in the same direction.",
                icon: <Target size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
              {
                title: "One-on-One Meetings",
                description: "Structured meeting templates, agenda builders, and action item tracking to make every conversation productive.",
                icon: <MessageSquare size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
              {
                title: "Employee Surveys",
                description: "Gather actionable feedback with customizable surveys that help you understand engagement and identify areas for improvement.",
                icon: <Activity size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
              {
                title: "Analytics Dashboard",
                description: "Gain insights into team performance, engagement trends, and organizational health with powerful visual analytics.",
                icon: <BarChart3 size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
              {
                title: "Team Management",
                description: "Efficiently organize teams, track roles, and manage reporting structures to keep your organization aligned.",
                icon: <Users size={24} className="text-primary" />,
                image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4">{feature.description}</p>
                  <a href="#" className="text-primary text-sm font-medium flex items-center">
                    Learn more <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Productivity Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                More productive managers, higher performing teams
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Proxa helps managers become more effective by providing the tools and insights they need to lead high-performing teams.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Streamlined feedback processes</h3>
                    <p className="text-sm text-neutral-600">Give and receive feedback that drives improvement and growth</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Goal alignment and tracking</h3>
                    <p className="text-sm text-neutral-600">Keep individual, team, and company goals connected and visible</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Data-driven insights</h3>
                    <p className="text-sm text-neutral-600">Make better decisions with analytics that reveal team trends</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button className="gap-2">
                    See how it works 
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                <div className="aspect-[16/10] bg-neutral-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-4 border">
                    <h4 className="text-lg font-medium mb-3">Team Performance Dashboard</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-neutral-500 mb-1">Average Engagement</p>
                        <p className="text-2xl font-bold text-emerald-600">87%</p>
                        <p className="text-xs text-emerald-600">▲ 12% from last quarter</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-neutral-500 mb-1">Goals Progress</p>
                        <p className="text-2xl font-bold text-blue-600">72%</p>
                        <p className="text-xs text-blue-600">On track for Q2</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Team Collaboration</span>
                        <span className="font-medium">84%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "84%" }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span>Knowledge Sharing</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "78%" }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span>Task Completion</span>
                        <span className="font-medium">91%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "91%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-3 z-20 border"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  <span className="text-sm font-medium">1:1 Meeting Reminder</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -top-6 -right-6 bg-emerald-50 rounded-lg shadow-lg p-3 z-20 border border-emerald-100"
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check size={14} />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">Goals aligned</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Less paperwork section */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="text-lg font-medium mb-3">Performance Review: Q2 2025</h4>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-neutral-50 rounded-lg p-2 text-center">
                        <div className="text-3xl font-bold text-primary">92%</div>
                        <p className="text-xs text-neutral-600">Complete</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-2 text-center">
                        <div className="text-3xl font-bold text-neutral-800">48</div>
                        <p className="text-xs text-neutral-600">Reviews</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-2 text-center">
                        <div className="text-3xl font-bold text-emerald-600">4.2</div>
                        <p className="text-xs text-neutral-600">Avg. Rating</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden mb-4">
                      <div className="p-3 border-b bg-neutral-50 text-sm font-medium">Recent Activity</div>
                      <div className="p-3 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                              <Check size={12} />
                            </div>
                            <div>
                              <p className="text-neutral-800">Michael K. completed self-assessment</p>
                              <p className="text-xs text-neutral-500">Today at 10:45 AM</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                              <Clock size={12} />
                            </div>
                            <div>
                              <p className="text-neutral-800">5 peer reviews pending</p>
                              <p className="text-xs text-neutral-500">Due in 3 days</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                              <MessageSquare size={12} />
                            </div>
                            <div>
                              <p className="text-neutral-800">New feedback from Sarah J.</p>
                              <p className="text-xs text-neutral-500">Yesterday at 4:30 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2">
                      <TrendingUp size={14} />
                      View all performance data
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute -top-6 -left-6 bg-primary rounded-lg shadow-lg p-3 z-20"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-white" />
                    <span className="text-sm font-medium text-white">Automated insights</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-3 z-20 border"
                >
                  <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full inline-block mb-1">
                    78% faster
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">vs. manual reviews</span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Less paperwork, more people work
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Automate administrative tasks so your HR team and managers can focus on what matters most: developing your people.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Automated review cycles</h3>
                    <p className="text-sm text-neutral-600">Schedule, assign and track reviews without manual coordination</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Time-saving templates</h3>
                    <p className="text-sm text-neutral-600">Customizable templates for reviews, 1:1s, and feedback</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-0.5">Centralized documentation</h3>
                    <p className="text-sm text-neutral-600">Store all performance data in one secure, accessible location</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button className="gap-2">
                    Try it yourself
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Integrations Section */}
      <section id="integrations" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Seamless integrations with your tech stack</h2>
            <p className="text-lg text-neutral-600">
              Proxa connects with the tools you already use to create a unified employee experience.
            </p>
          </div>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/5 flex items-center justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border shadow-sm flex items-center justify-center">
                  <img src={LogoIconPurplePath} alt="Proxa Logo" className="h-16 w-16" />
                </div>
              </div>
            </div>
            
            {[
              { name: "Slack", position: "top", color: "bg-[#4A154B]", textColor: "text-white" },
              { name: "Google", position: "top-right", color: "bg-blue-500", textColor: "text-white" },
              { name: "Zoom", position: "right", color: "bg-blue-600", textColor: "text-white" },
              { name: "MS Teams", position: "bottom-right", color: "bg-[#6264A7]", textColor: "text-white" },
              { name: "Jira", position: "bottom", color: "bg-[#0052CC]", textColor: "text-white" },
              { name: "Asana", position: "bottom-left", color: "bg-orange-600", textColor: "text-white" },
              { name: "Github", position: "left", color: "bg-neutral-900", textColor: "text-white" },
              { name: "Salesforce", position: "top-left", color: "bg-blue-700", textColor: "text-white" },
            ].map((integration, i) => {
              const getPosition = () => {
                switch(integration.position) {
                  case 'top': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
                  case 'top-right': return 'top-[15%] right-[15%] -translate-x-1/2 -translate-y-1/2';
                  case 'right': return 'top-1/2 right-0 -translate-x-1/2 -translate-y-1/2';
                  case 'bottom-right': return 'bottom-[15%] right-[15%] -translate-x-1/2 -translate-y-1/2';
                  case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
                  case 'bottom-left': return 'bottom-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2';
                  case 'left': return 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2';
                  case 'top-left': return 'top-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2';
                  default: return '';
                }
              };
              
              return (
                <div key={i} className={`absolute ${getPosition()} z-10`}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg ${integration.color} ${integration.textColor} flex items-center justify-center font-bold text-sm`}
                  >
                    {integration.name.charAt(0)}
                  </motion.div>
                </div>
              );
            })}
            
            <div className="h-80 md:h-120 flex items-center"></div>
          </div>
          
          <div className="mt-16 text-center">
            <Button className="gap-2">
              <DownloadCloud size={16} />
              View all integrations
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Your people are your business
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Invest in your team's growth with a platform designed to elevate performance, engagement, and results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Book a Demo
                </Button>
              </a>
            </div>
            
            <p className="text-sm text-neutral-500 mt-4">
              No credit card required. Free for up to 10 employees.
            </p>
          </div>
        </div>
        
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[200%] h-80 bg-primary/5 rounded-[100%]"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[250%] h-80 bg-primary/3 rounded-[100%]"></div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={LogoIconPurplePath} alt="Proxa Logo" className="h-8 w-8" />
                <span className="font-heading text-xl font-bold">Proxa</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                The people management platform that puts employees at the center.
              </p>
              <div className="flex gap-3">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((social) => (
                  <a key={social} href="#" className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4 bg-neutral-400 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-800 mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Integrations', 'Updates', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-neutral-600 hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Blog', 'Guides', 'Help Center', 'API Docs', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-neutral-600 hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-800 mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Contact', 'Partners', 'Legal'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-neutral-600 hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-800 mb-4">Get In Touch</h4>
              <ul className="space-y-2">
                {['Demo', 'Support', 'Sales', 'Feedback'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-neutral-600 hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} Proxa, Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-neutral-500 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Add Clock component to fix error
const Clock = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);