import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const provided = (req.headers['x-admin-key'] as string) || '';

    const expected = this.config.get<string>('ADMIN_API_KEY') || '';

    if (!expected) {
      // ป้องกันกรณีลืมตั้ง env ใน production/dev
      throw new UnauthorizedException('Admin access is not configured');
    }

    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}
