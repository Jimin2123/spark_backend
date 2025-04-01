import { Entity, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { DietaryRestriction } from './dietary-restriction.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['user', 'restriction'])
export class UserRestriction extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userRestrictions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => DietaryRestriction, (dietaryRestriction) => dietaryRestriction.userRestrictions, {
    onDelete: 'CASCADE',
  })
  restriction: DietaryRestriction;
}
