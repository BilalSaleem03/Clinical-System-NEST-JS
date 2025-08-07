import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Roles } from 'src/auth/decorators/role-defining.decorator';
import { Role } from 'src/profile/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';
import { Currentpayload } from 'src/auth/decorators/getPayload.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createAppointmentDto: CreateAppointmentDto ,  @Currentpayload() currPayload:any) {
    return this.appointmentService.create(createAppointmentDto , currPayload);
  }
  
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }
  
  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number, @Body(new ValidationPipe({whitelist: true})) updateAppointmentDto: UpdateAppointmentDto , @Currentpayload() currPayload:any) {
    return this.appointmentService.update(id, updateAppointmentDto , currPayload);
  }
  
  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id' , ParseIntPipe) id: number , @Currentpayload() currPayload:any) {
    return this.appointmentService.remove(id , currPayload);
  }
}
