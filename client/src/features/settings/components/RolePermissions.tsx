import { useState } from "react";
import { 
  usePermissions, 
  useResources, 
  useRolePermissions, 
  useAssignPermissionToRole, 
  useRemoveRolePermission 
} from "@/hooks/useRBAC";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form schema for assigning permissions to roles
const rolePermissionFormSchema = z.object({
  role: z.enum(["admin", "manager", "employee", "hr"], {
    required_error: "Please select a role",
  }),
  permissionId: z.number({
    required_error: "Please select a permission",
  }),
});

export function RolePermissions() {
  const { data: permissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const { data: resources = [] } = useResources();
  const assignPermissionToRole = useAssignPermissionToRole();
  const removeRolePermission = useRemoveRolePermission();

  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const { data: rolePermissions = [], isLoading: isLoadingRolePermissions } = useRolePermissions(selectedRole);
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Form for assigning permissions to roles
  const form = useForm<z.infer<typeof rolePermissionFormSchema>>({
    resolver: zodResolver(rolePermissionFormSchema),
    defaultValues: {
      role: selectedRole as "admin" | "manager" | "employee" | "hr",
      permissionId: 0,
    },
  });

  // Update form value when role changes
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    form.setValue("role", role as "admin" | "manager" | "employee" | "hr");
  };

  // Handle permission assignment
  const onSubmit = (values: z.infer<typeof rolePermissionFormSchema>) => {
    assignPermissionToRole.mutate(values, {
      onSuccess: () => {
        setIsAssignDialogOpen(false);
        form.reset();
      },
    });
  };

  // Handle permission removal
  const handleRemovePermission = (id: number) => {
    if (confirm("Are you sure you want to remove this permission from the role?")) {
      removeRolePermission.mutate(id);
    }
  };

  // Get resource name by ID
  const getResourceName = (resourceId: number) => {
    if ((resources as any[]).length === 0) return "Unknown";
    const resource = (resources as any[]).find((r: any) => r.id === resourceId);
    return resource ? resource.displayName : "Unknown";
  };

  // Get action display name
  const getActionDisplayName = (action: string) => {
    const actionMap: Record<string, string> = {
      view: "View",
      create: "Create",
      update: "Update",
      delete: "Delete",
      approve: "Approve",
      assign: "Assign",
      admin: "Admin",
    };
    return actionMap[action] || action;
  };

  // Get the color for an action badge
  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      update: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      approve: "bg-purple-100 text-purple-800",
      assign: "bg-pink-100 text-pink-800",
      admin: "bg-gray-100 text-gray-800",
    };
    return colorMap[action] || "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Configure which roles have access to which permissions
            </CardDescription>
          </div>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Assign Permission</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assign Permission to Role</DialogTitle>
                <DialogDescription>
                  Grant a specific permission to a role
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The role to assign the permission to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permissionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permission</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a permission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(permissions as any[]).map((permission: any) => {
                              const resource = (resources as any[]).find((r: any) => r.id === permission.resourceId);
                              return (
                                <SelectItem 
                                  key={permission.id} 
                                  value={permission.id.toString()}
                                >
                                  {resource ? resource.displayName : "Unknown"} - {getActionDisplayName(permission.action)}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The permission to assign to the role
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={assignPermissionToRole.isPending}>
                      {assignPermissionToRole.isPending ? "Assigning..." : "Assign Permission"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mt-4">
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingRolePermissions ? (
          <div className="py-6 text-center text-muted-foreground">Loading role permissions...</div>
        ) : (rolePermissions as any[]).length === 0 ? (
          <Alert>
            <AlertTitle>No permissions assigned</AlertTitle>
            <AlertDescription>
              This role doesn't have any permissions assigned yet. Use the "Assign Permission" button to add permissions.
            </AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rolePermissions as any[]).map((permission: any) => (
                <TableRow key={permission.id}>
                  <TableCell>{getResourceName(permission.resourceId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getActionColor(permission.action)}>
                      {getActionDisplayName(permission.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{permission.description}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemovePermission(permission.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}