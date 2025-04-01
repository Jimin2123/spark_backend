import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateGroupMemberDto } from 'src/entities/dtos/group.dto';

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
  );
}
