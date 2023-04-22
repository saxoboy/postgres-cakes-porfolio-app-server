import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  root = 'root',
  admin = 'admin',
  user = 'user',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Valid Roles',
});
