// User related types
export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  managerId?: number;
  profileImage?: string;
  profileImageUrl?: string;
  hireDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Department and team related types
export interface Department {
  id: number;
  name: string;
  managerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  departmentId: number;
  managerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Performance review related types
export type ReviewType = "quarterly" | "annual" | "peer" | "self";
export type ReviewStatus = "not_started" | "self_review" | "peer_review" | "manager_review" | "completed" | "in_progress";

export interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewerId: number;
  reviewCycleId: number;
  reviewType: ReviewType;
  status: ReviewStatus;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCycle {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Goal related types
export type GoalStatus = "not_started" | "in_progress" | "completed";
export type GoalCategory = "okr" | "personal" | "team" | "project";
export type GoalPriority = "low" | "medium" | "high";

export interface Goal {
  id: number;
  title: string;
  description?: string;
  userId?: number;
  teamId?: number;
  departmentId?: number;
  status: GoalStatus;
  category: GoalCategory;
  priority: GoalPriority;
  progress: number;
  startDate: string;
  dueDate: string;
  currentValue?: string;
  targetValue?: string;
  notes?: string;
  isCompanyGoal: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// One-on-one meeting related types
export type MeetingStatus = "scheduled" | "completed" | "cancelled";
export type ActionItemStatus = "not_started" | "in_progress" | "completed";

export interface MeetingActionItem {
  description: string;
  assignee: string;
  dueDate?: string;
  status: ActionItemStatus;
}

export interface MeetingNotes {
  summary: string;
  discussionPoints?: string;
  decisions?: string;
  privateNotes?: string;
  nextSteps?: MeetingActionItem[];
}

export interface OneOnOneMeeting {
  id: number;
  managerId: number;
  participantId: number; // renamed from employeeId for clarity
  date: string;          // renamed from scheduledAt for simplicity
  duration: number;
  status: MeetingStatus;
  location?: string;
  locationLink?: string;
  agenda?: string;
  notes?: MeetingNotes;
  actionItems?: MeetingActionItem[];
  createdAt: string;
  updatedAt: string;
}

// Survey related types
export interface SurveyTemplate {
  id: number;
  name: string;
  description?: string;
  questions: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Survey {
  id: number;
  name: string;
  description?: string;
  templateId: number;
  startDate: string;
  endDate: string;
  isAnonymous: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: number;
  surveyId: number;
  userId?: number;
  responses: any[];
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Feedback related types
export interface Feedback {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Analytics related types
export interface Analytics {
  id: number;
  metric: string;
  value: any;
  date: string;
  teamId?: number;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementCategory {
  name: string;
  score: number;
}

export interface EngagementData {
  overall: number;
  categories: EngagementCategory[];
}
