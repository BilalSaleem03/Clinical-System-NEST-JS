import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './pgConfig';
import { ProfileModule } from './profile/profile.module';
import { PatientModule } from './patient/patient.module';
import { AdminModule } from './admin/admin.module';
import { CheckUpModule } from './check-up/check-up.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { CalendarModule } from './calendar/calendar.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

// import envValidation from 'env.validation';
import envValidation from './env.validation';

@Module({
  imports: [
    TypeOrmModule.forRoot(pgConfig()),
    ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: envValidation
    }),
    DoctorModule,
    ProfileModule,
    PatientModule,
    AdminModule,
    CheckUpModule,
    AppointmentModule,
    AuthModule,
    EmailModule,
    CalendarModule,
    GoogleAuthModule,
    CalendarModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
