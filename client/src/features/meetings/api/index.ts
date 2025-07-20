// Re-export meetings endpoints
export { meetings } from '../../../shared/api/endpoints';

// Re-export meetings-specific hooks
export {
  useMeetings,
  useMeeting,
  useCreateMeeting,
  useUpdateMeeting,
  useDeleteMeeting,
} from '../../../shared/api/hooks';

// Re-export meetings-specific types
export type {
  OneOnOneMeeting,
  InsertOneOnOneMeeting,
  MeetingFilter,
} from '../../../shared/api/types';

// Export a convenience object for meetings API
export const meetingsApi = {
  // Endpoints
  ...meetings,
  
  // Helper functions specific to meetings feature
  getStatusColor: (status: 'scheduled' | 'completed' | 'canceled'): string => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  getStatusLabel: (status: 'scheduled' | 'completed' | 'canceled'): string => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Unknown';
    }
  },

  formatDuration: (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  },

  formatMeetingTime: (scheduledAt: string, duration: number): string => {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + duration * 60000);
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    
    const startTime = start.toLocaleTimeString('en-US', timeOptions);
    const endTime = end.toLocaleTimeString('en-US', timeOptions);
    
    return `${startTime} - ${endTime}`;
  },

  formatMeetingDate: (scheduledAt: string): string => {
    const date = new Date(scheduledAt);
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  isUpcoming: (scheduledAt: string): boolean => {
    return new Date(scheduledAt) > new Date();
  },

  isPast: (scheduledAt: string): boolean => {
    return new Date(scheduledAt) < new Date();
  },

  isToday: (scheduledAt: string): boolean => {
    const meeting = new Date(scheduledAt);
    const today = new Date();
    
    return meeting.toDateString() === today.toDateString();
  },

  canEdit: (meeting: OneOnOneMeeting, currentUserId: number): boolean => {
    // Only manager or employee can edit their own meetings
    return meeting.managerId === currentUserId || meeting.employeeId === currentUserId;
  },

  canCancel: (meeting: OneOnOneMeeting, currentUserId: number): boolean => {
    // Only scheduled meetings can be canceled
    if (meeting.status !== 'scheduled') return false;
    
    // Manager or employee can cancel
    return meeting.managerId === currentUserId || meeting.employeeId === currentUserId;
  },

  getDefaultAgendaItems: (): string[] => [
    'Review previous action items',
    'Discuss current projects and priorities',
    'Address any challenges or blockers',
    'Career development and goals',
    'Feedback and suggestions',
    'Next steps and action items',
  ],
};