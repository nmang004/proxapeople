import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "./metric-card";
import { ChartContainer } from "./chart-container";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart,
  Pie,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

// Default colors for charts
const COLORS = ['#8A4FFF', '#A66FFF', '#C28FFF', '#DFAFFF'];

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

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [timeFrame, setTimeFrame] = useState("quarter");
  const [activeTab, setActiveTab] = useState("engagement");
  
  // Fetch analytics data from the API
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  return (
    <div className={className}>
      {/* Mobile-responsive Time Frame Selector */}
      <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="engagement" className="text-xs sm:text-sm">Engagement</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs sm:text-sm">Goals</TabsTrigger>
            <TabsTrigger value="headcount" className="text-xs sm:text-sm">Headcount</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:space-x-2 md:gap-0">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <i className="ri-download-line mr-2"></i>
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export Data</span>
          </Button>
        </div>
      </div>
      
      <TabsContent value="engagement" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Current Engagement"
            value="8.4"
            change={{ value: "+0.2 from last quarter", positive: true }}
            subtitle="Out of 10 points"
          />
          
          <MetricCard
            title="Survey Response Rate"
            value="92%"
            change={{ value: "+5% from last quarter", positive: true }}
            subtitle="138/150 responses"
          />
          
          <MetricCard
            title="eNPS Score"
            value="+42"
            change={{ value: "+7 from last quarter", positive: true }}
            subtitle="65% promoters, 12% detractors"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer 
            title="Engagement Over Time" 
            description="Team engagement score trend"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagementData}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="quarter" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  domain={[0, 10]} 
                  fontSize={12}
                  width={40}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8A4FFF" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <ChartContainer 
            title="Department Engagement" 
            description="Engagement scores by department"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentEngagement}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  domain={[0, 10]} 
                  fontSize={12}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  fontSize={10}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8A4FFF">
                  {departmentEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Key Engagement Drivers</h3>
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
        </div>
      </TabsContent>
      
      <TabsContent value="performance" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Average Rating"
            value="4.2"
            change={{ value: "+0.3 from last cycle", positive: true }}
            subtitle="Out of 5 points"
          />
          
          <MetricCard
            title="Review Completion"
            value="78%"
            change={{ value: "Deadline: Nov 30", isWarning: true }}
            subtitle="117/150 completed"
          />
          
          <MetricCard
            title="High Performers"
            value="32%"
            change={{ value: "+4% from last cycle", positive: true }}
            subtitle="48 employees rated 4.5+"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer 
            title="Performance Distribution" 
            description="Employee rating distribution"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { rating: '1.0-1.9', count: 3 },
                  { rating: '2.0-2.9', count: 15 },
                  { rating: '3.0-3.9', count: 55 },
                  { rating: '4.0-4.4', count: 47 },
                  { rating: '4.5-5.0', count: 30 },
                ]}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="rating" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis fontSize={12} width={40} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Employees" fill="#8A4FFF" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <ChartContainer 
            title="Review Status" 
            description="Current review cycle progress"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewCompletion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8A4FFF"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={11}
                >
                  {reviewCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="goals" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Active Goals"
            value="87"
            change={{ value: "+12 from last quarter", positive: true }}
            subtitle="Across all departments"
          />
          
          <MetricCard
            title="Completion Rate"
            value="65%"
            change={{ value: "+8% from last quarter", positive: true }}
            subtitle="of all goals"
          />
          
          <MetricCard
            title="On-Track Goals"
            value="78%"
            change={{ value: "+5% from last month", positive: true }}
            subtitle="68/87 goals"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer 
            title="Goal Status" 
            description="Current goal progress across organization"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalProgress}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8A4FFF"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={11}
                >
                  {goalProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <ChartContainer 
            title="Department Goal Achievement" 
            description="Goal completion rate by department"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Engineering', rate: 72 },
                  { name: 'Marketing', rate: 68 },
                  { name: 'Product', rate: 81 },
                  { name: 'Design', rate: 76 },
                  { name: 'Sales', rate: 59 },
                  { name: 'Customer Success', rate: 63 },
                ]}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  fontSize={12}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  fontSize={10}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="rate" name="Goal Achievement %" fill="#8A4FFF">
                  {departmentEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="headcount" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Total Employees"
            value="150"
            change={{ value: "+8 from last quarter", positive: true }}
            subtitle="Full-time equivalent"
          />
          
          <MetricCard
            title="Turnover Rate"
            value="1.2%"
            change={{ value: "-0.8% from last quarter", positive: true }}
            subtitle="Monthly average"
          />
          
          <MetricCard
            title="New Hires"
            value="12"
            change={{ value: "+3 from last month", positive: true }}
            subtitle="In the past 90 days"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer 
            title="Employee Turnover Trend" 
            description="Monthly turnover rate"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={turnoverData}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  domain={[0, 5]} 
                  fontSize={12}
                  width={40}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8A4FFF" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <ChartContainer 
            title="Department Headcount" 
            description="Employee distribution by department"
            height="280px"
            className="min-h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Engineering', count: 42 },
                  { name: 'Marketing', count: 18 },
                  { name: 'Product', count: 24 },
                  { name: 'Design', count: 16 },
                  { name: 'Sales', count: 32 },
                  { name: 'Customer Success', count: 18 },
                ]}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  fontSize={12}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  fontSize={10}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Employees" fill="#8A4FFF">
                  {departmentEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </TabsContent>
    </div>
  );
}