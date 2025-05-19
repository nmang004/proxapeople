import { useState } from "react";
import { format } from "date-fns";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedCard } from "@/components/ui/animated-card";
import { User, OneOnOneMeeting } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MeetingListProps {
  meetings: OneOnOneMeeting[];
  teamMembers?: User[];
  isLoading: boolean;
  onSelectMeeting: (meetingId: number) => void;
}

export function MeetingList({ meetings, teamMembers, isLoading, onSelectMeeting }: MeetingListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Format date for display
  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };
  
  // Get attendee name
  const getAttendeeName = (userId: number) => {
    const user = teamMembers?.find(user => user.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };
  
  // Filter and sort meetings
  const filteredMeetings = meetings.filter(meeting => {
    // Status filter
    if (statusFilter !== "all" && meeting.status !== statusFilter) {
      return false;
    }
    
    // Search filter (by attendee name or location)
    if (searchQuery && searchQuery.trim() !== "") {
      const searchLower = searchQuery.toLowerCase();
      const attendeeName = getAttendeeName(meeting.participantId).toLowerCase();
      const locationLower = (meeting.location || "").toLowerCase();
      
      return attendeeName.includes(searchLower) || locationLower.includes(searchLower);
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "name-asc":
        return getAttendeeName(a.participantId).localeCompare(getAttendeeName(b.participantId));
      case "name-desc":
        return getAttendeeName(b.participantId).localeCompare(getAttendeeName(a.participantId));
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index} 
            className="h-24 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }
  
  if (filteredMeetings.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg border border-border mt-4">
        <div className="text-4xl text-muted-foreground mb-3">
          <i className="ri-calendar-2-line"></i>
        </div>
        <h3 className="text-lg font-medium">No meetings found</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          {searchQuery || statusFilter !== "all" 
            ? "Try adjusting your filters to see more results"
            : "Schedule your first 1:1 meeting to get started"}
        </p>
        {(searchQuery || statusFilter !== "all") && (
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Filters and controls */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-72">
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
            style={{ display: searchQuery ? 'block' : 'none' }}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-end">
          <div className="flex gap-3 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meetings</SelectItem>
                <SelectItem value="scheduled">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="hidden md:flex border rounded-md overflow-hidden">
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewType("list")}
            >
              <i className="ri-list-check"></i>
            </Button>
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="sm" 
              className="rounded-none"
              onClick={() => setViewType("grid")}
            >
              <i className="ri-grid-line"></i>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Meeting List */}
      {viewType === "list" && (
        <div className="space-y-3">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="w-full"
            >
              <Card 
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-md transition-all",
                  "border-l-4",
                  meeting.status === "scheduled" ? "border-l-blue-500" : 
                  meeting.status === "completed" ? "border-l-green-500" : 
                  "border-l-red-500"
                )}
                onClick={() => onSelectMeeting(meeting.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                    <Avatar className="h-12 w-12 rounded-full shrink-0 border-2 border-primary/10">
                      <AvatarImage 
                        src={teamMembers?.find(u => u.id === meeting.participantId)?.profileImageUrl || ""} 
                        alt={getAttendeeName(meeting.participantId)} 
                      />
                      <AvatarFallback>
                        {getAttendeeName(meeting.participantId).split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-medium text-base truncate">
                          1:1 with {getAttendeeName(meeting.participantId)}
                        </h3>
                        
                        <Badge className={cn(
                          meeting.status === "scheduled" ? "bg-blue-100 text-blue-800 border-blue-200" :
                          meeting.status === "completed" ? "bg-green-100 text-green-800 border-green-200" :
                          "bg-red-100 text-red-800 border-red-200"
                        )}>
                          {meeting.status === "scheduled" ? "Upcoming" : 
                           meeting.status === "completed" ? "Completed" : "Cancelled"}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <i className="ri-calendar-line"></i>
                          <span>{formatMeetingDate(meeting.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <i className="ri-time-line"></i>
                          <span>{meeting.duration} minutes</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <i className={cn(
                            meeting.location?.toLowerCase().includes("zoom") ? "ri-video-chat-line" :
                            meeting.location?.toLowerCase().includes("meet") ? "ri-google-line" :
                            meeting.location?.toLowerCase().includes("teams") ? "ri-microsoft-line" :
                            meeting.location?.toLowerCase().includes("person") ? "ri-map-pin-line" :
                            "ri-global-line"
                          )}></i>
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!isMobile && (
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <i className="ri-arrow-right-line"></i>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Meeting Grid */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((meeting, index) => (
            <AnimatedCard
              key={meeting.id}
              className="cursor-pointer hover:border-primary/20 overflow-hidden"
              fadeInDelay={index * 0.05}
              onClick={() => onSelectMeeting(meeting.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={cn(
                    "px-2 py-0.5",
                    meeting.status === "scheduled" ? "bg-blue-100 text-blue-800 border-blue-200" :
                    meeting.status === "completed" ? "bg-green-100 text-green-800 border-green-200" :
                    "bg-red-100 text-red-800 border-red-200"
                  )}>
                    {meeting.status === "scheduled" ? "Upcoming" : 
                     meeting.status === "completed" ? "Completed" : "Cancelled"}
                  </Badge>
                </div>
                
                <div className="flex items-center mb-3">
                  <Avatar className="h-10 w-10 rounded-full mr-3 border border-primary/10">
                    <AvatarImage 
                      src={teamMembers?.find(u => u.id === meeting.participantId)?.profileImageUrl || ""} 
                      alt={getAttendeeName(meeting.participantId)} 
                    />
                    <AvatarFallback>
                      {getAttendeeName(meeting.participantId).split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-sm">
                      {getAttendeeName(meeting.participantId)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {teamMembers?.find(u => u.id === meeting.participantId)?.role || "Team Member"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="ri-calendar-line text-primary text-xs"></i>
                    </div>
                    <span>{formatMeetingDate(meeting.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="ri-time-line text-primary text-xs"></i>
                    </div>
                    <span>{meeting.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className={cn(
                        "text-primary text-xs",
                        meeting.location?.toLowerCase().includes("zoom") ? "ri-video-chat-line" :
                        meeting.location?.toLowerCase().includes("meet") ? "ri-google-line" :
                        meeting.location?.toLowerCase().includes("teams") ? "ri-microsoft-line" :
                        meeting.location?.toLowerCase().includes("person") ? "ri-map-pin-line" :
                        "ri-global-line"
                      )}></i>
                    </div>
                    <span>{meeting.location}</span>
                  </div>
                </div>
                
                {meeting.notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center text-xs text-primary">
                      <i className="ri-file-text-line mr-1"></i>
                      <span>Has meeting notes</span>
                    </div>
                  </div>
                )}
                
                {meeting.actionItems && meeting.actionItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-primary">
                        <i className="ri-checkbox-line mr-1"></i>
                        <span>{meeting.actionItems.length} action items</span>
                      </div>
                      
                      <span className="text-muted-foreground">
                        {meeting.actionItems.filter(i => i.status === "completed").length}/{meeting.actionItems.length} done
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}