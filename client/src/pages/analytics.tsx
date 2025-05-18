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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Helmet } from 'react-helmet';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

// Sample data for analytics visualization
const engagementData = [
  { quarter: 'Q1', score: 7.5 },
  { quarter: 'Q2', score: 7.8 },
  { quarter: 'Q3', score: 8.2 },
  { quarter: 'Q4', score: 8.4 },
];

const departmentEngagement = [
  { name: 'Engineering', score: 8.5 },
  { name: 'Marketing', score: 8.2 },
  { name: 'Product', score: 8.7 },
  { name: 'Design', score: 9.0 },
  { name: 'Sales', score: 7.9 },
  { name: 'Customer Success', score: 8.1 },
];

const reviewCompletion = [
  { name: 'Completed', value: 78 },
  { name: 'In Progress', value: 17 },
  { name: 'Not Started', value: 5 },
];

const goalProgress = [
  { name: 'Completed', value: 65 },
  { name: 'In Progress', value: 30 },
  { name: 'Not Started', value: 5 },
];

const turnoverData = [
  { month: 'Jan', rate: 3.2 },
  { month: 'Feb', rate: 2.8 },
  { month: 'Mar', rate: 3.1 },
  { month: 'Apr', rate: 2.5 },
  { month: 'May', rate: 2.2 },
  { month: 'Jun', rate: 2.0 },
  { month: 'Jul', rate: 1.8 },
  { month: 'Aug', rate: 1.5 },
  { month: 'Sep', rate: 1.7 },
  { month: 'Oct', rate: 1.4 },
  { month: 'Nov', rate: 1.2 },
  { month: 'Dec', rate: 1.0 },
];

const COLORS = ['#8A4FFF', '#A66FFF', '#C28FFF', '#DFAFFF'];

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState("quarter");
  const [activeTab, setActiveTab] = useState("engagement");
  
  return (
    <>
      <Helmet>
        <title>Analytics | Proxa People Management</title>
        <meta name="description" content="Gain insights from comprehensive analytics on employee engagement, performance trends, and goal progress." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Analytics</h1>
        <p className="text-neutral-500 mt-1">Track and analyze people data across your organization</p>
      </div>
      
      {/* Time Frame Selector */}
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="headcount">Headcount</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <i className="ri-download-line mr-1"></i>
            Export
          </Button>
        </div>
      </div>
      
      <TabsContent value="engagement" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">8.4</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+0.2 from last quarter</span>
                  </div>
                  <div>Out of 10 points</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Survey Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">92%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+5% from last quarter</span>
                  </div>
                  <div>138/150 responses</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">eNPS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">+42</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+7 from last quarter</span>
                  </div>
                  <div>65% promoters, 12% detractors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>Team engagement score trend</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={engagementData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8A4FFF" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Department Engagement</CardTitle>
              <CardDescription>Engagement scores by department</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentEngagement}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8A4FFF">
                    {departmentEngagement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Key Engagement Drivers</CardTitle>
            <CardDescription>Factors most impacting employee engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Work Environment</span>
                  <span className="text-sm">8.7/10</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Team Collaboration</span>
                  <span className="text-sm">8.5/10</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Work-Life Balance</span>
                  <span className="text-sm">7.9/10</span>
                </div>
                <Progress value={79} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Career Growth</span>
                  <span className="text-sm">7.8/10</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Management Support</span>
                  <span className="text-sm">8.1/10</span>
                </div>
                <Progress value={81} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Compensation & Benefits</span>
                  <span className="text-sm">7.6/10</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="performance" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">4.2</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+0.3 from last cycle</span>
                  </div>
                  <div>Out of 5 points</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Review Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">78%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-warning">
                    <i className="ri-time-line mr-1"></i>
                    <span>Deadline: Nov 30</span>
                  </div>
                  <div>117/150 completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">32%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+4% from last cycle</span>
                  </div>
                  <div>48 employees rated 4.5+</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Employee rating distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { rating: '1.0-1.9', count: 3 },
                    { rating: '2.0-2.9', count: 15 },
                    { rating: '3.0-3.9', count: 55 },
                    { rating: '4.0-4.4', count: 47 },
                    { rating: '4.5-5.0', count: 30 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Employees" fill="#8A4FFF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Review Status</CardTitle>
              <CardDescription>Current review cycle progress</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reviewCompletion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8A4FFF"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reviewCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="goals" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">23</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+5 from last quarter</span>
                  </div>
                  <div>4 due this week</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">68%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+12% from last quarter</span>
                  </div>
                  <div>On track for Q4</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Goal Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">92%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+8% from last quarter</span>
                  </div>
                  <div>Team to company</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Goal Status Distribution</CardTitle>
              <CardDescription>Current status of all active goals</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalProgress}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8A4FFF"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {goalProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Goal Progress By Department</CardTitle>
              <CardDescription>Average completion percentage</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { department: 'Engineering', progress: 72 },
                    { department: 'Marketing', progress: 85 },
                    { department: 'Product', progress: 65 },
                    { department: 'Design', progress: 78 },
                    { department: 'Sales', progress: 90 },
                    { department: 'CS', progress: 83 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" name="Progress %" fill="#8A4FFF">
                    {departmentEngagement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="headcount" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">150</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-up-line mr-1"></i>
                    <span>+12 from last quarter</span>
                  </div>
                  <div>8.7% growth rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">New Hires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">14</div>
                <div className="text-sm text-neutral-500">
                  <div>In the last 90 days</div>
                  <div className="flex items-center text-success">
                    <i className="ri-user-add-line mr-1"></i>
                    <span>All onboarded</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Turnover Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-primary mr-3">1.0%</div>
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center text-success">
                    <i className="ri-arrow-down-line mr-1"></i>
                    <span>-0.2% from last month</span>
                  </div>
                  <div>Below industry average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Turnover Rate Trend</CardTitle>
              <CardDescription>Monthly employee turnover</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={turnoverData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="Turnover Rate (%)"
                    stroke="#8A4FFF" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Department Headcount</CardTitle>
              <CardDescription>Employee distribution by department</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { department: 'Engineering', count: 48 },
                    { department: 'Marketing', count: 22 },
                    { department: 'Product', count: 18 },
                    { department: 'Design', count: 12 },
                    { department: 'Sales', count: 32 },
                    { department: 'CS', count: 14 },
                    { department: 'Operations', count: 4 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8A4FFF" name="Employees">
                    {departmentEngagement.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}
