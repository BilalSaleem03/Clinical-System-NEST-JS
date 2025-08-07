import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckUpDto } from './create-check-up.dto';

export class UpdateCheckUpDto extends PartialType(CreateCheckUpDto) {}
