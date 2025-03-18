import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwaggerLogout() {
  return applyDecorators(
    ApiOperation({
      summary: '로그아웃',
      description: '현재 로그인된 사용자의 리프레시 토큰을 무효화하고 쿠키를 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '로그아웃이 성공적으로 처리되었습니다.',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자.',
    }),
  );
}
