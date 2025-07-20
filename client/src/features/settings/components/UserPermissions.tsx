import { useState } from "react";
import { 
  usePermissions, 
  useResources, 
  useUserPermissions, 
  useAssignPermissionToUser, 
  useRemoveUserPermission 
} from "@/hooks/useRBAC";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form schema for assigning permissions to users
const userPermissionFormSchema = z.object({
  userId: z.number({
    required_error: "Please enter a user ID",
  }),
  permissionId: z.number({
    required_error: "Please select a permission",
  }),
  granted: z.boolean().default(true),
  expiresAt: z.date().optional(),
});

export function UserPermissions() {
  const { data: permissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const { data: resources = [] } = useResources();
  const assignPermissionToUser = useAssignPermissionToUser();
  const removeUserPermission = useRemoveUserPermission();

  const [userId, setUserId] = useState<number | null>(null);
  const { data: userPermissions = [], isLoading: isLoadingUserPermissions } = useUserPermissions(userId || 0);
  
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Form for assigning permissions to users
  const form = useForm<z.infer<typeof userPermissionFormSchema>>({
    resolver: zodResolver(userPermissionFormSchema),
    defaultValues: {
      userId: userId || 0,
      permissionId: 0,
      granted: true,
      expiresAt: undefined,
    },
  });

  // Handle user ID input
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event.target.value);
    if (!isNaN(id)) {
      setUserId(id);
      form.setValue("userId", id);
    } else {
      setUserId(null);
      form.setValue("userId", 0);
    }
  };

  // Handle permission assignment
  const onSubmit = (values: z.infer<typeof userPermissionFormSchema>) => {
    assignPermissionToUser.mutate(values, {
      onSuccess: () => {
        setIsAssignDialogOpen(false);
        form.reset({
          ...form.getValues(),
          permissionId: 0,
          granted: true,
          expiresAt: undefined,
        });
      },
    });
  };

  // Handle permission removal
  const handleRemovePermission = (id: number) => {
    if (confirm("Are you sure you want to remove this permission from the user?")) {
      removeUserPermission.mutate(id);
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
            <CardTitle>User Permissions</CardTitle>
            <CardDescription>
              Manage custom permissions for individual users
            </CardDescription>
          </div>
          {userId && (
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Assign Permission</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Assign Permission to User</DialogTitle>
                  <DialogDescription>
                    Grant a specific permission to user ID: {userId}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            The permission to assign to the user
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="granted"
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
                              Granted
                            </FormLabel>
                            <FormDescription>
                              If unchecked, this will explicitly deny the permission
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiration Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>No expiration date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            If set, the permission will expire on this date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={assignPermissionToUser.isPending}>
                        {assignPermissionToUser.isPending ? "Assigning..." : "Assign Permission"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="mt-4 flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="number"
              placeholder="Enter user ID"
              value={userId || ""}
              onChange={handleUserIdChange}
            />
          </div>
          <Button 
            variant="secondary" 
            onClick={() => {
              if (userId) {
                // Refresh user permissions
                setUserId(userId);
              }
            }}
          >
            Load Permissions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!userId ? (
          <Alert>
            <AlertTitle>No user selected</AlertTitle>
            <AlertDescription>
              Enter a user ID to view and manage their custom permissions.
            </AlertDescription>
          </Alert>
        ) : isLoadingUserPermissions ? (
          <div className="py-6 text-center text-muted-foreground">Loading user permissions...</div>
        ) : (userPermissions as any[]).length === 0 ? (
          <Alert>
            <AlertTitle>No custom permissions</AlertTitle>
            <AlertDescription>
              This user doesn't have any custom permissions assigned. They still inherit permissions from their role.
            </AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(userPermissions as any[]).map((permission: any) => {
                // Find the permission details
                const permissionDetails = (permissions as any[]).find((p: any) => p.id === permission.permissionId);
                
                return (
                  <TableRow key={permission.id}>
                    <TableCell>
                      {permissionDetails ? getResourceName(permissionDetails.resourceId) : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {permissionDetails && (
                        <Badge variant="outline" className={getActionColor(permissionDetails.action)}>
                          {getActionDisplayName(permissionDetails.action)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.granted ? "outline" : "destructive"}>
                        {permission.granted ? "Granted" : "Denied"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {permission.expiresAt ? format(new Date(permission.expiresAt), "PPP") : "Never"}
                    </TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}