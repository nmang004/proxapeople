import express from 'express';
import { MeetingController } from './controller';
import { MeetingService } from './service';

const router = express.Router();
const meetingService = new MeetingService();
const meetingController = new MeetingController(meetingService);

// One-on-one meeting routes
router.get('/', meetingController.getAllMeetings);
router.get('/:id', meetingController.getMeeting);
router.post('/', meetingController.createMeeting);

// User specific meetings
router.get('/users/:userId', meetingController.getUserMeetings);

export default router;