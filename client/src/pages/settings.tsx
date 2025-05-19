import { useState } from "react";
import { 
  Bell, 
  CreditCard, 
  Eye,
  Globe, 
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
  CalendarIcon,
  CheckCircleIcon
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
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type IntegrationFormValues = z.infer<typeof integrationFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("security");

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

  // Form submission handlers
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
    // This would make an API call to delete the account
    console.log("Account deletion requested");
    
    toast({
      title: "Account deletion requested",
      description: "Your account deletion request has been submitted. You will receive an email with further instructions.",
      variant: "destructive",
    });
  };
  
  return (
    <>
      <Helmet>
        <title>Platform Settings | Proxa People Management</title>
        <meta name="description" content="Configure system settings, integrations, and platform preferences." />
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-3xl font-bold text-primary">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and platform preferences
          </p>
        </motion.div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Mobile dropdown menu */}
              <div className="md:hidden mb-6">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      {activeTab === "security" && <Lock className="h-4 w-4 mr-2" />}
                      {activeTab === "notifications" && <Bell className="h-4 w-4 mr-2" />}
                      {activeTab === "integrations" && <Globe className="h-4 w-4 mr-2" />}
                      {activeTab === "appearance" && <Palette className="h-4 w-4 mr-2" />}
                      {activeTab === "access" && <Shield className="h-4 w-4 mr-2" />}
                      {activeTab === "billing" && <CreditCard className="h-4 w-4 mr-2" />}
                      <span>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Security</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="notifications">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span>Notifications</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="integrations">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <span>Integrations</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="appearance">
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        <span>Appearance</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="access">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="billing">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Billing</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Desktop tab list */}
              <TabsList className="mb-6 hidden md:flex flex-wrap w-full bg-gray-100 p-1.5 rounded-lg">
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
              
              {/* Security Settings Tab */}
              <TabsContent value="security" className="mt-0">
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Security Settings</h2>
                    <p className="text-neutral-500 mb-6">Manage your account security and authentication methods</p>
                  </div>

                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordFormSubmit)} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
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
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character
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
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="mt-2">Update Password</Button>
                        </CardContent>
                      </Card>
                    </form>
                  </Form>
                  
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecurityFormSubmit)} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={securityForm.control}
                            name="twoFactorEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Enable Two-Factor Authentication
                                  </FormLabel>
                                  <FormDescription>
                                    Add an extra layer of security to your account
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
                          
                          {securityForm.watch("twoFactorEnabled") && (
                            <FormField
                              control={securityForm.control}
                              name="twoFactorMethod"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
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
                                          SMS
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
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Session Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={securityForm.control}
                            name="sessionTimeout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Session Timeout</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a session timeout" />
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
                                  Your session will expire after this period of inactivity
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="loginNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Login Notifications
                                  </FormLabel>
                                  <FormDescription>
                                    Receive notifications for new login attempts
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
                            control={securityForm.control}
                            name="rememberDevices"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Remember Devices
                                  </FormLabel>
                                  <FormDescription>
                                    Stay signed in on devices you trust
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
                      
                      <div className="pt-2">
                        <Button type="submit">Save Security Settings</Button>
                      </div>
                    </form>
                  </Form>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Login History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-3 rounded-md flex items-start justify-between">
                          <div>
                            <div className="font-medium mb-1">Current Session</div>
                            <div className="text-sm text-muted-foreground">
                              <div>Chrome on macOS</div>
                              <div>San Francisco, United States</div>
                              <div>IP: 192.168.1.1</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                            Active Now
                          </Badge>
                        </div>
                        
                        <div className="p-3 rounded-md flex items-start justify-between">
                          <div>
                            <div className="font-medium mb-1">Safari on iPhone</div>
                            <div className="text-sm text-muted-foreground">
                              <div>San Francisco, United States</div>
                              <div>May 15, 2025 at 2:30 PM</div>
                              <div>IP: 192.168.1.2</div>
                            </div>
                          </div>
                          <Button variant="ghost" className="h-auto p-0 text-destructive">
                            <LogOut className="h-4 w-4 mr-1" /> Sign Out
                          </Button>
                        </div>
                        
                        <div className="p-3 rounded-md flex items-start justify-between">
                          <div>
                            <div className="font-medium mb-1">Firefox on Windows</div>
                            <div className="text-sm text-muted-foreground">
                              <div>New York, United States</div>
                              <div>May 10, 2025 at 10:15 AM</div>
                              <div>IP: 192.168.1.3</div>
                            </div>
                          </div>
                          <Button variant="ghost" className="h-auto p-0 text-destructive">
                            <LogOut className="h-4 w-4 mr-1" /> Sign Out
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="mt-6">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteAccount}>Delete Account</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>
              
              {/* Notifications Settings Tab */}
              <TabsContent value="notifications" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
                  <p className="text-neutral-500 mb-6">Manage how and when you want to be notified</p>
                  
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationFormSubmit)} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Notification Channels</CardTitle>
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
                          
                          <FormField
                            control={notificationForm.control}
                            name="appNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    In-App Notifications
                                  </FormLabel>
                                  <FormDescription>
                                    Show notifications within the application
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
                            name="smsNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    SMS Notifications
                                  </FormLabel>
                                  <FormDescription>
                                    Receive important notifications via SMS
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
                          <CardTitle className="text-base">Notification Types</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={notificationForm.control}
                              name="reviewReminders"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Review Reminders
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="reviewAssignments"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Review Assignments
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="goalUpdates"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Goal Updates
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="goalDeadlines"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Goal Deadlines
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="meetingReminders"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Meeting Reminders
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="meetingChanges"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Meeting Changes
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="surveyNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Survey Notifications
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="teamUpdates"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <FormLabel className="text-sm">
                                    Team Updates
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      size="sm"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Email Digest Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="emailDigestFrequency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Digest Frequency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="immediate">Immediate</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  How often you want to receive email summaries
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationForm.control}
                            name="doNotDisturbEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Do Not Disturb
                                  </FormLabel>
                                  <FormDescription>
                                    Pause notifications during specific hours
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
                          
                          {notificationForm.watch("doNotDisturbEnabled") && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={notificationForm.control}
                                name="doNotDisturbStart"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="doNotDisturbEnd"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="doNotDisturbWeekends"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        Apply to weekends
                                      </FormLabel>
                                      <FormDescription>
                                        Enable Do Not Disturb for weekends
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <div className="pt-2">
                        <Button type="submit">Save Notification Settings</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              {/* Integrations Settings Tab */}
              <TabsContent value="integrations" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Integrations</h2>
                  <p className="text-neutral-500 mb-6">Connect with other tools and services</p>
                  
                  <Form {...integrationForm}>
                    <form onSubmit={integrationForm.handleSubmit(onIntegrationFormSubmit)} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Calendar & Meeting Apps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={integrationForm.control}
                            name="googleCalendar"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                                    <CalendarIcon className="h-5 w-5 text-neutral-500" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Google Calendar
                                    </FormLabel>
                                    <FormDescription>
                                      Sync meetings and events with Google Calendar
                                    </FormDescription>
                                  </div>
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
                            name="microsoftOutlook"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                                    <CalendarIcon className="h-5 w-5 text-neutral-500" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Microsoft Outlook
                                    </FormLabel>
                                    <FormDescription>
                                      Sync meetings and events with Outlook
                                    </FormDescription>
                                  </div>
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
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                                    <Monitor className="h-5 w-5 text-neutral-500" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Zoom
                                    </FormLabel>
                                    <FormDescription>
                                      Create and join Zoom meetings directly from Proxa
                                    </FormDescription>
                                  </div>
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
                          <CardTitle className="text-base">Communication & Collaboration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={integrationForm.control}
                            name="slackEnabled"
                            render={({ field }) => (
                              <FormItem className="space-y-4">
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                                      <Globe className="h-5 w-5 text-neutral-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Slack
                                      </FormLabel>
                                      <FormDescription>
                                        Send notifications and updates to Slack
                                      </FormDescription>
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                                
                                {field.value && (
                                  <FormField
                                    control={integrationForm.control}
                                    name="slackWorkspace"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Slack Workspace</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="your-workspace" />
                                        </FormControl>
                                        <FormDescription>
                                          Enter your Slack workspace name
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={integrationForm.control}
                            name="microsoftTeams"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                                    <Globe className="h-5 w-5 text-neutral-500" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Microsoft Teams
                                    </FormLabel>
                                    <FormDescription>
                                      Send notifications and updates to Teams
                                    </FormDescription>
                                  </div>
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
                      
                      <div className="pt-2">
                        <Button type="submit">Save Integration Settings</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              {/* Appearance Settings Tab */}
              <TabsContent value="appearance" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Appearance Settings</h2>
                  <p className="text-neutral-500 mb-6">Customize how Proxa looks and feels</p>
                  
                  <Form {...appearanceForm}>
                    <form onSubmit={appearanceForm.handleSubmit(onAppearanceFormSubmit)} className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Theme</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Color Theme</FormLabel>
                                <FormDescription>
                                  Choose the color theme for the interface
                                </FormDescription>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-3 gap-4 pt-2"
                                  >
                                    <FormItem>
                                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                          <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer">
                                          <div className="space-y-2 rounded-sm bg-[#FAFAFA] p-2">
                                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                              <div className="h-2 w-[80px] rounded-lg bg-[#EAEAEA]" />
                                              <div className="h-2 w-[100px] rounded-lg bg-[#EAEAEA]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                              <div className="h-4 w-4 rounded-full bg-[#EAEAEA]" />
                                              <div className="h-2 w-[100px] rounded-lg bg-[#EAEAEA]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                              <div className="h-4 w-4 rounded-full bg-[#EAEAEA]" />
                                              <div className="h-2 w-[100px] rounded-lg bg-[#EAEAEA]" />
                                            </div>
                                          </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                          Light
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                    
                                    <FormItem>
                                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                          <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent cursor-pointer">
                                          <div className="space-y-2 rounded-sm bg-neutral-950 p-2">
                                            <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                                              <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                                              <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                                              <div className="h-4 w-4 rounded-full bg-neutral-400" />
                                              <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                                              <div className="h-4 w-4 rounded-full bg-neutral-400" />
                                              <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                                            </div>
                                          </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                          Dark
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                    
                                    <FormItem>
                                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                          <RadioGroupItem value="system" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted bg-gradient-to-r from-white to-neutral-950 p-1 hover:border-accent cursor-pointer">
                                          <div className="space-y-2 rounded-sm bg-gradient-to-r from-[#FAFAFA] to-neutral-950 p-2">
                                            <div className="space-y-2 rounded-md bg-gradient-to-r from-white to-neutral-800 p-2 shadow-sm">
                                              <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#EAEAEA] to-neutral-400" />
                                              <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#EAEAEA] to-neutral-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-white to-neutral-800 p-2 shadow-sm">
                                              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#EAEAEA] to-neutral-400" />
                                              <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#EAEAEA] to-neutral-400" />
                                            </div>
                                          </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                          System
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Display Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={appearanceForm.control}
                            name="density"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interface Density</FormLabel>
                                <FormDescription>
                                  Control how compact the interface appears
                                </FormDescription>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select density" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="comfortable">Comfortable</SelectItem>
                                    <SelectItem value="spacious">Spacious</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="fontSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Font Size</FormLabel>
                                <FormDescription>
                                  Adjust the size of text throughout the application
                                </FormDescription>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select font size" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appearanceForm.control}
                            name="animations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Enable Animations
                                  </FormLabel>
                                  <FormDescription>
                                    Show animations throughout the interface
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
                      
                      <div className="pt-2">
                        <Button type="submit">Save Appearance Settings</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              {/* Access Settings Tab */}
              <TabsContent value="access" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Access Control</h2>
                  <p className="text-neutral-500 mb-6">Manage roles and permissions for your organization</p>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base">Role-Based Access Control</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PermissionManager />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Team Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h3 className="font-medium">Engineering Team</h3>
                            <p className="text-sm text-muted-foreground">12 members</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>Standard</Badge>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h3 className="font-medium">Product Team</h3>
                            <p className="text-sm text-muted-foreground">8 members</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>Admin</Badge>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h3 className="font-medium">Design Team</h3>
                            <p className="text-sm text-muted-foreground">5 members</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>Standard</Badge>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Marketing Team</h3>
                            <p className="text-sm text-muted-foreground">7 members</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>Standard</Badge>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Billing Settings Tab */}
              <TabsContent value="billing" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Billing & Subscription</h2>
                  <p className="text-neutral-500 mb-6">Manage your subscription and payment information</p>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base">Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">Professional Plan</h3>
                          <p className="text-sm text-muted-foreground mt-1">$49 per user / month</p>
                          <div className="flex items-center mt-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                            <span className="text-sm text-muted-foreground ml-2">Renews on May 31, 2025</span>
                          </div>
                          <ul className="mt-4 space-y-2">
                            <li className="text-sm flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" /> Unlimited projects
                            </li>
                            <li className="text-sm flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" /> Advanced analytics
                            </li>
                            <li className="text-sm flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" /> Priority support
                            </li>
                            <li className="text-sm flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" /> Custom integrations
                            </li>
                          </ul>
                        </div>
                        <Button>Change Plan</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-14 rounded-md bg-neutral-100 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-neutral-600" />
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 05/27</p>
                          </div>
                        </div>
                        <Button variant="outline">Update</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Billing History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                          <div>Date</div>
                          <div>Description</div>
                          <div>Amount</div>
                          <div>Status</div>
                          <div></div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-5 text-sm">
                          <div>May 1, 2025</div>
                          <div>Professional Plan - Monthly</div>
                          <div>$580.00</div>
                          <div><Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge></div>
                          <div className="text-right"><Button variant="ghost" size="sm">Download</Button></div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-5 text-sm">
                          <div>Apr 1, 2025</div>
                          <div>Professional Plan - Monthly</div>
                          <div>$580.00</div>
                          <div><Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge></div>
                          <div className="text-right"><Button variant="ghost" size="sm">Download</Button></div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-5 text-sm">
                          <div>Mar 1, 2025</div>
                          <div>Professional Plan - Monthly</div>
                          <div>$580.00</div>
                          <div><Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge></div>
                          <div className="text-right"><Button variant="ghost" size="sm">Download</Button></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}