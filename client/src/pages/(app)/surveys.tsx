import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SurveyForm from "@/components/forms/survey-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Survey, SurveyTemplate } from "@shared/schema";
import { Helmet } from 'react-helmet';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Surveys() {
  const [activeTab, setActiveTab] = useState("active");
  const [isSurveyFormOpen, setIsSurveyFormOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(undefined);
  
  const { data: surveys, isLoading, error } = useQuery<Survey[]>({
    queryKey: ['/api/surveys'],
  });
  
  const { data: templates } = useQuery<SurveyTemplate[]>({
    queryKey: ['/api/survey-templates'],
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const calculateSurveyCompletion = (surveyId: number) => {
    // In a real implementation, this would fetch actual response rates
    // Using mock calculation for UI demonstration
    return Math.floor(Math.random() * (100 - 30) + 30);
  };

  return (
    <>
      <Helmet>
        <title>Surveys | Proxa People Management</title>
        <meta name="description" content="Create and distribute pulse surveys and eNPS scoring to track employee engagement and satisfaction." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Surveys</h1>
        <p className="text-neutral-500 mt-1">Create and manage employee surveys and engagement tracking</p>
      </div>
      
      {/* Survey Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">3</div>
              <div className="text-sm text-neutral-500">
                <div className="flex items-center text-success">
                  <i className="ri-survey-line mr-1"></i>
                  <span>All on schedule</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">87%</div>
              <div className="text-sm text-neutral-500">
                <div className="flex items-center text-success">
                  <i className="ri-arrow-up-line mr-1"></i>
                  <span>+5% from last quarter</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">8.2</div>
              <div className="text-sm text-neutral-500">
                <div className="flex items-center text-success">
                  <i className="ri-arrow-up-line mr-1"></i>
                  <span>+0.4 since last survey</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Survey Management</CardTitle>
            <Button onClick={() => {
              setSelectedSurvey(undefined);
              setIsSurveyFormOpen(true);
            }}>
              <i className="ri-add-line mr-1"></i>
              Create New Survey
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              {isLoading ? (
                <div className="py-8 text-center">Loading surveys...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">Error loading survey data</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sample surveys for UI demonstration */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">Employee Engagement Pulse</CardTitle>
                        <Badge variant="outline" className="bg-secondary text-primary">Active</Badge>
                      </div>
                      <CardDescription>Quarterly pulse check on employee satisfaction</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Response Rate: 76%</span>
                          <span>23/30 Responses</span>
                        </div>
                        <Progress value={76} className="h-2" />
                        <div className="flex justify-between text-xs text-neutral-500 pt-1">
                          <span>Started: Oct 15, 2023</span>
                          <span>Ends: Oct 31, 2023</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-eye-line mr-1"></i>
                        View Responses
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="ri-more-2-fill"></i>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">Work Environment Survey</CardTitle>
                        <Badge variant="outline" className="bg-secondary text-primary">Active</Badge>
                      </div>
                      <CardDescription>Feedback on office space and remote work setup</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Response Rate: 90%</span>
                          <span>27/30 Responses</span>
                        </div>
                        <Progress value={90} className="h-2" />
                        <div className="flex justify-between text-xs text-neutral-500 pt-1">
                          <span>Started: Oct 10, 2023</span>
                          <span>Ends: Oct 25, 2023</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-eye-line mr-1"></i>
                        View Responses
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="ri-more-2-fill"></i>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">eNPS Score Survey</CardTitle>
                        <Badge variant="outline" className="bg-secondary text-primary">Active</Badge>
                      </div>
                      <CardDescription>Employee Net Promoter Score measurement</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Response Rate: 60%</span>
                          <span>18/30 Responses</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <div className="flex justify-between text-xs text-neutral-500 pt-1">
                          <span>Started: Oct 18, 2023</span>
                          <span>Ends: Nov 1, 2023</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <i className="ri-eye-line mr-1"></i>
                        View Responses
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="ri-more-2-fill"></i>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                <i className="ri-draft-line text-4xl block mb-2"></i>
                <p>No draft surveys found</p>
                <Button variant="outline" className="mt-4">Create a Draft Survey</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Q3 Engagement Survey</CardTitle>
                      <Badge variant="outline" className="bg-neutral-100 text-neutral-500">Completed</Badge>
                    </div>
                    <CardDescription>Quarterly engagement measurement</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Rate: 94%</span>
                        <span>28/30 Responses</span>
                      </div>
                      <Progress value={94} className="h-2" />
                      <div className="flex justify-between text-xs text-neutral-500 pt-1">
                        <span>Started: Jul 15, 2023</span>
                        <span>Ended: Jul 31, 2023</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-eye-line mr-1"></i>
                      View Results
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-file-copy-line mr-1"></i>
                      Clone
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">Manager Effectiveness Survey</CardTitle>
                      <Badge variant="outline" className="bg-neutral-100 text-neutral-500">Completed</Badge>
                    </div>
                    <CardDescription>Leadership and management effectiveness</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Rate: 83%</span>
                        <span>25/30 Responses</span>
                      </div>
                      <Progress value={83} className="h-2" />
                      <div className="flex justify-between text-xs text-neutral-500 pt-1">
                        <span>Started: Aug 10, 2023</span>
                        <span>Ended: Aug 25, 2023</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-eye-line mr-1"></i>
                      View Results
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-file-copy-line mr-1"></i>
                      Clone
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Employee Engagement Pulse</CardTitle>
                    <CardDescription>10 questions • ~5 min to complete</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm">
                    Standard set of questions to gauge employee satisfaction and engagement
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-file-list-line mr-1"></i>
                      View Template
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">eNPS Survey</CardTitle>
                    <CardDescription>2 questions • ~1 min to complete</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm">
                    Employee Net Promoter Score with likelihood to recommend question
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-file-list-line mr-1"></i>
                      View Template
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Work Environment</CardTitle>
                    <CardDescription>7 questions • ~3 min to complete</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm">
                    Assessment of workplace conditions and environment satisfaction
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-file-list-line mr-1"></i>
                      View Template
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Manager Effectiveness</CardTitle>
                    <CardDescription>12 questions • ~6 min to complete</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 text-sm">
                    Assessment of leadership qualities and manager effectiveness
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <i className="ri-file-list-line mr-1"></i>
                      View Template
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6">
                  <i className="ri-add-circle-line text-4xl text-neutral-400 mb-2"></i>
                  <p className="text-neutral-600 font-medium text-center mb-2">Create New Template</p>
                  <p className="text-neutral-500 text-sm text-center mb-4">Design a custom survey template</p>
                  <Button variant="outline">Create Template</Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Survey Results</CardTitle>
          <CardDescription>A summary of your most recent survey insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Engagement Score Trend</h3>
              <div className="aspect-video bg-neutral-50 rounded border border-neutral-100 flex items-center justify-center p-4">
                {/* Simulated Line Chart */}
                <div className="h-full w-full relative">
                  <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 flex justify-between">
                    <span className="text-xs text-neutral-500">Q1</span>
                    <span className="text-xs text-neutral-500">Q2</span>
                    <span className="text-xs text-neutral-500">Q3</span>
                    <span className="text-xs text-neutral-500">Q4</span>
                  </div>
                  <div className="absolute h-full flex flex-col justify-between left-0 text-xs text-neutral-500">
                    <span>10</span>
                    <span>5</span>
                    <span>0</span>
                  </div>
                  <div className="h-full w-full flex items-end pt-4 pl-6">
                    <svg className="w-full h-3/4" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path
                        d="M0,35 L25,30 L50,20 L75,15 L100,10"
                        fill="none"
                        stroke="#8A4FFF"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm text-neutral-600">
                <div>
                  <div className="font-medium">Starting Score</div>
                  <div className="text-xl font-bold text-primary">7.5</div>
                </div>
                <div>
                  <div className="font-medium">Current Score</div>
                  <div className="text-xl font-bold text-primary">8.2</div>
                </div>
                <div>
                  <div className="font-medium">Change</div>
                  <div className="text-xl font-bold text-success">+0.7</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Top Engagement Drivers</h3>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Survey Form Dialog */}
      {isSurveyFormOpen && (
        <SurveyForm
          open={isSurveyFormOpen}
          onClose={() => setIsSurveyFormOpen(false)}
          initialData={selectedSurvey}
          templates={templates?.map(template => ({
            id: template.id.toString(),
            name: template.name
          }))}
        />
      )}
    </>
  );
}
