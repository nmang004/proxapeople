import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
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
import { MeetingDetailView } from "@/components/meetings/meeting-detail-view";
import { MeetingList } from "@/components/meetings/meeting-list";
import { CreateMeetingForm } from "@/components/forms/create-meeting-form";
import { OneOnOneMeeting, User } from "@/lib/types";

export default function OneOnOne() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  
  // Fetch meetings data
  const { data: meetings, isLoading: isLoadingMeetings } = useQuery<OneOnOneMeeting[]>({
    queryKey: ['/api/one-on-ones'],
  });

  // Fetch users data for team members
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Metrics calculations (in a real app, these would come from the API)
  const upcomingMeetingsCount = meetings?.filter(m => 
    m.status === "scheduled" && new Date(m.date) > new Date()
  )?.length || 0;
  
  const completionRate = meetings && meetings.length > 0 ? 
    Math.round((meetings.filter(m => m.status === "completed").length / meetings.length) * 100) : 0;
  
  const pendingActionItems = meetings?.reduce((count, meeting) => {
    return count + (meeting.actionItems?.filter(item => item.status !== "completed").length || 0);
  }, 0) || 0;
  
  const dueThisWeek = meetings?.reduce((count, meeting) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return count + (meeting.actionItems?.filter(item => {
      return item.status !== "completed" && 
             item.dueDate && 
             new Date(item.dueDate) <= nextWeek;
    }).length || 0);
  }, 0) || 0;
  
  // Filter meetings based on active tab
  const filteredMeetings = meetings?.filter(meeting => {
    if (activeTab === "upcoming") {
      return meeting.status === "scheduled" && new Date(meeting.date) >= new Date();
    } else if (activeTab === "past") {
      return meeting.status === "completed" || 
             (meeting.status === "scheduled" && new Date(meeting.date) < new Date());
    } else if (activeTab === "action") {
      return meeting.actionItems && meeting.actionItems.length > 0;
    }
    return true;
  }) || [];
  
  // Handle meeting selection
  const handleMeetingSelect = (meetingId: number) => {
    setSelectedMeetingId(meetingId);
    setShowMeetingDetail(true);
  };
  
  return (
    <>
      <Helmet>
        <title>1:1 Meetings | Proxa People Management</title>
        <meta name="description" content="Schedule and manage 1:1 meetings with your team members to provide feedback, set goals, and track progress." />
      </Helmet>
      
      {/* Page Title with Add Button (Mobile Optimized) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-neutral-800">1:1 Meetings</h1>
          <p className="text-neutral-500 mt-1">Schedule and manage regular check-ins with your team</p>
        </div>
        
        <Button onClick={() => setIsSchedulingOpen(true)} size="sm" className="sm:self-start">
          <i className="ri-add-line mr-1.5"></i>
          Schedule Meeting
        </Button>
      </div>
      
      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm bg-gradient-to-br from-white to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">{upcomingMeetingsCount}</div>
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
        
        <Card className="shadow-sm bg-gradient-to-br from-white to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">{completionRate}%</div>
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
        
        <Card className="shadow-sm bg-gradient-to-br from-white to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-primary mr-3">{pendingActionItems}</div>
              <div className="text-sm text-neutral-500">
                <div>Pending completion</div>
                <div className="flex items-center text-amber-600">
                  <i className="ri-time-line mr-1"></i>
                  <span>{dueThisWeek} due this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Meeting List and Detail View */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {showMeetingDetail && selectedMeetingId ? (
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowMeetingDetail(false)}
                className="mb-6"
              >
                <i className="ri-arrow-left-line mr-1"></i>
                Back to all meetings
              </Button>
              
              <MeetingDetailView 
                meetingId={selectedMeetingId} 
                onClose={() => setShowMeetingDetail(false)} 
              />
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Meetings</TabsTrigger>
                  <TabsTrigger value="action">Action Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="mt-0">
                  <MeetingList 
                    meetings={filteredMeetings}
                    teamMembers={users}
                    isLoading={isLoadingMeetings}
                    onSelectMeeting={handleMeetingSelect}
                  />
                </TabsContent>
                
                <TabsContent value="past" className="mt-0">
                  <MeetingList 
                    meetings={filteredMeetings}
                    teamMembers={users}
                    isLoading={isLoadingMeetings}
                    onSelectMeeting={handleMeetingSelect}
                  />
                </TabsContent>
                
                <TabsContent value="action" className="mt-0">
                  <MeetingList 
                    meetings={filteredMeetings}
                    teamMembers={users}
                    isLoading={isLoadingMeetings}
                    onSelectMeeting={handleMeetingSelect}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Create Meeting Dialog */}
      <CreateMeetingForm
        open={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
      />
    </>
  );
}