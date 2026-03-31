import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IUser {
  id: string;
  email: string;
  status: string
  maxProject: number
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
  },
);