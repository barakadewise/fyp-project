import { Module } from '@nestjs/common';
import { AdminResolver } from './resolver/admin.resolver';
import { AdminService } from './service/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entitity/admin.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Admin])],
  providers: [AdminResolver, AdminService],
  exports:[AdminService]
})
export class AdminModule {}
