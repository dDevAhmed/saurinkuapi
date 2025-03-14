import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enums/usersRole.enum';


export const ROLES_KEY = 'roles';
export const RoleDecorator = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);