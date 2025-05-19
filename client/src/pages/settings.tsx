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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from 'react-helmet';
import { ProxaIcon } from "@/lib/proxa-icon";
import { PermissionManager } from "@/components/rbac/PermissionManager";

// Company settings form schema
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  companySize: z.string().min(1, "Please select company size"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  timezone: z.string().min(1, "Please select a timezone"),
});

// User settings form schema
const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
});

// Notification settings form schema
const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  reviewReminders: z.boolean(),
  goalUpdates: z.boolean(),
  meetingReminders: z.boolean(),
  surveyNotifications: z.boolean(),
  teamUpdates: z.boolean(),
});

// Integration settings form schema
const integrationFormSchema = z.object({
  slackWorkspace: z.string().optional(),
  googleCalendar: z.boolean(),
  microsoftTeams: z.boolean(),
  zoom: z.boolean(),
  jira: z.boolean(),
  hrisSystem: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type IntegrationFormValues = z.infer<typeof integrationFormSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  
  // Company form setup
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "Proxa Technologies",
      industry: "technology",
      companySize: "50-200",
      description: "A cutting-edge software company focused on innovative solutions",
      website: "https://proxa.example.com",
      timezone: "America/New_York",
    },
  });

  // User form setup
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "Ashley",
      lastName: "Johnson",
      email: "ashley.johnson@proxa.example.com",
      jobTitle: "HR Director",
      department: "Human Resources",
      phoneNumber: "555-123-4567",
      profileImage: "",
    },
  });

  // Notification form setup
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      reviewReminders: true,
      goalUpdates: true,
      meetingReminders: true,
      surveyNotifications: true,
      teamUpdates: false,
    },
  });

  // Integration form setup
  const integrationForm = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      slackWorkspace: "proxa-team",
      googleCalendar: true,
      microsoftTeams: false,
      zoom: true,
      jira: false,
      hrisSystem: "bamboohr",
    },
  });

  // Form submission handlers
  function onCompanyFormSubmit(data: CompanyFormValues) {
    console.log("Company settings saved:", data);
    // API call would be here in a real implementation
  }

  function onUserFormSubmit(data: UserFormValues) {
    console.log("User settings saved:", data);
    // API call would be here in a real implementation
  }

  function onNotificationFormSubmit(data: NotificationFormValues) {
    console.log("Notification settings saved:", data);
    // API call would be here in a real implementation
  }

  function onIntegrationFormSubmit(data: IntegrationFormValues) {
    console.log("Integration settings saved:", data);
    // API call would be here in a real implementation
  }

  return (
    <>
      <Helmet>
        <title>Settings | Proxa People Management</title>
        <meta name="description" content="Configure your Proxa account settings, integrations, and notifications preferences." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Settings</h1>
        <p className="text-neutral-500 mt-1">Configure your Proxa account and organization preferences</p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="account">My Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="access">Access & Permissions</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            {/* Company Settings Tab */}
            <TabsContent value="company" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Company Settings</h2>
                <p className="text-neutral-500 mb-6">Configure your organization details and preferences</p>
                
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanyFormSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center justify-center border border-dashed rounded-lg w-40 h-40 mb-4">
                        <ProxaIcon className="h-20 w-20 mb-2" />
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-line mr-1"></i>
                          Upload Logo
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={companyForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={companyForm.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={companyForm.control}
                            name="companySize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Size</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select company size" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                    <SelectItem value="50-200">50-200 employees</SelectItem>
                                    <SelectItem value="201-500">201-500 employees</SelectItem>
                                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                    <SelectItem value="1001+">1001+ employees</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={companyForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://yourcompany.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={companyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                              <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button type="submit">Save Company Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* User Account Settings Tab */}
            <TabsContent value="account" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">My Account Settings</h2>
                <p className="text-neutral-500 mb-6">Update your personal information and preferences</p>
                
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(onUserFormSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-40 h-40 mb-4 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160&h=160" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-line mr-1"></i>
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={userForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={userForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={userForm.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Executive">Executive</SelectItem>
                                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Product">Product</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={userForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Account Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                <p className="text-neutral-500 mb-6">Configure how and when you receive notifications</p>
                
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationFormSubmit)} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Email Notifications</CardTitle>
                        <CardDescription>Configure email notification preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Email Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive email notifications for important updates
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Performance & Goals</CardTitle>
                        <CardDescription>Configure performance tracking notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="reviewReminders"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Review Reminders
                                </FormLabel>
                                <FormDescription>
                                  Receive notifications for upcoming and in-progress performance reviews
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="goalUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Goal Updates
                                </FormLabel>
                                <FormDescription>
                                  Receive notifications for goal progress updates and changes
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Meetings & Surveys</CardTitle>
                        <CardDescription>Configure meeting and survey notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="meetingReminders"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Meeting Reminders
                                </FormLabel>
                                <FormDescription>
                                  Receive reminders for upcoming one-on-one meetings
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="surveyNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Survey Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive notifications for new surveys and survey deadlines
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="teamUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Team Updates
                                </FormLabel>
                                <FormDescription>
                                  Receive notifications for changes to team structure and membership
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Notification Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Integrations Tab */}
            <TabsContent value="integrations" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Integration Settings</h2>
                <p className="text-neutral-500 mb-6">Connect Proxa with your existing tools and services</p>
                
                <Form {...integrationForm}>
                  <form onSubmit={integrationForm.handleSubmit(onIntegrationFormSubmit)} className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Communication Tools</CardTitle>
                        <CardDescription>Connect with team communication platforms</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={integrationForm.control}
                          name="slackWorkspace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slack Workspace</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="workspace-name" />
                              </FormControl>
                              <FormDescription>
                                Connect Proxa to your Slack workspace for notifications and updates
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={integrationForm.control}
                          name="microsoftTeams"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Microsoft Teams
                                </FormLabel>
                                <FormDescription>
                                  Connect with Microsoft Teams for meeting integration
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Calendar & Meeting Tools</CardTitle>
                        <CardDescription>Connect with calendar services</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={integrationForm.control}
                          name="googleCalendar"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Google Calendar
                                </FormLabel>
                                <FormDescription>
                                  Sync one-on-one meetings with Google Calendar
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={integrationForm.control}
                          name="zoom"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Zoom
                                </FormLabel>
                                <FormDescription>
                                  Automatically create Zoom meetings for one-on-ones
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Work Management Tools</CardTitle>
                        <CardDescription>Connect with project and work management tools</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={integrationForm.control}
                          name="jira"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Jira
                                </FormLabel>
                                <FormDescription>
                                  Connect goals with Jira tickets and epics
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={integrationForm.control}
                          name="hrisSystem"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>HRIS System</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select HRIS system" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bamboohr">BambooHR</SelectItem>
                                  <SelectItem value="workday">Workday</SelectItem>
                                  <SelectItem value="gusto">Gusto</SelectItem>
                                  <SelectItem value="adp">ADP</SelectItem>
                                  <SelectItem value="namely">Namely</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Connect to your HR Information System to sync employee data
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Integration Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Access & Permissions Tab */}
            <TabsContent value="access" className="mt-0">
              <div className="max-w-full">
                <h2 className="text-lg font-medium mb-4">Access & Permissions</h2>
                <p className="text-neutral-500 mb-6">Manage user roles and access controls</p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                  <div className="flex items-start">
                    <i className="ri-information-line text-amber-500 text-lg mt-0.5 mr-3"></i>
                    <div>
                      <h3 className="font-medium text-amber-800">Access Control Configuration</h3>
                      <p className="text-amber-700 text-sm mt-1">
                        Configuring access controls and permissions requires admin privileges. 
                        Changes made here will affect how users interact with the platform.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Permission Manager Component */}
                <PermissionManager />
              </div>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Billing & Subscription</h2>
                <p className="text-neutral-500 mb-6">Manage your billing information and subscription plan</p>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Current Plan</CardTitle>
                      <CardDescription>Your subscription details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-primary">Premium Plan</h3>
                            <p className="text-sm text-neutral-500">All features included</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">$499<span className="text-sm font-normal">/month</span></div>
                            <p className="text-sm text-neutral-500">Billed annually</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm">
                            <span>Next billing date:</span>
                            <span className="font-medium">June 15, 2023</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Payment method:</span>
                            <span className="font-medium">Visa ending in 4242</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-4">
                          <Button variant="outline">Update Payment Method</Button>
                          <Button variant="outline" className="text-red-500">Cancel Subscription</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Billing History</CardTitle>
                      <CardDescription>View your recent invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left font-medium text-sm p-2">Date</th>
                                <th className="text-left font-medium text-sm p-2">Description</th>
                                <th className="text-right font-medium text-sm p-2">Amount</th>
                                <th className="text-right font-medium text-sm p-2">Receipt</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-2 text-sm">May 15, 2023</td>
                                <td className="p-2 text-sm">Premium Plan (Annual)</td>
                                <td className="p-2 text-sm text-right">$5,988.00</td>
                                <td className="p-2 text-sm text-right">
                                  <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2 text-sm">May 15, 2022</td>
                                <td className="p-2 text-sm">Premium Plan (Annual)</td>
                                <td className="p-2 text-sm text-right">$5,988.00</td>
                                <td className="p-2 text-sm text-right">
                                  <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}