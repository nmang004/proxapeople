import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { OneOnOneMeeting } from "@/lib/types";

// Sample 1:1 meeting data
const sampleMeetings: OneOnOneMeeting[] = [
  {
    id: 1,
    title: "Weekly Check-in",
    managerId: 1,
    employeeId: 2,
    scheduledAt: "2025-05-21T10:00:00Z",
    duration: 30,
    status: "scheduled",
    location: "Google Meet",
    agendaItems: ["Discuss current project progress", "Review goals for next sprint", "Address any blockers"],
    employee: {
      id: 2,
      name: "Michael Chen",
      jobTitle: "Frontend Developer",
      profileImage: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 2,
    title: "Monthly Performance Review",
    managerId: 1,
    employeeId: 1,
    scheduledAt: "2025-05-23T14:30:00Z",
    duration: 45,
    status: "scheduled",
    location: "Conference Room B",
    agendaItems: ["Review last month's goals", "Set objectives for next month", "Career development discussion"],
    employee: {
      id: 1,
      name: "Sarah Johnson",
      jobTitle: "Product Designer",
      profileImage: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 3,
    title: "Goal Setting Session",
    managerId: 1,
    employeeId: 4,
    scheduledAt: "2025-05-24T11:00:00Z",
    duration: 30,
    status: "scheduled",
    location: "Zoom",
    agendaItems: ["Review Q2 objectives", "Align on product roadmap priorities"],
    employee: {
      id: 4,
      name: "Emily Wilson",
      jobTitle: "Product Manager",
      profileImage: "https://i.pravatar.cc/150?img=5"
    }
  }
];

export function OneOnOneMeetings() {
  const { data: apiMeetings, isLoading, error } = useQuery<OneOnOneMeeting[]>({
    queryKey: ['/api/dashboard'],
    select: (data) => data.upcomingOneOnOnes || [],
  });
  
  // Use sample data for visual representation
  const meetings = apiMeetings?.length ? apiMeetings : sampleMeetings;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dayText = format(date, 'EEEE');
    if (date.toDateString() === today.toDateString()) {
      dayText = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayText = 'Tomorrow';
    }
    
    return `${dayText}, ${format(date, 'h:mm a')} - ${format(new Date(date.getTime() + 30*60000), 'h:mm a')}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-heading font-medium text-neutral-800">Upcoming 1:1s</CardTitle>
          <a href="#" className="text-primary text-sm font-medium hover:underline">Schedule New</a>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading meetings...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">Error loading meetings</div>
        ) : meetings && meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex p-3 border border-neutral-200 rounded-lg hover:border-primary transition-colors duration-200">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary mr-3 flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={meeting.employee.profileImage} alt={meeting.employee.name} />
                    <AvatarFallback>
                      {meeting.employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-neutral-800">1:1 with {meeting.employee.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{formatDateTime(meeting.scheduledAt)}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-primary">
                      {meeting.agendaItems ? `${(meeting.agendaItems as any[]).length} Agenda Items` : 'No Agenda Items'}
                    </span>
                    <span className="ml-2 text-xs text-neutral-500">{meeting.location || 'No location set'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-neutral-500">No upcoming 1:1 meetings found</div>
        )}
      </CardContent>
    </Card>
  );
}
