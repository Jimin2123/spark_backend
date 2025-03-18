import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: '리프레시 토큰 갱신',
      description: '쿠키에 저장된 리프레시 토큰을 사용하여 새로운 액세스 토큰과 리프레시 토큰을 발급합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '토큰이 성공적으로 갱신되었습니다.',
      schema: {
        example: {
          accessToken: 'newAccessTokenHere',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '리프레시 토큰이 없거나 유효하지 않습니다.',
    }),
  );
}

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
