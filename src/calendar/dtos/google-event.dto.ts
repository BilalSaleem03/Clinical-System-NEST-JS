export class GoogleEventDto {
  summary: string;
  description?: string;
  start: {
    dateTime: string; // ISO 8601 format
  };
  end: {
    dateTime: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    optional?: boolean;
  }>;
//   reminders?: {
//     useDefault: boolean;
//     overrides?: Array<{
//       method: 'email' | 'popup';
//       minutes: number;
//     }>;
//   };
}