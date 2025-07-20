import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { CalendarIcon, Clock } from "lucide-react";

const meetingSchema = z.object({
  participantId: z.string().min(1, "Please select a participant"),
  date: z.date({
    required_error: "Please select a date and time",
  }),
  time: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select a duration"),
  location: z.string().min(1, "Please select a location"),
  locationLink: z.string().optional(),
  agenda: z.string().optional()
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

interface CreateMeetingFormProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMeetingForm({ open, onClose }: CreateMeetingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch team members for participant selection
  const { data: teamMembers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  const defaultValues: Partial<MeetingFormValues> = {
    date: new Date(),
    time: "09:00",
    duration: "30",
    location: "Google Meet"
  };

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues,
  });

  const watchLocation = form.watch("location");
  
  const onSubmit = async (data: MeetingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const dateTimeStr = `${format(data.date, "yyyy-MM-dd")}T${data.time}:00`;
      
      await apiRequest('POST', '/api/one-on-ones', {
        participantId: parseInt(data.participantId),
        date: dateTimeStr,
        duration: parseInt(data.duration),
        location: data.location,
        locationLink: data.locationLink,
        agenda: data.agenda,
        status: "scheduled"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/one-on-ones'] });
      
      toast({
        title: "Success",
        description: "1:1 meeting scheduled successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule 1:1 Meeting</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="participantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Member</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamMembers?.map(member => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                          disabled={(date) => date < new Date()}
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <>
                            <SelectItem key={`${i}:00`} value={`${i.toString().padStart(2, '0')}:00`}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                            <SelectItem key={`${i}:30`} value={`${i.toString().padStart(2, '0')}:30`}>
                              {i.toString().padStart(2, '0')}:30
                            </SelectItem>
                          </>
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Google Meet">Google Meet</SelectItem>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                      <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                      <SelectItem value="In Person">In Person</SelectItem>
                      <SelectItem value="Phone Call">Phone Call</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchLocation && (watchLocation === "Google Meet" || watchLocation === "Zoom" || watchLocation === "Microsoft Teams" || watchLocation === "Other") && (
              <FormField
                control={form.control}
                name="locationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={`Enter your ${watchLocation} link`} 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      {watchLocation === "Google Meet" ? "Paste your Google Meet link here" : 
                      watchLocation === "Zoom" ? "Paste your Zoom meeting URL here" :
                      watchLocation === "Microsoft Teams" ? "Paste your Microsoft Teams meeting link here" :
                      "Paste your meeting URL here"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Meeting topics and agenda items" 
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Add agenda items to help your team member prepare for the meeting.
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
                {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}