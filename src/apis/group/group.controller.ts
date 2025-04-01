import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateGroupDto, CreateGroupMemberDto } from 'src/entities/dtos/group.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerCreateGroupMembers } from 'src/common/docs/group.swagger';

@Controller('group')
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() CreateGroupDto: CreateGroupDto, @CurrentUser() userid: string) {
    return await this.groupService.createGroup(userid, CreateGroupDto);
  }

  @Post('members:groupId')
  @SwaggerCreateGroupMembers()
  @UseGuards(JwtAuthGuard)
  async createGroupMembers(
    @Body() createGroupMemberDtos: CreateGroupMemberDto[],
    @Param('groupId') groupId: string,
    @CurrentUser() userid: string,
  ) {
    return await this.groupService.createGroupMembers(createGroupMemberDtos, groupId, userid);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async getGroups(@CurrentUser() userid: string) {
    return await this.groupService.getGroups(userid);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getGroup(@Param('id') id: string, @CurrentUser() userid: string) {
    return await this.groupService.getGroup(userid, id, ['members.restrictions', 'members.restrictions.restriction']);
  }
}
