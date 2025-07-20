import { Request, Response } from 'express';
import { TeamService } from './service';
import { insertTeamSchema, insertTeamMemberSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class TeamController {
  constructor(private teamService: TeamService) {}

  getAllTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await this.teamService.getAllTeams();
    res.json(teams);
  });

  createTeam = asyncHandler(async (req: Request, res: Response) => {
    const teamData = validateRequestBody(insertTeamSchema, req, res);
    if (!teamData) return;

    try {
      const team = await this.teamService.createTeam(teamData);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'team');
      }
      throw err;
    }
  });

  addTeamMember = asyncHandler(async (req: Request, res: Response) => {
    const teamMemberData = validateRequestBody(insertTeamMemberSchema, req, res);
    if (!teamMemberData) return;

    try {
      const teamMember = await this.teamService.addTeamMember(teamMemberData);
      res.status(201).json(teamMember);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'team member');
      }
      throw err;
    }
  });

  getTeamMembers = asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.teamId);
    const members = await this.teamService.getTeamMembers(teamId);
    res.json(members);
  });
}