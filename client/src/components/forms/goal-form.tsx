import { useState } from "react";
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
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const goalFormSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  category: z.enum(["personal", "team", "company"]),
  ownerId: z.string().min(1, "Please select an owner"),
  dueDate: z.string().optional(),
  targetValue: z.string().optional(),
  currentValue: z.string().optional(),
  progress: z.number().min(0).max(100),
  status: z.enum(["not_started", "in_progress", "on_track", "at_risk", "completed", "canceled"]),
  parentGoalId: z.string().optional(),
  keyResults: z.array(z.object({
    title: z.string().min(3, "Key result title must be at least 3 characters"),
    targetValue: z.string().optional(),
    currentValue: z.string().optional(),
    progress: z.number().min(0).max(100)
  })).optional()
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<GoalFormValues>;
  users: { id: string; name: string }[];
  teams: { id: string; name: string }[];
  parentGoals?: { id: string; title: string }[];
}

export function GoalForm({
  open,
  onClose,
  initialData,
  users,
  teams,
  parentGoals = []
}: GoalFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<GoalFormValues> = {
    title: "",
    description: "",
    category: "personal",
    ownerId: "",
    dueDate: "",
    targetValue: "",
    currentValue: "",
    progress: 0,
    status: "not_started",
    parentGoalId: "",
    keyResults: [],
    ...initialData
  };

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: GoalFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/goals', data);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyResult = () => {
    const currentKeyResults = form.getValues().keyResults || [];
    form.setValue('keyResults', [
      ...currentKeyResults, 
      { title: "", targetValue: "", currentValue: "", progress: 0 }
    ]);
  };

  const handleRemoveKeyResult = (index: number) => {
    const currentKeyResults = form.getValues().keyResults || [];
    form.setValue('keyResults', currentKeyResults.filter((_, i) => i !== index));
  };

  const categoryOptions = [
    { value: "personal", label: "Personal Goal" },
    { value: "team", label: "Team Goal" },
    { value: "company", label: "Company Goal" }
  ];

  const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_track", label: "On Track" },
    { value: "at_risk", label: "At Risk" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData?.title ? 'Edit' : 'Create'} Goal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Increase customer satisfaction score to 9.2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="current-user">Me (Current User)</SelectItem>
                        {form.watch('category') === 'team' && (
                          <>
                            {teams.map(team => (
                              <SelectItem key={`team-${team.id}`} value={`team-${team.id}`}>
                                {team.name} Team
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the goal in detail including why it matters" 
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {parentGoals.length > 0 && (
              <FormField
                control={form.control}
                name="parentGoalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Goal (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to a parent goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {parentGoals.map(goal => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Linking to a parent goal helps show goal alignment and hierarchy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 9.2" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 8.7" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
                        step={5}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Key Results (Optional)</h3>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAddKeyResult}
                >
                  Add Key Result
                </Button>
              </div>
              
              {form.watch('keyResults')?.map((_, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Key Result #{index + 1}</h4>
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveKeyResult(index)}
                    >
                      <i className="ri-delete-bin-line text-destructive"></i>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`keyResults.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Implement customer feedback system" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`keyResults.${index}.targetValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Value</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 100%" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`keyResults.${index}.currentValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Value</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 75%" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`keyResults.${index}.progress`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Progress: {field.value}%</FormLabel>
                          <FormControl>
                            <Slider
                              defaultValue={[field.value]}
                              max={100}
                              step={5}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData?.title ? 'Update' : 'Create'} Goal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}