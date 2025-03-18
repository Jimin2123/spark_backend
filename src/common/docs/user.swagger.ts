import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from 'src/entities/dtos/auth.dto';
import { CreateUserDto } from 'src/entities/dtos/user.dto';

export function SwaggerCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 생성 API',
      description: '사용자를 생성하고 Access Token 및 Refresh Token을 반환합니다.',
    }),
    ApiBody({
      description: '사용자 생성 정보',
      type: CreateUserDto,
    }),
    ApiResponse({
      status: 201,
      description: '사용자 생성 성공',
      type: AuthResponseDto, // 응답 DTO 추가
    }),
    ApiBadRequestResponse({
      description: '잘못된 요청 (유효하지 않은 입력값)',
    }),
    ApiConflictResponse({
      description: '이미 존재하는 이메일 또는 유저네임',
    }),
  );
}
