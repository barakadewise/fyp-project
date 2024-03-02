import { Module } from '@nestjs/common';
import { YouthResolver } from './resolver/youth.resolver';
import { YouthService } from './service/youth.service';

@Module({
  providers: [YouthResolver, YouthService]
})
export class YouthModule {}
