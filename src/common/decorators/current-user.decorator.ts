import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 사용자 정보를 가져오는 데코레이터
 * @param data
 * @param context
 * @returns  {string} userId - 현재 사용자 ID
 */
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user.userId;
});

/**
 * 현재 사용자의 역할을 가져오는 데코레이터
 * @param data
 * @param context
 * @returns {UserRole} role - 현재 사용자 역할
 */
export const CurrentUserRole = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user.role;
});
