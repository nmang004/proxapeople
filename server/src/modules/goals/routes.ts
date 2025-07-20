import express from 'express';
import { GoalController } from './controller';
import { GoalService } from './service';

const router = express.Router();
const goalService = new GoalService();
const goalController = new GoalController(goalService);

// Goal routes
router.get('/', goalController.getAllGoals);
router.get('/:id', goalController.getGoal);
router.post('/', goalController.createGoal);

// User and team specific goals
router.get('/user/:userId', goalController.getUserGoals);
router.get('/team/:teamId', goalController.getTeamGoals);

export default router;