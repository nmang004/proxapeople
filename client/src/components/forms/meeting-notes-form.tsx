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
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const meetingNotesSchema = z.object({
  summary: z.string().min(1, "Please provide a meeting summary"),
  discussionPoints: z.string().optional(),
  decisions: z.string().optional(),
  nextSteps: z.array(z.object({
    description: z.string().min(1, "Action item description is required"),
    assignee: z.string().min(1, "Please select an assignee"),
    dueDate: z.string().optional(),
    status: z.enum(["not_started", "in_progress", "completed"]).default("not_started")
  })).min(1, "At least one next step is required"),
  privateNotes: z.string().optional()
});

type MeetingNotesFormValues = z.infer<typeof meetingNotesSchema>;

interface MeetingNotesFormProps {
  open: boolean;
  onClose: () => void;
  meetingId: number;
  initialData?: Partial<MeetingNotesFormValues>;
  teamMembers: { id: string; name: string }[];
}

export function MeetingNotesForm({
  open,
  onClose,
  meetingId,
  initialData,
  teamMembers
}: MeetingNotesFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<MeetingNotesFormValues> = {
    summary: "",
    discussionPoints: "",
    decisions: "",
    nextSteps: [
      { 
        description: "", 
        assignee: "", 
        dueDate: "", 
        status: "not_started" 
      }
    ],
    privateNotes: "",
    ...initialData
  };

  const form = useForm<MeetingNotesFormValues>({
    resolver: zodResolver(meetingNotesSchema),
    defaultValues,
  });

  const { fields, append, remove } = form.control._formValues.nextSteps || [];

  const onSubmit = async (data: MeetingNotesFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', `/api/one-on-ones/${meetingId}/notes`, data);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/one-on-ones'] });
      
      toast({
        title: "Success",
        description: "Meeting notes saved successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save meeting notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addActionItem = () => {
    const nextSteps = form.getValues().nextSteps || [];
    append({ 
      description: "", 
      assignee: "", 
      dueDate: "", 
      status: "not_started" 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meeting Notes & Action Items</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief overview of the meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="discussionPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discussion Points</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Key topics discussed during the meeting" 
                        className="min-h-[100px]"
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
                name="decisions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decisions Made</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any decisions or conclusions reached" 
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
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Action Items</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addActionItem}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {form.getValues().nextSteps?.map((item, index) => (
                  <Card key={index} className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => {
                        const nextSteps = form.getValues().nextSteps || [];
                        if (nextSteps.length > 1) {
                          remove(index);
                        }
                      }}
                      disabled={form.getValues().nextSteps?.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name={`nextSteps.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="What needs to be done" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`nextSteps.${index}.assignee`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assignee</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select person" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {teamMembers.map(member => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name}
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
                            name={`nextSteps.${index}.dueDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`nextSteps.${index}.status`}
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
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="privateNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any private notes (only visible to you)" 
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes will not be shared with the team member.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Notes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}