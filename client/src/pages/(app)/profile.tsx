import { useState, useRef } from "react";
import { 
  Globe, 
  Upload, 
  User 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from 'react-helmet';
import { ProxaIcon } from "@/lib/proxa-icon";
import { toast } from "@/hooks/use-toast";
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
});

// User settings form schema
const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  language: z.string().min(1, "Please select a language"),
  photo: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

export default function Profile() {
  const [activeTab, setActiveTab] = useState("company");
  
  // File input ref for profile image upload
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  
  // Company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "Acme Corporation",
      industry: "technology",
      companySize: "51-200",
      description: "A leading provider of innovative solutions for businesses of all sizes.",
      website: "https://acme.com",
      timezone: "America/New_York",
      logo: "",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
    },
  });
  
  // User form
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@acme.com",
      jobTitle: "Senior Product Manager",
      department: "product",
      bio: "Experienced product manager with a passion for building innovative solutions.",
      language: "en",
      photo: "",
    },
  });
  
  const onCompanySubmit = (data: CompanyFormValues) => {
    console.log("Company form submitted:", data);
    toast({
      title: "Company settings updated",
      description: "Your company settings have been successfully updated",
    });
  };
  
  const onUserSubmit = (data: UserFormValues) => {
    console.log("User form submitted:", data);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  return (
    <>
      <Helmet>
        <title>Profile | Proxa People Management</title>
        <meta name="description" content="Manage your profile and company information" />
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and company information
          </p>
        </motion.div>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 flex flex-wrap w-full bg-gray-100 p-1.5 rounded-lg">
                <TabsTrigger value="company" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                  <Globe className="h-5 w-5" />
                  <span>Company</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2 flex-1 justify-center py-2.5">
                  <User className="h-5 w-5" />
                  <span>My Profile</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Company Settings Tab */}
              <TabsContent value="company" className="mt-0">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-medium mb-4">Company Settings</h2>
                  <p className="text-neutral-500 mb-6">Configure your organization details and preferences</p>
                  
                  <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg w-40 h-40 mb-4">
                          <ProxaIcon className="h-20 w-20 mb-2" />
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
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
                                      <SelectItem value="finance">Finance</SelectItem>
                                      <SelectItem value="healthcare">Healthcare</SelectItem>
                                      <SelectItem value="education">Education</SelectItem>
                                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                      <SelectItem value="retail">Retail</SelectItem>
                                      <SelectItem value="services">Services</SelectItem>
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
                                      <SelectItem value="51-200">51-200 employees</SelectItem>
                                      <SelectItem value="201-500">201-500 employees</SelectItem>
                                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                      <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                                      <SelectItem value="5000+">5000+ employees</SelectItem>
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
                                <FormLabel>Website</FormLabel>
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
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-40 h-40 mb-4 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=160&h=160" alt="Profile" className="w-full h-full object-cover" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
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
                                  <Input type="email" {...field} />
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
                                      <SelectItem value="engineering">Engineering</SelectItem>
                                      <SelectItem value="product">Product</SelectItem>
                                      <SelectItem value="design">Design</SelectItem>
                                      <SelectItem value="marketing">Marketing</SelectItem>
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="support">Support</SelectItem>
                                      <SelectItem value="hr">Human Resources</SelectItem>
                                      <SelectItem value="operations">Operations</SelectItem>
                                      <SelectItem value="finance">Finance</SelectItem>
                                      <SelectItem value="legal">Legal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={userForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio / About</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Tell us about yourself" rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <FormField
                        control={userForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-52">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="pt">Portuguese</SelectItem>
                                <SelectItem value="ja">Japanese</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button type="submit">Save Profile</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}