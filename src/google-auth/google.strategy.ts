// // src/google-auth/google.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private configService: ConfigService) {
//     super({
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.REDIRECT_URI,
//       scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const user = {
//       accessToken,
//       refreshToken,
//       profile,
//     };
//     done(null, user);
//   }
// }





// src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService ) {
    super({
      clientID: process.env.CLIENT_ID,      // ← From .env
      clientSecret: process.env.CLIENT_SECRET, // ← From .env
      callbackURL: process.env.REDIRECT_URI,  
      
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'], // Fixed scope
    });
    // console.log(process.env.REDIRECT_URI)
  }

  

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken,  // Google API token
      refreshToken, // For token renewal
      profile,     // User's Google profile
    };
  }
}