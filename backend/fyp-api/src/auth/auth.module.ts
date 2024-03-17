import { Module } from '@nestjs/common';
import { AuthResolver } from './resolver/auth.resolver';
import { AuthService } from './services/auth.service';
import { AdminModule } from 'src/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'constants/secret.';
import { JwtStrategy } from './strategy/jwt-strategy';
import { PartnersModule } from 'src/partners/partners.module';

@Module({
  imports: [AdminModule,PartnersModule,
     PassportModule,
    JwtModule.register(
      {
        global: true,
        secret: jwtConstant.secret,
        signOptions: { expiresIn: '1h' }
      }

    )
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
