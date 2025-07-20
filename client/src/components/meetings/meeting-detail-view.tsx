// Meeting detail view component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OneOnOneMeeting } from "@shared/schema";

export interface MeetingDetailViewProps {
  meetingId: number;
  onClose: () => void;
}

export function MeetingDetailView({ meetingId, onClose }: MeetingDetailViewProps) {
  // Mock meeting data for now
  const meeting: OneOnOneMeeting = {
    id: meetingId,
    managerId: 1,
    employeeId: 2,
    scheduledAt: new Date(),
    duration: 60,
    status: 'scheduled',
    location: null,
    agendaItems: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Details</CardTitle>
        <Badge variant="outline">{meeting.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Employee</h4>
              <p>ID: {meeting.employeeId}</p>
            </div>
            <div>
              <h4 className="font-semibold">Manager</h4>
              <p>ID: {meeting.managerId}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold">Scheduled Date</h4>
            <p>{new Date(meeting.scheduledAt).toLocaleString()}</p>
          </div>

          {Boolean(meeting.agendaItems) && (
            <div>
              <h4 className="font-semibold">Agenda</h4>
              <p>{meeting.agendaItems ? String(JSON.stringify(meeting.agendaItems)) : 'No agenda items'}</p>
            </div>
          )}

          {Boolean(meeting.notes) && (
            <div>
              <h4 className="font-semibold">Notes</h4>
              <p>{typeof meeting.notes === 'string' ? meeting.notes : String(JSON.stringify(meeting.notes))}</p>
            </div>
          )}

          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            Close
          </button>
        </div>
      </CardContent>
    </Card>
  );
}