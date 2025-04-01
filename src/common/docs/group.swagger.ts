import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto, CreateGroupMemberDto } from 'src/entities/dtos/group.dto';

export function SwaggerCreateGroupMembers() {
  return applyDecorators(
    ApiOperation({
      summary: '그룹 사용자 생성 API',
      description: '그룹에 사용자들의 프리셋을 추가합니다',
    }),
    ApiBody({
      description: '그룹 멤버 프리셋 생성 정보',
      type: [CreateGroupMemberDto],
    }),
    ApiParam({
      name: 'groupId',
      description: '그룹 ID',
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: '그룹 멤버 프리셋 생성 성공',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 데이터',
    }),
    ApiResponse({
      status: 401,
      description: '권한 없음',
    }),
  );
}

export function SwaggerCreateGroup() {
  return applyDecorators(
    ApiOperation({
      summary: '그룹 생성 API',
      description: '그룹을 생성합니다',
    }),
    ApiBody({
      description: '그룹 생성 정보',
      type: CreateGroupDto,
    }),
    ApiResponse({
      status: 201,
      description: '그룹 생성 성공',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 데이터',
    }),
    ApiResponse({
      status: 401,
      description: '권한 없음',
    }),
  );
}

export function SwaggerGetGroup() {
  return applyDecorators(
    ApiOperation({
      summary: '그룹 조회 API',
      description: '그룹을 조회합니다',
    }),
    ApiParam({
      name: 'id',
      description: '그룹 ID',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: '그룹 조회 성공',
    }),
    ApiResponse({
      status: 404,
      description: '그룹을 찾을 수 없음',
    }),
    ApiResponse({
      status: 401,
      description: '권한 없음',
    }),
  );
}

export function SwaggerGetGroups() {
  return applyDecorators(
    ApiOperation({
      summary: '그룹 목록 조회 API',
      description: '사용자가 속한 그룹 목록을 조회합니다',
    }),
    ApiResponse({
      status: 200,
      description: '그룹 목록 조회 성공',
    }),
    ApiResponse({
      status: 404,
      description: '그룹을 찾을 수 없음',
    }),
    ApiResponse({
      status: 401,
      description: '권한 없음',
    }),
  );
}
