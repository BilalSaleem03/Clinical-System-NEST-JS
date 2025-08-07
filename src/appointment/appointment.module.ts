import { forwardRef, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CalendarModule } from 'src/calendar/calendar.module';


@Module({
  imports:[
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(()=>DoctorModule),
    PatientModule,
    AuthModule,
    EmailModule,
    CalendarModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports:[AppointmentService]
})
export class AppointmentModule {}
