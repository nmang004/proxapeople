import { storage } from '../../database/storage';
import { type Team, type InsertTeam, type TeamMember, type InsertTeamMember, type User } from '@shared/schema';

export class TeamService {
  async getAllTeams(): Promise<Team[]> {
    return await storage.getAllTeams();
  }

  async createTeam(teamData: InsertTeam): Promise<Team> {
    return await storage.createTeam(teamData);
  }

  async addTeamMember(teamMemberData: InsertTeamMember): Promise<TeamMember> {
    return await storage.addTeamMember(teamMemberData);
  }

  async getTeamMembers(teamId: number): Promise<User[]> {
    return await storage.getTeamMembers(teamId);
  }
}