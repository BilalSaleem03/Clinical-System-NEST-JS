


// src/calendar/calendar.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PatientService } from 'src/patient/patient.service';
import { GoogleEventDto } from './dtos/google-event.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly patientService : PatientService){}
  private calendar = google.calendar('v3');

  async getEvents(id) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: process.env.CALENDER_SET_ACCESSTOKEN
    });

    // let accessToken = await this.patientService.getGoogleAccessToken(id)
    
    const res = await this.calendar.events.list({
      calendarId: 'primary',  // User's primary calendar
      auth: oauth2Client,      // From Google OAuth
      timeMin: new Date().toISOString(),
      maxResults: 10,
    });
    return res.data.items;
  }



  async createEvent(accessToken:string , event: GoogleEventDto) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    try {
      const res = await this.calendar.events.insert({
        calendarId: 'primary',
        auth: oauth2Client,
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.start.dateTime,
          },
          end: {
            dateTime: event.end.dateTime,
          },
          attendees: event.attendees,
        },
      });
      console.log("calenter    :   " , res)
      //store res.data.id as calendereventid in appointment
      return res.data.id;
    } catch (error) {
      console.error('Google API Error:', error.message);
      throw new Error('Failed to create calendar event');
    }
  }
}