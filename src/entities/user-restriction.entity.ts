import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { DietaryRestriction } from './dietary-restriction.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class UserRestriction extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userRestrictions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => DietaryRestriction, (dietaryRestriction) => dietaryRestriction.userRestrictions, {
    onDelete: 'CASCADE',
  })
  dietaryRestriction: DietaryRestriction;
}
