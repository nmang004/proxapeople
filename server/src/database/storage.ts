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
  updateUser(userId: number, userData: Partial<InsertUser>): Promise<User>;
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
  // Rival Digital employees
  private demoUsers: Record<number, User> = {
    // Leadership
    1: {
      id: 1,
      email: 'eric@rivaldigital.com',
      firstName: 'Eric',
      lastName: 'Thomas',
      role: 'admin',
      jobTitle: 'President',
      department: 'Executive',
      profileImage: null,
      hireDate: '2020-01-01',
      managerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    2: {
      id: 2,
      email: 'sophia@rivaldigital.com',
      firstName: 'Sophia',
      lastName: 'Potter',
      role: 'manager',
      jobTitle: 'OPS Manager',
      department: 'Operations',
      profileImage: null,
      hireDate: '2020-02-01',
      managerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Shared Services
    3: {
      id: 3,
      email: 'erik@rivaldigital.com',
      firstName: 'Erik',
      lastName: 'Olson',
      role: 'admin',
      jobTitle: 'CEO',
      department: 'Shared Services',
      profileImage: null,
      hireDate: '2020-01-01',
      managerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    4: {
      id: 4,
      email: 'marcia@rivaldigital.com',
      firstName: 'Marcia',
      lastName: 'Scarlett',
      role: 'employee',
      jobTitle: 'Finance Admin',
      department: 'Shared Services',
      profileImage: null,
      hireDate: '2020-03-01',
      managerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    5: {
      id: 5,
      email: 'madison@rivaldigital.com',
      firstName: 'Madison',
      lastName: 'Sullivan',
      role: 'employee',
      jobTitle: 'Business Manager',
      department: 'Shared Services',
      profileImage: null,
      hireDate: '2020-04-01',
      managerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    6: {
      id: 6,
      email: 'nadia@rivaldigital.com',
      firstName: 'Nadia',
      lastName: 'Olson',
      role: 'employee',
      jobTitle: 'Social Media Coord.',
      department: 'Shared Services',
      profileImage: null,
      hireDate: '2021-01-01',
      managerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    8: {
      id: 8,
      email: 'diana@rivaldigital.com',
      firstName: 'Diana',
      lastName: 'Tamayo',
      role: 'employee',
      jobTitle: 'Virtual Assistant',
      department: 'Shared Services',
      profileImage: null,
      hireDate: '2021-03-01',
      managerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Sales Department
    9: {
      id: 9,
      email: 'trevor@rivaldigital.com',
      firstName: 'Trevor',
      lastName: 'Quinlan',
      role: 'manager',
      jobTitle: 'Sales Manager',
      department: 'Sales',
      profileImage: null,
      hireDate: '2020-05-01',
      managerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    10: {
      id: 10,
      email: 'josh@rivaldigital.com',
      firstName: 'Josh',
      lastName: 'Miller',
      role: 'employee',
      jobTitle: 'Business Dev. Rep',
      department: 'Sales',
      profileImage: null,
      hireDate: '2021-04-01',
      managerId: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Websites Department
    11: {
      id: 11,
      email: 'zack@rivaldigital.com',
      firstName: 'Zack',
      lastName: 'Ledford',
      role: 'manager',
      jobTitle: 'Web Manager',
      department: 'Websites',
      profileImage: null,
      hireDate: '2020-06-01',
      managerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    12: {
      id: 12,
      email: 'aaron@rivaldigital.com',
      firstName: 'Aaron',
      lastName: 'Regaldo',
      role: 'employee',
      jobTitle: 'Developer',
      department: 'Websites',
      profileImage: null,
      hireDate: '2021-05-01',
      managerId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    13: {
      id: 13,
      email: 'jack@rivaldigital.com',
      firstName: 'Jack',
      lastName: 'Bibb',
      role: 'employee',
      jobTitle: 'Developer',
      department: 'Websites',
      profileImage: null,
      hireDate: '2021-06-01',
      managerId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    14: {
      id: 14,
      email: 'noah@rivaldigital.com',
      firstName: 'Noah',
      lastName: 'Logan',
      role: 'employee',
      jobTitle: 'Graphic Designer',
      department: 'Websites',
      profileImage: null,
      hireDate: '2021-07-01',
      managerId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    15: {
      id: 15,
      email: 'evan@rivaldigital.com',
      firstName: 'Evan',
      lastName: 'Markett',
      role: 'employee',
      jobTitle: 'Developer',
      department: 'Websites',
      profileImage: null,
      hireDate: '2021-08-01',
      managerId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Search Department (Reports to OPS Manager)
    16: {
      id: 16,
      email: 'kylie@rivaldigital.com',
      firstName: 'Kylie',
      lastName: 'Morrison',
      role: 'manager',
      jobTitle: 'Ad Manager',
      department: 'Search',
      profileImage: null,
      hireDate: '2020-07-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    17: {
      id: 17,
      email: 'allison@rivaldigital.com',
      firstName: 'Allison',
      lastName: 'Long',
      role: 'employee',
      jobTitle: 'Ad Spec.',
      department: 'Search',
      profileImage: null,
      hireDate: '2021-09-01',
      managerId: 16,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    18: {
      id: 18,
      email: 'everett@rivaldigital.com',
      firstName: 'Everett',
      lastName: 'Ezell',
      role: 'employee',
      jobTitle: 'PPC Spec.',
      department: 'Search',
      profileImage: null,
      hireDate: '2021-10-01',
      managerId: 16,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    19: {
      id: 19,
      email: 'christopher@rivaldigital.com',
      firstName: 'Christopher',
      lastName: 'Neckermann',
      role: 'manager',
      jobTitle: 'SEO Manager',
      department: 'Search',
      profileImage: null,
      hireDate: '2020-08-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    20: {
      id: 20,
      email: 'laura@rivaldigital.com',
      firstName: 'Laura',
      lastName: 'Keenan',
      role: 'employee',
      jobTitle: 'SEO Spec.',
      department: 'Search',
      profileImage: null,
      hireDate: '2021-11-01',
      managerId: 19,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    21: {
      id: 21,
      email: 'christian@rivaldigital.com',
      firstName: 'Christian',
      lastName: 'Cevallos',
      role: 'employee',
      jobTitle: 'SEO Spec.',
      department: 'Search',
      profileImage: null,
      hireDate: '2021-12-01',
      managerId: 19,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    22: {
      id: 22,
      email: 'nick@rivaldigital.com',
      firstName: 'Nick',
      lastName: 'Mangubat',
      role: 'employee',
      jobTitle: 'SEO Spec.',
      department: 'Search',
      profileImage: null,
      hireDate: '2022-01-01',
      managerId: 19,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Account Management
    23: {
      id: 23,
      email: 'georgia@rivaldigital.com',
      firstName: 'Georgia',
      lastName: 'Elder',
      role: 'manager',
      jobTitle: 'Dir. of AM',
      department: 'Account Management',
      profileImage: null,
      hireDate: '2020-09-01',
      managerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    24: {
      id: 24,
      email: 'rachel.kent@rivaldigital.com',
      firstName: 'Rachel',
      lastName: 'Kent',
      role: 'employee',
      jobTitle: 'AM',
      department: 'Account Management',
      profileImage: null,
      hireDate: '2022-02-01',
      managerId: 23,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    25: {
      id: 25,
      email: 'nina@rivaldigital.com',
      firstName: 'Nina',
      lastName: 'AM',
      role: 'employee',
      jobTitle: 'AM',
      department: 'Account Management',
      profileImage: null,
      hireDate: '2022-03-01',
      managerId: 23,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    26: {
      id: 26,
      email: 'london@rivaldigital.com',
      firstName: 'London',
      lastName: 'AM',
      role: 'employee',
      jobTitle: 'AM',
      department: 'Account Management',
      profileImage: null,
      hireDate: '2022-04-01',
      managerId: 23,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    27: {
      id: 27,
      email: 'katie@rivaldigital.com',
      firstName: 'Katie',
      lastName: 'Coord',
      role: 'employee',
      jobTitle: 'Acc. Coord.',
      department: 'Account Management',
      profileImage: null,
      hireDate: '2022-05-01',
      managerId: 23,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Content Department
    28: {
      id: 28,
      email: 'reagan@rivaldigital.com',
      firstName: 'Reagan',
      lastName: 'Content',
      role: 'employee',
      jobTitle: 'Content Str.',
      department: 'Content',
      profileImage: null,
      hireDate: '2022-06-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    29: {
      id: 29,
      email: 'maya@rivaldigital.com',
      firstName: 'Maya',
      lastName: 'Content',
      role: 'employee',
      jobTitle: 'Content Str.',
      department: 'Content',
      profileImage: null,
      hireDate: '2022-07-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    30: {
      id: 30,
      email: 'ariela@rivaldigital.com',
      firstName: 'Ariela',
      lastName: 'Content',
      role: 'employee',
      jobTitle: 'Content Str.',
      department: 'Content',
      profileImage: null,
      hireDate: '2022-08-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    31: {
      id: 31,
      email: 'rachel.keller@rivaldigital.com',
      firstName: 'Rachel',
      lastName: 'Keller',
      role: 'employee',
      jobTitle: 'Content Str.',
      department: 'Content',
      profileImage: null,
      hireDate: '2022-09-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    32: {
      id: 32,
      email: 'bella@rivaldigital.com',
      firstName: 'Bella',
      lastName: 'Content',
      role: 'employee',
      jobTitle: 'Content Str.',
      department: 'Content',
      profileImage: null,
      hireDate: '2022-10-01',
      managerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    },
    // Project Management
    33: {
      id: 33,
      email: 'meghan@rivaldigital.com',
      firstName: 'Meghan',
      lastName: 'PM',
      role: 'employee',
      jobTitle: 'PM',
      department: 'Project Management',
      profileImage: null,
      hireDate: '2022-11-01',
      managerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '$2b$10$demopasswordhash',
    }
  };

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    // Check if it's a Rival Digital employee
    if (id >= 1 && id <= 33 && this.demoUsers[id]) {
      return this.demoUsers[id];
    }
    
    const result = await db.users.findFirst({ id });
    return result || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Check demo users first
    const demoUser = Object.values(this.demoUsers).find(u => u.email === email);
    if (demoUser) {
      return demoUser;
    }
    
    const result = await db.users.findFirst({ email });
    return result || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    return db.users.create(userData);
  }

  async updateUser(userId: number, userData: Partial<InsertUser>): Promise<User> {
    // Check if it's a demo user
    if (userId >= 1 && userId <= 33 && this.demoUsers[userId]) {
      // Update demo user in memory
      const updatedUser = { ...this.demoUsers[userId], ...userData, updatedAt: new Date() };
      this.demoUsers[userId] = updatedUser;
      return updatedUser;
    }
    
    // Update real user in database
    const [updatedUser] = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    // Return all Rival Digital employees for demo
    return Object.values(this.demoUsers);
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
    // Return Rival Digital departments for demo
    return [
      { id: 1, name: 'Executive', description: 'Executive Leadership', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Operations', description: 'Operations Management', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Shared Services', description: 'Finance, Business Management, Social Media, Automation, Virtual Assistance', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Sales', description: 'Sales and Business Development', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Websites', description: 'Web Development and Design', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Search', description: 'Search Engine Marketing and Optimization', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Account Management', description: 'Client Account Management and Coordination', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Content', description: 'Content Strategy and Creation', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Project Management', description: 'Project Management and Coordination', createdAt: new Date(), updatedAt: new Date() }
    ];
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
    return 33;
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
    // For demo purposes, return static reviews since we don't have real review data yet
    return [
      {
        id: 1,
        type: 'Annual Review',
        dueDate: '2025-01-30',
        status: 'pending',
        employee: {
          id: 1,
          name: 'John Doe',
          jobTitle: 'Software Engineer',
          profileImage: null
        }
      },
      {
        id: 2,
        type: 'Mid-Year Review',
        dueDate: '2025-02-15',
        status: 'pending',
        employee: {
          id: 2,
          name: 'Jane Smith',
          jobTitle: 'Product Manager',
          profileImage: null
        }
      }
    ];
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
    // For demo purposes, return static goals since we don't have real goal data yet
    return [
      {
        id: 1,
        userId: 1,
        teamId: teamId,
        title: 'Improve Code Quality',
        description: 'Implement automated testing for all new features',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2025-03-01',
        progress: 75,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 2,
        teamId: teamId,
        title: 'Launch New Feature',
        description: 'Complete dashboard analytics feature',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2025-02-15',
        progress: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
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
    // For demo purposes, return static meetings since we don't have real meeting data yet
    return [
      {
        id: 1,
        employee: {
          id: 1,
          name: 'John Doe',
          profileImage: null
        },
        scheduledAt: new Date('2025-01-25T14:00:00Z'),
        duration: 30,
        location: 'Meeting Room A',
        agendaItems: ['Career development', 'Project updates']
      },
      {
        id: 2,
        employee: {
          id: 2,
          name: 'Jane Smith',
          profileImage: null
        },
        scheduledAt: new Date('2025-01-28T10:30:00Z'),
        duration: 45,
        location: 'Virtual',
        agendaItems: ['Performance feedback', 'Goals for Q1']
      }
    ];
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
    // For demo purposes, return comprehensive performance data
    return {
      quarterly: [
        { quarter: 'Q1', overallScore: 7.2, growthScore: 6.8 },
        { quarter: 'Q2', overallScore: 7.8, growthScore: 7.4 },
        { quarter: 'Q3', overallScore: 8.3, growthScore: 8.1 },
        { quarter: 'Q4', overallScore: 8.7, growthScore: 8.5 }
      ],
      monthly: [
        { month: 'Jan', overallScore: 7.0, growthScore: 6.5 },
        { month: 'Feb', overallScore: 7.1, growthScore: 6.7 },
        { month: 'Mar', overallScore: 7.3, growthScore: 7.0 },
        { month: 'Apr', overallScore: 7.5, growthScore: 7.2 },
        { month: 'May', overallScore: 7.8, growthScore: 7.6 },
        { month: 'Jun', overallScore: 8.0, growthScore: 7.8 },
        { month: 'Jul', overallScore: 8.1, growthScore: 7.9 },
        { month: 'Aug', overallScore: 8.3, growthScore: 8.0 },
        { month: 'Sep', overallScore: 8.4, growthScore: 8.2 },
        { month: 'Oct', overallScore: 8.6, growthScore: 8.3 },
        { month: 'Nov', overallScore: 8.7, growthScore: 8.5 },
        { month: 'Dec', overallScore: 8.8, growthScore: 8.6 }
      ],
      summary: {
        currentScore: 8.8,
        previousScore: 8.7,
        trend: 'positive',
        improvement: 0.1,
        topPerformingArea: 'Team Collaboration',
        focusArea: 'Work-Life Balance'
      }
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
