import { forwardRef, Module } from '@nestjs/common';
import { CheckUpService } from './check-up.service';
import { CheckUpController } from './check-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckUp } from './entities/check-up.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([CheckUp]),
    forwardRef(()=>DoctorModule),
    PatientModule,
    AuthModule
  ],
  controllers: [CheckUpController],
  providers: [CheckUpService],
  exports:[CheckUpService]
})
export class CheckUpModule {}
