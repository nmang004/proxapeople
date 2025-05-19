import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Goal form schema
const goalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "completed", "behind", "at_risk"]).default("draft"),
  category: z.enum(["project", "okr", "personal", "team"]).default("project"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  targetValue: z.string().optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  assigneeId: z.number().optional(),
  teamId: z.number().optional(),
  departmentId: z.number().optional(),
  isCompanyGoal: z.boolean().default(false),
  parentGoalId: z.number().optional(),
  notes: z.string().optional(),
  progress: z.number().min(0).max(100).default(0)
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

// Key result schema for OKRs
const keyResultSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetValue: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(["draft", "active", "completed", "behind", "at_risk"]).default("draft")
});

type KeyResultValues = z.infer<typeof keyResultSchema>;

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<GoalFormValues>;
  assignees?: { id: number; name: string }[];
  teams?: { id: number; name: string }[];
  departments?: { id: number; name: string }[];
  parentGoals?: { id: number; title: string }[];
}

export function GoalForm({
  open,
  onClose,
  initialData,
  assignees = [],
  teams = [],
  departments = [],
  parentGoals = []
}: GoalFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [goalType, setGoalType] = useState(initialData?.category || "project");
  const [keyResults, setKeyResults] = useState<Partial<KeyResultValues>[]>([]);
  
  const defaultValues: Partial<GoalFormValues> = {
    title: "",
    description: "",
    status: "draft",
    category: "project",
    priority: "medium",
    targetValue: "",
    startDate: new Date(),
    dueDate: undefined,
    assigneeId: undefined,
    teamId: undefined,
    departmentId: undefined,
    isCompanyGoal: false,
    parentGoalId: undefined,
    notes: "",
    progress: 0,
    ...initialData
  };

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
  });

  const handleAddKeyResult = () => {
    setKeyResults([...keyResults, { 
      title: "", 
      description: "", 
      targetValue: "", 
      progress: 0, 
      status: "draft" 
    }]);
  };
  
  const handleUpdateKeyResult = (index: number, data: Partial<KeyResultValues>) => {
    const updatedKeyResults = [...keyResults];
    updatedKeyResults[index] = { ...updatedKeyResults[index], ...data };
    setKeyResults(updatedKeyResults);
  };
  
  const handleRemoveKeyResult = (index: number) => {
    setKeyResults(keyResults.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: GoalFormValues) => {
    setIsSubmitting(true);
    
    // Combine goal with key results for OKRs
    const goalData = {
      ...data,
      // If category is OKR, include key results
      ...(data.category === 'okr' ? { keyResults } : {})
    };
    
    try {
      await apiRequest('/api/goals', {
        method: 'POST',
        body: JSON.stringify(goalData)
      });
      
      // Invalidate goals query to refresh the list
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit' : 'Create'} Goal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details">Goal Details</TabsTrigger>
                {goalType === 'okr' && (
                  <TabsTrigger value="keyResults">Key Results</TabsTrigger>
                )}
                <TabsTrigger value="alignment">Alignment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Increase customer satisfaction score by 15%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the goal in detail..." 
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setGoalType(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="okr">Objective & Key Results (OKR)</SelectItem>
                            <SelectItem value="personal">Personal Goal</SelectItem>
                            <SelectItem value="team">Team Goal</SelectItem>
                            <SelectItem value="project">Project Goal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {goalType === 'okr' ? 
                            'OKRs include measurable key results' : 
                            `${goalType.charAt(0).toUpperCase() + goalType.slice(1)} goals track individual progress`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goalType !== 'team' && (
                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {assignees.map(assignee => (
                                <SelectItem key={assignee.id} value={assignee.id.toString()}>
                                  {assignee.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {goalType === 'team' && (
                    <FormField
                      control={form.control}
                      name="teamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams.map(team => (
                                <SelectItem key={team.id} value={team.id.toString()}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="behind">Behind</SelectItem>
                            <SelectItem value="at_risk">At Risk</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {goalType !== 'okr' && (
                  <FormField
                    control={form.control}
                    name="targetValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Value (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g., $10,000 in new revenue, 95% satisfaction, etc." 
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Specific, measurable target for this goal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
              
              {goalType === 'okr' && (
                <TabsContent value="keyResults" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Key Results</h3>
                    <p className="text-sm text-neutral-500">
                      Add measurable outcomes that will determine the success of this objective
                    </p>
                  </div>
                  
                  {keyResults.length === 0 ? (
                    <div className="border border-dashed rounded-md p-6 text-center">
                      <p className="mb-4 text-neutral-500">No key results added yet</p>
                      <Button type="button" variant="outline" onClick={handleAddKeyResult}>
                        Add Key Result
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {keyResults.map((kr, index) => (
                        <div 
                          key={index} 
                          className="border rounded-md p-4 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Key Result #{index + 1}</h4>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveKeyResult(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Title</label>
                              <Input 
                                placeholder="E.g., Increase conversion rate to 5%" 
                                value={kr.title || ''}
                                onChange={(e) => handleUpdateKeyResult(index, { title: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Description (optional)</label>
                              <Textarea 
                                placeholder="Describe this key result..."
                                value={kr.description || ''}
                                onChange={(e) => handleUpdateKeyResult(index, { description: e.target.value })}
                                className="mt-1 min-h-[80px]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Target Value (optional)</label>
                              <Input 
                                placeholder="E.g., 5%, $10,000, etc."
                                value={kr.targetValue || ''}
                                onChange={(e) => handleUpdateKeyResult(index, { targetValue: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select 
                                  onValueChange={(value: any) => handleUpdateKeyResult(index, { status: value })}
                                  value={kr.status}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="behind">Behind</SelectItem>
                                    <SelectItem value="at_risk">At Risk</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Progress</label>
                                <div className="flex items-center gap-3 mt-2">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={kr.progress}
                                    onChange={(e) => handleUpdateKeyResult(index, { progress: parseInt(e.target.value) })}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium min-w-[40px] text-right">
                                    {kr.progress}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button type="button" variant="outline" onClick={handleAddKeyResult} className="w-full">
                        Add Another Key Result
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}
              
              <TabsContent value="alignment" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Goal Alignment</h3>
                  <p className="text-sm text-neutral-500">
                    Connect this goal to company, department or team goals
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="parentGoalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Goal (optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentGoals.map(goal => (
                            <SelectItem key={goal.id} value={goal.id.toString()}>
                              {goal.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Connect this goal to a higher-level goal for alignment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
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
                  name="isCompanyGoal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Company Goal</FormLabel>
                        <FormDescription>
                          This is a top-level company goal visible to all employees
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}