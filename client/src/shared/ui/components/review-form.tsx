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
  FormMessage
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { reviewStatusEnum } from "@shared/schema";

const reviewFormSchema = z.object({
  employeeId: z.number(),
  reviewerId: z.number(),
  reviewCycleId: z.number(),
  dueDate: z.string(),
  completedDate: z.string().nullable(),
  status: z.enum(["not_started", "self_review", "peer_review", "manager_review", "completed"]),
  type: z.enum(["quarterly", "annual", "peer", "self"]),
  overallScore: z.number().min(1).max(5).nullable(),
  feedback: z.string().nullable(),
  strengths: z.string().nullable(),
  growthAreas: z.string().nullable(),
  goals: z.string().nullable(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<ReviewFormValues>;
  employees: { id: number; name: string }[];
  reviewers: { id: number; name: string }[];
  reviewCycles: { id: number; name: string }[];
}

export function ReviewForm({
  open,
  onClose,
  initialData,
  employees,
  reviewers,
  reviewCycles
}: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<ReviewFormValues> = {
    employeeId: 0,
    reviewerId: 0,
    reviewCycleId: 0,
    dueDate: new Date().toISOString().substring(0, 10),
    completedDate: null,
    status: "not_started",
    type: "quarterly",
    overallScore: null,
    feedback: "",
    strengths: "",
    growthAreas: "",
    goals: "",
    ...initialData
  };

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/reviews', data);
      
      // Invalidate reviews query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      
      toast({
        title: "Success",
        description: "Performance review added successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add performance review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData && 'id' in initialData ? 'Edit' : 'Create'} Performance Review</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Employee</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviewer</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reviewers.map(reviewer => (
                          <SelectItem key={reviewer.id} value={reviewer.id.toString()}>
                            {reviewer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reviewCycleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Cycle</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select review cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reviewCycles.map(cycle => (
                          <SelectItem key={cycle.id} value={cycle.id.toString()}>
                            {cycle.name}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select review type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="peer">Peer</SelectItem>
                        <SelectItem value="self">Self</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
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
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="self_review">Self Review</SelectItem>
                        <SelectItem value="peer_review">Peer Review</SelectItem>
                        <SelectItem value="manager_review">Manager Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Overall feedback" 
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strengths</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Key strengths" 
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="growthAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Areas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Areas for improvement" 
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals & Action Items</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Specific goals and action items" 
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="overallScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Score (1-5)</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Not Rated</SelectItem>
                          <SelectItem value="1">1 - Needs Significant Improvement</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Meeting Expectations</SelectItem>
                          <SelectItem value="4">4 - Exceeding Expectations</SelectItem>
                          <SelectItem value="5">5 - Outstanding Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData && 'id' in initialData ? 'Update' : 'Create'} Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}