import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Role } from 'src/profile/enums/role.enum';
import { Roles } from 'src/auth/decorators/role-defining.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';
import { Currentpayload } from 'src/auth/decorators/getPayload.decorator';



@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }
  
  @Get()
  findAll(@Query('name') name?: string) {
    return this.doctorService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number ) {
    return this.doctorService.findOne(id);
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number, @Body(new ValidationPipe({whitelist: true})) updateDoctorDto: UpdateDoctorDto , @Currentpayload() currPayload:any) {
    return this.doctorService.update(id, updateDoctorDto , currPayload);
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id' , ParseIntPipe) id: number , @Currentpayload() currpayload:any) {
    return this.doctorService.remove(id , currpayload);
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Get('/all-checkups-of-patient/:id')
  allcheckUpsOfOnepatient(@Param('id' , ParseIntPipe) patientId : number){
    return this.doctorService.allcheckUpsOfOnepatient(patientId)
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Get('/all-appointments-of-patient/:id')
  allAppointmentsOfonepatient(@Param('id' , ParseIntPipe) patientId : number){
    return this.doctorService.allAppointmentsOfonepatient(patientId)
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Get('/all-checkups-of-doctor/:id')
  allcheckUpsOfOneDoctor(@Param('id' , ParseIntPipe) doctorId : number){
    return this.doctorService.allcheckUpsOfOneDoctor(doctorId)
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Get('/all-appointments-of-doctor/:id')
  allAppointmentsOfoneDoctor(@Param('id' , ParseIntPipe) doctorId : number){
    return this.doctorService.allAppointmentsOfoneDoctor(doctorId)
  }


}
