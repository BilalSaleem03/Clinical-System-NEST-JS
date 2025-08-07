

// src/calendar/calendar.controller.ts
import { Controller, Get, Post, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(@Req() req) {
    // Expects 'Authorization: Bearer <google_access_token>' in headers
    return this.calendarService.getEvents();
  }

  @Post('events')
  async createEvent(@Req() req) {
    let event = {
      summary: 'Team Sync Meeting',
      description: 'Quarterly planning session',
      start: {
        dateTime: '2025-12-15T09:00:00',
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: '2025-12-15T10:30:00',
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: 'member1@company.com' },
        { email: 'member2@company.com', displayName: 'Jane Doe' },
      ],
      // reminders: {
      //   useDefault: false,
      //   overrides: [
      //     { method: 'email', minutes: 24 * 60 }, // 1 day before
      //     { method: 'popup', minutes: 30 },
      //   ],
      // }
    }
    // const token = req.headers.authorization.split(' ')[1];
    // return this.calendarService.createEvent(event);
  }
}