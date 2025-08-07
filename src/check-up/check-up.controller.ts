import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { CheckUpService } from './check-up.service';
import { CreateCheckUpDto } from './dto/create-check-up.dto';
import { UpdateCheckUpDto } from './dto/update-check-up.dto';
import { Role } from 'src/profile/enums/role.enum';
import { Roles } from 'src/auth/decorators/role-defining.decorator';
import { RolesGuard } from 'src/auth/guards/roleGuard.guard';
import { Currentpayload } from 'src/auth/decorators/getPayload.decorator';

@Controller('check-up')
export class CheckUpController {
  constructor(private readonly checkUpService: CheckUpService) {}

  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createCheckUpDto: CreateCheckUpDto, @Currentpayload() currPayload:any) {
    return this.checkUpService.create(createCheckUpDto , currPayload);
  }

  @Get()
  findAll() {
    return this.checkUpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id' , ParseIntPipe) id: number) {
    return this.checkUpService.findOne(id);
  }
  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id' , ParseIntPipe) id: number, @Body(new ValidationPipe({whitelist: true})) updateCheckUpDto: UpdateCheckUpDto , @Currentpayload() currPayload:any) {
    return this.checkUpService.update(id, updateCheckUpDto , currPayload);
  }

  @Roles(Role.Doctor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id' , ParseIntPipe) id: number , @Currentpayload() currPayload:any) {
    return this.checkUpService.remove(id , currPayload);
  }
}
