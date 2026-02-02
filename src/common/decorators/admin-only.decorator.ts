import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminApiKeyGuard } from '../guards/admin-api-key.guards';

export function AdminOnly() {
  return applyDecorators(UseGuards(AdminApiKeyGuard));
}
