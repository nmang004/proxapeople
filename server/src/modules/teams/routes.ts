import express from 'express';
import { TeamController } from './controller';
import { TeamService } from './service';

const router = express.Router();
const teamService = new TeamService();
const teamController = new TeamController(teamService);

// GET /api/teams - Get all teams
router.get('/', teamController.getAllTeams);

// POST /api/teams - Create new team
router.post('/', teamController.createTeam);

// POST /api/team-members - Add team member
router.post('/members', teamController.addTeamMember);

// GET /api/teams/:teamId/members - Get team members
router.get('/:teamId/members', teamController.getTeamMembers);

export default router;