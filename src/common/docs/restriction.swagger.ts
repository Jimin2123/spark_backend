import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwaggerCreateDietaryRestriction() {
  return applyDecorators(
    ApiOperation({
      summary: '식이 제한 생성',
      description: '새로운 식이 제한을 생성합니다.',
    }),
    ApiResponse({
      status: 201,
      description: '식이 제한이 성공적으로 생성되었습니다.',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 데이터.',
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패. 권한 없음.',
    }),
  );
}

export function SwaggerGetDietaryRestrictions() {
  return applyDecorators(
    ApiOperation({
      summary: '식이 제한 목록 조회',
      description: '모든 식이 제한 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '식이 제한 목록 조회 성공.',
    }),
  );
}

export function SwaggerUpdateDietaryRestriction() {
  return applyDecorators(
    ApiOperation({
      summary: '식이 제한 수정',
      description: '식이 제한을 수정합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '식이 제한 수정 성공.',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 데이터.',
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패. 권한 없음.',
    }),
  );
}

export function SwaggerDeleteDietaryRestriction() {
  return applyDecorators(
    ApiOperation({
      summary: '식이 제한 삭제',
      description: '식이 제한을 삭제합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '식이 제한 삭제 성공.',
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 데이터.',
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패. 권한 없음.',
    }),
  );
}
