import { Module } from '@nestjs/common';
import { RestrictionService } from './restriction.service';
import { RestrictionController } from './restriction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaryRestriction } from 'src/entities/dietary-restriction.entity';
import { UserRestriction } from 'src/entities/user-restriction.entity';
import { GroupMemberRestriction } from 'src/entities/group-member-restiction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DietaryRestriction, UserRestriction, GroupMemberRestriction])],
  controllers: [RestrictionController],
  providers: [RestrictionService],
  exports: [RestrictionService],
})
export class RestrictionModule {}
