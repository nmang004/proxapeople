import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell, 
  Calendar,
  CheckCircle, 
  ChevronRight, 
  Clock,
  CreditCard, 
  Eye,
  Globe, 
  LanguagesIcon,
  Lock, 
  LogOut,
  Monitor, 
  MonitorSmartphone,
  Moon, 
  Palette, 
  Shield, 
  Smartphone,
  Sun, 
  Trash2, 
  Upload, 
  User
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { motion } from "framer-motion";

// Company settings form schema
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  companySize: z.string().min(1, "Please select company size"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  timezone: z.string().min(1, "Please select a timezone"),
  logo: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  companyEmail: z.string().email("Please enter a valid email").or(z.string().length(0)),
  phone: z.string().optional(),
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
  bio: z.string().optional(),
  location: z.string().optional(),
  language: z.string().default("en-US"),
  userTimezone: z.string().default("America/New_York"),
  dateFormat: z.string().default("MM/DD/YYYY"),
  timeFormat: z.string().default("12h"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  showCalendarStatus: z.boolean().default(true),
});

// Password settings form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Notification settings form schema
const notificationFormSchema = z.object({
  // General notification preferences
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  
  // Specific notification types
  reviewReminders: z.boolean().default(true),
  reviewAssignments: z.boolean().default(true),
  reviewCompletions: z.boolean().default(true),
  goalUpdates: z.boolean().default(true),
  goalDeadlines: z.boolean().default(true),
  goalAchievements: z.boolean().default(true), 
  meetingReminders: z.boolean().default(true),
  meetingChanges: z.boolean().default(true),
  surveyNotifications: z.boolean().default(true),
  surveyDeadlines: z.boolean().default(true),
  teamUpdates: z.boolean().default(true),
  teamAnnouncements: z.boolean().default(true),
  directMessages: z.boolean().default(true),
  
  // Frequency preferences
  emailDigestFrequency: z.enum(["immediate", "daily", "weekly"]).default("daily"),
  summaryReports: z.boolean().default(true),
  weeklyUpdates: z.boolean().default(true),
  
  // Do not disturb settings
  doNotDisturbEnabled: z.boolean().default(false),
  doNotDisturbStart: z.string().default("18:00"),
  doNotDisturbEnd: z.string().default("09:00"),
  doNotDisturbWeekends: z.boolean().default(true),
});

// Integration settings form schema
const integrationFormSchema = z.object({
  slackWorkspace: z.string().optional(),
  slackEnabled: z.boolean().default(false),
  googleCalendar: z.boolean().default(false),
  microsoftTeams: z.boolean().default(false),
  microsoftOutlook: z.boolean().default(false),
  zoom: z.boolean().default(false),
  jira: z.boolean().default(false),
  jiraDomain: z.string().optional(),
  asana: z.boolean().default(false),
  trello: z.boolean().default(false),
  githubWorkspace: z.string().optional(),
  githubEnabled: z.boolean().default(false),
  hrisSystem: z.string().optional(),
  bambooHrEnabled: z.boolean().default(false),
  workdayEnabled: z.boolean().default(false),
});

// Security settings form schema
const securityFormSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  twoFactorMethod: z.enum(["app", "sms", "email"]).default("app"),
  loginNotifications: z.boolean().default(true),
  rememberDevices: z.boolean().default(true),
  sessionTimeout: z.enum(["30min", "1hour", "4hours", "8hours", "24hours"]).default("4hours"),
  ipRestrictions: z.boolean().default(false),
  allowedIPs: z.string().optional(),
});

// Appearance settings form schema
const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  colorScheme: z.enum(["default", "blue", "green", "red", "orange"]).default("default"),
  density: z.enum(["comfortable", "compact", "spacious"]).default("comfortable"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  animations: z.boolean().default(true),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type IntegrationFormValues = z.infer<typeof integrationFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("security");
  
  // File input ref for profile image upload
  const profileImageInputRef = useRef<HTMLInputElement>(null);

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
      logo: "",
      address: "123 Innovation Way",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      companyEmail: "info@proxa.example.com",
      phone: "555-987-6543",
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
      bio: "HR professional with 10+ years of experience in talent management and employee development.",
      location: "San Francisco, CA",
      language: "en-US",
      userTimezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      theme: "system",
      showCalendarStatus: true,
    },
  });

  // Password form setup
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification form setup
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      // General notification preferences
      emailNotifications: true,
      appNotifications: true,
      smsNotifications: false,
      
      // Specific notification types
      reviewReminders: true,
      reviewAssignments: true,
      reviewCompletions: true,
      goalUpdates: true,
      goalDeadlines: true,
      goalAchievements: true, 
      meetingReminders: true,
      meetingChanges: true,
      surveyNotifications: true,
      surveyDeadlines: true,
      teamUpdates: true,
      teamAnnouncements: true,
      directMessages: true,
      
      // Frequency preferences
      emailDigestFrequency: "daily",
      summaryReports: true,
      weeklyUpdates: true,
      
      // Do not disturb settings
      doNotDisturbEnabled: false,
      doNotDisturbStart: "18:00",
      doNotDisturbEnd: "09:00",
      doNotDisturbWeekends: true,
    },
  });

  // Integration form setup
  const integrationForm = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      slackWorkspace: "proxa-team",
      slackEnabled: true,
      googleCalendar: true,
      microsoftTeams: false,
      microsoftOutlook: false,
      zoom: true,
      jira: false,
      jiraDomain: "",
      asana: false,
      trello: false,
      githubWorkspace: "",
      githubEnabled: false,
      hrisSystem: "bamboohr",
      bambooHrEnabled: true,
      workdayEnabled: false,
    },
  });

  // Security form setup
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorEnabled: false,
      twoFactorMethod: "app",
      loginNotifications: true,
      rememberDevices: true,
      sessionTimeout: "4hours",
      ipRestrictions: false,
      allowedIPs: "",
    },
  });

  // Appearance form setup
  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "system",
      colorScheme: "default",
      density: "comfortable",
      fontSize: "medium",
      animations: true,
    },
  });

  // File handler for profile image
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, this would upload the file to a server
      // For now, we'll create a local URL for display
      const imageUrl = URL.createObjectURL(file);
      userForm.setValue("profileImage", imageUrl);
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      });
    }
  };

  // Function to trigger file input click
  const triggerProfileImageUpload = () => {
    profileImageInputRef.current?.click();
  };

  // Form submission handlers
  function onCompanyFormSubmit(data: CompanyFormValues) {
    console.log("Company settings saved:", data);
    // API call would be here in a real implementation
    
    toast({
      title: "Company settings saved",
      description: "Your company settings have been updated successfully.",
      variant: "default",
    });
  }

  function onUserFormSubmit(data: UserFormValues) {
    console.log("User settings saved:", data);
    // API call would be here in a real implementation
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    });
  }

  function onPasswordFormSubmit(data: PasswordFormValues) {
    console.log("Password changed:", data);
    // API call would be here in a real implementation
    
    // Reset form after submission
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully. Please use your new password for future logins.",
      variant: "default",
    });
  }

  function onNotificationFormSubmit(data: NotificationFormValues) {
    console.log("Notification settings saved:", data);
    // API call would be here in a real implementation
    
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated successfully.",
      variant: "default",
    });
  }

  function onIntegrationFormSubmit(data: IntegrationFormValues) {
    console.log("Integration settings saved:", data);
    // API call would be here in a real implementation
    
    toast({
      title: "Integrations updated",
      description: "Your integration settings have been updated successfully.",
      variant: "default",
    });
  }
  
  function onSecurityFormSubmit(data: SecurityFormValues) {
    console.log("Security settings saved:", data);
    // API call would be here in a real implementation
    
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
      variant: "default",
    });
  }
  
  function onAppearanceFormSubmit(data: AppearanceFormValues) {
    console.log("Appearance settings saved:", data);
    
    // In a real implementation, we would make an API call to save the settings
    // For example:
    // apiRequest('/api/settings/appearance', {
    //   method: 'POST',
    //   data
    // });
    
    // Apply the theme immediately (in a real app, this would be more sophisticated)
    document.documentElement.classList.remove('light', 'dark');
    if (data.theme !== 'system') {
      document.documentElement.classList.add(data.theme);
    } else {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    }
    
    // Apply color scheme (in a real app, would update CSS variables)
    
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been updated and applied.",
      variant: "default",
    });
  }
  
  // Account deletion handler
  const deleteAccount = () => {
    // This would make an API call to delete the account in a real implementation
    console.log("Account deletion requested");
    
    toast({
      title: "Account deletion requested",
      description: "Your account deletion request has been submitted. You will receive an email confirmation.",
      variant: "destructive",
    });
  }

  return (
    <>
      <Helmet>
        <title>Platform Settings | Proxa People Management</title>
        <meta name="description" content="Configure system settings, integrations, and platform preferences." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Platform Settings</h1>
        <p className="text-neutral-500 mt-1">Configure system settings and platform preferences</p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap w-full bg-gray-100 p-1.5 rounded-lg">
              <TabsTrigger value="security" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <Lock className="h-5 w-5" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <Globe className="h-5 w-5" />
                <span>Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <Shield className="h-5 w-5" />
                <span>Access</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                <CreditCard className="h-5 w-5" />
                <span>Billing</span>
              </TabsTrigger>
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
            {/* Security Tab */}
            <TabsContent value="security" className="mt-0">
              <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Security & Password</h2>
                    <p className="text-neutral-500">Manage your account security settings and password</p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Protected</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-medium mb-4">Change Password</h3>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordFormSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormDescription>
                                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="mt-2">Change Password</Button>
                      </form>
                    </Form>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-4">Two-Factor Authentication</h3>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(onSecurityFormSubmit)} className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="twoFactorEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Enable Two-Factor Authentication
                                </FormLabel>
                                <FormDescription>
                                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {securityForm.watch("twoFactorEnabled") && (
                          <FormField
                            control={securityForm.control}
                            name="twoFactorMethod"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Authentication Method</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="app" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Authenticator App
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="sms" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        SMS Text Message
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="email" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Email
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <h3 className="text-md font-medium pt-4 pb-2">Session Settings</h3>
                        
                        <FormField
                          control={securityForm.control}
                          name="sessionTimeout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Timeout</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select timeout period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="30min">30 minutes</SelectItem>
                                  <SelectItem value="1hour">1 hour</SelectItem>
                                  <SelectItem value="4hours">4 hours</SelectItem>
                                  <SelectItem value="8hours">8 hours</SelectItem>
                                  <SelectItem value="24hours">24 hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Automatically log out after a period of inactivity
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={securityForm.control}
                          name="loginNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Login Notifications</FormLabel>
                                <FormDescription>
                                  Receive email notifications for new login attempts
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
                        
                        <Button type="submit" className="mt-2">Save Security Settings</Button>
                      </form>
                    </Form>
                    
                    <div className="mt-8 pt-4 border-t">
                      <h3 className="text-md font-medium mb-2">Active Sessions</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-md border">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">Safari • San Francisco, CA • May 19, 2025</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-md border">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-muted-foreground">iOS • San Francisco, CA • May 18, 2025</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Revoke</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="mt-0">
              <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Appearance Settings</h2>
                    <p className="text-neutral-500">Customize how Proxa People looks and feels for you</p>
                  </div>
                </div>
                
                <Form {...appearanceForm}>
                  <form onSubmit={appearanceForm.handleSubmit(onAppearanceFormSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex flex-col space-y-4">
                        <h3 className="text-md font-medium">Theme</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div
                                    className={`flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer transition-all ${
                                      field.value === "light" 
                                        ? "border-primary bg-accent shadow-md" 
                                        : "hover:border-primary/50 hover:bg-gray-50"
                                    }`}
                                    onClick={() => field.onChange("light")}
                                  >
                                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border">
                                      <Sun className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <span className="font-medium text-lg">Light</span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div
                                    className={`flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer transition-all ${
                                      field.value === "dark" 
                                        ? "border-primary bg-accent shadow-md" 
                                        : "hover:border-primary/50 hover:bg-gray-50"
                                    }`}
                                    onClick={() => field.onChange("dark")}
                                  >
                                    <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-3 shadow-sm border">
                                      <Moon className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <span className="font-medium text-lg">Dark</span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div
                                    className={`flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer transition-all ${
                                      field.value === "system" 
                                        ? "border-primary bg-accent shadow-md" 
                                        : "hover:border-primary/50 hover:bg-gray-50"
                                    }`}
                                    onClick={() => field.onChange("system")}
                                  >
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-sm border overflow-hidden">
                                      <div className="w-full h-full flex">
                                        <div className="w-1/2 h-full bg-white flex items-center justify-center">
                                          <Sun className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <div className="w-1/2 h-full bg-zinc-900 flex items-center justify-center">
                                          <Moon className="w-8 h-8 text-blue-400" />
                                        </div>
                                      </div>
                                    </div>
                                    <span className="font-medium text-lg">System</span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-6 space-y-4">
                        <h3 className="text-md font-medium">Interface Density</h3>
                        <FormField
                          control={appearanceForm.control}
                          name="density"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer">
                                    <FormControl>
                                      <RadioGroupItem value="compact" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-medium">Compact</FormLabel>
                                      <FormDescription>
                                        Maximize content density with smaller UI elements
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer">
                                    <FormControl>
                                      <RadioGroupItem value="comfortable" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-medium">Comfortable</FormLabel>
                                      <FormDescription>
                                        Standard spacing with balanced UI sizing
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 cursor-pointer">
                                    <FormControl>
                                      <RadioGroupItem value="spacious" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-medium">Spacious</FormLabel>
                                      <FormDescription>
                                        More breathing room with larger UI elements
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-t pt-6 space-y-4">
                        <h3 className="text-md font-medium">Font Size</h3>
                        <FormField
                          control={appearanceForm.control}
                          name="fontSize"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select font size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium (Default)</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Adjust the size of text throughout the application
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-t pt-6">
                        <FormField
                          control={appearanceForm.control}
                          name="animations"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Animations</FormLabel>
                                <FormDescription>
                                  Enable or disable UI animations and transitions
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
                      
                      <FormField
                        control={appearanceForm.control}
                        name="colorScheme"
                        render={({ field }) => (
                          <FormItem className="border-t pt-6">
                            <FormLabel>Color Scheme</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-2">
                              <div 
                                className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer border-2 ${field.value === "default" ? "border-primary" : "border-transparent"}`}
                                style={{ background: "#9C5AFF" }}
                                onClick={() => field.onChange("default")}
                              >
                                {field.value === "default" && <CheckCircle className="h-6 w-6 text-white" />}
                              </div>
                              <div 
                                className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer border-2 ${field.value === "blue" ? "border-primary" : "border-transparent"}`}
                                style={{ background: "#0284c7" }}
                                onClick={() => field.onChange("blue")}
                              >
                                {field.value === "blue" && <CheckCircle className="h-6 w-6 text-white" />}
                              </div>
                              <div 
                                className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer border-2 ${field.value === "green" ? "border-primary" : "border-transparent"}`}
                                style={{ background: "#16a34a" }}
                                onClick={() => field.onChange("green")}
                              >
                                {field.value === "green" && <CheckCircle className="h-6 w-6 text-white" />}
                              </div>
                              <div 
                                className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer border-2 ${field.value === "red" ? "border-primary" : "border-transparent"}`}
                                style={{ background: "#dc2626" }}
                                onClick={() => field.onChange("red")}
                              >
                                {field.value === "red" && <CheckCircle className="h-6 w-6 text-white" />}
                              </div>
                              <div 
                                className={`h-16 w-16 rounded-full flex items-center justify-center cursor-pointer border-2 ${field.value === "orange" ? "border-primary" : "border-transparent"}`}
                                style={{ background: "#ea580c" }}
                                onClick={() => field.onChange("orange")}
                              >
                                {field.value === "orange" && <CheckCircle className="h-6 w-6 text-white" />}
                              </div>
                            </div>
                            <FormDescription className="mt-2">
                              Choose a color scheme for the application's primary elements
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="mt-4">Save Appearance Settings</Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
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