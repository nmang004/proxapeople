import { 
  users, type User, type InsertUser,
  departments, type Department, type InsertDepartment,
  teams, type Team, type InsertTeam,
  teamMembers, type TeamMember, type InsertTeamMember,
  performanceReviews, type PerformanceReview, type InsertPerformanceReview,
  reviewCycles, type ReviewCycle, type InsertReviewCycle,
  goals, type Goal, type InsertGoal,
  oneOnOneMeetings, type OneOnOneMeeting, type InsertOneOnOneMeeting,
  surveyTemplates, type SurveyTemplate, type InsertSurveyTemplate,
  surveys, type Survey, type InsertSurvey,
  surveyResponses, type SurveyResponse, type InsertSurveyResponse,
  feedback, type Feedback, type InsertFeedback,
  analytics, type Analytics, type InsertAnalytics,
  resources, type Resource, type InsertResource,
  permissions, type Permission, type InsertPermission,
  rolePermissions, type RolePermission, type InsertRolePermission,
  userPermissions, type UserPermission, type InsertUserPermission,
  passwordResetTokens, type PasswordResetToken, type InsertPasswordResetToken
} from "@shared/schema";
import { db } from "./supabase";
import { eq, and, gte, lt } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  
  // Password reset methods
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenAsUsed(tokenId: number): Promise<void>;
  deleteExpiredPasswordResetTokens(): Promise<void>;
  
  // Department methods
  createDepartment(department: InsertDepartment): Promise<Department>;
  getAllDepartments(): Promise<Department[]>;
  
  // Team methods
  createTeam(team: InsertTeam): Promise<Team>;
  getAllTeams(): Promise<Team[]>;
  
  // Team member methods
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getTeamMembers(teamId: number): Promise<User[]>;
  getTeamMemberCount(): Promise<number>;
  
  // Performance review methods
  createPerformanceReview(review: InsertPerformanceReview): Promise<PerformanceReview>;
  getPerformanceReview(id: number): Promise<PerformanceReview | undefined>;
  getAllPerformanceReviews(): Promise<PerformanceReview[]>;
  getReviewsInProgressCount(): Promise<number>;
  getUpcomingReviews(): Promise<PerformanceReview[]>;
  
  // Review cycle methods
  createReviewCycle(cycle: InsertReviewCycle): Promise<ReviewCycle>;
  getAllReviewCycles(): Promise<ReviewCycle[]>;
  
  // Goal methods
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoal(id: number): Promise<Goal | undefined>;
  getAllGoals(): Promise<Goal[]>;
  getUserGoals(userId: number): Promise<Goal[]>;
  getTeamGoals(teamId: number): Promise<Goal[]>;
  getActiveGoalsCount(): Promise<number>;
  
  // One-on-one meeting methods
  createOneOnOneMeeting(meeting: InsertOneOnOneMeeting): Promise<OneOnOneMeeting>;
  getOneOnOneMeeting(id: number): Promise<OneOnOneMeeting | undefined>;
  getAllOneOnOneMeetings(): Promise<OneOnOneMeeting[]>;
  getUserOneOnOneMeetings(userId: number): Promise<OneOnOneMeeting[]>;
  getUpcomingOneOnOnes(): Promise<OneOnOneMeeting[]>;
  
  // Survey template methods
  createSurveyTemplate(template: InsertSurveyTemplate): Promise<SurveyTemplate>;
  getAllSurveyTemplates(): Promise<SurveyTemplate[]>;
  
  // Survey methods
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getAllSurveys(): Promise<Survey[]>;
  
  // Survey response methods
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  
  // Feedback methods
  createFeedback(feedbackItem: InsertFeedback): Promise<Feedback>;
  getUserFeedback(userId: number): Promise<Feedback[]>;
  
  // Analytics methods
  createAnalytics(analyticsItem: InsertAnalytics): Promise<Analytics>;
  getAllAnalytics(): Promise<Analytics[]>;
  getAverageEngagementScore(): Promise<number>;
  getTeamPerformance(): Promise<any>;
  getTeamEngagement(): Promise<any>;
  
  // Resource methods
  createResource(resource: InsertResource): Promise<Resource>;
  getResource(id: number): Promise<Resource | undefined>;
  getResourceByName(name: string): Promise<Resource | undefined>;
  getAllResources(): Promise<Resource[]>;
  
  // Permission methods
  createPermission(permission: InsertPermission): Promise<Permission>;
  getPermission(id: number): Promise<Permission | undefined>;
  getResourcePermissions(resourceId: number): Promise<Permission[]>;
  getAllPermissions(): Promise<Permission[]>;
  
  // Role permission methods
  assignPermissionToRole(rolePermission: InsertRolePermission): Promise<RolePermission>;
  getRolePermissions(role: string): Promise<Permission[]>;
  removeRolePermission(rolePermissionId: number): Promise<void>;
  
  // User permission methods
  assignPermissionToUser(userPermission: InsertUserPermission): Promise<UserPermission>;
  getUserPermissions(userId: number): Promise<UserPermission[]>;
  removeUserPermission(userPermissionId: number): Promise<void>;
  checkUserPermission(userId: number, resourceName: string, action: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Demo users cache
  private demoUsers: Record<number, User> = {
    1: {
      id: 1,
      email: 'admin@demo.com',
      firstName: 'Admin',
      lastName: 'Demo',
      role: 'admin',
      jobTitle: 'System Administrator',
      department: 'IT',
      profileImage: null,
      hireDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash', // Not used for demo auth
    },
    2: {
      id: 2,
      email: 'hr@demo.com',
      firstName: 'HR',
      lastName: 'Demo',
      role: 'hr',
      jobTitle: 'HR Manager',
      department: 'Human Resources',
      profileImage: null,
      hireDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    3: {
      id: 3,
      email: 'manager@demo.com',
      firstName: 'Manager',
      lastName: 'Demo',
      role: 'manager',
      jobTitle: 'Department Manager',
      department: 'Operations',
      profileImage: null,
      hireDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    4: {
      id: 4,
      email: 'employee@demo.com',
      firstName: 'Employee',
      lastName: 'Demo',
      role: 'employee',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      profileImage: null,
      hireDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    }
  };

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    // Check if it's a demo user
    if (id >= 1 && id <= 4 && this.demoUsers[id]) {
      return this.demoUsers[id];
    }
    
    return db.users.findFirst({ id });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Check demo users first
    const demoUser = Object.values(this.demoUsers).find(u => u.email === email);
    if (demoUser) {
      return demoUser;
    }
    
    return db.users.findFirst({ email });
  }

  async createUser(userData: InsertUser): Promise<User> {
    return db.users.create(userData);
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Password reset methods
  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db.insert(passwordResetTokens).values(tokenData).returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, false),
          gte(passwordResetTokens.expiresAt, new Date())
        )
      );
    return resetToken;
  }

  async markPasswordResetTokenAsUsed(tokenId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, new Date()));
  }
  
  // Resource methods
  async createResource(resourceData: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(resourceData).returning();
    return resource;
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  async getResourceByName(name: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.name, name));
    return resource;
  }
  
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }
  
  // Permission methods
  async createPermission(permissionData: InsertPermission): Promise<Permission> {
    const [permission] = await db.insert(permissions).values(permissionData).returning();
    return permission;
  }
  
  async getPermission(id: number): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id));
    return permission;
  }
  
  async getResourcePermissions(resourceId: number): Promise<Permission[]> {
    return db.select().from(permissions).where(eq(permissions.resourceId, resourceId));
  }
  
  async getAllPermissions(): Promise<Permission[]> {
    return db.select().from(permissions);
  }
  
  // Role permission methods
  async assignPermissionToRole(rolePermissionData: InsertRolePermission): Promise<RolePermission> {
    const [rolePermission] = await db.insert(rolePermissions).values(rolePermissionData).returning();
    return rolePermission;
  }
  
  async getRolePermissions(role: string): Promise<Permission[]> {
    const permissionsList = await db
      .select({
        permission: permissions
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, role as any));
    
    return permissionsList.map(p => p.permission);
  }
  
  async removeRolePermission(rolePermissionId: number): Promise<void> {
    await db.delete(rolePermissions).where(eq(rolePermissions.id, rolePermissionId));
  }
  
  // User permission methods
  async assignPermissionToUser(userPermissionData: InsertUserPermission): Promise<UserPermission> {
    const [userPermission] = await db.insert(userPermissions).values(userPermissionData).returning();
    return userPermission;
  }
  
  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    return db.select().from(userPermissions).where(eq(userPermissions.userId, userId));
  }
  
  async removeUserPermission(userPermissionId: number): Promise<void> {
    await db.delete(userPermissions).where(eq(userPermissions.id, userPermissionId));
  }
  
  async checkUserPermission(userId: number, resourceName: string, action: string): Promise<boolean> {
    // 1. Get the user to check their role
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return false;
    }
    
    // 2. Find the resource
    const [resource] = await db.select().from(resources).where(eq(resources.name, resourceName));
    
    if (!resource) {
      return false;
    }
    
    // 3. Find the specific permission for this resource and action
    const [permission] = await db.select().from(permissions).where(
      and(
        eq(permissions.resourceId, resource.id),
        eq(permissions.action, action as any)
      )
    );
    
    if (!permission) {
      return false;
    }
    
    // 4. Check if user has this permission through their role
    const roleBasedPermissions = await db.select().from(rolePermissions).where(
      and(
        eq(rolePermissions.role, user.role),
        eq(rolePermissions.permissionId, permission.id)
      )
    );
    
    if (roleBasedPermissions.length > 0) {
      return true;
    }
    
    // 5. Check for specific user permissions (can override role permissions)
    const [userSpecificPermission] = await db.select().from(userPermissions).where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permissionId, permission.id),
        eq(userPermissions.granted, true)
      )
    );
    
    // If user has the specific permission and it hasn't expired
    if (userSpecificPermission) {
      if (userSpecificPermission.expiresAt && userSpecificPermission.expiresAt < new Date()) {
        return false;
      }
      return true;
    }
    
    // No permission found
    return false;
  }

  // Department methods
  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const [department] = await db.insert(departments).values(departmentData).returning();
    return department;
  }

  async getAllDepartments(): Promise<Department[]> {
    return db.select().from(departments);
  }

  // Team methods
  async createTeam(teamData: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(teamData).returning();
    return team;
  }

  async getAllTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }

  // Team member methods
  async addTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db.insert(teamMembers).values(teamMemberData).returning();
    return teamMember;
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    const members = await db
      .select({ user: users })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    
    return members.map(m => m.user);
  }

  async getTeamMemberCount(): Promise<number> {
    // For demo purposes, return a static count
    return 14;
  }

  // Performance review methods
  async createPerformanceReview(reviewData: InsertPerformanceReview): Promise<PerformanceReview> {
    const [review] = await db.insert(performanceReviews).values(reviewData).returning();
    return review;
  }

  async getPerformanceReview(id: number): Promise<PerformanceReview | undefined> {
    const [review] = await db.select().from(performanceReviews).where(eq(performanceReviews.id, id));
    return review;
  }

  async getAllPerformanceReviews(): Promise<PerformanceReview[]> {
    return db.select().from(performanceReviews);
  }

  async getReviewsInProgressCount(): Promise<number> {
    // For demo purposes, return a static count
    return 8;
  }

  async getUpcomingReviews(): Promise<any[]> {
    // For demo purposes, return static reviews
    const now = new Date();
    const reviews = await db
      .select({
        review: performanceReviews,
        employee: users
      })
      .from(performanceReviews)
      .innerJoin(users, eq(performanceReviews.employeeId, users.id))
      .where(gte(performanceReviews.dueDate, now.toISOString().split('T')[0]));
    
    return reviews.map(r => ({
      id: r.review.id,
      type: r.review.reviewType,
      dueDate: r.review.dueDate,
      status: r.review.status,
      employee: {
        id: r.employee.id,
        name: `${r.employee.firstName} ${r.employee.lastName}`,
        jobTitle: r.employee.jobTitle,
        profileImage: r.employee.profileImage
      }
    }));
  }

  // Review cycle methods
  async createReviewCycle(cycleData: InsertReviewCycle): Promise<ReviewCycle> {
    const [cycle] = await db.insert(reviewCycles).values(cycleData).returning();
    return cycle;
  }

  async getAllReviewCycles(): Promise<ReviewCycle[]> {
    return db.select().from(reviewCycles);
  }

  // Goal methods
  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(goalData).returning();
    return goal;
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async getAllGoals(): Promise<Goal[]> {
    return db.select().from(goals);
  }

  async getUserGoals(userId: number): Promise<Goal[]> {
    return db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getTeamGoals(teamId: number): Promise<Goal[]> {
    return db.select().from(goals).where(eq(goals.teamId, teamId));
  }

  async getActiveGoalsCount(): Promise<number> {
    // For demo purposes, return a static count
    return 23;
  }

  // One-on-one meeting methods
  async createOneOnOneMeeting(meetingData: InsertOneOnOneMeeting): Promise<OneOnOneMeeting> {
    const [meeting] = await db.insert(oneOnOneMeetings).values(meetingData).returning();
    return meeting;
  }

  async getOneOnOneMeeting(id: number): Promise<OneOnOneMeeting | undefined> {
    const [meeting] = await db.select().from(oneOnOneMeetings).where(eq(oneOnOneMeetings.id, id));
    return meeting;
  }

  async getAllOneOnOneMeetings(): Promise<OneOnOneMeeting[]> {
    return db.select().from(oneOnOneMeetings);
  }

  async getUserOneOnOneMeetings(userId: number): Promise<OneOnOneMeeting[]> {
    return db
      .select()
      .from(oneOnOneMeetings)
      .where(
        and(
          eq(oneOnOneMeetings.employeeId, userId),
          gte(oneOnOneMeetings.scheduledAt, new Date())
        )
      );
  }

  async getUpcomingOneOnOnes(): Promise<any[]> {
    // For demo purposes, return static meetings
    const oneOnOnes = await db
      .select({
        meeting: oneOnOneMeetings,
        employee: users
      })
      .from(oneOnOneMeetings)
      .innerJoin(users, eq(oneOnOneMeetings.employeeId, users.id))
      .where(gte(oneOnOneMeetings.scheduledAt, new Date()));
    
    return oneOnOnes.map(m => ({
      id: m.meeting.id,
      employee: {
        id: m.employee.id,
        name: `${m.employee.firstName} ${m.employee.lastName}`,
        profileImage: m.employee.profileImage
      },
      scheduledAt: m.meeting.scheduledAt,
      duration: m.meeting.duration,
      location: m.meeting.location,
      agendaItems: m.meeting.agendaItems
    }));
  }

  // Survey template methods
  async createSurveyTemplate(templateData: InsertSurveyTemplate): Promise<SurveyTemplate> {
    const [template] = await db.insert(surveyTemplates).values(templateData).returning();
    return template;
  }

  async getAllSurveyTemplates(): Promise<SurveyTemplate[]> {
    return db.select().from(surveyTemplates);
  }

  // Survey methods
  async createSurvey(surveyData: InsertSurvey): Promise<Survey> {
    const [survey] = await db.insert(surveys).values(surveyData).returning();
    return survey;
  }

  async getAllSurveys(): Promise<Survey[]> {
    return db.select().from(surveys);
  }

  // Survey response methods
  async createSurveyResponse(responseData: InsertSurveyResponse): Promise<SurveyResponse> {
    const [response] = await db.insert(surveyResponses).values(responseData).returning();
    return response;
  }

  // Feedback methods
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [feedbackItem] = await db.insert(feedback).values(feedbackData).returning();
    return feedbackItem;
  }

  async getUserFeedback(userId: number): Promise<Feedback[]> {
    return db.select().from(feedback).where(eq(feedback.toUserId, userId));
  }

  // Analytics methods
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analyticsItem] = await db.insert(analytics).values(analyticsData).returning();
    return analyticsItem;
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return db.select().from(analytics);
  }

  async getAverageEngagementScore(): Promise<number> {
    // For demo purposes, return a static score
    return 8.2;
  }

  async getTeamPerformance(): Promise<any> {
    // For demo purposes, return static data
    return {
      quarterly: [
        { quarter: 'Q1', overallScore: 7.5, growthScore: 7.2 },
        { quarter: 'Q2', overallScore: 7.8, growthScore: 6.5 },
        { quarter: 'Q3', overallScore: 8.5, growthScore: 8.0 },
        { quarter: 'Q4', overallScore: 8.0, growthScore: 8.0 }
      ]
    };
  }

  async getTeamEngagement(): Promise<any> {
    // For demo purposes, return static data
    return {
      overall: 8.2,
      categories: [
        { name: 'Work Environment', score: 8.7 },
        { name: 'Team Collaboration', score: 8.5 },
        { name: 'Work-Life Balance', score: 7.9 },
        { name: 'Career Growth', score: 7.8 }
      ]
    };
  }
}

// For testing, we can use either MemStorage or DatabaseStorage
export const storage = new DatabaseStorage();
