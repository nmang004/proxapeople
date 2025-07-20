import { useState } from "react";
import { 
  useResources, 
  useCreateResource, 
  useResourcePermissions, 
  useCreatePermission,
  type Resource,
  type Permission
} from "@/hooks/useRBAC";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form schema for creating a resource
const resourceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  description: z.string().optional(),
});

// Form schema for creating a permission
const permissionFormSchema = z.object({
  resourceId: z.number().min(1, "Resource is required"),
  action: z.enum(["view", "create", "update", "delete", "approve", "assign", "admin"]),
  description: z.string().min(2, "Description must be at least 2 characters"),
});

export function ResourceManager() {
  const { data: resources = [], isLoading: isLoadingResources } = useResources();
  const createResource = useCreateResource();
  const createPermission = useCreatePermission();

  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const { data: resourcePermissions = [] } = useResourcePermissions(selectedResourceId || 0);

  const [isNewResourceDialogOpen, setIsNewResourceDialogOpen] = useState(false);
  const [isNewPermissionDialogOpen, setIsNewPermissionDialogOpen] = useState(false);

  // Form for creating a new resource
  const resourceForm = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
    },
  });

  // Form for creating a new permission
  const permissionForm = useForm<z.infer<typeof permissionFormSchema>>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      resourceId: selectedResourceId || 0,
      action: "view",
      description: "",
    },
  });

  // Handle resource selection
  const handleResourceSelect = (resourceId: number) => {
    setSelectedResourceId(resourceId);
    permissionForm.setValue("resourceId", resourceId);
  };

  // Handle resource creation
  const onSubmitResource = (values: z.infer<typeof resourceFormSchema>) => {
    createResource.mutate(values, {
      onSuccess: () => {
        setIsNewResourceDialogOpen(false);
        resourceForm.reset();
      },
    });
  };

  // Handle permission creation
  const onSubmitPermission = (values: z.infer<typeof permissionFormSchema>) => {
    createPermission.mutate(values, {
      onSuccess: () => {
        setIsNewPermissionDialogOpen(false);
        permissionForm.reset();
      },
    });
  };

  // Get the display name for an action
  const getActionDisplayName = (action: string) => {
    const actionMap: { [key: string]: string } = {
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
    const colorMap: { [key: string]: string } = {
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Resources Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Configure resource definitions for the application
            </CardDescription>
          </div>
          <Dialog open={isNewResourceDialogOpen} onOpenChange={setIsNewResourceDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Add Resource</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Define a new resource that can be protected by permissions
                </DialogDescription>
              </DialogHeader>
              <Form {...resourceForm}>
                <form onSubmit={resourceForm.handleSubmit(onSubmitResource)} className="space-y-4">
                  <FormField
                    control={resourceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource Name</FormLabel>
                        <FormControl>
                          <Input placeholder="users" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique identifier for the resource (e.g., "users", "teams")
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resourceForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Users" {...field} />
                        </FormControl>
                        <FormDescription>
                          Human-readable name for the resource
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resourceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="User accounts in the system" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={createResource.isPending}>
                      {createResource.isPending ? "Creating..." : "Create Resource"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingResources ? (
            <div className="py-6 text-center text-muted-foreground">Loading resources...</div>
          ) : (resources as any[]).length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No resources defined yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(resources as any[]).map((resource: Resource) => (
                  <TableRow 
                    key={resource.id}
                    className={selectedResourceId === resource.id ? "bg-muted/50" : ""}
                  >
                    <TableCell className="font-medium">{resource.displayName}</TableCell>
                    <TableCell className="text-muted-foreground">{resource.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResourceSelect(resource.id)}
                      >
                        View Permissions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Permissions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              {selectedResourceId 
                ? `Permissions for selected resource`
                : "Select a resource to view permissions"}
            </CardDescription>
          </div>
          {selectedResourceId && (
            <Dialog open={isNewPermissionDialogOpen} onOpenChange={setIsNewPermissionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Add Permission</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Permission</DialogTitle>
                  <DialogDescription>
                    Define a new permission for the selected resource
                  </DialogDescription>
                </DialogHeader>
                <Form {...permissionForm}>
                  <form onSubmit={permissionForm.handleSubmit(onSubmitPermission)} className="space-y-4">
                    <FormField
                      control={permissionForm.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an action" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="view">View</SelectItem>
                              <SelectItem value="create">Create</SelectItem>
                              <SelectItem value="update">Update</SelectItem>
                              <SelectItem value="delete">Delete</SelectItem>
                              <SelectItem value="approve">Approve</SelectItem>
                              <SelectItem value="assign">Assign</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The action this permission grants
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={permissionForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Allow viewing user details" {...field} />
                          </FormControl>
                          <FormDescription>
                            Describe what this permission allows
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createPermission.isPending}>
                        {createPermission.isPending ? "Creating..." : "Create Permission"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {!selectedResourceId ? (
            <div className="py-6 text-center text-muted-foreground">
              Select a resource from the left to view its permissions
            </div>
          ) : (resourcePermissions as any[]).length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">No permissions defined for this resource</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(resourcePermissions as any[]).map((permission: Permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(permission.action)}>
                        {getActionDisplayName(permission.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>{permission.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}