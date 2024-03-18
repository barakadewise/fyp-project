import { Module } from '@nestjs/common';
import { YouthResolver } from './resolver/youth.resolver';
import { YouthService } from './service/youth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Youth } from './entity/youth.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Youth])],
  providers: [YouthResolver, YouthService],
  exports:[YouthService]
})
export class YouthModule {}
