// import { Module } from '@nestjs/common';
// // import { GoogleAuthService } from './google-auth.service';
// import { GoogleAuthController } from './google-auth.controller';
// import { GoogleStrategy } from './google.strategy';

// @Module({
//   controllers: [GoogleAuthController],
//   providers: [GoogleStrategy],
// })
// export class GoogleAuthModule {}


// src/auth/auth.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from 'src/patient/patient.module';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [PassportModule, ConfigModule ,PatientModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy , GoogleAuthService],
})
export class GoogleAuthModule {}