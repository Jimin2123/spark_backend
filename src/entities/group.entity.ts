import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Purpose } from 'src/common/enums/purpose.enum';
import { User } from './user.entity';
import { GroupMemberPreset } from './group-member-preset.entity';

@Entity()
export class Group extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: Purpose })
  purpose: Purpose;

  @ManyToOne(() => User, (user) => user.createdGroups, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => GroupMemberPreset, (groupMemberPreset) => groupMemberPreset.group, { cascade: true })
  members: GroupMemberPreset[];
}
