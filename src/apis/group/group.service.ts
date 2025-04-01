import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto, CreateGroupMemberDto } from 'src/entities/dtos/group.dto';
import { GroupMemberPreset } from 'src/entities/group-member-preset.entity';
import { Group } from 'src/entities/group.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { GroupMemberRestriction } from 'src/entities/group-member-restiction.entity';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMemberPreset)
    private readonly groupMemberPresetRepository: Repository<GroupMemberPreset>,
    @InjectRepository(GroupMemberRestriction)
    private readonly groupMemberRestrictionRepository: Repository<GroupMemberRestriction>,
    private readonly userService: UserService,
    private readonly restrictionService: RestrictionService,
  ) {}

  async createGroup(userid: string, CreateGroupDto: CreateGroupDto) {
    const creator = await this.userService.findUserById(userid);

    if (!creator) {
      throw new NotFoundException('User not found');
    }

    const { members, ...groupData } = CreateGroupDto;

    const createdGroup = this.groupRepository.create({
      ...groupData,
      creator,
    });

    const savedGroup = await this.groupRepository.save(createdGroup);

    const createdGroupMembers = await this.createGroupMembers(members, createdGroup.uid);
    createdGroup.members = createdGroupMembers;

    return savedGroup;
  }

  async createGroupMembers(createGroupMemberPresetDtos: CreateGroupMemberDto[], groupId: string, userId?: string) {
    if (userId) {
      const group = await this.getGroup(userId, groupId);
      if (!group) {
        throw new NotFoundException('생성한 그룹이 없거나 권한이 없습니다.');
      }
    }

    const groupMemberPresets = createGroupMemberPresetDtos.map((memberDto) => {
      const { restrictions, ...rest } = memberDto;
      return this.groupMemberPresetRepository.create({
        ...rest,
        group: { uid: groupId },
      });
    });

    const savedMembers = await this.groupMemberPresetRepository.save(groupMemberPresets);

    for (let i = 0; i < savedMembers.length; i++) {
      const restrictions = createGroupMemberPresetDtos[i].restrictions;
      const member = savedMembers[i];

      if (restrictions && restrictions.length > 0) {
        const groupMemberRestrictions = await this.restrictionService.createGroupMemberRestriction(
          member,
          restrictions,
        );
        await this.groupMemberRestrictionRepository.save(groupMemberRestrictions);
      }
    }

    return savedMembers;
  }

  async getGroup(userid: string, groupId: string, relations: string[] = []) {
    const group = await this.groupRepository.findOne({
      where: { uid: groupId, creator: { uid: userid } },
      relations: ['members', 'creator', ...relations],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
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
