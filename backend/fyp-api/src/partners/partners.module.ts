import { Module } from '@nestjs/common';
import { PartnersResolver } from './resolver/partners.resolver';
import { PartnersService } from './service/partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entity/partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  providers: [PartnersResolver, PartnersService],
  exports:[PartnersService]
})
export class PartnersModule { }
