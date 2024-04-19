import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,} from '@nestjs/common';
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
       
        return { 
            sub: payload.sub,
            username: payload.username,
            expIn:payload.exp
             
             }
    }
}