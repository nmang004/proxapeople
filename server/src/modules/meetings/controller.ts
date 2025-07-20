import { Request, Response } from 'express';
import { MeetingService } from './service';
import { insertOneOnOneMeetingSchema } from '@shared/schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequestBody, handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';

export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  getAllMeetings = asyncHandler(async (req: Request, res: Response) => {
    const meetings = await this.meetingService.getAllOneOnOneMeetings();
    res.json(meetings);
  });

  getMeeting = asyncHandler(async (req: Request, res: Response) => {
    const meeting = await this.meetingService.getOneOnOneMeeting(parseInt(req.params.id));
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  });

  createMeeting = asyncHandler(async (req: Request, res: Response) => {
    const meetingData = validateRequestBody(insertOneOnOneMeetingSchema, req, res);
    if (!meetingData) return;

    try {
      const meeting = await this.meetingService.createOneOnOneMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return handleValidationError(err, res, 'meeting');
      }
      throw err;
    }
  });

  getUserMeetings = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const meetings = await this.meetingService.getUserOneOnOneMeetings(userId);
    res.json(meetings);
  });
}