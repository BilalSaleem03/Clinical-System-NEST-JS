import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from 'src/auth/decorators/role-defining.decorator';
import { Role } from 'src/profile/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';
import { Currentpayload } from 'src/auth/decorators/getPayload.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Roles(Role.Admin , Role.Doctor)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.adminService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }
  @Roles(Role.Admin , Role.Doctor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number , @Body(new ValidationPipe({whitelist: true})) updateAdminDto: UpdateAdminDto , @Currentpayload() currPayload:any) {
    return this.adminService.update(id, updateAdminDto , currPayload);
  }
  @Roles(Role.Admin , Role.Doctor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number , @Currentpayload() currPayload:any) {
    return this.adminService.remove(id , currPayload);
  }
}
