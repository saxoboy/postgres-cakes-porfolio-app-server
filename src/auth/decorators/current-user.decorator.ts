import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { ValidRoles } from '../enums/valid-roles.enum';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new UnauthorizedException(
        `No user inside the request - make sure that we used the AuthGuard`,
      );
    }

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      // TODO: Eliminar Valid Roles
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `User ${user.name} ${user.lastname} needs a valid role [${[...roles]}]`,
    );
  },
);
