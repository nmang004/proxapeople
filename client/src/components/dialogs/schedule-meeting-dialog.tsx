import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DatePicker } from "@/components/ui/date-picker";

const meetingFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  participantId: z.string().min(1, "Please select a participant"),
  date: z.date({
    required_error: "Meeting date is required",
  }),
  duration: z.string().min(1, "Please select a duration"),
  agenda: z.string().optional(),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

export function ScheduleMeetingDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      agenda: "",
      duration: "30",
    },
  });

  function onSubmit(data: MeetingFormValues) {
    // Format the data for the API
    const meetingData = {
      ...data,
      date: data.date.toISOString(),
      status: "scheduled",
      hostId: 1 // Current user ID
    };

    // Submit to API
    apiRequest("/api/one-on-ones", {
      method: "POST",
      body: JSON.stringify(meetingData),
    })
      .then(() => {
        toast({
          title: "1:1 meeting scheduled",
          description: "Your one-on-one meeting has been scheduled successfully",
        });
        setOpen(false);
        form.reset();
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to schedule meeting. Please try again.",
          variant: "destructive",
        });
        console.error("Error scheduling meeting:", error);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimatedButton
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <i className="ri-calendar-line"></i>
          <span>Schedule 1:1</span>
        </AnimatedButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule 1:1 Meeting</DialogTitle>
          <DialogDescription>
            Set up a one-on-one meeting with a team member
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Check-in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="participantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Michael Chen</SelectItem>
                      <SelectItem value="3">David Miller</SelectItem>
                      <SelectItem value="4">Emily Wilson</SelectItem>
                      <SelectItem value="5">James Taylor</SelectItem>
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
                    <FormLabel>Meeting Date & Time</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                      className="w-full"
                      showTimePicker={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Discuss current projects, blockers, and goals"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Schedule Meeting</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}