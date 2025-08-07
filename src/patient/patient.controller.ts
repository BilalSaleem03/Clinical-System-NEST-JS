import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Inject, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ActivatePatientDto } from './dto/activate-patient.dto';
import { Roles } from 'src/auth/decorators/role-defining.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';
import { Role } from 'src/profile/enums/role.enum';

@Controller('patient')
export class PatientController {
  constructor (private readonly patientService: PatientService) {}


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll(@Query('name') name?:string) {
    return this.patientService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number) {
    return this.patientService.findOne(id);
  }


  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number, @Body(new ValidationPipe({whitelist: true})) updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }


  @Roles(Role.Doctor , Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id' , ParseIntPipe) id: number) {
    return this.patientService.remove(id);
  }

  @Post('/activate-patient')
  activatePatient(@Body(new ValidationPipe({whitelist: true})) activatePatientDto:ActivatePatientDto){
    return this.patientService.activatePatient(activatePatientDto.email , activatePatientDto.hash , activatePatientDto.newPassword)
  }
}
