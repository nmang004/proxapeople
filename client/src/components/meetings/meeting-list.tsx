// Meeting list component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OneOnOneMeeting } from "@shared/schema";

interface MeetingListProps {
  meetings: OneOnOneMeeting[];
  onViewDetails?: (id: number) => void;
}

export function MeetingList({ meetings, onViewDetails }: MeetingListProps) {
  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <Card key={meeting.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">One-on-One Meeting</CardTitle>
              <Badge variant="outline">{meeting.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Employee ID:</strong> {meeting.employeeId}</p>
              <p><strong>Manager ID:</strong> {meeting.managerId}</p>
              <p><strong>Scheduled:</strong> {new Date(meeting.scheduledAt).toLocaleString()}</p>
              {Boolean(meeting.agendaItems) && (
                <p><strong>Agenda:</strong> {meeting.agendaItems ? String(JSON.stringify(meeting.agendaItems)) : 'No agenda'}</p>
              )}
              {onViewDetails && (
                <Button 
                  variant="outline" 
                  onClick={() => onViewDetails(meeting.id)}
                  className="w-full mt-4"
                >
                  View Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}