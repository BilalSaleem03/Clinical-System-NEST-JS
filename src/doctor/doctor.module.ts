import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckUpModule } from 'src/check-up/check-up.module';

import { AppointmentModule } from 'src/appointment/appointment.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Doctor]),
    CheckUpModule,
    AppointmentModule,
    AuthModule,
    ProfileModule
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports:[DoctorService]
})
export class DoctorModule {}
