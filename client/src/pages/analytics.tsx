import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Helmet } from 'react-helmet';
import { 
  ChevronDown, 
  Download, 
  Calendar, 
  BarChart3, 
  Users, 
  Award, 
  Target, 
  TrendingUp, 
  HelpCircle,
  Info,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("last-quarter");
  const [activeTab, setActiveTab] = useState("engagement");
  const [focusTeam, setFocusTeam] = useState("all");
  
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics', timeRange],
  });
  
  // Sample engagement data
  const engagementData = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 74 },
    { month: 'Mar', score: 76 },
    { month: 'Apr', score: 73 },
    { month: 'May', score: 78 },
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 83 },
    { month: 'Aug', score: 85 },
    { month: 'Sep', score: 82 },
    { month: 'Oct', score: 86 },
    { month: 'Nov', score: 88 },
    { month: 'Dec', score: 90 },
  ];
  
  // Performance data by department
  const performanceByDepartment = [
    { name: 'Engineering', score: 86 },
    { name: 'Product', score: 83 },
    { name: 'Design', score: 88 },
    { name: 'Marketing', score: 78 },
    { name: 'Sales', score: 81 },
    { name: 'Customer Support', score: 75 },
    { name: 'HR', score: 92 },
    { name: 'Finance', score: 79 },
  ];
  
  // Review completion data
  const reviewCompletion = [
    { name: 'Completed', value: 78 },
    { name: 'In Progress', value: 17 },
    { name: 'Not Started', value: 5 },
  ];
  
  // Goal completion data
  const goalCompletionData = [
    { 
      name: 'Q1', 
      team: 82, 
      personal: 74, 
      company: 89 
    },
    { 
      name: 'Q2', 
      team: 85, 
      personal: 78, 
      company: 91
    },
    { 
      name: 'Q3', 
      team: 88, 
      personal: 81, 
      company: 87 
    },
    { 
      name: 'Q4 (Projected)', 
      team: 91, 
      personal: 85,
      company: 94
    },
  ];
  
  // Turnover rate data
  const turnoverData = [
    { month: 'Jan', rate: 2.3 },
    { month: 'Feb', rate: 2.1 },
    { month: 'Mar', rate: 1.9 },
    { month: 'Apr', rate: 2.0 },
    { month: 'May', rate: 2.2 },
    { month: 'Jun', rate: 1.8 },
    { month: 'Jul', rate: 1.7 },
    { month: 'Aug', rate: 1.5 },
    { month: 'Sep', rate: 1.6 },
    { month: 'Oct', rate: 1.4 },
    { month: 'Nov', rate: 1.3 },
    { month: 'Dec', rate: 1.2 },
  ];
  
  // Survey response rate data
  const surveyResponseData = [
    { name: 'Responded', value: 85 },
    { name: 'No Response', value: 15 },
  ];
  
  // One-on-one meeting data
  const oneOnOneMeetingData = [
    { month: 'Jan', completed: 65, missed: 35 },
    { month: 'Feb', completed: 72, missed: 28 },
    { month: 'Mar', completed: 70, missed: 30 },
    { month: 'Apr', completed: 78, missed: 22 },
    { month: 'May', completed: 80, missed: 20 },
    { month: 'Jun', completed: 85, missed: 15 },
    { month: 'Jul', completed: 88, missed: 12 },
    { month: 'Aug', completed: 90, missed: 10 },
    { month: 'Sep', completed: 92, missed: 8 },
    { month: 'Oct', completed: 94, missed: 6 },
    { month: 'Nov', completed: 95, missed: 5 },
    { month: 'Dec', completed: 96, missed: 4 },
  ];
  
  // Training completion data
  const trainingCompletionData = [
    { name: 'Leadership', completed: 87, pending: 13 },
    { name: 'Technical', completed: 92, pending: 8 },
    { name: 'Soft Skills', completed: 78, pending: 22 },
    { name: 'Compliance', completed: 96, pending: 4 },
    { name: 'Project Mgmt', completed: 83, pending: 17 },
  ];
  
  // Top skills in the organization
  const skillsDistribution = [
    { name: 'Technical Skills', value: 35 },
    { name: 'Leadership', value: 20 },
    { name: 'Communication', value: 15 },
    { name: 'Project Management', value: 12 },
    { name: 'Analytics', value: 10 },
    { name: 'Other', value: 8 },
  ];
  
  // Colors for charts
  const COLORS = ['#9C5AFF', '#4DD0E1', '#FFB74D', '#FF7043', '#4FC3F7', '#AED581'];
  
  // Trend indicators
  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <span className="text-emerald-500 flex items-center"><TrendingUp size={14} className="mr-1" /> {value}%</span>;
    } else if (value < 0) {
      return <span className="text-red-500 flex items-center"><TrendingUp size={14} className="mr-1 rotate-180" /> {Math.abs(value)}%</span>;
    }
    return <span className="text-neutral-500">—</span>;
  };
  
  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Proxa People Management</title>
        <meta name="description" content="Comprehensive analytics dashboard for tracking and understanding employee performance, engagement, and growth metrics." />
      </Helmet>
      
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-neutral-800">Analytics Dashboard</h1>
          <p className="text-neutral-500 mt-1">Track team performance, engagement, and growth with key metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Calendar size={16} />
            <span className="hidden sm:inline">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] border-0 p-0 h-auto text-sm">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </Button>
          
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Engagement Score</p>
                <h3 className="text-2xl font-bold mt-1">86%</h3>
                {getTrendIcon(5)}
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Performance Rating</p>
                <h3 className="text-2xl font-bold mt-1">4.2/5</h3>
                {getTrendIcon(2)}
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Award size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Goal Completion</p>
                <h3 className="text-2xl font-bold mt-1">82%</h3>
                {getTrendIcon(8)}
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <Target size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500">Turnover Rate</p>
                <h3 className="text-2xl font-bold mt-1">1.4%</h3>
                {getTrendIcon(-0.3)}
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <BarChart3 size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="mb-0">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>
          
          <Select value={focusTeam} onValueChange={setFocusTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Engagement Trend</CardTitle>
                <CardDescription>Monthly employee engagement scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={engagementData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[50, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#9C5AFF" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Survey Response Rate</CardTitle>
                <CardDescription>Employee pulse survey participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={surveyResponseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {surveyResponseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">One-on-One Meeting Completion</CardTitle>
              <CardDescription>Monthly completion rate of scheduled 1:1 meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={oneOnOneMeetingData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill="#9C5AFF" />
                    <Bar dataKey="missed" name="Missed" fill="#FF7043" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center">
                  <span>Top Engagement Drivers</span>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <HelpCircle size={14} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Work-Life Balance</span>
                      <span className="text-sm text-neutral-500">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Leadership & Management</span>
                      <span className="text-sm text-neutral-500">86%</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Career Growth</span>
                      <span className="text-sm text-neutral-500">83%</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Team Collaboration</span>
                      <span className="text-sm text-neutral-500">81%</span>
                    </div>
                    <Progress value={81} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Compensation & Benefits</span>
                      <span className="text-sm text-neutral-500">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Comments</CardTitle>
                <CardDescription>From employee pulse surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-neutral-50 rounded-md">
                    <p className="text-sm italic">"The new mentorship program has been tremendously helpful for my career development."</p>
                    <p className="text-xs text-neutral-500 mt-2">Engineering team, 3 days ago</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md">
                    <p className="text-sm italic">"I really appreciate the flexibility in our work arrangements. It's helped me achieve better work-life balance."</p>
                    <p className="text-xs text-neutral-500 mt-2">Marketing team, 5 days ago</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md">
                    <p className="text-sm italic">"Our weekly team meetings have become much more productive since the new format was introduced."</p>
                    <p className="text-xs text-neutral-500 mt-2">Product team, 1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance by Department</CardTitle>
                <CardDescription>Average performance scores across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={performanceByDepartment}
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#9C5AFF" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Review Status</CardTitle>
                <CardDescription>Current performance review completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reviewCompletion}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {reviewCompletion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Goal Completion</CardTitle>
              <CardDescription>Quarterly goal achievement by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={goalCompletionData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="personal" name="Personal Goals" fill="#4DD0E1" />
                    <Bar dataKey="team" name="Team Goals" fill="#9C5AFF" />
                    <Bar dataKey="company" name="Company Goals" fill="#FFB74D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center">
                  <span>Top Performance Areas</span>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <HelpCircle size={14} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Technical Expertise</span>
                      <span className="text-sm text-neutral-500">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Project Management</span>
                      <span className="text-sm text-neutral-500">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm text-neutral-500">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm text-neutral-500">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Initiative & Innovation</span>
                      <span className="text-sm text-neutral-500">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Performers</CardTitle>
                <CardDescription>Highest rated team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs">MK</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Michael Kim</p>
                      <p className="text-xs text-neutral-500">Engineering</p>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">
                      <span>4.9/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs">SJ</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-neutral-500">Product</p>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">
                      <span>4.8/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs">JT</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">James Taylor</p>
                      <p className="text-xs text-neutral-500">Design</p>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">
                      <span>4.7/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs">AL</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Amy Lee</p>
                      <p className="text-xs text-neutral-500">Marketing</p>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">
                      <span>4.7/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Development Tab */}
        <TabsContent value="development" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Training Completion</CardTitle>
                <CardDescription>Required training completion by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={trainingCompletionData}
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" stackId="a" fill="#9C5AFF" />
                      <Bar dataKey="pending" name="Pending" stackId="a" fill="#E0E0E0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Skills Distribution</CardTitle>
                <CardDescription>Top skills across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {skillsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Development Plan Progress</CardTitle>
                <CardDescription>Percentage of employees with active development plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 pt-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Engineering</span>
                      <span className="text-sm text-neutral-500">94%</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Product</span>
                      <span className="text-sm text-neutral-500">88%</span>
                    </div>
                    <Progress value={88} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Design</span>
                      <span className="text-sm text-neutral-500">90%</span>
                    </div>
                    <Progress value={90} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Marketing</span>
                      <span className="text-sm text-neutral-500">85%</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Sales</span>
                      <span className="text-sm text-neutral-500">82%</span>
                    </div>
                    <Progress value={82} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Training Requests</CardTitle>
                <CardDescription>Most requested development areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium">AI & Machine Learning</span>
                    <span className="text-xs text-neutral-500">48 requests</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium">Leadership Development</span>
                    <span className="text-xs text-neutral-500">42 requests</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium">Project Management</span>
                    <span className="text-xs text-neutral-500">36 requests</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium">Public Speaking</span>
                    <span className="text-xs text-neutral-500">29 requests</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-md flex justify-between items-center">
                    <span className="text-sm font-medium">Data Analysis</span>
                    <span className="text-xs text-neutral-500">25 requests</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Career Path Progress</CardTitle>
                <CardDescription>Advancement through career frameworks</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-neutral-50 p-3 flex justify-between items-center">
                    <h3 className="font-medium">Engineering Path</h3>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <span>Details</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Junior (L1-L2)</span>
                      <span>Mid-level (L3-L4)</span>
                      <span>Senior (L5-L6)</span>
                      <span>Lead (L7+)</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '37%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-2">
                      <span>28 employees</span>
                      <span>43 employees</span>
                      <span>17 employees</span>
                      <span>5 employees</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-neutral-50 p-3 flex justify-between items-center">
                    <h3 className="font-medium">Product Path</h3>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <span>Details</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Associate</span>
                      <span>Product Manager</span>
                      <span>Sr. Product Manager</span>
                      <span>Director</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-2">
                      <span>12 employees</span>
                      <span>18 employees</span>
                      <span>9 employees</span>
                      <span>3 employees</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Turnover Trend</CardTitle>
                <CardDescription>Monthly employee turnover rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={turnoverData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        name="Turnover Rate (%)"
                        stroke="#FF7043" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attrition by Tenure</CardTitle>
                <CardDescription>Employee departures by years at company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { tenure: '<1 year', count: 8 },
                        { tenure: '1-2 years', count: 12 },
                        { tenure: '2-3 years', count: 7 },
                        { tenure: '3-5 years', count: 5 },
                        { tenure: '5+ years', count: 2 },
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tenure" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Departures" fill="#FF7043" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Exit Survey Insights</CardTitle>
                <CardDescription>Top reasons cited for departures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Career Growth Opportunities</span>
                      <span className="text-sm text-neutral-500">32%</span>
                    </div>
                    <Progress value={32} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Compensation & Benefits</span>
                      <span className="text-sm text-neutral-500">27%</span>
                    </div>
                    <Progress value={27} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Work-Life Balance</span>
                      <span className="text-sm text-neutral-500">18%</span>
                    </div>
                    <Progress value={18} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Management & Leadership</span>
                      <span className="text-sm text-neutral-500">14%</span>
                    </div>
                    <Progress value={14} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Company Culture</span>
                      <span className="text-sm text-neutral-500">9%</span>
                    </div>
                    <Progress value={9} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Flight Risk</CardTitle>
                <CardDescription>Employees at risk of leaving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">High Risk</span>
                    </div>
                    <p className="text-sm text-neutral-600">12 employees (5%)</p>
                    <div className="flex items-center justify-end mt-2">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <span className="text-xs">View Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                      <span className="text-sm font-medium">Medium Risk</span>
                    </div>
                    <p className="text-sm text-neutral-600">28 employees (12%)</p>
                    <div className="flex items-center justify-end mt-2">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <span className="text-xs">View Details</span>
                        <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                      <span className="text-sm font-medium">Engagement Actions</span>
                    </div>
                    <p className="text-sm text-neutral-600">32 suggested interventions</p>
                    <div className="flex items-center justify-end mt-2">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <span className="text-xs">View Actions</span>
                        <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Retention Initiatives</CardTitle>
                <CardDescription>Active programs to improve retention</CardDescription>
              </div>
              <Button size="sm">
                <Info size={14} className="mr-1" />
                Add Initiative
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">Career Development Program</h3>
                      <p className="text-sm text-neutral-600">Structured pathway for advancement with clear milestones</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Active</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-neutral-500">
                    <span>85 participants</span>
                    <span className="mx-2">•</span>
                    <span>Launched 3 months ago</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">Mentorship Program</h3>
                      <p className="text-sm text-neutral-600">Pairing junior employees with senior mentors for growth</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Active</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-neutral-500">
                    <span>62 mentor pairs</span>
                    <span className="mx-2">•</span>
                    <span>Launched 5 months ago</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">Flexible Work Arrangements</h3>
                      <p className="text-sm text-neutral-600">Policy options for remote, hybrid, and flexible scheduling</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Active</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-neutral-500">
                    <span>212 participants</span>
                    <span className="mx-2">•</span>
                    <span>Launched 8 months ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}