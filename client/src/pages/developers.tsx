import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Code, ArrowRight, Copy, Terminal, Book, Zap, Shield, Globe, Download, ExternalLink, CheckCircle } from "lucide-react";
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
            Build with the <br />
            <span className="text-primary">Proxa People API</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Integrate performance management into your existing tools and workflows. 
            RESTful API with comprehensive documentation and SDKs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group">
              <Code className="w-5 h-5 mr-2" />
              View API Docs
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              <Terminal className="w-5 h-5 mr-2" />
              Interactive Playground
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">REST</div>
              <div className="text-sm text-neutral-600">API Architecture</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-neutral-600">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">&lt;200ms</div>
              <div className="text-sm text-neutral-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">OAuth 2.0</div>
              <div className="text-sm text-neutral-600">Authentication</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const QuickStart = () => {
  const [activeTab, setActiveTab] = useState("auth");

  const codeExamples = {
    auth: {
      title: "Authentication",
      description: "Get started with OAuth 2.0 authentication",
      code: `curl -X POST https://api.proxapeople.com/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "scope": "read:users write:reviews"
  }'

# Response
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:users write:reviews"
}`
    },
    users: {
      title: "Get Users",
      description: "Retrieve employee information",
      code: `curl -X GET https://api.proxapeople.com/v1/users \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json"

# Response
{
  "data": [
    {
      "id": "user_123",
      "email": "john.doe@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "jobTitle": "Software Engineer",
      "department": "Engineering",
      "managerId": "user_456",
      "startDate": "2023-01-15",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}`
    },
    reviews: {
      title: "Create Review",
      description: "Start a performance review cycle",
      code: `curl -X POST https://api.proxapeople.com/v1/reviews \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "revieweeId": "user_123",
    "reviewerId": "user_456",
    "cycleId": "cycle_2024_q1",
    "type": "annual",
    "dueDate": "2024-03-31",
    "questions": [
      {
        "id": "q1",
        "text": "Rate overall performance",
        "type": "rating",
        "scale": 5
      }
    ]
  }'

# Response
{
  "id": "review_789",
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00Z",
  "dueDate": "2024-03-31T23:59:59Z"
}`
    },
    goals: {
      title: "Track Goals",
      description: "Manage OKRs and goal progress",
      code: `curl -X PUT https://api.proxapeople.com/v1/goals/goal_123/progress \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "progress": 75,
    "status": "on_track",
    "notes": "Completed 3 of 4 key results",
    "updatedBy": "user_123"
  }'

# Response
{
  "id": "goal_123",
  "title": "Improve API Response Time",
  "progress": 75,
  "status": "on_track",
  "targetDate": "2024-06-30",
  "keyResults": [
    {
      "title": "Reduce average response time to <200ms",
      "progress": 90,
      "status": "completed"
    }
  ]
}`
    }
  };

  const tabs = [
    { id: "auth", label: "Authentication" },
    { id: "users", label: "Users" },
    { id: "reviews", label: "Reviews" },
    { id: "goals", label: "Goals" }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Quick Start Guide
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Get up and running with the Proxa People API in minutes.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tab Navigation */}
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="font-semibold">{tab.label}</div>
                  <div className={`text-sm mt-1 ${
                    activeTab === tab.id ? 'text-primary-100' : 'text-neutral-500'
                  }`}>
                    {codeExamples[activeTab as keyof typeof codeExamples].description}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Code Example */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {codeExamples[activeTab as keyof typeof codeExamples].title}
                    </CardTitle>
                    <Button size="sm" variant="outline">
                      <Copy className="w-3 h-3 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    {codeExamples[activeTab as keyof typeof codeExamples].description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-neutral-100">
                      <code>{codeExamples[activeTab as keyof typeof codeExamples].code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const APIFeatures = () => {
  const features = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Sub-200ms response times with global CDN and edge caching",
      details: ["99.9% uptime SLA", "Rate limiting: 1000 req/min", "Real-time webhooks"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "OAuth 2.0, HTTPS, and SOC 2 Type II compliance",
      details: ["JWT token authentication", "Scope-based permissions", "Audit logging"]
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Multi-region deployment with automatic failover",
      details: ["Global load balancing", "Data residency options", "99.99% availability"]
    },
    {
      icon: Book,
      title: "Comprehensive Docs",
      description: "Interactive documentation with code examples",
      details: ["OpenAPI 3.0 specification", "Postman collections", "SDK libraries"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Enterprise-Grade API
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Built for scale, security, and developer experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <p className="text-neutral-600 text-sm">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {detail}
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

const APIResources = () => {
  const resources = [
    {
      title: "API Reference",
      description: "Complete API documentation with interactive examples",
      icon: Book,
      link: "#",
      external: true
    },
    {
      title: "Postman Collection",
      description: "Pre-configured requests for easy testing and development",
      icon: Download,
      link: "#",
      external: true
    },
    {
      title: "SDKs & Libraries",
      description: "Official libraries for JavaScript, Python, PHP, and Ruby",
      icon: Code,
      link: "#",
      external: false
    },
    {
      title: "Webhooks Guide",
      description: "Real-time event notifications for your applications",
      icon: Zap,
      link: "#",
      external: false
    },
    {
      title: "Rate Limits",
      description: "Understanding API quotas and best practices",
      icon: Shield,
      link: "#",
      external: false
    },
    {
      title: "Migration Guide",
      description: "Upgrading from v1 to v2 API with breaking changes",
      icon: ArrowRight,
      link: "#",
      external: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Developer Resources
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everything you need to integrate with Proxa People.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <resource.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {resource.title}
                        {resource.external && <ExternalLink className="w-4 h-4 text-neutral-400" />}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 text-sm">{resource.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const useCases = [
    {
      title: "HRIS Integration",
      description: "Sync employee data between your HRIS and performance management system",
      example: "Automatically import new hires and update organizational structure",
      endpoints: ["/users", "/departments", "/roles"]
    },
    {
      title: "Custom Dashboards",
      description: "Build executive dashboards with real-time performance metrics",
      example: "Display team engagement scores and goal completion rates",
      endpoints: ["/analytics", "/goals", "/reviews"]
    },
    {
      title: "Slack/Teams Bots",
      description: "Create chatbots for goal updates and review reminders",
      example: "Weekly goal check-ins and automated review notifications",
      endpoints: ["/goals", "/reviews", "/webhooks"]
    },
    {
      title: "Workflow Automation",
      description: "Trigger actions based on performance events",
      example: "Auto-assign development plans when reviews are completed",
      endpoints: ["/webhooks", "/reviews", "/development-plans"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Common Use Cases
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            See how developers are using our API to build powerful integrations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <p className="text-neutral-600">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Example Implementation</h4>
                      <p className="text-neutral-600 text-sm">{useCase.example}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Key Endpoints</h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.endpoints.map((endpoint, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs font-mono"
                          >
                            {endpoint}
                          </span>
                        ))}
                      </div>
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

const CTASection = () => (
  <section className="py-16 md:py-24 bg-primary/5">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Ready to Start Building?
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Get your API keys and start integrating with Proxa People today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="group">
            <Code className="w-5 h-5 mr-2" />
            Get API Keys
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Developer Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function DevelopersPage() {
  return (
    <>
      <Helmet>
        <title>API Documentation | Proxa People - Developer Resources</title>
        <meta name="description" content="Integrate with Proxa People using our RESTful API. Comprehensive documentation, SDKs, and developer resources for performance management integrations." />
      </Helmet>
      
      <PublicHeader />
      
      <main>
        <HeroSection />
        <QuickStart />
        <APIFeatures />
        <UseCases />
        <APIResources />
        <CTASection />
      </main>
      
      <PublicFooter />
    </>
  );
}