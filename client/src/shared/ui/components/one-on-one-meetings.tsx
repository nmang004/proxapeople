import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import type { OneOnOneMeeting } from "@shared/schema";

// Sample 1:1 meeting data
const sampleMeetings: OneOnOneMeeting[] = [
  {
    id: 1,
    managerId: 1,
    employeeId: 2,
    scheduledAt: new Date("2025-05-21T10:00:00Z"),
    duration: 30,
    status: "scheduled",
    location: "Google Meet",
    agendaItems: ["Discuss current project progress", "Review goals for next sprint", "Address any blockers"],
    notes: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 2,
    managerId: 1,
    employeeId: 1,
    scheduledAt: new Date("2025-05-23T14:30:00Z"),
    duration: 45,
    status: "scheduled",
    location: "Conference Room B",
    agendaItems: ["Review last month's goals", "Set objectives for next month", "Career development discussion"],
    notes: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  },
  {
    id: 3,
    managerId: 1,
    employeeId: 4,
    scheduledAt: new Date("2025-05-24T11:00:00Z"),
    duration: 30,
    status: "scheduled",
    location: "Zoom",
    agendaItems: ["Review Q2 objectives", "Align on product roadmap priorities"],
    notes: null,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z")
  }
];

interface OneOnOneMeetingsProps {
  meetings?: any[];
  isLoading?: boolean;
  error?: Error | null;
}

export function OneOnOneMeetings({ meetings: propMeetings, isLoading = false, error = null }: OneOnOneMeetingsProps) {
  // Use meetings from props (passed from dashboard) or fall back to sample data
  const meetings = (propMeetings && propMeetings.length > 0) ? propMeetings : sampleMeetings;

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
          <div className="py-4 text-center text-red-500">
            {error.message || 'Error loading meetings'}
          </div>
        ) : meetings && meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex p-3 border border-neutral-200 rounded-lg hover:border-primary transition-colors duration-200">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary mr-3 flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${meeting.employeeId}`} alt={`Employee ${meeting.employeeId}`} />
                    <AvatarFallback>
                      {`E${meeting.employeeId}`}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-neutral-800">1:1 with Employee {meeting.employeeId}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{formatDateTime(typeof meeting.scheduledAt === 'string' ? meeting.scheduledAt : meeting.scheduledAt.toISOString())}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-primary">
                      {(meeting.agendaItems && Array.isArray(meeting.agendaItems) && meeting.agendaItems.length > 0) ? 'Has Agenda' : 'No Agenda'}
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
