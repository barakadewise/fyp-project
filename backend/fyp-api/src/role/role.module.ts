import { Module } from '@nestjs/common';
import { RoleResolver } from './resolver/role.resolver';
import { RoleService } from './service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleResolver, RoleService]
})
export class RoleModule { }
