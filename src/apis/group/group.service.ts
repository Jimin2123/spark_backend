import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from 'src/entities/dtos/group.dto';
import { GroupMemberPreset } from 'src/entities/group-member-preset.entity';
import { Group } from 'src/entities/group.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMemberPreset)
    private readonly groupMemberPresetRepository: Repository<GroupMemberPreset>,
    private readonly userService: UserService,
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
      members,
    });

    return await this.groupRepository.save(createdGroup);
  }

  async getGroup(userid: string, groupId: string) {
    const group = await this.groupRepository.findOne({
      where: { uid: groupId, creator: { uid: userid } },
      relations: ['members', 'creator'],
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
