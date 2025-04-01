import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto, CreateGroupMemberDto } from 'src/entities/dtos/group.dto';
import { GroupMemberPreset } from 'src/entities/group-member-preset.entity';
import { Group } from 'src/entities/group.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { GroupMemberRestriction } from 'src/entities/group-member-restiction.entity';
import { RestrictionService } from '../restriction/restriction.service';
import { TransactionUtil } from 'src/utils/transaction.util';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMemberPreset)
    private readonly groupMemberPresetRepository: Repository<GroupMemberPreset>,
    private readonly userService: UserService,
    private readonly restrictionService: RestrictionService,
    private readonly transactionUtil: TransactionUtil,
  ) {}

  async createGroup(userid: string, CreateGroupDto: CreateGroupDto) {
    const creator = await this.userService.findUserById(userid);

    return this.transactionUtil.runInTransaction(async (queryRunner) => {
      const { members, ...groupData } = CreateGroupDto;

      const createdGroup = this.groupRepository.create({
        ...groupData,
        creator,
      });

      const savedGroup = await queryRunner.manager.save(createdGroup);

      const createdGroupMembers = await this.createGroupMembers(members, createdGroup.uid, userid, queryRunner);
      createdGroup.members = createdGroupMembers;

      return savedGroup;
    });
  }

  async createGroupMembers(
    createGroupMemberPresetDtos: CreateGroupMemberDto[],
    groupId: string,
    userId: string,
    queryRunner?: QueryRunner,
  ) {
    const run = async (queryRunner: QueryRunner) => {
      const group = await this.getGroup(userId, groupId, [], queryRunner);

      // 그룹이 존재하지 않거나 사용자가 그룹의 생성자가 아닌 경우
      if (!group) {
        throw new NotFoundException('생성한 그룹이 없거나 권한이 없습니다.');
      }

      const groupMemberPresets = createGroupMemberPresetDtos.map((memberDto) => {
        const { restrictions, ...rest } = memberDto;
        return this.groupMemberPresetRepository.create({
          ...rest,
          group,
        });
      });

      const savedMembers = await queryRunner.manager.save(groupMemberPresets);

      for (let i = 0; i < savedMembers.length; i++) {
        const restrictions = createGroupMemberPresetDtos[i].restrictions;
        const member = savedMembers[i];

        if (restrictions && restrictions.length > 0) {
          const groupMemberRestrictions = await this.restrictionService.createGroupMemberRestriction(
            member,
            restrictions,
          );
          await queryRunner.manager.save(groupMemberRestrictions);
        }
      }
      return savedMembers;
    };

    return queryRunner ? run(queryRunner) : this.transactionUtil.runInTransaction(run);
  }

  async getGroup(userid: string, groupId: string, relations: string[] = [], queryRunner?: QueryRunner) {
    const group = queryRunner
      ? queryRunner.manager.findOne(Group, {
          where: { uid: groupId, creator: { uid: userid } },
          relations: ['members', 'creator', ...relations],
        })
      : await this.groupRepository.findOne({
          where: { uid: groupId, creator: { uid: userid } },
          relations: ['members', 'creator', ...relations],
        });

    if (!group) {
      throw new NotFoundException('그룹이 존재하지 않거나 권한이 없습니다.');
    }

    return group;
  }

  async getGroups(userid: string) {
    const groups = await this.groupRepository.find({
      where: { creator: { uid: userid } },
      relations: ['members', 'creator'],
    });

    return groups;
  }
}
