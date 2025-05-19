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
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Product">Product</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
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
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Password & Security</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" type="button">
                          <i className="ri-lock-password-line mr-1"></i>
                          Change Password
                        </Button>
                        
                        <Button variant="outline" type="button">
                          <i className="ri-shield-keyhole-line mr-1"></i>
                          Enable Two-Factor Authentication
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Account Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Notification Settings Tab */}
            <TabsContent value="notifications" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
                <p className="text-neutral-500 mb-6">Manage how and when you receive notifications</p>
                
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationFormSubmit)} className="space-y-6">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
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
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Notification Types</h3>
                      
                      <FormField
                        control={notificationForm.control}
                        name="reviewReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Performance Review Reminders</FormLabel>
                              <FormDescription>
                                Get reminders about upcoming and due reviews
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
                              <FormLabel className="text-base">Goal Updates</FormLabel>
                              <FormDescription>
                                Notifications when goals are updated or completed
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
                        name="meetingReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">1:1 Meeting Reminders</FormLabel>
                              <FormDescription>
                                Get reminders about upcoming 1:1 meetings
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
                              <FormLabel className="text-base">Survey Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications about new surveys and completions
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
                              <FormLabel className="text-base">Team Updates</FormLabel>
                              <FormDescription>
                                Notifications about team changes and announcements
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
                    </div>
                    
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
                <h2 className="text-lg font-medium mb-4">Integrations</h2>
                <p className="text-neutral-500 mb-6">Connect Proxa with your other tools and services</p>
                
                <Form {...integrationForm}>
                  <form onSubmit={integrationForm.handleSubmit(onIntegrationFormSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Communication Tools</h3>
                      
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#4A154B] w-10 h-10 rounded flex items-center justify-center text-white">
                            <i className="ri-slack-fill text-xl"></i>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-base font-medium">Slack</h4>
                            <p className="text-sm text-neutral-500">
                              Send notifications and updates to Slack channels
                            </p>
                          </div>
                        </div>
                        <FormField
                          control={integrationForm.control}
                          name="slackWorkspace"
                          render={({ field }) => (
                            <div className="w-32">
                              <Input {...field} placeholder="Workspace" />
                            </div>
                          )}
                        />
                      </div>
                      
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#6264A7] w-10 h-10 rounded flex items-center justify-center text-white">
                            <i className="ri-microsoft-fill text-xl"></i>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-base font-medium">Microsoft Teams</h4>
                            <p className="text-sm text-neutral-500">
                              Connect with Microsoft Teams
                            </p>
                          </div>
                        </div>
                        <FormField
                          control={integrationForm.control}
                          name="microsoftTeams"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Calendar & Meeting Tools</h3>
                      
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#4285F4] w-10 h-10 rounded flex items-center justify-center text-white">
                            <i className="ri-google-fill text-xl"></i>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-base font-medium">Google Calendar</h4>
                            <p className="text-sm text-neutral-500">
                              Sync 1:1 meetings with Google Calendar
                            </p>
                          </div>
                        </div>
                        <FormField
                          control={integrationForm.control}
                          name="googleCalendar"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#2D8CFF] w-10 h-10 rounded flex items-center justify-center text-white">
                            <i className="ri-video-chat-fill text-xl"></i>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-base font-medium">Zoom</h4>
                            <p className="text-sm text-neutral-500">
                              Automatically generate Zoom links for meetings
                            </p>
                          </div>
                        </div>
                        <FormField
                          control={integrationForm.control}
                          name="zoom"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Work Tools</h3>
                      
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#0052CC] w-10 h-10 rounded flex items-center justify-center text-white">
                            <i className="ri-jira-fill text-xl"></i>
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-base font-medium">Jira</h4>
                            <p className="text-sm text-neutral-500">
                              Link goals and OKRs with Jira tickets
                            </p>
                          </div>
                        </div>
                        <FormField
                          control={integrationForm.control}
                          name="jira"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">HRIS Integration</h3>
                      
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
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="bamboohr">BambooHR</SelectItem>
                                <SelectItem value="gusto">Gusto</SelectItem>
                                <SelectItem value="workday">Workday</SelectItem>
                                <SelectItem value="adp">ADP</SelectItem>
                                <SelectItem value="greenhouse">Greenhouse</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Connect to your HR Information System to sync employee data
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit">Save Integration Settings</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Access & Permissions Tab */}
            <TabsContent value="access" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Access & Permissions</h2>
                <p className="text-neutral-500 mb-6">Manage user roles and access controls</p>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">User Roles</CardTitle>
                      <CardDescription>Configure available roles and their permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h4 className="font-medium">Admin</h4>
                            <p className="text-sm text-neutral-500">Full access to all settings and data</p>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h4 className="font-medium">Manager</h4>
                            <p className="text-sm text-neutral-500">Can manage their direct reports and teams</p>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Employee</h4>
                            <p className="text-sm text-neutral-500">Limited access to personal data only</p>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Team Access Controls</CardTitle>
                      <CardDescription>Set which teams can access specific modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline">Configure Team Access</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Privacy</CardTitle>
                      <CardDescription>Configure data visibility and privacy settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Anonymous Survey Responses</h4>
                            <p className="text-sm text-neutral-500">Keep survey responses anonymous by default</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Peer Feedback Privacy</h4>
                            <p className="text-sm text-neutral-500">Keep peer feedback private to managers only</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Goal Visibility</h4>
                            <p className="text-sm text-neutral-500">Allow employees to see team and company goals</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0">
              <div className="max-w-2xl">
                <h2 className="text-lg font-medium mb-4">Billing & Subscription</h2>
                <p className="text-neutral-500 mb-6">Manage your subscription plan and billing information</p>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="inline-block bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm mb-2">
                          Professional Plan
                        </div>
                        <p className="text-xl font-bold">$12 <span className="text-sm font-normal text-neutral-500">per user/month</span></p>
                        <p className="text-sm text-neutral-500 mt-1">Billed annually for 150 users</p>
                      </div>
                      <div className="mt-4 md:mt-0 space-x-2">
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="outline" className="text-red-500 hover:text-red-600">Cancel Subscription</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-neutral-100 p-2 rounded mr-4">
                          <i className="ri-visa-line text-xl"></i>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-neutral-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button variant="outline">Update Payment Method</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Billing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">October 1, 2023</p>
                          <p className="text-sm text-neutral-500">Professional Plan - Annual</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$21,600.00</p>
                          <Button variant="ghost" size="sm">
                            <i className="ri-download-line mr-1"></i>
                            Invoice
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">October 1, 2022</p>
                          <p className="text-sm text-neutral-500">Professional Plan - Annual</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$19,800.00</p>
                          <Button variant="ghost" size="sm">
                            <i className="ri-download-line mr-1"></i>
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
