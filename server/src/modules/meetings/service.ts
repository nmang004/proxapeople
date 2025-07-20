import { storage } from '../../database/storage';
import { type OneOnOneMeeting, type InsertOneOnOneMeeting } from '@shared/schema';

export class MeetingService {
  async getAllOneOnOneMeetings(): Promise<OneOnOneMeeting[]> {
    return await storage.getAllOneOnOneMeetings();
  }

  async getOneOnOneMeeting(id: number): Promise<OneOnOneMeeting | null> {
    const meeting = await storage.getOneOnOneMeeting(id);
    return meeting || null;
  }

  async createOneOnOneMeeting(meetingData: InsertOneOnOneMeeting): Promise<OneOnOneMeeting> {
    return await storage.createOneOnOneMeeting(meetingData);
  }

  async getUserOneOnOneMeetings(userId: number): Promise<OneOnOneMeeting[]> {
    return await storage.getUserOneOnOneMeetings(userId);
  }
}