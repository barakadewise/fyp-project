import { Module } from '@nestjs/common';
import { AuthResolver } from './resolver/auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthResolver, AuthService]
})
export class AuthModule {}
