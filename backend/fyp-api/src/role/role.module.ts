import { Module } from '@nestjs/common';
import { RoleResolver } from './resolver/role.resolver';
import { RoleService } from './service/role.service';

@Module({
  providers: [RoleResolver, RoleService]
})
export class RoleModule {}
