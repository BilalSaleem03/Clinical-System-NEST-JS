import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports:[PatientModule],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports:[CalendarService]
})
export class CalendarModule {}
