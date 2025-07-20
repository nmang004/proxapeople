import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MeetingNotesForm } from "@/components/forms/meeting-notes-form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { User } from "@shared/schema";
import type { OneOnOneMeeting } from "@/shared/types/types";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface MeetingDetailViewProps {
  meetingId: number;
  onClose: () => void;
}

export function MeetingDetailView({ meetingId, onClose }: MeetingDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const { toast } = useToast();

  // Fetch meeting details
  const { data: meeting, isLoading, isError } = useQuery<OneOnOneMeeting>({
    queryKey: [`/api/one-on-ones/${meetingId}`],
  });

  // Fetch team members for assignees
  const { data: teamMembers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Helper function to format dates
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  // Calculate time until meeting
  const getTimeUntilMeeting = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((meetingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return "Past meeting";
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays < 7) return `In ${diffInDays} days`;
    if (diffInDays < 31) return `In ${Math.floor(diffInDays / 7)} weeks`;
    return `In ${Math.floor(diffInDays / 30)} months`;
  };

  // Handle status changes for action items
  const handleStatusChange = async (actionItemId: number, newStatus: string) => {
    try {
      await apiRequest('PATCH', `/api/one-on-ones/${meetingId}/action-items/${actionItemId}`, {
        status: newStatus
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/one-on-ones/${meetingId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/one-on-ones'] });
      
      toast({
        title: "Status updated",
        description: "Action item status has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle meeting cancellation
  const handleCancelMeeting = async () => {
    try {
      await apiRequest('PATCH', `/api/one-on-ones/${meetingId}`, {
        status: "cancelled"
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/one-on-ones'] });
      
      toast({
        title: "Meeting cancelled",
        description: "The 1:1 meeting has been cancelled successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check meeting status for appropriate actions
  const isFutureMeeting = meeting?.status === "scheduled" && new Date(meeting.date) > new Date();
  const isPastMeeting = meeting?.status === "completed" || new Date(meeting?.date || "") < new Date();
  
  // Get meeting location icon
  const getLocationIcon = (location: string) => {
    switch (location?.toLowerCase()) {
      case "google meet":
        return "ri-google-line";
      case "zoom":
        return "ri-video-chat-line";
      case "microsoft teams":
        return "ri-microsoft-line";
      case "in person":
        return "ri-map-pin-line";
      case "phone call":
        return "ri-phone-line";
      default:
        return "ri-calendar-line";
    }
  };

  // Calculate action items progress
  const calculateProgress = () => {
    if (!meeting?.actionItems || meeting.actionItems.length === 0) return 0;
    
    const completed = meeting.actionItems.filter(item => item.status === "completed").length;
    return Math.round((completed / meeting.actionItems.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <i className="ri-error-warning-line text-4xl text-destructive mb-2"></i>
        <p className="text-lg font-medium">Failed to load meeting details</p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Go Back
        </Button>
      </div>
    );
  }

  // Format attendee name from the participant info
  const getAttendeeName = (userId: number) => {
    const user = teamMembers?.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  return (
    <div className="space-y-6">
      {/* Meeting header with participant info */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <Avatar className="w-16 h-16 border-4 border-primary/10">
          <AvatarImage 
            src={teamMembers?.find(u => u.id === meeting.participantId)?.profileImage || ""} 
            alt={getAttendeeName(meeting.participantId)} 
          />
          <AvatarFallback className="text-lg">
            {getAttendeeName(meeting.participantId).split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            1:1 with {getAttendeeName(meeting.participantId)}
            <Badge className={cn(
              meeting.status === "scheduled" ? "bg-blue-100 text-blue-800 border-blue-200" :
              meeting.status === "completed" ? "bg-green-100 text-green-800 border-green-200" :
              meeting.status === "cancelled" ? "bg-red-100 text-red-800 border-red-200" :
              "bg-slate-100 text-slate-800 border-slate-200"
            )}>
              {meeting.status === "scheduled" ? "Upcoming" : 
               meeting.status === "completed" ? "Completed" :
               meeting.status === "cancelled" ? "Cancelled" : meeting.status}
            </Badge>
          </h2>
          <p className="text-muted-foreground">{formatDateTime(meeting.date)}</p>
          
          {/* Countdown or past meeting indicator */}
          <p className={cn(
            "text-sm mt-1",
            isFutureMeeting ? "text-blue-600" : isPastMeeting ? "text-slate-500" : ""
          )}>
            <i className={cn(
              "mr-1",
              isFutureMeeting ? "ri-time-line" : isPastMeeting ? "ri-check-line" : "ri-information-line"
            )}></i>
            {getTimeUntilMeeting(meeting.date)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          {isFutureMeeting && (
            <>
              <Button variant="outline" size="sm" className="gap-1">
                <i className="ri-calendar-2-line"></i>
                <span>Reschedule</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 border-red-200 text-red-600 hover:bg-red-50">
                    <i className="ri-close-circle-line"></i>
                    <span>Cancel</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel 1:1 Meeting</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this 1:1 meeting with {getAttendeeName(meeting.participantId)}? 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Meeting</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancelMeeting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Meeting
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          {meeting.status === "scheduled" && new Date(meeting.date) <= new Date() && (
            <Button size="sm" className="gap-1">
              <i className="ri-check-line"></i>
              <span>Mark as Completed</span>
            </Button>
          )}
          
          {meeting.status === "completed" && !meeting.notes && (
            <Button 
              size="sm" 
              className="gap-1"
              onClick={() => setIsEditingNotes(true)}
            >
              <i className="ri-file-text-line"></i>
              <span>Add Notes</span>
            </Button>
          )}
          
          {meeting.notes && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsEditingNotes(true)}
            >
              <i className="ri-edit-line"></i>
              <span>Edit Notes</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Meeting details tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
          <TabsTrigger 
            value="details" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4"
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4"
          >
            Notes & Discussion
          </TabsTrigger>
          <TabsTrigger 
            value="action-items" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4"
          >
            Action Items
            {meeting.actionItems && meeting.actionItems.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {meeting.actionItems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedCard>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-4">Meeting Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <i className="ri-calendar-line text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(meeting.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <i className="ri-time-line text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{meeting.duration} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <i className={`${getLocationIcon(meeting.location || "")} text-primary`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{meeting.location}</p>
                      {meeting.locationLink && (
                        <a 
                          href={meeting.locationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          Join meeting
                          <i className="ri-external-link-line text-xs"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-4">Agenda</h3>
                
                {meeting.agenda ? (
                  <div className="whitespace-pre-wrap text-sm">{meeting.agenda}</div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No agenda items added</div>
                )}
                
                {isFutureMeeting && (
                  <Button variant="outline" size="sm" className="mt-4 gap-1">
                    <i className="ri-edit-line"></i>
                    <span>Edit Agenda</span>
                  </Button>
                )}
              </CardContent>
            </AnimatedCard>
          </div>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes" className="pt-4">
          {meeting.notes ? (
            <AnimatedCard>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Meeting Summary</h3>
                  <p className="mt-2">{meeting.notes.summary}</p>
                </div>
                
                {meeting.notes.discussionPoints && (
                  <div>
                    <h3 className="text-sm font-medium">Discussion Points</h3>
                    <div className="mt-2 whitespace-pre-wrap text-sm">
                      {meeting.notes.discussionPoints}
                    </div>
                  </div>
                )}
                
                {meeting.notes.decisions && (
                  <div>
                    <h3 className="text-sm font-medium">Decisions Made</h3>
                    <div className="mt-2 whitespace-pre-wrap text-sm">
                      {meeting.notes.decisions}
                    </div>
                  </div>
                )}
                
                {meeting.notes.privateNotes && (
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <i className="ri-lock-line"></i>
                      <span>Private Notes</span>
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px]">
                        Only visible to you
                      </Badge>
                    </h3>
                    <div className="mt-2 whitespace-pre-wrap text-sm bg-yellow-50 p-3 rounded-md border border-yellow-100">
                      {meeting.notes.privateNotes}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit Notes
                </Button>
              </CardFooter>
            </AnimatedCard>
          ) : isPastMeeting ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3 text-muted-foreground">
                <i className="ri-file-text-line"></i>
              </div>
              <h3 className="text-lg font-medium">No meeting notes yet</h3>
              <p className="text-muted-foreground mb-4">
                Add notes and action items from your 1:1 meeting.
              </p>
              <Button onClick={() => setIsEditingNotes(true)}>
                <i className="ri-add-line mr-1"></i>
                Add Meeting Notes
              </Button>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3 text-muted-foreground">
                <i className="ri-time-line"></i>
              </div>
              <h3 className="text-lg font-medium">Meeting hasn't happened yet</h3>
              <p className="text-muted-foreground">
                Notes can be added after the meeting is completed.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Action Items Tab */}
        <TabsContent value="action-items" className="pt-4">
          {meeting.actionItems && meeting.actionItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Action Items</h3>
                  <p className="text-sm text-muted-foreground">
                    {meeting.actionItems.filter(item => item.status === "completed").length} of {meeting.actionItems.length} completed
                  </p>
                </div>
                <Progress 
                  value={calculateProgress()} 
                  className="w-28 h-2"
                />
              </div>
              
              <div className="space-y-3">
                {meeting.actionItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "border-l-4", 
                      item.status === "completed" ? "border-l-green-500" : 
                      item.status === "in_progress" ? "border-l-blue-500" : 
                      "border-l-slate-300"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center",
                                  item.status === "completed" ? "bg-green-100 text-green-600" : 
                                  item.status === "in_progress" ? "bg-blue-100 text-blue-600" : 
                                  "bg-slate-100 text-slate-600"
                                )}
                                onClick={() => {
                                  if (item.status === "completed") {
                                    handleStatusChange(index, "not_started");
                                  } else {
                                    handleStatusChange(index, "completed");
                                  }
                                }}
                                role="button"
                                aria-label={item.status === "completed" ? "Mark as not started" : "Mark as completed"}
                              >
                                {item.status === "completed" ? (
                                  <i className="ri-check-line text-xs"></i>
                                ) : (
                                  <i className="ri-checkbox-blank-circle-line text-xs"></i>
                                )}
                              </div>
                              <p className={cn(
                                "font-medium",
                                item.status === "completed" && "line-through text-muted-foreground"
                              )}>
                                {item.description}
                              </p>
                            </div>
                            <div className="mt-2 ml-7 flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <i className="ri-user-line"></i>
                                <span>{item.assignee}</span>
                              </div>
                              {item.dueDate && (
                                <div className="flex items-center gap-1">
                                  <i className="ri-calendar-line"></i>
                                  <span>Due: {format(new Date(item.dueDate), "MMM d, yyyy")}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                            className="text-xs rounded-full bg-transparent border py-1 px-2"
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3 text-muted-foreground">
                <i className="ri-list-check-2"></i>
              </div>
              <h3 className="text-lg font-medium">No action items</h3>
              <p className="text-muted-foreground mb-4">
                Add action items to track follow-up tasks from this meeting.
              </p>
              {isPastMeeting && (
                <Button onClick={() => setIsEditingNotes(true)}>
                  <i className="ri-add-line mr-1"></i>
                  Add Action Items
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Meeting Notes Form Dialog */}
      {isEditingNotes && (
        <MeetingNotesForm
          open={isEditingNotes}
          onClose={() => setIsEditingNotes(false)}
          meetingId={meetingId}
          initialData={meeting.notes || undefined}
          teamMembers={teamMembers?.map(user => ({
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`
          })) || []}
        />
      )}
    </div>
  );
}