import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
// import authConfig from './Config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import authConfig, { asProvider } from './config/auth.config';
import { AdminModule } from 'src/admin/admin.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(asProvider()),
    forwardRef(()=>AdminModule),
    forwardRef(()=>DoctorModule),
    // PatientModule,
    forwardRef(()=>PatientModule),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
