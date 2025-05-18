import { useState } from "react";
import { MeetingNotesForm } from "@/components/forms/meeting-notes-form";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, addDays } from "date-fns";
import { OneOnOneMeeting, User } from "@/lib/types";
import { Helmet } from 'react-helmet';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const meetingSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select a duration"),
  location: z.string().min(1, "Please select a location"),
  agenda: z.string().optional(),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

export default function OneOnOne() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isNotesFormOpen, setIsNotesFormOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  
  const { data: meetings, isLoading, error } = useQuery<OneOnOneMeeting[]>({
    queryKey: ['/api/one-on-ones'],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      employeeId: "",
      date: undefined,
      time: "",
      duration: "30",
      location: "Google Meet",
      agenda: "",
    },
  });

  function onSubmit(data: MeetingFormValues) {
    // This would be connected to the API in a real implementation
    console.log(data);
    setIsScheduling(false);
    form.reset();
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const formatDuration = (minutes: number) => {
    return minutes < 60 
      ? `${minutes} minutes` 
      : `${minutes / 60} hour${minutes > 60 ? 's' : ''}`;
  };

  const timeOptions = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const durationOptions = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  const locationOptions = [
    "Google Meet", "Zoom", "Microsoft Teams", "In Person", "Phone Call"
  ];

  return (
    <>
      <Helmet>
        <title>1:1 Meetings | Proxa People Management</title>
        <meta name="description" content="Schedule and manage 1:1 meetings with your team members to provide feedback, set goals, and track progress." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">1:1 Meetings</h1>
        <p className="text-neutral-500 mt-1">Schedule and manage regular check-ins with your team</p>
      </div>
      
      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">5</div>
              <div className="text-sm text-neutral-500">
                <div>This week</div>
                <div className="flex items-center text-success">
                  <i className="ri-calendar-check-line mr-1"></i>
                  <span>All scheduled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">92%</div>
              <div className="text-sm text-neutral-500">
                <div>Last 30 days</div>
                <div className="flex items-center text-success">
                  <i className="ri-arrow-up-line mr-1"></i>
                  <span>+5% from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">14</div>
              <div className="text-sm text-neutral-500">
                <div>Pending completion</div>
                <div className="flex items-center text-warning">
                  <i className="ri-time-line mr-1"></i>
                  <span>3 due this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>1:1 Management</CardTitle>
            <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
              <DialogTrigger asChild>
                <Button>
                  <i className="ri-calendar-line mr-1"></i>
                  Schedule New Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Schedule a 1:1 Meeting</DialogTitle>
                  <DialogDescription>
                    Set up a one-on-one meeting with a team member. Add agenda items to make the most of your time together.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Member</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a team member" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users?.map(user => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.firstName} {user.lastName}
                                </SelectItem>
                              )) || (
                                <SelectItem value="1">Michael Chen</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                                    "w-full pl-3 text-left font-normal",
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
                                disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {durationOptions.map(option => (
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
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {locationOptions.map(location => (
                                  <SelectItem key={location} value={location}>{location}</SelectItem>
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
                      name="agenda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agenda (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add topics or discussion points..." 
                              className="h-24 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be shared with the team member before the meeting.
                          </FormDescription>
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
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Meetings</TabsTrigger>
              <TabsTrigger value="action">Action Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {isLoading ? (
                <div className="py-8 text-center">Loading meetings...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">Error loading meeting data</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Agenda Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample meeting data for UI demonstration */}
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="Michael Chen" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Michael Chen</div>
                            <div className="text-sm text-neutral-500">Product Designer</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Tomorrow, 10:00 AM</TableCell>
                      <TableCell>30 minutes</TableCell>
                      <TableCell>Google Meet</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary text-primary">
                          3 Items
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="Sarah Wilson" />
                            <AvatarFallback>SW</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Sarah Wilson</div>
                            <div className="text-sm text-neutral-500">Engineering Lead</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Thursday, 2:00 PM</TableCell>
                      <TableCell>45 minutes</TableCell>
                      <TableCell>Zoom</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary text-primary">
                          5 Items
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="James Rodriguez" />
                            <AvatarFallback>JR</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">James Rodriguez</div>
                            <div className="text-sm text-neutral-500">Marketing Specialist</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Friday, 11:30 AM</TableCell>
                      <TableCell>30 minutes</TableCell>
                      <TableCell>Google Meet</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary text-primary">
                          2 Items
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing past meetings
              </div>
            </TabsContent>
            
            <TabsContent value="action" className="mt-0">
              <div className="py-8 text-center text-neutral-500">
                Showing action items from meetings
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
