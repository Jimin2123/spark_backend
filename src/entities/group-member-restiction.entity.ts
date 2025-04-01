import { Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupMemberPreset } from './group-member-preset.entity';
import { DietaryRestriction } from './dietary-restriction.entity';

@Entity()
@Unique(['member', 'restriction'])
export class GroupMemberRestriction extends BaseEntity {
  @ManyToOne(() => GroupMemberPreset, (groupMemberPreset) => groupMemberPreset.restrictions, { onDelete: 'CASCADE' })
  member: GroupMemberPreset;

  @ManyToOne(() => DietaryRestriction, (restriction) => restriction.groupMemberRestrictions, { onDelete: 'CASCADE' })
  restriction: DietaryRestriction;
}
