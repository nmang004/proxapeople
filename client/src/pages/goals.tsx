import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GoalForm } from "@/components/forms/goal-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/lib/types";
import { Helmet } from 'react-helmet';

export default function Goals() {
  const { data: goals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  });
  
  return (
    <>
      <Helmet>
        <title>Goals & OKRs | Proxa People Management</title>
        <meta name="description" content="Set, track, and align individual, team, and company goals and OKRs with progress tracking." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Goals & OKRs</h1>
        <p className="text-neutral-500 mt-1">Set, track, and manage objectives and key results</p>
      </div>
      
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
                <div>Overall on track</div>
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
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Goals Dashboard</CardTitle>
            <Button>
              <i className="ri-add-line mr-1"></i>
              Create New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Goals</TabsTrigger>
              <TabsTrigger value="my">My Goals</TabsTrigger>
              <TabsTrigger value="team">Team Goals</TabsTrigger>
              <TabsTrigger value="company">Company Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="py-8 text-center">Loading goals...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">Error loading goal data</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample goal data for UI demonstration */}
                    <TableRow>
                      <TableCell className="font-medium">Increase customer satisfaction score to 9.2</TableCell>
                      <TableCell>Customer Success Team</TableCell>
                      <TableCell>Dec 31, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="w-24" />
                          <span>75%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-info">In Progress</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Launch new product features (6/8)</TableCell>
                      <TableCell>Product Team</TableCell>
                      <TableCell>Dec 15, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={62} className="w-24" />
                          <span>62%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-info">In Progress</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reduce bug resolution time by 30%</TableCell>
                      <TableCell>Engineering Team</TableCell>
                      <TableCell>Nov 30, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={40} className="w-24" />
                          <span>40%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-warning">At Risk</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Improve team knowledge sharing</TableCell>
                      <TableCell>All Teams</TableCell>
                      <TableCell>Ongoing</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={90} className="w-24" />
                          <span>90%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-success">On Track</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="my" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing your personal goals
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing team goals
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing company goals
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
