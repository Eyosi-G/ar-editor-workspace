import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import appConfig from 'libs/config/app.config';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from 'libs/schemas/account.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('token is missing from header');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.jwtToken,
      });

      const account = await this.accountModel.findById(payload['id']);
      if (!account) {
        throw new BadRequestException('account not found');
      }

      request['user'] = {
        id: account.id,
        email: account.email,
        status: account.status,
        maxProject: account.max_project,
      };
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException(
        'token has expired or malformed, please try again',
      );
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
