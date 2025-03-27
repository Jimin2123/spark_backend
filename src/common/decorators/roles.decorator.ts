import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * 역할을 설정하는 데코레이터
 * @param roles
 * @returns {SetMetadata} roles - 역할
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
