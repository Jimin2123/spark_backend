import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestrictionService } from './restriction.service';
import { CreateDietaryRestrictionDto } from 'src/entities/dtos/restriction.dto';

@Controller('restriction')
export class RestrictionController {
  constructor(private readonly restrictionService: RestrictionService) {}

  @Post('create')
  createDietaryRestriction(@Body() dto: CreateDietaryRestrictionDto) {
    return this.restrictionService.createDietaryRestriction(dto);
  }

  @Get('list')
  getDietaryRestrictions() {
    return this.restrictionService.getDietaryRestrictions();
  }
}
