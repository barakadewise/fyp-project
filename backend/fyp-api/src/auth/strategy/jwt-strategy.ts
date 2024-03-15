import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstant } from 'constants/secret.';
import { AdminService } from 'src/admin/service/admin.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly adminService: AdminService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstant.secret,
        });
    }

    async validate(payload: any) {
        const user = await this.adminService.findOne(payload.email)
        if (user) {
            return { id: payload.sub, username: payload.email, name: payload.name };
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}