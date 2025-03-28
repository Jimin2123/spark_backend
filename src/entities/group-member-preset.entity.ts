import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { Group } from './group.entity';

@Entity()
export class GroupMemberPreset extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  preset_name: string;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender: UserGender;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ nullable: true })
  food_preference: string;

  @Column({ type: 'boolean', default: false })
  is_vegetarian: boolean;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group: Group;
}
