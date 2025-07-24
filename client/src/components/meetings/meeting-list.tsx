// Meeting list component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OneOnOneMeeting, User } from "@shared/schema";

export interface MeetingListProps {
  meetings: OneOnOneMeeting[];
  teamMembers?: User[];
  isLoading?: boolean;
  onSelectMeeting?: (id: number) => void;
}

export function MeetingList({ meetings, teamMembers, isLoading, onSelectMeeting }: MeetingListProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading meetings...</div>;
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No meetings found</p>
        <p className="text-gray-400 text-sm">Schedule your first 1:1 meeting to get started</p>
      </div>
    );
  }

  const getEmployeeName = (employeeId: number) => {
    const employee = teamMembers?.find(member => member.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : `Employee #${employeeId}`;
  };

  const getManagerName = (managerId: number) => {
    const manager = teamMembers?.find(member => member.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : `Manager #${managerId}`;
  };

  const formatAgendaItems = (agendaItems: any) => {
    if (!agendaItems) return [];
    if (Array.isArray(agendaItems)) return agendaItems;
    if (typeof agendaItems === 'string') {
      try {
        return JSON.parse(agendaItems);
      } catch {
        return [agendaItems];
      }
    }
    return [];
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const agendaList = formatAgendaItems(meeting.agendaItems);
        const statusColor = meeting.status === 'completed' ? 'bg-green-100 text-green-800' : 
                           meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800';
        
        return (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {getEmployeeName(meeting.employeeId)} & {getManagerName(meeting.managerId)}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(meeting.scheduledAt)} • {meeting.duration} minutes
                  </p>
                </div>
                <Badge className={`${statusColor} border-0 capitalize`}>
                  {meeting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {meeting.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {meeting.location}
                  </div>
                )}
                
                {agendaList.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Agenda:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {agendaList.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {meeting.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{meeting.notes}</p>
                  </div>
                )}

                {onSelectMeeting && (
                  <Button 
                    variant="outline" 
                    onClick={() => onSelectMeeting(meeting.id)}
                    className="w-full mt-4 text-sm"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}