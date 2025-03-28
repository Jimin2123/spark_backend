import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RestrictionService } from './restriction.service';
import { CreateDietaryRestrictionDto, UpdateDietaryRestrictionDto } from 'src/entities/dtos/restriction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  SwaggerCreateDietaryRestriction,
  SwaggerDeleteDietaryRestriction,
  SwaggerGetDietaryRestrictions,
  SwaggerUpdateDietaryRestriction,
} from 'src/common/docs/restriction.swagger';

@Controller('restriction')
@ApiBearerAuth()
export class RestrictionController {
  constructor(private readonly restrictionService: RestrictionService) {}

  @Post('create')
  @SwaggerCreateDietaryRestriction()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createDietaryRestriction(@Body() dto: CreateDietaryRestrictionDto) {
    return this.restrictionService.createDietaryRestriction(dto);
  }

  @Get('list')
  @SwaggerGetDietaryRestrictions()
  getDietaryRestrictions() {
    return this.restrictionService.getDietaryRestrictions();
  }

  @Patch(':id')
  @SwaggerUpdateDietaryRestriction()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateDietaryRestriction(@Param('id') id: string, @Body() dto: UpdateDietaryRestrictionDto) {
    return this.restrictionService.updateDietaryRestriction(id, dto);
  }

  @Delete(':id')
  @SwaggerDeleteDietaryRestriction()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteDietaryRestriction(@Param('id') dto: string) {
    return this.restrictionService.deleteDietaryRestriction(dto);
  }
}
