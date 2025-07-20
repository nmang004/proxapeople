// Meeting detail view component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OneOnOneMeeting } from "@shared/schema";

interface MeetingDetailViewProps {
  meeting: OneOnOneMeeting;
}

export function MeetingDetailView({ meeting }: MeetingDetailViewProps) {
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

        </div>
      </CardContent>
    </Card>
  );
}