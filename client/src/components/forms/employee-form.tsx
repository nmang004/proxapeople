import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { insertUserSchema, insertDepartmentSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "manager", "employee"]),
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  managerId: z.number().nullable(),
  profileImage: z.string().nullable(),
  hireDate: z.string().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  managerId: z.number().nullable(),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<UserFormValues>;
  departments: string[];
  managers: { id: number; name: string }[];
}

export function EmployeeForm({ 
  open, 
  onClose, 
  initialData,
  departments,
  managers
}: EmployeeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewDepartmentForm, setShowNewDepartmentForm] = useState(false);
  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const [departmentsList, setDepartmentsList] = useState<string[]>(departments);
  
  // Create a separate form for new department
  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      managerId: null
    }
  });
  
  const defaultValues: Partial<UserFormValues> = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "employee",
    jobTitle: "",
    department: "",
    managerId: null,
    profileImage: null,
    hireDate: null,
    ...initialData
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const createDepartment = async (data: DepartmentFormValues) => {
    setIsCreatingDepartment(true);
    
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create department');
      }
      
      const newDepartment = await response.json();
      
      // Update departments list
      setDepartmentsList(prev => [...prev, newDepartment.name]);
      
      // Set the new department in the employee form
      form.setValue('department', newDepartment.name);
      
      toast({
        title: "Success",
        description: `Department "${newDepartment.name}" created successfully`,
      });
      
      setShowNewDepartmentForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDepartment(false);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const userData = {
        ...data,
        // Remove confirmPassword as it's not part of the API schema
        confirmPassword: undefined
      };
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit' : 'Add'} Employee</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <div className="space-y-2">
                      <Select 
                        onValueChange={(value) => {
                          if (value === "new_department") {
                            setShowNewDepartmentForm(true);
                          } else {
                            field.onChange(value);
                          }
                        }}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Existing Departments</SelectLabel>
                            {departmentsList.map(dept => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectItem value="new_department" className="text-primary font-medium">
                            + Create New Department
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* New Department Form Dialog */}
                      <Dialog open={showNewDepartmentForm} onOpenChange={setShowNewDepartmentForm}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Create New Department</DialogTitle>
                            <DialogDescription>
                              Add a new department to your organization.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Form {...departmentForm}>
                            <form onSubmit={departmentForm.handleSubmit(createDepartment)} className="space-y-4">
                              <FormField
                                control={departmentForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Department Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Engineering, Marketing, HR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={departmentForm.control}
                                name="managerId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Department Manager</FormLabel>
                                    <Select 
                                      onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select manager" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">No Manager</SelectItem>
                                        {managers.map(mgr => (
                                          <SelectItem key={mgr.id} value={mgr.id.toString()}>
                                            {mgr.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  type="button" 
                                  onClick={() => setShowNewDepartmentForm(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={isCreatingDepartment}>
                                  {isCreatingDepartment ? 'Creating...' : 'Create Department'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        if (value === "none") {
                          field.onChange(null);
                        } else {
                          field.onChange(parseInt(value));
                        }
                      }}
                      defaultValue={field.value !== null ? field.value?.toString() : "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Manager</SelectItem>
                        {managers.map(mgr => (
                          <SelectItem key={mgr.id} value={mgr.id.toString()}>
                            {mgr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Add'} Employee
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}