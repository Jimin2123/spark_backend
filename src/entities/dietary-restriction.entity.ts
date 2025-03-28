import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RestrictionType } from 'src/common/enums/restriction-type.enum';
import { UserRestriction } from './user-restriction.entity';

@Entity()
export class DietaryRestriction extends BaseEntity {
  @Column({ type: 'enum', enum: RestrictionType })
  restriction_type: RestrictionType;

  @Column({ type: 'varchar', length: 100, unique: true })
  restriction_name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => UserRestriction, (userRestriction) => userRestriction.dietaryRestriction)
  userRestrictions: UserRestriction[];
}
